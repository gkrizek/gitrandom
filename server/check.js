//Check the GitHub API status once every 5 minutes and alert me if it is reporting problems.
SyncedCron.options = {
    log: false,
    collectionName: 'check_api',
}

  Meteor.startup(function(){

  SyncedCron.add({
    name: 'check_api_function',
    schedule: function(parser) {
      return parser.recur().every(5).minute();
    },
    job: function() {
    	HTTP.get ('https://status.github.com/api/last-message.json', {
        headers: {"User-Agent": "gitrandom"}}, function(error, response) {
      if(error) {
          console.log(error);
      } else {
        result = JSON.parse(response.content);
        stat = result.status;
        message = result.body;
        if (stat == 'good') {

        }else{
        	Meteor.call('apiEmail');
        }
      }
    });

    }
  });

  SyncedCron.start();
});

Meteor.methods({
      apiEmail: function () {
       this.unblock();
       Email.send({
         to: 'email@address.com',
         from: 'email@address.com',
         subject: 'GITHUB API ISSUE',
         text: 'GITHUB STATUS API IS REPORTING ISSUES:\r \r' +stat+ '\r' +message
       });
      }
});