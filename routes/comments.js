const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");


//  ROUTES

// comments new - displays form
router.get("/new", middleware.isLoggedIn, (req, res) => {
    // find campground by ID
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: campground });
        };
    });
});

// coments create - adds new comment
router.post("/", middleware.isLoggedIn, (req, res) => {
    // lookup campground ID
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            // create new comment
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    // connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    // redirect to campground show page
                    req.flash("success", "Successfully added comment")
                    res.redirect("/campgrounds/" + campground._id);
                };
            });
        };
    });
});

// comments edit - shows form to edit comment
router.get("/:comment_id/edit", middleware.isCommentOwner, (req, res)=>{
    Comment.findById(req.params.comment_id, (err, foundComment)=>{
        if(err){
            console.log(err);
            res.redirect("back");
        } else{
            res.render("comments/edit", { campground_id: req.params.id, comment: foundComment })
        };
    })
});

// comments update - updates comment data
router.put("/:comment_id", middleware.isCommentOwner, (req, res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment)=>{
        if(err){
            console.log(err);
            res.redirect("back");
        } else{
            res.redirect("/campgrounds/" + req.params.id);
        };
    });
});

// comments destroy - removes existing campground
router.delete("/:comment_id", middleware.isCommentOwner, (req, res)=>{
    Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
        if(err){
            console.log(err);
            res.redirect("back");
        } else{
            req.flash("success", "Coment has been successfully deleted");
            res.redirect("/campgrounds/" + req.params.id);
        };
    });
});

module.exports = router;