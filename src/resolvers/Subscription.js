export default {
    newLink: {
        subscribe: (parent, args, context, info) => {
            return context.pubsub.asyncIterator("NEW_LINK");
        },
    },
    newVote: {
        subscribe: (parent, args, context, info) => {
            return context.pubsub.asyncIterator("NEW_VOTE");
        },
    },
};
