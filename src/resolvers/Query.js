// 'parent' parameter carries the return value of the previous resolver execution level
export default {
    info: () => `This is the API of a Hackernews Clone`,
    users: async (parent, args, context) => {
        return await context.prismaClient.user.findMany();
    },
    links: async (parent, args, context) => {
        return await context.prismaClient.link.findMany();
    },
    feed: async (parent, args, context, info) => {
        const where = args.filter
            ? {
                OR: [
                    { description: { contains: args.filter } },
                    { url: { contains: args.filter } },
                ],
            } : {};

        const links = await context.prismaClient.link.findMany({
            where,
            skip: args.skip,  // offset (default = 0)
            take: args.take ? args.take : 1,  // limit
            orderBy: args.orderBy,
        });

        // orderBy will be an object similar to one of these
        // 1. { description: asc } || { description: desc }
        // 2. { url: asc } || { url: desc }
        // 3. { createdAt: asc } || { createdAt: desc }
        const count = await context.prismaClient.link.count({ where })
        return {
            links,
            count,
        }
    },
};
