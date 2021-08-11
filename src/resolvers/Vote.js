export default {
    link: async (parent, args, context, _) => {
        return await context.prismaClient.vote
            .findUnique({
                where: { id: parent.id },
            })
            .link();
    },
    user: async (parent, args, context, _) => {
        return await context.prismaClient.vote
            .findUnique({
                where: { id: parent.id },
            })
            .user();
    },
};
