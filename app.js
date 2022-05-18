const express = require("express");
const bodyParser = require('body-parser');
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

// Set dependencies
// Set express app
// Set view engine ejs
// Set body-parser encoded
// Set ejs static public folder
// This project creaes a basic API using app.route to update, delete, patch, find an article.
// Because no front-end page has been developed, testing is completed using PostMan desktop app to send Requests
// to a locally stored MongoDB 

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// Setup DB local connection
mongoose.connect("mongodb://localhost:27017/wikiDB")

// Create Schema
const articleSchema = new mongoose.Schema({
  title: "String",
  content: "String"
});

// Create Model, Should be capitalized and singular
// Mongoose automatically changes 'Article' into lowercase and singular
const Article = mongoose.model('Article', articleSchema);

////////////////////////////// Requests targetting all articles ///////////////////////////////

// Route method for less conding
// app.route("/articles").get().post().delete();
app.route("/articles")
  .get(function(req, res){
      //Query DB for all article
      Article.find({}, function(err, foundArticles){
        if (!err){
          res.send(foundArticles);
        } else{
          res.send(err);
        }
      }); // End Article.find()
  }) // End .get

  .post(function(req,res){
      givenTitle = req.body.title;
      givenContent = req.body.content;
      Article.create({
        title: givenTitle,
        content: givenContent
      }, function (err){
        if (err){
          console.log(err);
        } else{
          console.log("Added stuff");
        }
      }); // End Article.create
  }) // End .post

  .delete(function(req, res){
    // Ignoring the conditions so that this will delete EVERYTHING.
    Article.deleteMany(function(err){
      if(!err){
        console.log("Successfully deleted all articles.");
      } else{
        console.log(err);
      }
    }); //End deleteMany
}); // End .delete
// END app.route




////////////////////////////// Requests targetting specific articles ///////////////////////////////

// Routes for a specific given URL article.
app.route("/articles/:requestedArticle")

  .get(function(req, res){
    const requestedArticle = req.params.requestedArticle;
    console.log(requestedArticle + " " + req.params.requestedArticle);
    //Find the document with title title name
    Article.findOne({title: requestedArticle}, function(err, foundArticle){
      if (err){console.log(err);}
      if (!foundArticle) {console.log("Nothing found");}
      else {
        console.log("Found a matching article");
        res.send(foundArticle);
      }
    }); // End article.findONe
  }) // END .get NO semicolon

  .put(function(req, res){ // PUT request will replace the entire document. even if you didnt say place a title
    Article.findOneAndUpdate(
      {title: req.params.requestedArticle}, //condition
      {title: req.body.title, content: req.body.content }, // replace title with new title, replace content with new content.
      {overwrite: true}, //Mongoose prevents overwrite by default
      function(err){
        if(!err){res.send("Updated the article with new stuff");}
        else {console.log(err);}
      }
    );//end update
  }) // END put no semicolon if continueing chain

  .patch(function(req,res){
    Article.findOneAndUpdate(
      {title: req.params.requestedArticle},
      {$set: req.body},
      function(err){
        if(!err){
          res.send("updated with patch")
        } else {
          res.send(err)
        }
      }
    );
  })

  .delete(function(req,res){
    Article.deleteOne(
      { title: req.params.requestedArticle },
      function(err){
        if(!err){
          res.send("Deleted that pesky article");
        } else {
          res.send(err);
        }
      }
    ); //END deleteONE
  }); //END delete and chain



////////////////////////////// Hey! Listen! ///////////////////////////////

// Listen on port
app.listen(3000, function(){
  console.log("listening on port 3000");
})


// OLD, refactored into app.route
// Create Get route for all article
// app.get("/articles", function(req, res){
//   //Query DB for all article
//   Article.find({}, function(err, foundArticles){
//     if (!err){
//       res.send(foundArticles);
//     } else{
//       res.send(err);
//     }
//   });
// });

// OLD refactored into app.route
// Add new article from form that has not been created yet.
// Currently testing postman to make xform post requests
// app.post("/articles", function(req,res){
//   givenTitle = req.body.title;
//   givenContent = req.body.content;
//
//   Article.create({
//     title: givenTitle,
//     content: givenContent
//   }, function (err){
//     if (err){
//       console.log(err);
//     } else{
//       console.log("Added stuff");
//     }
//   });
//
// });

// OLD refactored into the app.route request.
//Will delete ALL aritcles
// app.delete("/articles", function(req, res){
//   // Ignoring the conditions so that this will delete EVERYTHING.
//   Article.deleteMany(function(err){
//     if(!err){
//       console.log("Successfully deleted all articles.");
//     } else{
//       console.log(err);
//     }
//   }); //End deleteMany
//
// }); // End delete.
