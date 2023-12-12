const jwt = require('../services/jwt');

async function auth(req, res, next)
{
    const token = req.header('Authorization');
    if(!token) return res.status(401).send('No token provided');
    const verifiedUser = await jwt.verifyAuthToken(token);
    if(verifiedUser)
    {
        res.locals.user = JSON.parse(verifiedUser)["user"];
        res.locals.id = JSON.parse(verifiedUser)["id"];
        next();
    }
    else
    {
        res.status(401).send("Invalid token");
    }
}

module.exports = {
    auth
}