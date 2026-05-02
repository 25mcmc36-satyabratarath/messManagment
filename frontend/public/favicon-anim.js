(function () {
  var size = 32;
  var c = document.createElement('canvas');
  c.width = c.height = size;
  var ctx = c.getContext('2d');
  if (!ctx) return;
  var link = document.querySelector('link[rel="icon"]');
  if (!link) return;
  link.type = 'image/png';
  var frame = 0;
  function draw() {
    var t = frame * 0.12;
    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = '#1e3a5f';
    ctx.beginPath();
    ctx.ellipse(16, 20, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.ellipse(16, 19, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.lineCap = 'round';
    for (var i = 0; i < 3; i++) {
      var phase = t + i * 0.8;
      var alpha = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(phase));
      ctx.strokeStyle = 'rgba(191, 219, 254, ' + alpha + ')';
      ctx.beginPath();
      var x = 10 + i * 6;
      var h = 4 + 5 * (0.5 + 0.5 * Math.sin(phase * 1.3));
      ctx.moveTo(x, 14);
      ctx.quadraticCurveTo(x + 2, 14 - h * 0.5, x - 1, 14 - h);
      ctx.stroke();
    }
    frame++;
    try {
      link.href = c.toDataURL('image/png');
    } catch (_) {}
  }
  draw();
  setInterval(draw, 180);
})();
