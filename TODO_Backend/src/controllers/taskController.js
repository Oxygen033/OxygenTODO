const Task = require('../models/taskModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const { replaceOne } = require('../models/userModel');
const fs = require('fs');

async function createTask(req, res)
{
    let date = new Date;
    try
    {
        Task.create({
            title: req.body.title,
            description: req.body.description,
            user: res.locals.id,
            isCompleted: false,
            category: req.body.category,
            addDate: Date.now(),
            dueDate: req.body.dueDate});
        res.status(201).send('Created');
    }
    catch
    {
        res.status(501).send('Failure');
    }
}

async function getAllTasks(req, res, next)
{
    const targetUser = await User.findOne({username: req.params.username});
    try
    {
        if(res.locals.id != targetUser.id)
        {
            throw new Error("Incorrect user");
        }
        const tasks = await Task.find({user: res.locals.id});
        res.status(200).json(tasks);
    }
    catch(err)
    {
        res.status(400).send(`Failed to retrieve tasks, error: ${err.message}`);
    }
}

async function getTaskById(req, res)
{
    try
    {
        const task = await Task.findOne({user: new mongoose.Types.ObjectId(req.params.id)});
        if(task.user == res.locals.id)
        {
            res.status(200).json(task);
        }
        else
        {
            throw new Error("Incorrect user");
        }
    }
    catch(err)
    {
        res.status(400).send(`Failed to retrieve task, error: ${err.message}`);
    }
}

async function updateTask(req, res, next)
{
    try
    {
        const task = await Task.findById(req.params.id);
        if(task.user!=res.locals.id)
        {
            res.status(403).send('Incorrect user');
            return;
        }
        else
        {
            await Task.findByIdAndUpdate(req.params.id, {
                title: req.body.title,
                description: req.body.description,
                isCompleted: req.body.isCompleted,
                category: req.body.category,
                dueDate: req.body.dueDate});
            res.status(200).send('Edited');
        }
    }
    catch(err)
    {
        res.status(400).send(`Failed to update, error: ${err.message}`);
    }
}

async function deleteTask(req, res, next)
{
    try
    {
        const task = await Task.findById(req.params.id);
        if(task.user!=res.locals.id)
        {
            res.status(403).send('Incorrect user');
            return;
        }
        else
        {
            await Task.findByIdAndDelete(req.params.id);
            res.status(200).send('Deleted');
        }
    }
    catch
    {
        res.status(400).send(`Failed to delete, error: ${err.message}`);
    }
}

module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask
}