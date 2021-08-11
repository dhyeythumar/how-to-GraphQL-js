// !--------------------------------- Note on this project -------------------------------
/*
 * This project employees 1 of the 3 method of creating GraphQL APIs
 * i.e It directly uses DB in resolvers (n not the legacy APIs) with the help of Prisma (advanced ORM)
 */

// !------------------------------------ Note on GraphQL ---------------------------------
/* There are 3 root types: Query, Mutation, and Subscription
    >> The fields on these root types are called root fields and define the available API operations.
    >>  When sending operations (such as queries, mutations or subscriptions) to a GraphQL API, these always need to start with a root types

  Other custom types can be also defined in schema but can't be used directly by clients
*/

// !--------------------------------- Note on Apollo Server ------------------------------
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

// !---------------------------------- Note on Prisma ------------------------------------
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
 *  * Prisma studio >_ npx prisma studio
 */
//--------------------------------------------------------------------------------------

import fs from "fs";
import path from "path";
import { ApolloServer } from "apollo-server";
import prisma from "@prisma/client";

import { getUserId } from "./utils.js";
import Query from "./resolvers/Query.js";
import Mutation from "./resolvers/Mutation.js";
import User from "./resolvers/User.js";
import Link from "./resolvers/Link.js";

const prismaClient = new prisma.PrismaClient();

const resolvers = {
    Query,
    Mutation,
    User,
    Link,
};

const graphQLSchema = fs.readFileSync(
    path.join("src/", "schema.graphql"),
    "utf8"
);

const server = new ApolloServer({
    typeDefs: graphQLSchema,
    resolvers,
    context: ({ req }) => {
        return {
            ...req,
            prismaClient,
            userId:
                req && req.headers.authorization ? getUserId(req) : undefined,
        };
    },
});

server.listen().then(({ url }) => {
    console.log(`
    🚀  Server is running!
    🔉  Listening on port 4000
    📭  Query at https://studio.apollographql.com/dev
  `);
});
