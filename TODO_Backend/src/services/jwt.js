const jwt = require('jsonwebtoken');
const { castObject } = require('../models/userModel');

function generateAuthToken(id, username)
{
    return jwt.sign({id: id, user: username}, process.env.TOKEN_SECRET, {expiresIn: '3000s'});
}

async function verifyAuthToken(token)
{
    let res;
    try
    {
        res = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
            if(err) return reject(err);
            resolve(decoded);
            });
        });
        return JSON.stringify(res);
    }
    catch(err)
    {
        console.log("jwt verifying internal error");
        console.log("error: " + err.message);
        return null;
    }
}

module.exports = {
    generateAuthToken,
    verifyAuthToken
}