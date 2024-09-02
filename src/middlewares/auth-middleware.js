import { prismaClient } from "../app/database";

export const authMiddleware = async (req, res, next) => {
    const token = req.get('Authorization');
    if(token) {
        const user = await prismaClient.user.findFirst({
            where: {
                token: token
            }
        });

        if(user) {
            req.user = user;
            next();
        } else {
            res.status(401).json({
                errors: 'Unauthorized'
            }).end();
        }
    } else {
        res.status(401).json({
            errors: 'Unauthorized'
        }).end();
    }
}