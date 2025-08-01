const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const user = require('./Backend/models/user');
const User = require('./Backend/models/user');
const auth = require('./Backend/middleware/auth');
const Post = require('./Backend/models/Post');
const bodyparser = require('body-parser');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static('public'));

const JWT_SECRET = "9849793081";

mongoose.connect("mongodb://localhost:27017/websiteA")
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log(err));

// Registration
app.post('/signup', async(req, res)=>{
    const {name, email, username, password} = req.body;
    try{
        const exists = await User.findOne({username});
        if(exists) return res.status(400).json({msg: "Username already exists"});
        const hashed = await bcrypt.hash(password, 10);
        const user = new User({name, email, username, password:hashed});
        await user.save();
        res.status(201).json({message:"user registered"});
    }
    catch(error){
        res.status(500).json({message:"server error"});
    }
})

//Login and jwt

app.post('/login', async(req, res)=>{
    const {username, password} = req.body;
    try{
        const user = await User.findOne({username});
        if(!user) return res.status(400).json({msg: "Invalid username"});

        const match = await bcrypt.compare(password, user.password);
        if(!match) return res.status(400).json({msg: "Invalid password"});

        const token = jwt.sign({id: user._id, username: user.username}, JWT_SECRET, {expiresIn: "1h"});
        res.status(200).json({message:"user loged in succesful",token});
    }
    catch(error){
        res.status(500).json({message:"server error"});
    }
})

app.post('/create-post', auth, async(req, res)=>{
    console.log(req.body);

    const { category, title, description, image, targetFunds, deadline} = req.body;
    if(!category || !title || !description || !image || !targetFunds || !deadline){
        return res.status(400).json({message: "Please fill all fields"});
    }
    try{
        const newPost = new Post({
            userId: req.user.id,
            category,
            title,
            description,
            image,
            targetFunds,
            deadline
        });
        await newPost.save();
        res.status(201).json({message:" project created"});
    }
    catch(err){
        res.status(500).json({message:"server error"});
        
    }
})

app.get('/posts',auth, async(req, res)=>{
    try{
        const sortOption = req.query.sort === 'old'? 1: -1; // default to latest
        const posts = await Post.find().sort({createdAt: -1});
        res.status(200).json(posts);
    }
    catch(err){
        res.status(500).json({message:"server error"});
        }
})
app.get('/categories', async(req, res)=>{
    try{
        const categories = await Category.find();
        res.json(categories);
    }
    catch(err){
        res.status(500).json({message:"server error"});
    }
})

app.delete('/posts/:id', auth, async (req, res)=>{
    try{
        const post = await Post.findByIdAndDelete(req.params.id);
        if(!post) return res.status(404).json({message:"post not found"});
        if(post.userId.toString() !== req.user.id){
            return res.status(403).json({message:"unauthorized"});

        }
        await post.deleteOne();
        res.status(200).json({messsage:"post deleted succesfully"});
    }
    catch(err){
        res.status(500).json({message:"server error"});
    }
})

app.post('/posts/fund/:id', auth, async(req, res)=>{
    const {amount} = req.body;
    if(!amount || amount <=0) return res.status(400).json({message:"invalid amount"});
    try{
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({message:"post not found"});

        post.raisedFunds += amount;
        await post.save();
        res.status(200).json({message:"funds updated", post});
    }
    catch(err){
        res.status(500).json({message:"server error"});
    }
})

app.post('/posts/like/:id', auth, async(req, res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post.likes) post.likes = [];
        if(post.likes.includes(req.user.id)){
            return res.status(400).json({message:"Already liked"});
        }
        post.likes.push(req.user.id);
        await post.save();
        res.status(200).json({message:"post liked"});
    }
    catch(err){
        res.status(500).json({message:"server error"});
    }
})

app.get('/users/posts', auth, async(req, res)=>{
    try{
        const posts = await Post.find({userId: req.user.id}).sort({createdAt: -1});
        res.status(200).json(posts);
    }
    catch(err){
        res.status(500).json({message: "server error"});
    }
});

app.listen(3000)