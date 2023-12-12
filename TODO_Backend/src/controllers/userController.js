const User = require('../models/userModel');
const jwt = require('../services/jwt');
const crypto = require('crypto');


async function passwordToHash(pass, salt)
{
    let hash;
    try
    {
        hash = await new Promise((resolve, reject) => {
            crypto.pbkdf2(pass, salt, 128, 64, 'sha512', (err, key) => {
                if(err) return reject(err);
                resolve(key.toString('hex'));
            });
        });
    } catch(error)
    {
        console.log("Failed to generate key!");
        console.log(error);
    }
    return hash;
}

async function createUser(req, res)
{
    let hash;
    try
    {
        hash = await new Promise((resolve, reject) => {
            crypto.pbkdf2(req.body.password, req.body.username, 128, 64, 'sha512', (err, key) => {
                if(err) return reject(err);
                resolve(key.toString('hex'));
            });
        });
    } catch(error)
    {
        console.log('Failed to generate key!');
    }
    try
    {
        await User.create({username: req.body.username, password: hash});
        res.status(201).send('Created');
    }
    catch(error)
    {
        console.log(error.message);
        res.status(501).send('Failure');
    }
}

async function loginUser(req, res)
{
    const targetUser = await User.findOne({username: req.body.username});
    if(targetUser && await passwordToHash(req.body.password, req.body.username) === targetUser.password)
    {
        token = jwt.generateAuthToken(targetUser.id, req.body.username);
        res.setHeader("Authorization", token);
        res.status(200).send("Logged");
    }
    else
    {
        res.status(401).send("Invalid credentials");
    }
}

async function updateUser(req, res, next)
{
    let hash;
    try
    {
        hash = await new Promise((resolve, reject) => {
            crypto.pbkdf2(req.body.password, req.body.username ? req.body.username : process.env.TOKEN_SECRET, 128, 64, 'sha512', (err, key) => {
                if(err) return reject(err);
                resolve(key.toString('hex'));
            });
        });
    } catch(error)
    {
        console.log('Failed to generate key!');
    }
    try
    {
        const user = await User.findOne({username: req.params.username});
        if(user._id!=res.locals.id)
        {
            res.status(403).send('Incorrect user');
            return;
        }
        else
        {
            await User.findByIdAndUpdate(res.locals.id, {
                username: req.body.username,
                password: hash
            });
            res.status(200).send('Edited');
        }
    }
    catch(err)
    {
        res.status(400).send(`Failed to update, error: ${err.message}`);
    }
}

async function deleteUser(req, res)
{
    if(req.params.username!=res.locals.user)
    {
        res.status(403).send('Incorrect user');
        return;
    }
    else
    {
        await User.deleteOne({username: req.params.username});
        res.status(200).send('Deleted');
    }
}

module.exports = {
    createUser,
    loginUser,
    deleteUser,
    updateUser
}