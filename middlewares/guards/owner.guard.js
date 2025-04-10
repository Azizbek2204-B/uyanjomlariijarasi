const { errorHandler } = require("../../helpers/error_handler");
const jwtService = require("../../services/jwtowner.service");

module.exports = async function (req, res, next){
    try {
        const authorization = req.headers.authorization
        console.log(authorization);
        if (!authorization) {
            return res.status(403).send({message:"Authorization token berilmagan"})
        }
        const bearer = authorization.split(" ")[0];
        const token = authorization.split(" ")[1];
        if (bearer != "Bearer" || !token) {
            return res
            .status(403)
            .send({ message: "bearer yoki token berilmagan" });
        }

        const decodedToken = await jwtService.verifyAccessToken(token);
        req.user=decodedToken
        console.log("ppp"+req.user);
        
        next()
    } catch (error) {
        errorHandler(error, res)
    }
}