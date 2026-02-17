export const CANVAS_WIDTH = 640;
export const CANVAS_HEIGHT = 480;

// Skier
export const SKIER_WIDTH = 20;
export const SKIER_HEIGHT = 30;
export const SKIER_START_X = CANVAS_WIDTH / 2;
export const SKIER_START_Y = 140;
export const SKIER_MAX_SPEED = 8;
export const SKIER_MIN_SPEED = 2;
export const SKIER_DEFAULT_SPEED = 4;
export const SKIER_LATERAL_SPEED = 4;
export const SKIER_ACCEL = 0.15;
export const SKIER_DECEL = 0.15;
export const CRASH_PAUSE_MS = 800;

// Directions: -2 left fast, -1 left, 0 straight, 1 right, 2 right fast
export const DIR_LEFT_FAST = -2;
export const DIR_LEFT = -1;
export const DIR_STRAIGHT = 0;
export const DIR_RIGHT = 1;
export const DIR_RIGHT_FAST = 2;
export const DIR_CRASH = 99;

// Obstacles
export const OBSTACLE_TYPES = ['tree', 'rock', 'stump', 'ramp'];
export const OBSTACLE_SPAWN_RATE = 0.06; // per frame
export const OBSTACLE_BUFFER = 100; // spawn ahead of screen
export const TREE_WIDTH = 24;
export const TREE_HEIGHT = 36;
export const ROCK_WIDTH = 20;
export const ROCK_HEIGHT = 16;
export const STUMP_WIDTH = 16;
export const STUMP_HEIGHT = 12;
export const RAMP_WIDTH = 30;
export const RAMP_HEIGHT = 12;

// Collision box shrink (forgiving hitboxes)
export const COLLISION_SHRINK = 6;

// Snowman
export const SNOWMAN_APPEAR_DISTANCE = 2000;
export const SNOWMAN_SPEED = 3.5;
export const SNOWMAN_WIDTH = 30;
export const SNOWMAN_HEIGHT = 40;
export const SNOWMAN_CATCH_DIST = 20;

// Jump
export const JUMP_DURATION_MS = 600;
export const JUMP_BONUS = 50;

// Speed boost (F key)
export const BOOST_SPEED = 12;
export const BOOST_DURATION_MS = 3000;
export const BOOST_COOLDOWN_MS = 10000;

// Scoring
export const METERS_PER_PIXEL = 0.5;
