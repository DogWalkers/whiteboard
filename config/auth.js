	if(process.env.OPENSHIFT_NODEJS_IP === "undefined"){
		module.exports = {
			'facebookAuth' : {
				'clientID' 		: '690942394285097', // your App ID
				'clientSecret' 	: '00a33fd027f033dc1ae77ae67142123e', // your App Secret
				'callbackURL' 	: 'http://localhost:8080/auth/facebook/callback'
			}
		};
	}else{
		module.exports = {
			'facebookAuth' : {
				'clientID' 		: '215699211971159', // your App ID
				'clientSecret' 	: '7ebadc6ebbccc3f816eba5c1054fbf34', // your App Secret
				'callbackURL' 	: 'http://www.uwwhiteboard.com/auth/facebook/callback'
			}
		};
	}
//,

	/*'twitterAuth' : {
		'consumerKey' 		: 'your-consumer-key-here',
		'consumerSecret' 	: 'your-client-secret-here',
		'callbackURL' 		: 'http://localhost:8080/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID' 		: 'your-secret-clientID-here',
		'clientSecret' 	: 'your-client-secret-here',
		'callbackURL' 	: 'http://localhost:8080/auth/google/callback'
	}*/