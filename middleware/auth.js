import  jwt  from "jsonwebtoken";

export const auth=(req, res, next) =>{
    try {
        const token =req.header("x-Auth-token");
        jwt.verify(token,process.env.SECRET_KEY)
        next()
    } catch (error) {
        res.status(404).send({message:error.message});
    }
}