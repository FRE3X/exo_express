var express = require('express');
var router  = express.Router();
var redis   = require('redis')
var client  = redis.createClient();
var debug   =  require('debug')('cours:roomAction');


/* GET home page. */
router.post('/', function(req, res) {
  client.incr('room_id', function(err, replies){
    client.sadd('rooms_list', replies, function(){
      res.redirect('/rooms');
    });
  });
});

router.get('/', function(req, res) {
  client.smembers('rooms_list', function(err, replies){
    res.render('rooms/index', { rooms: replies || [] })
  });
});


router.get('/:id', function(req, res) {
  client.smembers('rooms_list', function(err, replies){
    if ( !replies && replies.indexOf(req.params.id) == -1 ) {
      res.redirect('/rooms');
      return;
    }

    res.render('rooms/show', { room_id: req.params.id })
  });
});



module.exports = router;
