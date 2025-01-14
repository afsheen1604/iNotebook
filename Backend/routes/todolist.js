const express = require('express');
const router = express.Router(); 
const TodoList = require('../models/TodoList');
var fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const { getByTitle } = require('@testing-library/react');
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

        if(status == "completed"){
            const suggestedlistItem = new SuggestedTodoList({
                content: req.body.content, user: req.user.id, status:"completed"
            })
            const savedListItem = await suggestedlistItem.save();
        }
        else{
            SuggestedTodoList.deleteMany({content: req.body.content, user: req.user.id}, (err)=>{
                if (err) {
                    console.error('Error deleting document:', err);
                  } else {
                    console.log('Document deleted successfully');
                  }
            });
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

        res.json({"Success":"Note deleted", "Note":note});
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

        const hobbies = user.hobbies.split(', ');

        

        for (let i = 0; i < hobbies.length; i++) {
            const value = hobbies[i];
            const tasks = await Tasks.find({ Category: value });
            
            while(true){
                let randomIndex = Math.floor(Math.random() * tasks.length);
                let listItem = await SuggestedTodoList.findOne({ content: tasks[randomIndex].Content });
                if(!listItem){
                    listItem = new TodoList({
                        content: tasks[randomIndex].Content,
                        user : req.user.id,
                        type: "suggested"
                    });
                    let savedListItem = await listItem.save();
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

router.post('/createTasks',[
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