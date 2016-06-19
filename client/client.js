FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render('layout', { main: 'home' });
  }
});

FlowRouter.route('/execute', {
  action: function() {
    BlazeLayout.render('layout', { main: 'execute' });
  }
});

FlowRouter.route('/contact', {
  action: function() {
    BlazeLayout.render('layout', { main: 'contact' });
  }
});

FlowRouter.route('/therewasaproblem', {
  action: function() {
    BlazeLayout.render('layout', { main: 'therewasaproblem' });
  }
});

FlowRouter.notFound = {
    action: function() {
      BlazeLayout.render('layout', { main: 'notfound' });
    }
};

Template.home.onRendered(function () {
    $(".whole")
    .velocity("scroll", { delay: 2200, duration: 1400 })
    .velocity({ opacity: 1 });
});


Template.execute.onRendered(function() {
  this.autorun(() => {
    //Check if client has internet connection and if not display a warning.
    iconnect = navigator.onLine
    if (iconnect == true) {
      $(".spin").css('visibility', 'visible');
      $(".connection").css('visibility', 'hidden');
      $(".sk-circle").css('visibility', 'visible');
    }else{
      $(".spin").css('visibility', 'visible');
      $(".connection").css('visibility', 'visible');
      $(".sk-circle").css('visibility', 'hidden');
    }
    Meteor.call('data', function (error, response){
      if (error) {
        //if this call returns an error its most likely because I have hit the rate limit on one of the tokens.
        //Emails me if it happens so I can investigate.
        Meteor.call('emergencyEmail');
        FlowRouter.redirect('/therewasaproblem');
        Meteor.call('problemCheck', "There was a problem calling the /repositories endpoint of GitHub. Possibly overuse of tokens.");
     } else {
       var message = response;
       //if the repo doesn't have a readme, try again.
        if (message == "404") {
          var elem = document.getElementById("button");
          elem.click();
        } else {
          Session.set('data', response);
        }
      }
    });

    Meteor.call('file', function (error, response){
      if (error) {
          console.log(error);
          $(".spin").css('visibility', 'hidden');
          $(".sk-circle").css('visibility', 'hidden');
        } else {
          Session.set('file', response);
            if (iconnect == true && response != " ") {
               $(".spin").css('visibility', 'hidden');
               $(".sk-circle").css('visibility', 'hidden');
            }else if (iconnect == true && response == " ") {
               $(".spin").css('visibility', 'visible');
               $(".sk-circle").css('visibility', 'visible');
            }else{
               $(".spin").css('visibility', 'visible');
               $(".sk-circle").css('visibility', 'hidden');
           }
          }
       });
   });
});

Template.execute.events ({
   'click .refresh': function() {
    //Check if client has internet connection and if not display a warning.
    iconnect = navigator.onLine
    if (iconnect == true) {
      $(".spin").css('visibility', 'visible');
      $(".connection").css('visibility', 'hidden');
      $(".sk-circle").css('visibility', 'visible');
    }else{
      $(".spin").css('visibility', 'visible');
      $(".connection").css('visibility', 'visible');
      $(".sk-circle").css('visibility', 'hidden');
    }
    Meteor.call('data', function (error, response){
      if (error) {
        //if this call returns an error its most likely because I have hit the rate limit on one of the tokens.
        //Emails me if it happens so I can investigate.
        Meteor.call('emergencyEmail');
        FlowRouter.redirect('/therewasaproblem');
        Meteor.call('problemCheck', "There was a problem calling the /repositories endpoint of GitHub. Possibly overuse of tokens.");
     } else {
       var message = response;
        //if the repo doesn't have a readme, try again.
        if (message == "404") {
          var elem = document.getElementById("button");
          elem.click();
        } else {
          Session.set('data', response);
        }
      }
    });

    Meteor.call('file', function (error, response){
      if (error) {
          console.log(error);
          $(".spin").css('visibility', 'hidden');
          $(".sk-circle").css('visibility', 'hidden');
        } else {
          Session.set('file', response);
            if (iconnect == true && response != " ") {
               $(".spin").css('visibility', 'hidden');
               $(".sk-circle").css('visibility', 'hidden');
            }else if (iconnect == true && response == " ") {
               $(".spin").css('visibility', 'visible');
               $(".sk-circle").css('visibility', 'visible');
            }else{
               $(".spin").css('visibility', 'visible');
               $(".sk-circle").css('visibility', 'hidden');
           }
          }
       });
    }
});

Template.execute.helpers ({
    'output': function () {
      var res = Session.get('data');
      return res;
    },

    'readme': function () {
      var result = Session.get('file');
      return result;
    },
  });

Template.contact.onRendered(function (){
    //Check if client has internet connection and if not display a warning.
    var iconnect = navigator.onLine
    if (iconnect == true) {
      $(".connection").css('visibility', 'hidden');
      $(".spin").css('visibility', 'hidden');
    }else{
      $(".connection").css('visibility', 'visible');
      $(".spin").css('visibility', 'visible');
    }

});

Template.contact.events({
  'submit form#contactForm':function(e){
      e.preventDefault();
      var name = e.target.name.value;
      var email = e.target.email.value;
      var message = e.target.message.value;
      var info = e.target.info.value;
      var namel = name.length;
      var emaill = email.length;
      var messagel = message.length;
      var infol = info.length;

    //form validation and a honeypot captha for spammers
    if(namel > 0 && emaill > 0 && messagel > 0 && infol == 0){
      var text = "Message from: " + name + " \rEmail: " + email + "\rContent:" + message;
      Meteor.call('sendEmail', text);
      alert('Message sent! Thank you', 'success');
      e.currentTarget.reset();
      return false;
    }else{
      alert('An error occurred. Please make sure you have filled in all the fields.', 'error');
      return false;
    }
  }
});
