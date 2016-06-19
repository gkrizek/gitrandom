Meteor.startup(function(){
	//Where the emails are sent from
	process.env.MAIL_URL = 'smtp://username:password@smtp.sendgrid.net:587/'
});