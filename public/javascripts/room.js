function rainbow(numOfSteps, step) {
  // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
  // Adam Cole, 2011-Sept-14
  // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
  var r, g, b;
  var h = step / numOfSteps;
  var i = ~~(h * 6);
  var f = h * 6 - i;
  var q = 1 - f;
  switch(i % 6){
      case 0: r = 1; g = f; b = 0; break;
      case 1: r = q; g = 1; b = 0; break;
      case 2: r = 0; g = 1; b = f; break;
      case 3: r = 0; g = q; b = 1; break;
      case 4: r = f; g = 0; b = 1; break;
      case 5: r = 1; g = 0; b = q; break;
  }
  var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
  return (c);
}

var randomColor  = rainbow(20, Math.floor(Math.random()*21));

window.onload = function() {
  var canvas   = document.getElementById("draw"),
      ctx      = canvas.getContext('2d'),
      clicked  = null,
      callTime = 0,
      interval = null,
      render   = true,
      socket   = io();

  socket.emit( 'join_room', room_id);

  var drawCircle       = function(color, length, x, y) {
    ctx.beginPath();
    ctx.arc(x, y, length, 0, Math.PI*2, true);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }

  var drawRandomCircle = function(e) {
    if(!clicked || !render)
      return false;
    var randomLength = Math.floor(Math.random() * (40 - 5)) + 5;

    render = false;

    socket.emit('draw_circle', { color: randomColor, length: randomLength, x: e.offsetX, y: e.offsetY, id: room_id });
  }

  socket.on('game_end', function(attrs){
    var colorThief = new ColorThief();

    var winner = colorThief.getColor(document.getElementById('draw'));

    document.getElementById('winner').innerHTML = '<div style="display: inline-block; width: 30px; height: 30px; background-color: rgb(' + winner.join(',') +')"></div> est le gagnant'
  });

  socket.on('draw_circle', function(attrs){
    drawCircle(attrs['color'], attrs['length'], attrs['x'], attrs['y']);
  });

  canvas.addEventListener("click", function(e){
    clicked=true;
    render = true;
    drawRandomCircle(e);
    clicked = false;
  }, false);
  canvas.addEventListener("mousemove", drawRandomCircle, false);
  canvas.addEventListener("mousedown", function(){
    clicked  = true;
    interval = setInterval( function(){
      render = true;
    }, 100);
  }, false);

  canvas.addEventListener("mouseup", function(){
    clicked = false;
    clearInterval(interval);
  }, false);
}
