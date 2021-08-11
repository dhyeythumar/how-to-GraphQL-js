//!--------------------------------- Note on this project -------------------------------
/*
 * This project employees 1 of the 3 method of creating GraphQL APIs
 * i.e It directly uses DB in resolvers (n not the legacy APIs) with the help of Prisma (advanced ORM)
 */

//!------------------------------------ Note on GraphQL ---------------------------------
/* There are 3 root types: Query, Mutation, and Subscription
    >> The fields on these root types are called root fields and define the available API operations.
    >>  When sending operations (such as queries, mutations or subscriptions) to a GraphQL API, these always need to start with a root types

  Other custom types can be also defined in schema but can't be used directly by clients
*/
//! Subscriptions are typically implemented via WebSockets

//!--------------------------------- Note on Apollo-Server ------------------------------
// apollo-server is a fully-featured GraphQL server. It uses Express.js and a few other libraries (behind the scenes) to help build production-ready GraphQL servers.
/*
 * List of its features:
 *      1. GraphQL spec-compliant
 *      2. Realtime functionality with GraphQL subscriptions
 *      3. Out-of-the-box support for GraphQL Playground
 *      4. Extensible via Express middlewares
 *      5. Resolves custom directives in your GraphQL schema
 *      6. Query performance tracing
 *      7. Runs everywhere: Can be deployed via Vercel, Up, AWS Lambda, Heroku etc.
 */
//! apollo-server uses apollo-server-express under the hood.
//! apollo-server v3 doesn't support subscriptions so swap out to apollo-server-express.
// The PubSub class is not recommended for production environments, because it's an in-memory event system that only supports a single server instance.
//* So check out: https://www.apollographql.com/docs/apollo-server/data/subscriptions/#production-pubsub-libraries

//!---------------------------------- Note on Prisma ------------------------------------
// Prisma is an open source database toolkit that makes it easy for developers to reason about their data and how they access it, by providing a clean and type-safe API for submitting database queries.
/*
 * It mainly consists of three tools:
 *      1. Prisma Client: An auto-generated and type-safe query builder for Node.js & TypeScript.
 *      2. Prisma Migrate (experimental): A declarative data modeling & migration system.
 *      3. Prisma Studio (experimental): A GUI to view and edit data in your database.
 */

/* Dev Process
 *  0. If starting with prisma >_ npx prisma init
 *  1. Add the schema in prisma/schema.prisma || if db already exists then pull the schema >_ npx prisma db pull
 *  2. (if schema is updated locally then) To migrate the changes >_ npx prisma migrate dev --name "<comment-similar-to-git>"
 *  3. Now generate client >_ npx prisma generate
 *
 *  * Browse your data with Prisma Studio >_ npx prisma studio
 */
//--------------------------------------------------------------------------------------

import fs from "fs";
import path from "path";
import { ApolloServer } from "apollo-server-express";
import { PubSub } from "graphql-subscriptions";
import express from "express";
import prisma from "@prisma/client";

// To run both an Express app and a separate subscription server, we'll create an http.Server instance that effectively wraps the two and becomes a new listener
import { createServer } from "http";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { makeExecutableSchema } from "@graphql-tools/schema";

import { getUserId } from "./utils.js";
import resolvers from "./resolvers/index.js";

(async () => {
    const app = express();
    const httpServer = createServer(app);

    const prismaClient = new prisma.PrismaClient();
    const pubsub = new PubSub();

    const schema = makeExecutableSchema({
        typeDefs: fs.readFileSync(path.join("src/", "schema.graphql"), "utf8"),
        resolvers,
    });

    const server = new ApolloServer({
        schema,
        context: ({ req }) => ({
            ...req,
            prismaClient,
            pubsub,
            userId:
                req && req.headers.authorization ? getUserId(req) : undefined,
        }),
    });
    // Required logic for integrating with Express
    await server.start();
    server.applyMiddleware({
        app,
        path: server.graphqlPath,
    });

    const subscriptionServer = SubscriptionServer.create(
        {
            schema,
            execute,
            subscribe,
            onConnect(connectionParams, webSocket, context) {
                // connectionParams holds the req headers
                console.log("Connected!");
                return { pubsub, prismaClient };
            },
            onDisconnect(webSocket, context) {
                console.log("Disconnected!");
            },
        },
        {
            server: httpServer,
            path: server.graphqlPath,
        }
    );

    const port = process.env.PORT || 4000;
    httpServer.listen(port, () =>
        console.log(`
        🚀 Server ready at http://localhost:${port}${server.graphqlPath}
        📭  Query at https://studio.apollographql.com/dev
        `)
    );

    // Shut down in the case of interrupt and termination signals
    ["SIGINT", "SIGTERM"].forEach((signal) => {
        process.on(signal, () => subscriptionServer.close());
    });
})();
