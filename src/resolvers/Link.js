export default {
    postedBy: async (parent, args, context) => {
        return await context.prismaClient.link
            .findUnique({ where: { id: parent.id } })
            .postedBy();
    },
    votes: async (parent, args, context) => {
        return await context.prismaClient.link
            .findUnique({ where: { id: parent.id } })
            .votes();
    },
};
