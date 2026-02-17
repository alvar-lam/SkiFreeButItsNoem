import {
  CANVAS_WIDTH, CANVAS_HEIGHT,
  SKIER_START_X, SKIER_START_Y,
  SKIER_MAX_SPEED, SKIER_MIN_SPEED, SKIER_DEFAULT_SPEED,
  SKIER_LATERAL_SPEED, SKIER_ACCEL, SKIER_DECEL,
  CRASH_PAUSE_MS,
  DIR_LEFT_FAST, DIR_LEFT, DIR_STRAIGHT, DIR_RIGHT, DIR_RIGHT_FAST, DIR_CRASH,
  OBSTACLE_TYPES, OBSTACLE_SPAWN_RATE, OBSTACLE_BUFFER,
  TREE_WIDTH, TREE_HEIGHT, ROCK_WIDTH, ROCK_HEIGHT,
  STUMP_WIDTH, STUMP_HEIGHT, RAMP_WIDTH, RAMP_HEIGHT,
  COLLISION_SHRINK,
  SNOWMAN_APPEAR_DISTANCE, SNOWMAN_SPEED, SNOWMAN_CATCH_DIST,
  JUMP_DURATION_MS, JUMP_BONUS,
  METERS_PER_PIXEL,
} from './constants.js';

export function createGameState() {
  return {
    status: 'start', // 'start' | 'playing' | 'over'
    skier: {
      x: SKIER_START_X,
      y: SKIER_START_Y,
      speed: SKIER_DEFAULT_SPEED,
      direction: DIR_STRAIGHT,
      crashed: false,
      crashTime: 0,
      jumping: false,
      jumpStart: 0,
    },
    camera: { y: 0 },
    obstacles: [],
    snowman: null,
    distance: 0,
    score: 0,
    frame: 0,
    snowParticles: initSnowParticles(),
    keys: {},
    lastObstacleY: 0,
  };
}

function initSnowParticles() {
  const particles = [];
  for (let i = 0; i < 30; i++) {
    particles.push({
      x: Math.random() * CANVAS_WIDTH,
      y: Math.random() * CANVAS_HEIGHT,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: Math.random() * 0.5 + 0.3,
    });
  }
  return particles;
}

const OBSTACLE_SIZES = {
  tree: { w: TREE_WIDTH, h: TREE_HEIGHT },
  rock: { w: ROCK_WIDTH, h: ROCK_HEIGHT },
  stump: { w: STUMP_WIDTH, h: STUMP_HEIGHT },
  ramp: { w: RAMP_WIDTH, h: RAMP_HEIGHT },
};

export function updateGame(state, now) {
  if (state.status !== 'playing') return state;

  state.frame++;

  // Handle crash pause
  if (state.skier.crashed) {
    if (now - state.skier.crashTime > CRASH_PAUSE_MS) {
      state.skier.crashed = false;
      state.skier.direction = DIR_STRAIGHT;
      state.skier.speed = SKIER_MIN_SPEED;
    } else {
      updateSnowParticles(state);
      return state;
    }
  }

  // Handle jump
  if (state.skier.jumping) {
    const jumpProgress = (now - state.skier.jumpStart) / JUMP_DURATION_MS;
    if (jumpProgress >= 1) {
      state.skier.jumping = false;
    }
  }

  // Process input
  processInput(state);

  // Move skier
  const lateralMove = state.skier.direction * SKIER_LATERAL_SPEED;
  state.skier.x += lateralMove;

  // Clamp to bounds
  state.skier.x = Math.max(20, Math.min(CANVAS_WIDTH - 20, state.skier.x));

  // Move camera (world scrolls down)
  state.camera.y += state.skier.speed;
  state.distance += state.skier.speed * METERS_PER_PIXEL;

  // Spawn obstacles
  spawnObstacles(state);

  // Remove off-screen obstacles (above camera)
  state.obstacles = state.obstacles.filter(
    o => o.y > state.camera.y - 100
  );

  // Collision detection (skip if jumping)
  if (!state.skier.jumping) {
    checkCollisions(state, now);
  }

  // Snowman logic
  updateSnowman(state, now);

  // Snow particles
  updateSnowParticles(state);

  return state;
}

