const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");


//  ROUTES

// INDEX - show all campgrounds
router.get("/", (req, res) => {
    // get all the campgrounds from DB
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log("Smthing went wrong while loading campgrounds!");
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds });
        };
    });
});

// CREATE - add new campground to the DB
router.post("/", middleware.isLoggedIn, (req, res) => {
    // take the data from the form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = { name: name, image: image, price: price, description: description, author: author };
    // create a new campground and add to the database
    Campground.create(newCampground, (err, created_campground) => {
        if (err) {
            console.log("Something went wrong!");
            console.log(err);
        } else {
            console.log("Campground successfully created. :");
            console.log(created_campground);
        };
    });
    // redirect to /campgrounds
    res.redirect("/campgrounds");
});

// NEW - show form to create a new campground
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
})

//SHOW - shows more info about one campground
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if (err) {
            console.log("Something went wrong!");
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campgrounds/show", { campground: foundCampground });
        };
    });
});

// EDIT - allows to edit existing campground
router.get("/:id/edit", middleware.isCampgroundOwner, (req, res)=>{
    Campground.findById(req.params.id, (err, foundCampground)=>{
        if(err){
            console.log(err);
            req.flash("error", "Campground not found");
            res.redirect("/campgrounds");
        } else{
            res.render("campgrounds/edit", { campground: foundCampground });
        };
    });
});

// UPDATE - update campground with edited data
router.put("/:id", middleware.isCampgroundOwner, (req, res)=>{
    //find and update the campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground)=>{
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds/" + req.params.id);
        };
    });
});

// DESTROY - removes existing campground
router.delete("/:id", middleware.isCampgroundOwner, (req, res)=>{
    Campground.findByIdAndRemove(req.params.id, (err, removedCampground)=>{
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else{
            Comment.deleteMany({_id: { $in: removedCampground.comments}}, (err)=>{
                if(err){
                    console.log(err);
                };
            })
            res.redirect("/campgrounds");
        };
    });
});

module.exports = router;