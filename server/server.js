Future = Npm.require('fibers/future');
process.env.HTTP_FORWARDED_COUNT = 1

Meteor.methods({
    'data': function () {
      var future = new Future();
      var rand = _.random(0, 55925979);
      //Randomly selects an API token to avoid hitting the rate limit.
      var tokarray = ['GITHUB-TOKEN', 'GITHUB-TOKEN', 'GITHUB-TOKEN', 'GITHUB-TOKEN', 'GITHUB-TOKEN']
      var tok = Random.choice(tokarray);
      HTTP.get ('https://api.github.com/repositories?since='+rand+'&access_token='+tok, {
        headers: {"User-Agent": "gitrandom"}}, function(error, response) {
      if(error) {
          future.throw(error);
      } else {
        var output = JSON.parse(response.content);
        var readurl = output[0].url+'/readme?access_token='+tok;
          HTTP.get (readurl, { headers: {"User-Agent": "gitrandom"}}, function(error, response) {
            if (error) {
              ServerSession.set('downurl', "404");
              future.return("404");
            } else {
              var readresponse = JSON.parse(response.content);
              var download = readresponse.download_url;
              ServerSession.set('downurl', download);
              future.return (output);
          }
        });
      }
    });
      return future.wait();
  },

    'file': function() {
      var future = new Future();
      var file = ServerSession.get('downurl');
      if (file == "404") {
        future.return(" ");
      }else{
       HTTP.get (file, {headers: {"User-Agent": "gitrandom"}}, function(error, response) {
        if(error) {
          future.throw(error);
         } else {
         var fileresponse = response.content;
         future.return (fileresponse);
         }
       });
     }

      return future.wait();
  },

    'sendEmail': function (text) {
    this.unblock();
    Email.send({
      to: 'email@address.com',
      from: 'email@address.com',
      subject: 'Git Random Support Request',
      text: text
    });
  },
    emergencyEmail: function () {
    this.unblock();
    Email.send({
      to: 'email@address.com',
      from: 'email@address.com',
      subject: 'SITE IS BROKEN',
      text: 'THE ERROR PAGE WAS TRIGGERED. USUALLY A PROBLEM WITH GITHUB API TOKENS'
    });
  },

  problemCheck: function (issue) {
    console.log(issue);
  }
});