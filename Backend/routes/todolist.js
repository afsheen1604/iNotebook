const express = require('express');
const router = express.Router(); 
const TodoList = require('../models/TodoList');
var fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const Tasks = require('../models/Tasks');

const User = require('../models/User');
const SuggestedTodoList = require('../models/SuggestedTodoList');


router.get('/fetchTodoList', fetchuser, async (req,res)=>{
    
    try {
        const list = await TodoList.find({user: req.user.id});
        res.json(list);        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

});


router.post('/addListItem', fetchuser, [
    body('content', 'content Must be Atleast 5 Characters').isLength({ min: 5 }),
], async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        
        const {content} = req.body;

        const listItem = new TodoList({
            content, user: req.user.id
        })

        const savedListItem = await listItem.save();
        
        res.json(savedListItem);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error Occured");
    }

});

router.put('/updateListItem/:id', fetchuser, async (req, res) => {

    try {
        const {status} = req.body;

        const updatedListItem = {};
        updatedListItem.status = status;

        let listItem = await TodoList.findById(req.params.id);
        if(!listItem){
            return res.status(404).send("Not Found");
        }
        if(listItem.user.toString()!==req.user.id){
            return res.status(401).send("Not Allowed");
        }

        if(status === "completed"){
            const suggestedlistItem = new SuggestedTodoList({
                content: req.body.content, user: req.user.id, status:"completed"
            })
            const savedListItem = await suggestedlistItem.save();
        }
        else{
            await SuggestedTodoList.deleteMany({content: req.body.content, user: req.user.id});
        }

        listItem = await TodoList.findByIdAndUpdate(req.params.id, {$set: updatedListItem}, {new: true});

        

        res.json(listItem);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error Occured");
    }

});


router.delete('/deleteListItem/:id', fetchuser, async (req, res) => {

    try {

        let listItem = await TodoList.findById(req.params.id);
        if(!listItem){
            return res.status(404).send("Not Found");
        }
        if(listItem.user.toString()!==req.user.id){
            return res.status(401).send("Not Allowed");
        }

        listItem = await TodoList.findByIdAndDelete(req.params.id);

        res.json({"Success":"Item deleted", "item":listItem});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error Occured");
    }

});

router.get('/suggestTasks', fetchuser, [
], async (req, res) => {
    try {
        
        const user = await User.findById(req.user.id);

        console.log(user);

        const hobbies = (user.hobbies || "").split(', ').filter(h => h);

        

        for (let i = 0; i < hobbies.length; i++) {
            const value = hobbies[i];
            const tasks = await Tasks.find({ Category: value });
            
            if (tasks.length === 0) continue;

            const shuffled = tasks.sort(() => Math.random() - 0.5);
            for (const task of shuffled) {
                const existing = await SuggestedTodoList.findOne({ content: task.Content, user: req.user.id });
                if (!existing) {
                    const listItem = new TodoList({
                        content: task.Content,
                        user: req.user.id,
                        type: "suggested"
                    });
                    await listItem.save();
                    break;
                }
            }
        }

        res.json({success: "Success"});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error Occured");
    }

});

router.post('/createTasks', fetchuser, [
    body('content', 'content Must be Atleast 5 Characters').isLength({ min: 5 }),
], async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        
        const {category, content, link} = req.body;

        const listItem = new Tasks({
            content, category, link
        })

        const savedListItem = await listItem.save();
        
        res.json(savedListItem);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error Occured");
    }

});



module.exports = router