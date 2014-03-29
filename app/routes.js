module.exports = function(app, passport){
	app.get('/', function(req,res){
		res.render("landingpage");
	});

  app.get('/loginsuccess', function(req,res){
    res.render("firstuser.ejs");
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

