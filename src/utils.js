import jwt from "jsonwebtoken";

const APP_SECRET = "GraphQL-is-aw3some";

const getTokenPayload = (token) => {
    return jwt.verify(token, APP_SECRET);
};

const getUserId = (req, authToken) => {
    if (req) {
        const token = req.headers.authorization.replace("Bearer ", "");
        if (!token) throw new Error("No token found");
        const { userId } = getTokenPayload(token);
        return userId;
    } else if (authToken) {
        const { userId } = getTokenPayload(authToken);
        return userId;
    }
    throw new Error("Not Authenticated");
};

export { APP_SECRET, getUserId };
