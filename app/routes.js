var User = require("../models/user");
var Project = require("../models/project");

module.exports = function(app, passport){
  var skillsList = ["css", "javascript"];


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
      console.log(projects);
      res.render('projectlist', {projects: projects, req: req});
    });
  });

app.get('/logout', function(req, res){
  res.render('logout');
});

app.get('/profile', isLoggedIn, function(req, res){
  res.render('profile', {req: req});
});

app.get('/viewproject/*', isLoggedIn, function(req, res){
    var id = req.url.split('/')[2];
    console.log(req.url);
    console.log(id);
    Project.findById(id).exec(function(err, p){
      res.render('viewproject', {project: p});
    });
  });

app.get('/createproject', isLoggedIn, function(req,res){
  res.render("createproject", {req: req});
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

   var newProject = new Project({title: title, description: description, positionName: positionName, numPositions: numPositions, timeRequired: timeRequired, startDate: startDate, creator: creator});
   newProject.save(function(err, newProject) {
      if (err) {
        res.send(err);
      } else {
        res.redirect("/viewproject/" + newProject._id);
      }
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