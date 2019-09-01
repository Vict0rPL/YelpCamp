const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");


var data = [
    {"name": "Silent Hills", 
    "image": "https://images.unsplash.com/photo-1534437401535-8cdaa9b93ae4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80", 
    "description": "Non urbanized area wiht beautifull scenery." },

    {"name": "Mt. Goats", 
    "image": "https://images.unsplash.com/photo-1484960055659-a39d25adcb3c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80", 
    "description": "Rocky mountain site." },

    {"name": "Nappers Den", 
    "image": "https://images.unsplash.com/photo-1534187886935-1e1236e856c3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80", 
    "description": "Perfect place to take a nap." },

    {"name": "Mt. Silver", 
    "image": "https://images.unsplash.com/photo-1535326913333-ee6f9201c45c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80", 
    "description": "Beware strong Pokemons living there! You may meet Red ocasionally there." },

    {"name": "Aurora Plains", 
    "image": "https://images.unsplash.com/photo-1525177089949-b1488a0ea5b6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80",  
    "description": "Aurora can be seen here pretty often." },

    {"name": "starlight valley", 
    "image": "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80", 
    "description": "Campsite located in the woods faraway from the city. From where you can enjoy beautifull night sky."}
]



function seedDB(){
    Campground.remove({}, (err) => {
        if (err) {
            console.log(err);
        } else{
            console.log("Removed campgrounds.")
            // add a few campgrounds
            data.forEach((seed) => {
                Campground.create(seed, (err, campground) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("added a campground");
                        // create a coment
                        Comment.create(
                            {
                                text: "This place is great! No internet tho.",
                                author: "Homer"
                            }, (err, comment)=>{
                                if(err){
                                    console.log(err);
                                } else{
                                    campground.comments.push(comment);
                                    campground.save((err, savedData)=>{
                                        if(err){
                                            console.log(err);
                                        } else{
                                            console.log("Saved.");
                                        };
                                    console.log("Created a new comment.");
                                    })
                                }
                            }
                        )
                    };
                });
            });
        };
    });
};

module.exports = seedDB;
