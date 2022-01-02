var c = document.getElementById("cvs"),
  w = (c.width = c.parentNode.clientWidth),
  h = (c.height = c.parentNode.clientHeight),
  //   var s = c.width = c.height = 512
  s = (c.width = c.parentNode.clientWidth),
  ctx = c.getContext("2d"),
  particles = [],
  state = "playing",
  score = 0,
  tick = 0;

function hue(x, y) {
  return (
    tick +
    (Math.abs(s / 2 - x) / (s / 2)) * 180 +
    (Math.abs(s / 2 - y) / (s / 2)) * 180
   * 4);
}
function Particle() {
  this.x = Math.random() * s;
  this.y = Math.random() * s;

  var vel = 2 + Math.random() * 1,
    rad = (((Math.random() * 4) | 0) / 4) * Math.PI * 2 + Math.PI / 4;

  this.vx = vel * Math.cos(rad);
  this.vy = vel * Math.sin(rad);

  this.size = 2 + Math.random() * 4;
  this.emission = 0;
  this.squareEmission = 0;

  this.state = "flowing";
}
Particle.prototype.step = function () {
  if (this.state === "flowing") {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > s) {
      ntx += 0.5;
      this.vx *= -1;
    }

    if (this.y < 0 || this.y > s) {
      nty += 0.5;
      this.vy *= -1;
    }

    ctx.fillStyle = "hsl(hue,80%,50%)".replace("hue", hue(this.x, this.y));
    ctx.fillRect(
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );

    for (var i = 0.2; i < Math.random(); i += 0.1)
      ctx.fillRect(
        this.x + (Math.random() - 0.5) * this.size * 4,
        this.y + (Math.random() - 0.5) * this.size * 4,
        1.5,
        1.5
      );
  } else if (this.state === "emitting") {
    this.x += this.vx *= 0.1;
    this.y += this.vy *= 0.1;

    this.size -= 0.07;
    this.emission += 0.7;

    ctx.fillStyle = ctx.strokeStyle = "hsl(hue,50%,50%)".replace(
      "hue",
      hue(this.x, this.y)
    );
    ctx.fillRect(
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );
    ctx.strokeRect(
      this.x - this.emission,
      this.y - this.emission,
      this.emission * 2,
      this.emission * 2
    );

    if (this.size <= 0) this.state = "dead";
  }
};

var tx = (ntx = 0),
  ty = (nty = 0);
function anim() {
  window.requestAnimationFrame(anim);

  ++tick;

  ctx.fillStyle = "rgba(0,0,0,.1)";
  ctx.fillRect(0, 0, s, s);

  ntx = 0;
  nty = 0;
  ctx.translate(tx, ty);

  ctx.globalCompositeOperation = "lighter";
  ctx.shadowBlur = 2;

  if (state === "playing" || state === "played") {
    if (particles.length < 99) particles.push(new Particle());

    for (var i = 0; i < particles.length; ++i) {
      var p = particles[i];
      p.step();

      if (p.state === "flowing") {
        for (var j = 0; j < particles.length; ++j) {
          var p2 = particles[j];
          if (p2.state === "emitting") {
            var dx = Math.abs(p2.x - p.x),
              dy = Math.abs(p2.y - p.y);
            if (dx < p2.emission && dy < p2.emission) {
              p.state = "emitting";
              var rand = 0.3 + Math.random() * 0.7;
              ntx += (rand * p.vx) / 10;
              nty += (rand * p.vy) / 10;
              ++score;
              j = particles.length;
            }
          }
        }
      }
    }
  }

  ctx.shadowBlur = 0;
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(80,80,80,.1)";
  ctx.fillRect(s / 2 - 50, s - 30, 100, 30);
  ctx.fillStyle = "rgba(255,255,255,.8)";
  ctx.font = "20px monospace";
  var text = score + "/" + particles.length;
  ctx.fillText(text, s / 2 - ctx.measureText(text).width / 2, s - 7);

  ctx.translate(-tx, -ty);
  tx = (-tx + ntx) * 0.9;
  ty = (-ty + nty) * 0.9;
}
anim();

c.addEventListener("click", function (e) {
  if (state === "playing") {
    var bbox = c.getBoundingClientRect(),
      x = e.clientX - bbox.left,
      y = e.clientY - bbox.top;

    var p = new Particle();
    p.x = x;
    p.y = y;
    p.vx = p.vy = 0;
    p.size = 3;
    p.state = "emitting";

    particles.push(p);
    ++score;

    state = "played";
  } else if (state === "played") {
    state = "playing";
    particles.length = 0;
    score = 0;
  }
});
