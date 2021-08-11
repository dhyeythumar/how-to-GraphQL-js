export default {
    links: async (parent, args, context) => {
        return await context.prismaClient.user
            .findUnique({ where: { id: parent.id } })
            .links();
    },
    votes: async (parent, args, context) => {
        return await context.prismaClient.user
            .findUnique({ where: { id: parent.id } })
            .votes();
    },
};
