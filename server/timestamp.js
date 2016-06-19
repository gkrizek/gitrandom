//Sends a log message every 10 minutes because meteor doesn't timestamp error logs
//This is required so you know when an error occurs.
   SyncedCron.options = {
    log: false,
    collectionName: 'timestamp',
  }

  Meteor.startup(function(){

  SyncedCron.add({
    name: 'add_timestamp',
    schedule: function(parser) {
      return parser.recur().every(10).minute();
    },
    job: function() {
      var log = new Logger('timestamp');
      log.info('######################################');
    }
  });

  SyncedCron.start();
});