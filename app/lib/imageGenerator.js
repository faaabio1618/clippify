const {registerFont, createCanvas} = require('canvas')


function printAtWordWrap(context, text, x, y, lineHeight, fitWidth) {
  fitWidth = fitWidth || 0;

  if (fitWidth <= 0) {
    context.fillText(text, x, y);
    return 1;
  }
  var words = text.split(' ');
  var currentLine = 0;
  var idx = 1;
  while (words.length > 0 && idx <= words.length) {
    var str = words.slice(0, idx).join(' ');
    var w = context.measureText(str).width;
    if (w > fitWidth) {
      if (idx === 1) {
        idx = 2;
      }
      context.fillText(words.slice(0, idx - 1).join(' '), x, y + (lineHeight * currentLine));
      currentLine++;
      words = words.splice(idx - 1);
      idx = 1;
    } else {
      idx++;
    }
  }
  if (idx > 0) {
    context.fillText(words.join(' '), x, y + (lineHeight * currentLine));
  }
  return currentLine >= 3 ? currentLine : 3;
}

function drawBubble(ctx, w, h, radius, text) {
  ctx.font = "15px";
  const x = 20;
  const y = 10;
  ctx.beginPath();

  ctx.fillStyle = "#000";
  const totalLines = printAtWordWrap(ctx, text, 30, 30, 20, 300);

  ctx.fillStyle = "#FFFFCB";
  h = h * totalLines;
  var r = x + w;
  var b = y + h + 20;
  ctx.globalCompositeOperation = 'destination-over';
  ctx.strokeStyle = "black";
  ctx.lineWidth = "2";
  ctx.moveTo(x + radius, y);
  ctx.lineTo(r - radius, y);
  ctx.quadraticCurveTo(r, y, r, y + radius);
  ctx.lineTo(r, y + h - radius);

  ctx.quadraticCurveTo(r, b, r - radius, b);
  ctx.lineTo(x + radius, b);

  ctx.quadraticCurveTo(x, b, x, b - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.fill();
  ctx.stroke();

  ctx.globalCompositeOperation = 'source-over';
  ctx.beginPath();
  ctx.moveTo(x + 1, y + h / 2);
  ctx.lineTo(x - 15, y + h / 2 + 10);
  ctx.lineTo(x, y + h / 2 + 10);
  ctx.lineWidth = "2";
  ctx.strokeStyle = '#000';
  ctx.stroke();

  ctx.fillStyle = "#FFFFCB";
  ctx.fill();
  return h
}


export default function generateImage(text) {

  const canvas = createCanvas(400, 150)
  const ctx = canvas.getContext('2d')
  drawBubble(ctx, 300 + 40, 25, 20, text);
  return canvas.toDataURL('image/png');
}

