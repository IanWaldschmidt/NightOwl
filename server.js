/***********************************
 *****Server and Database Setup*****
 **********************************/

//Requires
var express = require("express");
var server = express();
var http = require('http');
var fs = require('fs');
var path = require('path');
var mysql = require('mysql');
var bodyParser = require("body-parser");
var multer = require('multer');
var ms = require('mediaserver');

//Multer setup
var picStorage = multer.diskStorage({
  destination: function (req, file, cb) {cb(null, __dirname + '/media/')},
  filename: function (req, file, cb) {cb(null, Date.now() + '.png')}
});

var audioStorage = multer.diskStorage({
  destination: function (req, file, cb) {cb(null, __dirname + '/media/')},
  filename: function (req, file, cb) {cb(null, Date.now() + '.mp3')}
});

var videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {cb(null, __dirname + '/media/')},
  filename: function (req, file, cb) {cb(null, Date.now() + '.mp4')}
});

var picUpload = multer({storage: picStorage});
var audioUpload = multer({storage: audioStorage});
var videoUpload = multer({storage: videoStorage});

//Set views to ejs
server.set("view engine", "ejs");
server.use(bodyParser.urlencoded({extended: true}));

//SQL Database Setup
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "NightOwl",
  database: "NightOwl"
});

//Connect to Database.
con.connect(function(err) {
  if (!err) return console.log("Connected to DB");
});

/****************
 *****Routes*****
 ****************/

server.get("/", function(req, res){res.redirect("home");});

