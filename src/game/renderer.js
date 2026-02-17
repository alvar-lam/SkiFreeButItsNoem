import {
  CANVAS_WIDTH, CANVAS_HEIGHT,
  JUMP_DURATION_MS,
} from './constants.js';
import {
  drawSkier, drawSkierJumping,
  drawTree, drawRock, drawStump, drawRamp,
  drawSnowman, drawSnowParticle,
} from './sprites.js';

const OBSTACLE_DRAW = {
  tree: drawTree,
  rock: drawRock,
  stump: drawStump,
  ramp: drawRamp,
};

export function render(ctx, state, now) {
  // Clear with snow-white background
  ctx.fillStyle = '#F0F0F0';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Draw ski tracks (subtle)
  drawTracks(ctx, state);

  // Draw obstacles (sorted by y for correct overlap)
  const visibleObs = state.obstacles.filter(o =>
    o.y > state.camera.y - 40 && o.y < state.camera.y + CANVAS_HEIGHT + 40
  );
  visibleObs.sort((a, b) => a.y - b.y);

  for (const obs of visibleObs) {
    const screenX = obs.x;
    const screenY = obs.y - state.camera.y;
    const drawFn = OBSTACLE_DRAW[obs.type];
    if (drawFn) drawFn(ctx, screenX, screenY);
  }

  // Draw snowman
  if (state.snowman) {
    const smX = state.snowman.x;
    const smY = state.snowman.y - state.camera.y;
    drawSnowman(ctx, smX, smY, state.frame);
  }

  // Draw skier
  if (state.skier.jumping) {
    const progress = Math.min(1, (now - state.skier.jumpStart) / JUMP_DURATION_MS);
    drawSkierJumping(ctx, state.skier.x, state.skier.y, progress);
  } else {
    drawSkier(ctx, state.skier.x, state.skier.y, state.skier.direction);
  }

  // Snow particles (always on top)
  for (const p of state.snowParticles) {
    drawSnowParticle(ctx, p.x, p.y, p.size);
  }
}

function drawTracks(ctx, state) {
  if (state.skier.crashed || state.skier.jumping) return;

  ctx.strokeStyle = 'rgba(180, 190, 200, 0.3)';
  ctx.lineWidth = 1;

  // Simple parallel lines behind skier
  const trackLen = 60;
  const x = state.skier.x;
  const y = state.skier.y;

  ctx.beginPath();
  ctx.moveTo(x - 3, y + 10);
  ctx.lineTo(x - 3 - state.skier.direction * 2, y + trackLen);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x + 3, y + 10);
  ctx.lineTo(x + 3 - state.skier.direction * 2, y + trackLen);
  ctx.stroke();
}
