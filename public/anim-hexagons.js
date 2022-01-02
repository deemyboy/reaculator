/*
 * this is a modified recreation of @jackrugile's awesomepen:
 * Rainbow Grid https://codepen.io/jackrugile/details/bdwvMo/
 *
 * I have no credit over the idea, but the code is original and side option comes from this pen
 */

function reset(canvas) {
  var newCanvas = canvas.cloneNode(false);
  canvas.parentNode.replaceChild(newCanvas, canvas);
  return newCanvas;
}

function init() {
  window.onclick = null;
  var cvs = document.getElementById("cvs");

  var w = (cvs.width = cvs.parentNode.clientWidth),
  h = (cvs.height = cvs.parentNode.clientHeight);

    cvs = reset(cvs),
    ctx = cvs.getContext("2d") /* Error in getContext("2d") */,
    sum = w + h,
    opts = {
      side: 35,
      picksParTick: 2,
      baseTime: 40,
      addedTime: 10,

      baseLight: 0,
      addedLight: 60,
      strokeLight: 30,

      hueSpeed: 0.4,
      repaintAlpha: 1,
    },
    difX = (Math.sqrt(3) * opts.side) / 2, // height of a equilateral triangle
    difY = (opts.side * 3) / 2, // side of a triangle ( because it goes down to a vertex ) then half a side of the triangle in the hex below: s + s/2 = s*3/2
    rad = Math.PI / 6, // TAU / 6 = PI / 3 I thought, but apparently this way works better
    cos = Math.cos(rad) * opts.side,
    sin = Math.sin(rad) * opts.side,
    hexs = [],
    tick = 0;

  function loop() {
    window.requestAnimationFrame(loop);

    tick += opts.hueSpeed;

    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(0,0,0,alp)".replace("alp", opts.repaintAlpha);
    ctx.fillRect(0, 0, w, h);

    for (var i = 0; i < opts.picksParTick; ++i)
      hexs[(Math.random() * hexs.length) | 0].pick();

    hexs.map(function (hex) {
      hex.step();
    });
  }
  function Hex(x, y) {
    this.x = x;
    this.y = y;
    this.sum = this.x + this.y;
    this.picked = false;
    this.time = 0;
    this.targetTime = 0;

    this.xs = [
      this.x + cos,
      this.x,
      this.x - cos,
      this.x - cos,
      this.x,
      this.x + cos,
    ];
    this.ys = [
      this.y - sin,
      this.y - opts.side,
      this.y - sin,
      this.y + sin,
      this.y + opts.side,
      this.y + sin,
    ];
  }
  Hex.prototype.pick = function () {
    this.picked = true;
    this.time = this.time || 0;
    this.targetTime =
      this.targetTime || (opts.baseTime + opts.addedTime * Math.random()) | 0;
  };
  Hex.prototype.step = function () {
    var prop = this.time / this.targetTime;
    color = "hsl(hue,100%,light%)".replace(
      "hue",
      (this.sum / sum) * 100 + tick
    );

    ctx.beginPath();
    ctx.moveTo(this.xs[0], this.ys[0]);
    for (var i = 1; i < this.xs.length; ++i) ctx.lineTo(this.xs[i], this.ys[i]);
    ctx.lineTo(this.xs[0], this.ys[0]);

    if (this.picked) {
      ++this.time;

      if (this.time >= this.targetTime) {
        this.time = 0;
        this.targetTime = 0;
        this.picked = false;
      }

      ctx.fillStyle = ctx.shadowColor = color.replace(
        "light",
        opts.baseLight + opts.addedLight * Math.sin(prop * Math.PI)
      );
      ctx.fill();
    } else {
      ctx.strokeStyle = ctx.shadowColor = color.replace(
        "light",
        opts.strokeLight
      );
      ctx.stroke();
    }
  };

  for (var x = 0; x < w; x += difX * 2) {
    var i = 0;

    for (var y = 0; y < h; y += difY) {
      ++i;
      hexs.push(new Hex(x + difX * (i % 2), y));
    }
  }

  window.addEventListener("resize", function () {
    w = cvs.width = window.innerWidth;
    h = cvs.height = window.innerHeight;
    sum = w + h;

    hexs.length = 0;
    for (var x = 0; x < w; x += difX * 2) {
      var i = 0;

      for (var y = 0; y < h; y += difY) {
        ++i;
        hexs.push(new Hex(x + difX * (i % 2), y));
      }
    }
  });

  loop();
}

init();