server.get("/home", function(req, res){
  /*
    Queries are grouped by media type: Pictures are first, then HomeVideos, then Movies, then Music
    The first query in each group finds the most viewed media of the week
    The second one finds the most viewed media of all time
    The third one finds the most highly rated media of all time
    The fourth one is a random piece of media that fits the search criteria
  */

  var pic_viewWeekSQL = "Select Media.name, Media.mediaID, Views.viewCount FROM Media, Picture, (SELECT History.historyMediaID, COUNT(History.historyMediaID) AS viewCount FROM History WHERE DATEDIFF(History.accessed, CURDATE()) <= 7 GROUP BY History.historyMediaID) AS Views WHERE Media.mediaID = Picture.pictureMediaID AND Media.mediaId = Views.historyMediaID ORDER BY viewCount DESC LIMIT 5";
  var pic_viewAllTimeSQL = "Select Media.name, Media.mediaID, Views.viewCount FROM Media, Picture, (SELECT History.historyMediaID, COUNT(History.historyMediaID) AS viewCount FROM History GROUP BY History.historyMediaID) AS Views WHERE Media.mediaID = Picture.pictureMediaID AND Media.mediaId = Views.historyMediaID ORDER BY viewCount DESC LIMIT 5";
  var pic_ratingSQL = "Select Media.name, Media.mediaID, Ratings.avgRating FROM Media, Picture, (SELECT Feedback.commentMediaID, AVG(Feedback.rating) AS avgRating FROM Feedback GROUP BY Feedback.commentMediaID) AS Ratings WHERE Media.mediaID = Picture.pictureMediaID AND Media.mediaID = Ratings.commentMediaID ORDER BY Ratings.avgRating DESC LIMIT 5"
  var pic_randSQL = "SELECT Media.name, Media.mediaID FROM Media, Picture WHERE Media.mediaID = Picture.pictureMediaID ORDER BY RAND() LIMIT 1";

  var vid_viewWeekSQL = "Select Media.name, Media.mediaID, Views.viewCount FROM Media, HomeVideo, (SELECT History.historyMediaID, COUNT(History.historyMediaID) AS viewCount FROM History WHERE DATEDIFF(History.accessed, CURDATE()) <= 7 GROUP BY History.historyMediaID) AS Views WHERE Media.mediaID = HomeVideo.homeVideoMediaID AND Media.mediaId = Views.historyMediaID ORDER BY viewCount DESC LIMIT 5";
  var vid_viewAllTimeSQL = "Select Media.name, Media.mediaID, Views.viewCount FROM Media, HomeVideo, (SELECT History.historyMediaID, COUNT(History.historyMediaID) AS viewCount FROM History GROUP BY History.historyMediaID) AS Views WHERE Media.mediaID = HomeVideo.homeVideoMediaID AND Media.mediaId = Views.historyMediaID ORDER BY viewCount DESC LIMIT 5";
  var vid_ratingSQL = "Select Media.name, Media.mediaID, Ratings.avgRating FROM Media, HomeVideo, (SELECT Feedback.commentMediaID, AVG(Feedback.rating) AS avgRating FROM Feedback GROUP BY Feedback.commentMediaID) AS Ratings WHERE Media.mediaID = HomeVideo.homeVideoMediaID AND Media.mediaID = Ratings.commentMediaID ORDER BY Ratings.avgRating DESC LIMIT 5"
  var vid_randSQL = "SELECT Media.name, Media.mediaID FROM Media, HomeVideo WHERE Media.mediaId = HomeVideo.homeVideoMediaID ORDER BY RAND() LIMIT 1";

  var mov_viewWeekSQL = "Select Media.name, Media.mediaID, Views.viewCount FROM Media, Movies, (SELECT History.historyMediaID, COUNT(History.historyMediaID) AS viewCount FROM History WHERE DATEDIFF(History.accessed, CURDATE()) <= 7 GROUP BY History.historyMediaID) AS Views WHERE Media.mediaID = Movies.movieMediaID AND Media.mediaId = Views.historyMediaID ORDER BY viewCount DESC LIMIT 5";
  var mov_viewAllTimeSQL = "Select Media.name, Media.mediaID, Views.viewCount FROM Media, Movies, (SELECT History.historyMediaID, COUNT(History.historyMediaID) AS viewCount FROM History GROUP BY History.historyMediaID) AS Views WHERE Media.mediaID = Movies.movieMediaID AND Media.mediaId = Views.historyMediaID ORDER BY viewCount DESC LIMIT 5";
  var mov_ratingSQL = "Select Media.name, Media.mediaID, Ratings.avgRating FROM Media, Movies, (SELECT Feedback.commentMediaID, AVG(Feedback.rating) AS avgRating FROM Feedback GROUP BY Feedback.commentMediaID) AS Ratings WHERE Media.mediaID = Movies.movieMediaID AND Media.mediaID = Ratings.commentMediaID ORDER BY Ratings.avgRating DESC LIMIT 5"
  var mov_randSQL = "SELECT Media.name, Media.mediaID FROM Media, Movies WHERE Media.mediaId = Movies.movieMediaID ORDER BY RAND() LIMIT 1";

  var mus_viewWeekSQL = "Select Media.name, Media.mediaID, Views.viewCount FROM Media, Music, (SELECT History.historyMediaID, COUNT(History.historyMediaID) AS viewCount FROM History WHERE DATEDIFF(History.accessed, CURDATE()) <= 7 GROUP BY History.historyMediaID) AS Views WHERE Media.mediaID = Music.musicMediaID AND Media.mediaId = Views.historyMediaID ORDER BY viewCount DESC LIMIT 5";
  var mus_viewAllTimeSQL = "Select Media.name, Media.mediaID, Views.viewCount FROM Media, Music, (SELECT History.historyMediaID, COUNT(History.historyMediaID) AS viewCount FROM History GROUP BY History.historyMediaID) AS Views WHERE Media.mediaID = Music.musicMediaID AND Media.mediaId = Views.historyMediaID ORDER BY viewCount DESC LIMIT 5";
  var mus_ratingSQL = "Select Media.name, Media.mediaID, Ratings.avgRating FROM Media, Music, (SELECT Feedback.commentMediaID, AVG(Feedback.rating) AS avgRating FROM Feedback GROUP BY Feedback.commentMediaID) AS Ratings WHERE Media.mediaID = Music.musicMediaID AND Media.mediaID = Ratings.commentMediaID ORDER BY Ratings.avgRating DESC LIMIT 5"
  var mus_randSQL = "SELECT Media.name, Media.mediaID FROM Media, Music WHERE Media.mediaID = Music.musicMediaID ORDER BY RAND() LIMIT 1";

  //This executes all queries synchronously and renders the results
  con.query(pic_viewWeekSQL, function(err, pic_viewWeekSQL){
    if(err) console.log(err);
    else{
      con.query(pic_viewAllTimeSQL, function(err, pic_viewAllTimeSQL){
        if(err) console.log(err);
        else{
          con.query(pic_ratingSQL, function(err, pic_ratingSQL){
            if(err) console.log(err);
            else{
              con.query(pic_randSQL, function(err, pic_randSQL){
                if(err) console.log(err);
                else{
                  con.query(vid_viewWeekSQL, function(err, vid_viewWeekSQL){
                    if(err) console.log(err);
                    else{
                      con.query(vid_viewAllTimeSQL, function(err, vid_viewAllTimeSQL){
                        if(err) console.log(err);
                        else{
                          con.query(vid_ratingSQL, function(err, vid_ratingSQL){
                            if(err) console.log(err);
                            else{
                              con.query(vid_randSQL, function(err, vid_ratingSQL){
                                if(err) console.log(err);
                                else{
                                  con.query(mov_viewWeekSQL, function(err, mov_viewWeekSQL){
                                    if(err) console.log(err);
                                    else{
                                      con.query(mov_viewAllTimeSQL, function(err, mov_viewAllTimeSQL){
                                        if(err) console.log(err);
                                        else{
                                          con.query(mov_ratingSQL, function(err, mov_ratingSQL){
                                            if(err) console.log(err);
                                            else{
                                              con.query(mov_randSQL, function(err, mov_randSQL){
                                                if(err) console.log(err);
                                                else{
                                                  con.query(mus_viewWeekSQL, function(err, mus_viewWeekSQL){
                                                    if(err) console.log(err);
                                                    else{
                                                      con.query(mus_viewAllTimeSQL, function(err, mus_viewAllTimeSQL){
                                                        if(err) console.log(err);
                                                        else{
                                                          con.query(mus_ratingSQL, function(err, mus_ratingSQL){
                                                            if(err) console.log(err);
                                                            else{
                                                              con.query(mus_randSQL, function(err, mus_randSQL){
                                                                if(err) console.log(err);
                                                                else{
                                                                  res.render("home", {results:{
                                                                    pic_viewWeekSQL: pic_viewWeekSQL,
                                                                    pic_viewAllTimeSQL: pic_viewAllTimeSQL,
                                                                    pic_ratingSQL: pic_ratingSQL,
                                                                    pic_randSQL: pic_randSQL,
                                                                    vid_viewWeekSQL: vid_viewWeekSQL,
                                                                    vid_viewAllTimeSQL: vid_viewAllTimeSQL,
                                                                    vid_ratingSQL: vid_ratingSQL,
                                                                    vid_randSQL: vid_ratingSQL,
                                                                    mov_viewWeekSQL: mov_viewWeekSQL,
                                                                    mov_viewAllTimeSQL: mov_viewAllTimeSQL,
                                                                    mov_ratingSQL: mov_ratingSQL,
                                                                    mov_randSQL: mov_randSQL,
                                                                    mus_viewWeekSQL: mus_viewWeekSQL,
                                                                    mus_viewAllTimeSQL: mus_viewAllTimeSQL,
                                                                    mus_ratingSQL: mus_ratingSQL,
                                                                    mus_randSQL: mus_randSQL}
                                                                  });
                                                                }
                                                              });
                                                            }
                                                          });
                                                        }
                                                      });
                                                    }
                                                  });
                                                }
                                              });
                                            }
                                          });
                                        }
                                      });
                                    }
                                  });
                                }
                              });
                            }
                          });
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
});

server.get("/search", function(req, res){res.render("search");});

//Handle search request based on user input
server.post("/search", function(req, res){
  //Get user input
  var mediaType = req.body.mediaType;
  var name = req.body.name;
  var filter = req.body.filter;
  //Set SQL query based on input
  if(filter === "rating"){
    if(mediaType === "movie"){var sql = "SELECT Media.name, Media.mediaID, AVG(Feedback.rating) AS avgRating FROM Media, Movies, Feedback WHERE Media.mediaID = Feedback.commentMediaID AND Media.mediaID = Movies.movieMediaID AND Media.name LIKE '%" + name + "%' GROUP BY Media.mediaID";}
    else if(mediaType === "video"){var sql = "SELECT Media.name, Media.mediaID, AVG(Feedback.rating) AS avgRating FROM Media, HomeVideo, Feedback WHERE Media.mediaID = Feedback.commentMediaID AND Media.mediaID = HomeVideo.homeVideoMediaID AND Media.name LIKE '%" + name + "%' GROUP BY Media.mediaID";}
    else if(mediaType === "picture"){var sql = "SELECT Media.name, Media.mediaID, AVG(Feedback.rating) AS avgRating FROM Media, Picture, Feedback WHERE Media.mediaID = Feedback.commentMediaID AND Media.mediaID = Picture.pictureMediaID AND Media.name LIKE '%" + name + "%' GROUP BY Media.mediaID";}
    else if(mediaType === "music"){var sql = "SELECT Media.name, Media.mediaID, AVG(Feedback.rating) AS avgRating FROM Media, Music, Feedback WHERE Media.mediaID = Feedback.commentMediaID AND Media.mediaID = Music.musicMediaID AND Media.name LIKE '%" + name + "%' GROUP BY Media.mediaID";}
    else {return;}
  }
  else{
    if(mediaType === "movie"){var sql = "SELECT Media.name, Media.mediaID FROM Media, Movies WHERE Media.mediaID = Movies.movieMediaID AND Media.name LIKE '%" + name + "%'";}
    else if(mediaType === "video"){var sql = "SELECT Media.name, Media.mediaID FROM Media, HomeVideo WHERE Media.mediaID = HomeVideo.homeVideoMediaID AND Media.name LIKE '%" + name + "%'";}
    else if(mediaType === "picture"){var sql = "SELECT Media.name, Media.mediaID FROM Media, Picture WHERE Media.mediaID = Picture.pictureMediaID AND Media.name LIKE '%" + name + "%'";}
    else if(mediaType === "music"){var sql = "SELECT Media.name, Media.mediaID FROM Media, Music WHERE Media.mediaID = Music.musicMediaID AND Media.name LIKE '%" + name + "%'";}
    else {return;}
  }
  sql = sortBy(sql, filter);
  //Execute query and render results
  con.query(sql, function(err, results){
    if(err){
      console.log(err);
      res.render("search");
    }
    else{
      res.render("results", {results: results, mediaType: mediaType});
    }
  });
});

server.get("/signup", function(req, res){res.render("signup");});

//Handle signup request
server.post("/signup", function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;
  var country = req.body.country;
  var birthdate = req.body.birthdate;
  var gender = req.body.gender;
  var sql = "INSERT INTO Users VALUES('"+ username +"','"+ password +"','" + email +"','"+ country +"','"+ birthdate +"','"+ gender + "')";
  /*
    Transaction to ensure user is created correctly
  */
  con.beginTransaction(function(err){
    if(err) {console.log(err)}
    con.query(sql, function(err){
      if(err){
        console.log(err);
        con.rollback(function() {});
        res.render("signup");
      }
      else { con.commit(function() {});}
    });
  });
  
  res.redirect("/users/" + username);
});

server.get("/login", function(req, res){res.render("login");});

//Handle login request
server.post("/login", function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  var sql = "SELECT username, password FROM Users WHERE username=?";
  con.query(sql, username, function(err, results){
    if(err){
      console.log(err);
      res.render("login");
    }
    else if(results[0].password !== password){
      res.render("loginFailed");
    }
    else{
      res.redirect("/home");
    }
  })
});

//Display user info page
server.get("/users/:username", function(req, res){
    var username = req.params.username;
    var sql = 'Select * From Users WHERE username=?';
    con.query(sql,username, function(err, results, fields){
      if(err)console.log(err);
      else{
        if(results.length === 0) res.render("userNoExist", {username:username});
        else res.render("users", {results:results[0]});
      }
    });
});

//Display user update page
server.get("/updateuser/:username", function(req,res){
  var username = req.params.username;
  var sql = 'Select * From Users WHERE username=?';
  con.query(sql,username, function(err, results, fields){
    if(err)console.log(err);
    else{
      if(results.length === 0) res.render("userNoExist", {username:username});
      else res.render("updateUser", {results:results[0]});
    }
  })
});

//Handle user update request
server.post("/updateuser", function(req, res){
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;
  var country = req.body.country;
  var birthdate = req.body.birthdate;
  var gender = req.body.gender;
  var oldUsername = req.body.oldUsername;
  var sql = "UPDATE Users SET username='" + username + "', password='" + password + "', email='" + email + "', country='" + country + "', birthdate='" + birthdate + "', gender='" + gender + "' WHERE username = '" + oldUsername + "'";
    /*
    Transaction to ensure user information is updated correctly
  */
  con.beginTransaction(function(err){
    if(err) {console.log(err)}
    con.query(sql, function(err){
      if(err){
        console.log(err);
        con.rollback(function() {});
      }
      else { 
        con.commit(function(err) {});
        res.redirect("/users/" + username); 
      }
    });
  });
});

server.get("/media/new", function(req, res){res.render("media:new.ejs");});

//Send user to proper media upload page
server.post("/media", function(req, res){
  var mediaType = req.body.mediaType
  if(mediaType == "MOVIE") res.redirect("/media:new:movie");  //Redirect because the EJS file needs to query for actors
  else if(mediaType == "MUSIC") res.render("media:new:music");
  else if(mediaType == "VIDEO") res.render("media:new:video");
  else if(mediaType == "PICTURE") res.render("media:new:picture");
});

//Handle add new picture request
server.post("/media/new/picture", picUpload.single('upload'), function(req, res, err){
  var mediaID = req.file.filename;
  var name = req.body.name;
  var description = req.body.description;
  var uploader = req.body.uploader;
  var sql = "INSERT INTO Media VALUES('" + mediaID + "','" + name + "', '" + uploader + "')";
  var sql2 = "INSERT INTO Picture VALUES('" + mediaID + "','" + description + "')";
  con.query(sql, function(err, results){
    if(err) console.log(err);
    else{
      con.query(sql2, function(err, results){
        if(err) console.log(err);
        else res.redirect("/media/picture/" + mediaID);
      });
    }
  });
});

//Render picture webpage
server.get("/media/picture/:mediaID", function(req, res){
  var mediaID = req.params.mediaID;
  var sql =  "SELECT * FROM Media, Picture WHERE Media.mediaID='" + mediaID + "' AND Media.mediaID=Picture.pictureMediaID";
  con.query(sql, mediaID, function(err, results, fields){
    if(err) console.log(err);
    else{
      if(results.length === 0) res.render("mediaNoExist", {});
      else{
        var comments_sql = "SELECT * FROM Media, Feedback WHERE Media.mediaID=? AND Media.mediaID=Feedback.commentMediaID";
        con.query(comments_sql, mediaID, function(err, comments){
          if(err) console.log(err);
          else{
            res.render("picture", {results:{
              mediaID: mediaID,
              name: results[0].name,
              description: results[0].description,
              comments: comments
            }});
          }
        });
      }
    }
  });
});

//Handle add new music request
server.post("/media/new/music", audioUpload.single('upload'), function(req, res, err){
  var mediaID = req.file.filename;
  var name = req.body.name;
  var duration = req.body.duration;
  var artist = req.body.artist;
  var uploader = req.body.uploader;
  var sql = "INSERT INTO Media VALUES('" + mediaID + "','" + name + "', '" + uploader + "')";
  var sql2 = "INSERT INTO Music VALUES('" + mediaID + "','" + duration + "','" + artist + "')";
  con.query(sql, function(err, results){
    if(err) console.log(err);
    else{
      con.query(sql2, function(err, results){
        if(err) console.log(err);
        else res.redirect("/media/music/" + mediaID);
      });
    }
  });
});

//Render music webpage
server.get("/media/music/:mediaID", function(req, res){
  var mediaID = req.params.mediaID;
  var sql =  "SELECT * FROM Media, Music WHERE Media.mediaID=? AND Media.mediaID=Music.musicMediaID;"
  con.query(sql, mediaID, function(err, results, fields){
    if(err) console.log(err);
    else{
      if(results.length === 0) res.render("mediaNoExist", {});
      else{
        var comments_sql = "SELECT * FROM Media, Feedback WHERE Media.mediaID=? AND Media.mediaID=Feedback.commentMediaID";
        con.query(comments_sql, mediaID, function(err, comments){
          if(err) console.log(err);
          else{
            res.render("music", {results:{
            mediaID: mediaID,
            name: results[0].name,
            duration: results[0].duration,
            artist: results[0].artist,
            comments: comments
          }});
          }
        });
      }
    }
  });
});

//Handle add new home video request
server.post("/media/new/video", videoUpload.single('upload'), function(req, res, err){
  var mediaID = req.file.filename;
  var name = req.body.name;
  var duration = req.body.duration;
  var description = req.body.description;
  var uploader = req.body.uploader;
  var sql = "INSERT INTO Media VALUES('" + mediaID + "','" + name + "', '" + uploader + "')";
  var sql2 = "INSERT INTO Videos VALUES('" + mediaID + "','" + duration + "')";
  var sql3 = "INSERT INTO HomeVideo VALUES('" + mediaID + "','" + description + "')";
  con.query(sql, function(err, results){
    if(err) console.log(err);
    else{
      con.query(sql2, function(err, results){
        if(err) console.log(err);
        else{
          con.query(sql3, function(err, results){
            if(err) console.log(err);
            else res.redirect("/media/video/" + mediaID);
          })
        }
      });
    }
  });
});

//Render home video webpage
server.get("/media/video/:mediaID", function(req, res){
  var mediaID = req.params.mediaID;
  var sql =  "SELECT * FROM Media, Videos, HomeVideo WHERE Media.mediaID=? AND Media.mediaID=Videos.videoMediaID AND Videos.videoMediaID=HomeVideo.homeVideoMediaID";
  con.query(sql, mediaID, function(err, results, fields){
    if(err) console.log(err);
    else{
      if(results.length === 0) res.render("mediaNoExist", {});
      else{
        var comments_sql = "SELECT * FROM Media, Feedback WHERE Media.mediaID=? AND Media.mediaID=Feedback.commentMediaID";
        con.query(comments_sql, mediaID, function(err, comments){
          if(err) console.log(err);
          else{
            res.render("video", {results:{
              mediaID: mediaID,
              name: results[0].name,
              duration: results[0].duration,
              description: results[0].description,
              comments: comments
            }});
          }
        });
      }
    }
  });
});

//Render add new movie page
server.get("/media:new:movie", function(req, res){
  var sql = "SELECT * FROM Actors";
  con.query(sql, function(err, results){
    if(err) console.log(err);
    else{
      res.render("media:new:movie", {results: results});
    }
  })
});

//Handle add new movie request
server.post("/media/new/movie", videoUpload.single('upload'), function(req, res, err){
  var mediaID = req.file.filename;
  var name = req.body.name;
  var duration = req.body.duration;
  var director = req.body.director;
  var ageRating = req.body.ageRating;
  var uploader = req.body.uploader;
  //Insert into Movies table
  var sql = "INSERT INTO Media VALUES('" + mediaID + "','" + name + "', '" + uploader + "')";
  var sql2 = "INSERT INTO Videos VALUES('" + mediaID + "','" + duration + "')";
  var sql3 = "INSERT INTO Movies VALUES('" + mediaID + "','" + director + "','" + ageRating + "')";
  con.query(sql, function(err, results){
    if(err) console.log(err);
    else{
      con.query(sql2, function(err, results){
        if(err) console.log(err);
        else{
          con.query(sql3, function(err, results){
            if(err) console.log(err);
            else{
              //Insert into Acts table
              con.query("SELECT * FROM Actors", function(err, results){
                for(var i = 0; i < results.length; i++){
                  var actor = results[i];
                  if(req.body[actor.name] === 'on'){
                    var sql = "INSERT INTO Acts VALUES('" + hashCode(actor.name + mediaID) + "','" + actor.name + "','" + mediaID + "')";
                    con.query(sql, function(err, results){ if(err) console.log(err); });
                  }
                }
                res.redirect("/media/movie/" + mediaID);
              });
            }
          })
        }
      });
    }
  });
});

//Render movie webpage
server.get("/media/movie/:mediaID", function(req, res){
  var mediaID = req.params.mediaID;
  var sql =  "SELECT * FROM Media, Videos, Movies WHERE Media.mediaID=? AND Videos.videoMediaID=Movies.movieMediaID AND Media.mediaID=Videos.videoMediaID";
  con.query(sql, mediaID, function(err, results, fields){
    if(err) console.log(err);
    else{
      if(results.length === 0) res.render("mediaNoExist", {});
      else{
        //Get actors
        var actors_sql = "SELECT Actors.name FROM Actors, Acts WHERE Acts.actsName=Actors.name AND Acts.actsMediaID='" + mediaID + "'";
        con.query(actors_sql, function(error, actors){
          var allActors = ""; //Make a comma delimited list of actors
          for(var i = 0; i < actors.length; i++){ allActors += (", " + actors[i].name); }
          var comments_sql = "SELECT * FROM Media, Feedback WHERE Media.mediaID=? AND Media.mediaID=Feedback.commentMediaID";
          con.query(comments_sql, mediaID, function(err, comments){
            if(err) console.log(err);
            else{
              res.render("movie", {results:{
                mediaID: mediaID,
                name: results[0].name,
                duration: results[0].duration,
                director: results[0].director,
                ageRating: results[0].ageRating,
                actors: allActors.substring(2),
                comments: comments
              }});
            }
          });
        });
      }
    }
  });
});

server.get("/comments/:mediaType/:mediaID", function(req, res){res.render("comment", {results: {mediaID: req.params.mediaID, type: req.params.mediaType}});});

//Handle adding a comment
server.post("/comments", function(req, res){
  var username = req.body.username;
  var comment = req.body.comment;
  var rating = req.body.rating;
  var mediaID = req.body.mediaID;
  var type = req.body.type;
  var sql = "INSERT INTO Feedback VALUES('" + hashCode(comment) + "', '" + username + "', '" + mediaID + "', " + rating + ", '" + comment + "')";
    /*
    Transaction to ensure comment is added correctly
  */
  con.beginTransaction(function(err){
    if(err) {console.log(err)}
    con.query(sql, function(err){
      if(err){
        console.log(err);
        con.rollback(function() {});
      }
      else { 
        con.commit(function(err) {});
        res.redirect("/media/" + type + "/" + mediaID); 
      }
    });
  });
});

//Handle populating History table
server.post('/addView', function(req, res){
  console.log("here");
  var username = req.body.username;
  var mediaID = req.body.mediaID;
  var accessed = new Date().toISOString().slice(0, 19).replace('T', ' ');
  var id = hashCode(username + mediaID + accessed);
  var sql = "INSERT INTO History VALUES('" + id + "', '" + username + "', '" + mediaID + "', '" + accessed + "')";
  console.log(sql);
  con.query(sql, function(err, results){
    if(err) console.log(err);
  });
});

server.get("/addActor", function(req, res){res.render("addActor");});

//Handle add new actor request
server.post("/newActor", function(req, res){
  var actor = req.body.actor;
  var sql = "INSERT INTO Actors VALUES('" + actor + "')";
  con.query(sql, function(err){
    if(err) console.log(err)
    else res.redirect("/media:new:movie")
  });
});

//Handle requests to get picture files
server.get('/rawmedia/:mediaID', function(req, res){
    var mediaID = req.params.mediaID;
    res.sendFile(path.resolve(__dirname + '/media/' + mediaID));
});

//Handle requests to get multimedia files (music and video filetypes)
server.get('/multimedia/:mediaID', function(req, res){
  var mediaID = req.params.mediaID;
  var AUDIOFILE = __dirname + "/media/" + mediaID;
  ms.pipe(req, res, AUDIOFILE);
});

//Send copy of cookies.js, a helper library when it comes to saving/removing cookies, to the client
server.get('/cookies.js', function(req, res){res.sendFile(path.resolve(__dirname + '/node_modules/cookies.js'))});

//Server listens on port 8000.
server.listen(8000, 'localhost', function(){
    console.log("NightOwl Server is running");
});

/************************
 *****Helper Methods*****
 ***********************/

function hashCode (str){
    var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

function sortBy (str, filter){
  if(filter === 'rating') {
    return str + " ORDER BY avgRating DESC"
  }
  else if(filter === 'titleASC') {
    return str + " ORDER BY Media.name ASC"
  }
  else if(filter === 'titleDESC') {
    return str + " ORDER BY Media.name DESC"
  }
}