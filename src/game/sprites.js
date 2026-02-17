// All sprites drawn programmatically on canvas

export function drawSkier(ctx, x, y, direction) {
  ctx.save();
  ctx.translate(x, y);

  if (direction === 99) {
    // Crash
    drawCrashedSkier(ctx);
  } else {
    drawSkiingSkier(ctx, direction);
  }

  ctx.restore();
}

function drawSkiingSkier(ctx, dir) {
  // Head
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(0, -10, 5, 0, Math.PI * 2);
  ctx.fill();

  // Body
  ctx.fillStyle = '#2244CC';
  ctx.fillRect(-4, -5, 8, 14);

  // Skis
  ctx.strokeStyle = '#CC0000';
  ctx.lineWidth = 2;

  const lean = dir * 4;

  // Left ski
  ctx.beginPath();
  ctx.moveTo(-4 + lean, 9);
  ctx.lineTo(-6 + lean * 1.5, 18);
  ctx.stroke();

  // Right ski
  ctx.beginPath();
  ctx.moveTo(4 + lean, 9);
  ctx.lineTo(2 + lean * 1.5, 18);
  ctx.stroke();

  // Poles
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-4, 0);
  ctx.lineTo(-10 - lean, 12);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(4, 0);
  ctx.lineTo(10 - lean, 12);
  ctx.stroke();
}

function drawCrashedSkier(ctx) {
  // Tumbled skier
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(-6, -2, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#2244CC';
  ctx.fillRect(-3, -4, 12, 6);

  // Skis flying
  ctx.strokeStyle = '#CC0000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(8, -8);
  ctx.lineTo(16, -14);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-8, 4);
  ctx.lineTo(-16, 8);
  ctx.stroke();

  // Stars (ouch)
  ctx.fillStyle = '#FFD700';
  ctx.font = '10px sans-serif';
  ctx.fillText('*', 8, -4);
  ctx.fillText('*', -12, -8);
}

export function drawSkierJumping(ctx, x, y, progress) {
  ctx.save();
  ctx.translate(x, y);

  const lift = Math.sin(progress * Math.PI) * 20;
  const scale = 1 + Math.sin(progress * Math.PI) * 0.3;

  ctx.translate(0, -lift);
  ctx.scale(scale, scale);

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.ellipse(0, 10 + lift, 8 * (1 / scale), 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Draw skier in tuck position
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(0, -8, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#2244CC';
  ctx.fillRect(-5, -3, 10, 10);

  ctx.strokeStyle = '#CC0000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-5, 7);
  ctx.lineTo(-5, 14);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(5, 7);
  ctx.lineTo(5, 14);
  ctx.stroke();

  ctx.restore();
}

export function drawTree(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);

  // Trunk
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(-2, 10, 4, 10);

  // Foliage layers
  ctx.fillStyle = '#228B22';
  ctx.beginPath();
  ctx.moveTo(0, -16);
  ctx.lineTo(-10, 2);
  ctx.lineTo(10, 2);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, -8);
  ctx.lineTo(-12, 8);
  ctx.lineTo(12, 8);
  ctx.closePath();
  ctx.fill();

  // Snow on top
  ctx.fillStyle = '#FFF';
  ctx.beginPath();
  ctx.moveTo(0, -16);
  ctx.lineTo(-4, -10);
  ctx.lineTo(4, -10);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

export function drawRock(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = '#808080';
  ctx.beginPath();
  ctx.moveTo(-8, 4);
  ctx.lineTo(-6, -4);
  ctx.lineTo(0, -6);
  ctx.lineTo(7, -3);
  ctx.lineTo(9, 4);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#A0A0A0';
  ctx.beginPath();
  ctx.moveTo(-4, -2);
  ctx.lineTo(0, -6);
  ctx.lineTo(5, -2);
  ctx.lineTo(2, 1);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

export function drawStump(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = '#8B4513';
  ctx.fillRect(-6, -2, 12, 8);

  ctx.fillStyle = '#A0522D';
  ctx.beginPath();
  ctx.ellipse(0, -2, 6, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Rings
  ctx.strokeStyle = '#6B3410';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.ellipse(0, -2, 3, 1.5, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();
}

export function drawRamp(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = '#DEB887';
  ctx.beginPath();
  ctx.moveTo(-14, 6);
  ctx.lineTo(-14, -2);
  ctx.lineTo(14, -6);
  ctx.lineTo(14, 6);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#A0896B';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-14, -2);
  ctx.lineTo(14, -6);
  ctx.stroke();

  // Snow on ramp
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillRect(-10, -1, 20, 3);

  ctx.restore();
}

export function drawSnowman(ctx, x, y, frame) {
  ctx.save();
  ctx.translate(x, y);

  // Bobbing animation
  const bob = Math.sin(frame * 0.2) * 2;

  // Body
  ctx.fillStyle = '#FFF';
  ctx.beginPath();
  ctx.ellipse(0, 10 + bob, 12, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#CCC';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Upper body
  ctx.fillStyle = '#FFF';
  ctx.beginPath();
  ctx.ellipse(0, -4 + bob, 9, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Head
  ctx.beginPath();
  ctx.arc(0, -16 + bob, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Eyes (angry)
  ctx.fillStyle = '#000';
  ctx.fillRect(-4, -19 + bob, 3, 2);
  ctx.fillRect(1, -19 + bob, 3, 2);

  // Angry eyebrows
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-5, -21 + bob);
  ctx.lineTo(-2, -20 + bob);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(5, -21 + bob);
  ctx.lineTo(2, -20 + bob);
  ctx.stroke();

  // Mouth
  ctx.beginPath();
  ctx.arc(0, -13 + bob, 3, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // Arms (reaching)
  ctx.strokeStyle = '#8B4513';
  ctx.lineWidth = 2;
  const armWave = Math.sin(frame * 0.3) * 10;
  ctx.beginPath();
  ctx.moveTo(-9, -4 + bob);
  ctx.lineTo(-18, -10 + bob + armWave);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(9, -4 + bob);
  ctx.lineTo(18, -10 + bob - armWave);
  ctx.stroke();

  ctx.restore();
}

export function drawSnowParticle(ctx, x, y, size) {
  ctx.fillStyle = 'rgba(200, 220, 255, 0.6)';
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
}
