var User = require("../models/user");
var Project = require("../models/project");

module.exports = function(app, passport){
var skillsList = ["CSS", "JavaScript","C#","Java","Objective-C","C++","PHP","(Visual) Basic","Python","Visual Basic .NET","Transact-SQL","Perl","Ruby","Delphi/Object Pascal","Lisp","D","Assembly","PL/SQL","MATLAB"];


	app.get('/', function(req,res){
		res.render("landingpage");
	});

  app.get('/loginsuccess', isLoggedIn, function(req,res){
    if (req.user.skills.length > 0) {
      res.redirect('/listprojects');
    } else {
      console.log(skillsList);
      console.log(req.user);
      res.render("firstuser", {skills: skillsList, req: req});
    }
  });

  app.get('/listprojects', isLoggedIn, function(req, res){
    Project.find().populate('creator').exec(function(err, projects){
      res.render('projectlist', {projects: projects, req: req});
    });
  });

app.get('/logout', function(req, res){
  res.render('logout');
});

app.get('/profile', isLoggedIn, function(req, res){

        User.findById(req.query.userid).exec(function(err, doc){

        if(doc){
          Project.find({'creator': doc}, function (err, docs) {
          res.render('profile', {docs: docs, req: req, user: doc}); 
        });
        }else{
          //res.send("mistake");
           Project.find({'creator': req.user}, function (err, docs) {
          res.render('profile', {docs: docs, req: req, user: req.user});
          }); 
        }
      });

});

app.get('/viewproject/*', isLoggedIn, function(req, res){
    var id = req.url.split('/')[2];


    Project.findByIdAndUpdate(id, {$inc: {numViews: 1}}).populate("creator").exec(function(err, p){
      if(err) return;
      console.log(p);
      res.render('viewproject', {project: p, req: req});
    });
  });

app.get('/myprojects', function(req, res){
  Project.find({creator: req.user}).exec(function(err, p){
    res.render('myprojects', {projects: p, req: req});
  });
});

app.get('/createproject', isLoggedIn, function(req,res){
  res.render("createproject", {req: req, skills: skillsList});
});

app.get('/deleteproject/*', isLoggedIn, function(req, res){
  console.log("in method");
   var id = req.url.split('/')[2];
  Project.findById(id).remove(function(err, doc){
    if(err){
      res.send("Could not be deleted");
    }else{
      res.redirect('/myprojects');
    }
  });
});

app.get('/editproject/*', isLoggedIn, function(req, res){
    var id = req.url.split('/')[2];
    Project.findById(id, function(err, p){
      if(err) return err;
      console.log(p);
      res.render('editproject', {project: p, req: req, skills: skillsList});
    });
  });

app.post('/createproject', isLoggedIn, function(req, res){
   // res.render('/viewproject' + ....);
   console.log(req.body);
   var title = req.body.title;
   var description = req.body.description;
   var positionName = req.body.positionName;
   var numPositions = req.body.numPositions;
   var timeRequired = req.body.timeRequired;
   var startDate = req.body.startDate;
   var creator = req.user;
   var skillsToAdd = [];
    skillsList.forEach(function(skill){
      
      if(req.body[skill]==="on"){
        console.log(skill);
        skillsToAdd.push(skill);
      }
    });




   var newProject = new Project({title: title, description: description, positionName: positionName, numPositions: numPositions, timeRequired: timeRequired, startDate: startDate, creator: creator, preferredSkills: skillsToAdd});
   newProject.save(function(err, newProject) {
      if (err) {
        res.send(err);
      } else {
        res.redirect("/viewproject/" + newProject._id);
      }
   });
});

app.post('/editproject', isLoggedIn, function(req, res){
   // res.render('/viewproject' + ....);
   console.log(req.body);
   var id = req.body.projectid;
   console.log(id);
   var title = req.body.title;
   var description = req.body.description;
   var positionName = req.body.positionName;
   var numPositions = req.body.numPositions;
   var timeRequired = req.body.timeRequired;
   var startDate = req.body.startDate;
   var creator = req.user;
   var skillsToAdd = [];
    skillsList.forEach(function(skill){
      
      if(req.body[skill]==="on"){
        console.log(skill);
        skillsToAdd.push(skill);
      }
    });

    Project.findById(id).remove(function(err, doc){
      if(err) res.send("error");
         var newProject = new Project({title: title, description: description, positionName: positionName, numPositions: numPositions, timeRequired: timeRequired, startDate: startDate, creator: creator, preferredSkills: skillsToAdd});
   newProject.save(function(err, newProject) {
      if (err) {
        res.send(err);
      } else {
        res.redirect("/viewproject/" + newProject._id);
      }
   });


    });



});

  app.post('/addskills', isLoggedIn, function(req, res){
    
    var skillsToAdd = [];
    skillsList.forEach(function(skill){
      
      if(req.body[skill]==="on"){
        skillsToAdd.push(skill);
      }
    });
    User.findByIdAndUpdate(req.user._id, {$pushAll: {skills: skillsToAdd}},function(err){
      if(err){
        console.log("poop");
      }else{

        res.redirect('/listprojects');
      }
    });
    

  });

  app.post('/extraaccountdetails', isLoggedIn, function(req, res){
    

  });



// =====================================
  // FACEBOOK ROUTES =====================
  // =====================================
  // route for facebook authentication and login
  app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback',
  	passport.authenticate('facebook', {
  		successRedirect : '/loginsuccess',
  		failureRedirect : '/'
  	}));

  // route for logging out
  app.get('/logout', function(req, res) {
  	req.logout();
  	res.redirect('/');
  });

};

var isLoggedIn = function(req, res, next){
      if(req.isAuthenticated()){
       // res.locals.user = req.user;
       // res.locals.userCount = userCount;
        return next();
      }
      //console.log(req.user);
      res.redirect('/');
};