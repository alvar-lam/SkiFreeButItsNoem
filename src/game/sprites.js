// All sprites drawn programmatically on canvas

export function drawSkier(ctx, x, y, direction) {
  ctx.save();
  ctx.translate(x, y);
  ctx.font = '28px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  if (direction === 99) {
    // Crashed — dizzy dog
    ctx.fillText('🐕', 0, -2);
    ctx.font = '10px serif';
    const t = Date.now();
    const a = t * 0.004;
    ctx.fillText('💫', Math.cos(a) * 14, -16 + Math.sin(a) * 5);
    ctx.fillText('💫', Math.cos(a + 3) * 14, -16 + Math.sin(a + 3) * 5);
  } else {
    if (direction < 0) {
      ctx.scale(-1, 1);
    }
    ctx.fillText('🐕', 0, -2);
  }

  ctx.restore();
}

export function drawSkierJumping(ctx, x, y, progress) {
  ctx.save();
  ctx.translate(x, y);

  const lift = Math.sin(progress * Math.PI) * 20;
  const scale = 1 + Math.sin(progress * Math.PI) * 0.3;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.beginPath();
  ctx.ellipse(0, 12, 10 * (1 / scale), 3, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.translate(0, -lift);
  ctx.scale(scale, scale);

  ctx.font = '28px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🐕', 0, -2);

  ctx.restore();
}

export function drawTree(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);

  ctx.fillStyle = '#8B4513';
  ctx.fillRect(-2, 10, 4, 10);

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

  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillRect(-10, -1, 20, 3);

  ctx.restore();
}

// Preload monster image
const monsterImg = new Image();
monsterImg.src = '/monster.png';
let monsterLoaded = false;
monsterImg.onload = () => { monsterLoaded = true; };

const MONSTER_DRAW_W = 50;
const MONSTER_DRAW_H = 60;

export function drawSnowman(ctx, x, y, frame) {
  ctx.save();
  ctx.translate(x, y);

  const bob = Math.sin(frame * 0.2) * 2;

  if (monsterLoaded) {
    ctx.drawImage(
      monsterImg,
      -MONSTER_DRAW_W / 2,
      -MONSTER_DRAW_H / 2 + bob,
      MONSTER_DRAW_W,
      MONSTER_DRAW_H,
    );
  } else {
    ctx.fillStyle = '#888';
    ctx.fillRect(-15, -20 + bob, 30, 40);
  }

  ctx.restore();
}

export function drawSnowParticle(ctx, x, y, size) {
  ctx.fillStyle = 'rgba(200, 220, 255, 0.6)';
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
}
