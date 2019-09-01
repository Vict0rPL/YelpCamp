const Campground = require("../models/campground");
const Comment = require("../models/comment");
// all the middlewares
middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in first to do that");
    res.redirect("/login");
};

middlewareObj.isCommentOwner = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {
                // does user own the comment
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                };
            };
        });
    } else {
        req.flash("error", "You need to be logged in first to do that");
        res.redirect("back");
    };
};

middlewareObj.isCampgroundOwner = function (req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if (err) {
                console.log(err);
                req.flash("error", "Campground not found")
                res.redirect("back");
            } else {
                // does user own the campground
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                };
            };
        });
    } else {
        req.flash("error", "You need to be logged in first to do that");
        res.redirect("back");
    };
};


module.exports = middlewareObj