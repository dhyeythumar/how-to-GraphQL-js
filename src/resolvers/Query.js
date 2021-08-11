// 'parent' parameter carries the return value of the previous resolver execution level
export default {
    info: () => `This is the API of a Hackernews Clone`,
    users: async (parent, args, context) => {
        return await context.prismaClient.user.findMany();
    },
    links: async (parent, args, context) => {
        return await context.prismaClient.link.findMany();
    },
};
