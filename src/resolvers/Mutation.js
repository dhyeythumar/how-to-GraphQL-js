import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { APP_SECRET } from "../utils.js";

export default {
    signup: async (parent, args, context, info) => {
        const emailExists = await context.prismaClient.user.findUnique({
            where: {
                email: args.email,
            },
        });
        if (emailExists) throw new Error("Email exists");

        const password = await bcrypt.hash(args.password, 10);
        const user = await context.prismaClient.user.create({
            data: { ...args, password },
        });
        const token = jwt.sign({ userId: user.id }, APP_SECRET);
        return {
            token,
            user,
        };
    },
    login: async (parent, args, context, info) => {
        const user = await context.prismaClient.user.findUnique({
            where: { email: args.email },
        });
        if (!user) throw new Error("No such user found");

        const valid = await bcrypt.compare(args.password, user.password);
        if (!valid) throw new Error("Invalid password");

        const token = jwt.sign({ userId: user.id }, APP_SECRET);
        return {
            token,
            user,
        };
    },
    createLink: async (parent, args, context, info) => {
        const { userId } = context;
        if (userId === undefined) throw new Error("Not Authenticated");

        const newLink = await context.prismaClient.link.create({
            data: {
                url: args.url,
                description: args.description,
                postedBy: { connect: { id: userId } },
            },
        });
        context.pubsub.publish("NEW_LINK", newLink);
        return newLink;
    },
};
