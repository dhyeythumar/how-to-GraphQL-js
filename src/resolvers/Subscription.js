export default {
    newLink: {
        resolve: (payload, args, context, info) => {
            // Manipulate and return the new value
            console.log(payload, context);
            return payload;
        },
        subscribe: (parent, args, context, info) => {
            console.log(parent, context);
            return context.pubsub.asyncIterator(["NEW_LINK"]);
        },
    },
};