function processInput(state) {
  const { keys } = state;

  if (keys['ArrowLeft']) {
    if (state.skier.direction > DIR_LEFT_FAST) {
      state.skier.direction = Math.max(DIR_LEFT_FAST, state.skier.direction - 1);
    }
  } else if (keys['ArrowRight']) {
    if (state.skier.direction < DIR_RIGHT_FAST) {
      state.skier.direction = Math.min(DIR_RIGHT_FAST, state.skier.direction + 1);
    }
  } else {
    // Return to straight gradually
    if (state.skier.direction > DIR_STRAIGHT) state.skier.direction--;
    else if (state.skier.direction < DIR_STRAIGHT) state.skier.direction++;
  }

  if (keys['ArrowDown']) {
    state.skier.speed = Math.min(SKIER_MAX_SPEED, state.skier.speed + SKIER_ACCEL);
  } else if (keys['ArrowUp']) {
    state.skier.speed = Math.max(SKIER_MIN_SPEED, state.skier.speed - SKIER_DECEL);
  }
}

function spawnObstacles(state) {
  const spawnY = state.camera.y + CANVAS_HEIGHT + OBSTACLE_BUFFER;

  // Spawn rows of obstacles
  while (state.lastObstacleY < spawnY) {
    state.lastObstacleY += 20;

    if (Math.random() < OBSTACLE_SPAWN_RATE) {
      const type = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
      const x = Math.random() * (CANVAS_WIDTH - 40) + 20;
      const size = OBSTACLE_SIZES[type];

      state.obstacles.push({
        type,
        x,
        y: state.lastObstacleY,
        w: size.w,
        h: size.h,
      });
    }
  }
}

function checkCollisions(state, now) {
  const skierBox = {
    x: state.skier.x - 8 + COLLISION_SHRINK,
    y: state.skier.y + state.camera.y - 10 + COLLISION_SHRINK,
    w: 16 - COLLISION_SHRINK * 2,
    h: 24 - COLLISION_SHRINK * 2,
  };

  for (const obs of state.obstacles) {
    if (obs.hit) continue;

    const obsBox = {
      x: obs.x - obs.w / 2 + COLLISION_SHRINK,
      y: obs.y - obs.h / 2 + COLLISION_SHRINK,
      w: obs.w - COLLISION_SHRINK * 2,
      h: obs.h - COLLISION_SHRINK * 2,
    };

    if (boxCollision(skierBox, obsBox)) {
      obs.hit = true;
      if (obs.type === 'ramp') {
        // Jump!
        state.skier.jumping = true;
        state.skier.jumpStart = now;
        state.score += JUMP_BONUS;
      } else {
        // Crash!
        state.skier.crashed = true;
        state.skier.crashTime = now;
        state.skier.direction = DIR_CRASH;
        state.skier.speed = 0;
      }
    }
  }
}

function boxCollision(a, b) {
  return a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y;
}

function updateSnowman(state, now) {
  const distMeters = state.distance;

  if (!state.snowman && distMeters >= SNOWMAN_APPEAR_DISTANCE) {
    // Spawn snowman behind the skier (above screen)
    state.snowman = {
      x: CANVAS_WIDTH / 2 + (Math.random() - 0.5) * 200,
      y: state.camera.y - 60,
    };
  }

  if (state.snowman) {
    // Chase the skier
    const targetX = state.skier.x;
    const targetY = state.skier.y + state.camera.y;
    const dx = targetX - state.snowman.x;
    const dy = targetY - state.snowman.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 0) {
      const speed = SNOWMAN_SPEED + (state.skier.speed > SKIER_DEFAULT_SPEED ? 1 : 0);
      state.snowman.x += (dx / dist) * speed;
      state.snowman.y += (dy / dist) * speed;
    }

    // Also push snowman forward with camera so it doesn't fall behind
    state.snowman.y += state.skier.speed * 0.3;

    // Check if snowman caught skier
    if (dist < SNOWMAN_CATCH_DIST) {
      state.status = 'over';
    }
  }
}

function updateSnowParticles(state) {
  for (const p of state.snowParticles) {
    p.x += p.speedX;
    p.y += p.speedY + state.skier.speed * 0.2;

    if (p.y > CANVAS_HEIGHT) {
      p.y = 0;
      p.x = Math.random() * CANVAS_WIDTH;
    }
    if (p.x < 0) p.x = CANVAS_WIDTH;
    if (p.x > CANVAS_WIDTH) p.x = 0;
  }
}

export function getSpeedLabel(speed) {
  if (speed >= SKIER_MAX_SPEED * 0.8) return 'Blazing';
  if (speed >= SKIER_MAX_SPEED * 0.5) return 'Fast';
  if (speed >= SKIER_DEFAULT_SPEED) return 'Medium';
  return 'Slow';
}
