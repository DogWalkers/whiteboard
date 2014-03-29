var User = require("../models/user");

module.exports = function(app, passport){
  var skillsList = ["css", "javascript"];


	app.get('/', function(req,res){
		res.render("landingpage");
	});

  app.get('/loginsuccess', isLoggedIn, function(req,res){
    console.log(skillsList);
    res.render("firstuser", {skills: skillsList});

  });

  app.get('/listprojects', function(req, res){
    Project.find().populate('creator').exec(function(err, projects){
      res.render('/projectlist', {projects: projects});
    });
  });

app.get('/logout', function(req, res){
  res.render('logout');


});

app.get('/viewproject/*', isLoggedIn, function(req, res){
    var id = req.url.split('/')[2];
    console.log(req.url);
    console.log(id);
    Project.findById(id).exec(function(err, p){
      res.render('viewproject', {project: p});
    });
  });

  app.post('/submitproject', function(req, res){
    //Project newProject = req.sdf;

    //newProject.save();

  });

  app.post('/addskills', function(req, res){


  });

  app.post('/extraaccountdetails', function(req, res){
    

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

    function isLoggedIn(req, res, next){
      if(req.isAuthenticated()){
       // res.locals.user = req.user;
       // res.locals.userCount = userCount;
        return next();
      }
      //console.log(req.user);
      res.redirect('/');
};