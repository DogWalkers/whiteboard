var User = require("../models/user");
var Project = require("../models/project");

var errorJSON = function(res){
  res.json(500, { error: 'Internal Server Error' });
}

module.exports = function(app, passport){
var skillsList = ["AJAX","Android Dev","ASP.NET","C","C#","C++","CSS","Django","Eclipse","Flask","Git","Grunt","HTML","iOS dev","Java","Java Spring","Javascript","JBoss","JSON","Maven","Mocha.js","Node.js","NoSQL Databases","Objective-C","Perl","PHP","Python","Ruby","Ruby on Rails","Scala","SQL Databases","SVN","Visual Basic","Windows Azure","X-Code","XML"];


  //API ENDPOINTS BEGIN

  app.get('/api/projects', function(req, res){
    Project.find().populate('creator').exec(function(err, projects){
      if(err) return errorJSON(res);
      res.json(projects);
    });
  });

  app.get('/api/project', function(req, res){
    if(!req.query.id) return errorJSON(res);
    Project.findByIdAndUpdate(req.query.id, {$inc: {numViews: 1}}).populate("creator").exec(function(err, p){
      if(err || !p) return errorJSON(res);
      res.json(p);
    });
  });

  app.get('/api/profile', function(req, res){
    if(!req.query.id) return errorJSON(res);
    User.findById(req.query.id).exec(function(err, doc){
      res.json(doc);
    });
  });

  //API ENDPOINTS END

	app.get('/', function(req,res){
		res.render("landingpage");
	});

  app.get('/loginsuccess', isLoggedIn, function(req,res){
    if (req.user.skills.length > 0) {
      res.redirect('/listprojects');
    } else {
      res.render("firstuser", {skills: skillsList});
    }
  });

  app.get('/listprojects', isLoggedIn, function(req, res){
    Project.find().populate('creator').exec(function(err, projects){
      res.render('projectlist', {projects: projects});
    });
  });

app.get('/logout', function(req, res){
  res.render('logout');
});

app.get('/profile', isLoggedIn, function(req, res){
  User.findById(req.query.userid).exec(function(err, doc){
    if(doc){
      //they want to see someone else
      Project.find({'creator': doc}, function (err, docs) {
        res.render('profile', {docs: docs, displayUser: doc}); 
      });
    }else{
      //they're seeing themselves
      Project.find({'creator': req.user}, function (err, docs) {
        res.render('profile', {docs: docs, displayUser: req.user});
      }); 
    }
  });
});

app.get('/viewproject/:id', isLoggedIn, function(req, res){

    Project.findByIdAndUpdate(req.params.id, {$inc: {numViews: 1}}).populate("creator").exec(function(err, p){
      if(err) return;
      //console.log(p);
      res.render('viewproject', {project: p});
    });
  });

app.get('/myprojects', isLoggedIn, function(req, res){
  Project.find({creator: req.user}).exec(function(err, p){
    res.render('myprojects', {projects: p});
  });
});

app.get('/createproject', isLoggedIn, function(req,res){
  res.render("createproject", {skills: skillsList});
});

app.get('/deleteproject/:id', isLoggedIn, function(req, res){
  //console.log("in method");
   //var id = req.url.split('/')[2];
  Project.findById(req.params.id).remove(function(err, doc){
    if(err){
      res.send("Could not be deleted");
    }else{
      res.redirect('/myprojects');
    }
  });
});

app.get('/editproject/:id', isLoggedIn, function(req, res){
    //var id = req.url.split('/')[2];
    Project.findById(req.params.id, function(err, p){
      if(err) return err;
      //console.log(p);
      res.render('editproject', {project: p, skills: skillsList});
    });
  });

app.post('/createproject', isLoggedIn, function(req, res){
   // res.render('/viewproject' + ....);
   //console.log(req.body);
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
        //console.log(skill);
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
   //console.log(req.body);
   var id = req.body.projectid;
   //console.log(id);
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
       res.locals.user = req.user;
       // res.locals.userCount = userCount;
        return next();
      }
      //console.log(req.user);
      res.redirect('/');
};