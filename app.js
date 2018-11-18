const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");
// connecting to mlab Db
const mongoUrl = "mongodb://balundev:ali123123@ds123753.mlab.com:23753/mongoblogdb";
mongoose.connect(mongoUrl, {useNewUrlParser: true});

/// blog schema
const blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date,
              default: Date.now
    }
});
const Blog = mongoose.model("Blog", blogSchema);
// app conf
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

/// rest routes
app.get("/", (req,res)=>{
    res.redirect("/blogs");
})
app.get("/blogs", (req, res)=>{
    Blog.find({}, (err,blogs)=>{
        if(err){
            console.log("error to find")
        }else{
            res.render("index", {blogs:blogs})
        }
    });
});

app.get("/blogs/new", (req,res)=>{
    res.render("new")
});


app.post("/blogs", (req,res)=>{
    req.body.body = req.sanitize(req.body.body);
    let post = req.body;
    Blog.create(post, (err, newPost)=>{
        if(err) console.log("error in adding post");
        res.redirect("/blogs");
    })
});

app.get("/blogs/:id", (req,res)=>{
    Blog.findById(req.params.id, (err, foundPost)=>{
        if(err){
            res.redirect("/blogs")
        } else {
            res.render("show", {post: foundPost})
        }
    })
});

app.get("/blogs/:id/edit", (req,res)=>{
    Blog.findById(req.params.id, (err, foundPostEdit)=>{
        if(err){
            res.redirect("/blogs")
        } else {
            res.render("edit", {post: foundPostEdit})
        }
    })
});
app.put("/blogs/:id", (req,res)=>{
    req.body.body = req.sanitize(req.body.body);
    Blog.findByIdAndUpdate(req.params.id, req.body, (err, post)=>{
        if(err){
            console.log("error while updating")
        } else {
            res.redirect("/blogs");
        }
    })
});

app.delete("/blogs/:id", (req,res)=>{
Blog.findByIdAndRemove(req.params.id, (err)=>{
    if(err){
        res.redirect("/blogs");
    }else {
        res.redirect("/blogs");
    }
})
});

app.listen(4000, () => {
    console.log('listening to port 4000');
});