import { useRef, useEffect, useCallback } from 'react';
import { CANVAS_WIDTH, CANVAS_HEIGHT, SKIER_MAX_SPEED } from '../game/constants.js';
import { createGameState, updateGame, getSpeedLabel } from '../game/engine.js';
import { render } from '../game/renderer.js';
import {
  initAudio, startSwoosh, updateSwoosh, stopSwoosh,
  playCrash, playJump, playBoost, playSnowmanAppear, playGameOver,
} from '../game/sounds.js';

export default function GameCanvas({ onStatusChange }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const rafRef = useRef(null);
  const soundFlags = useRef({ snowmanOnScreen: false, wasPlaying: false });

  const startGame = useCallback(() => {
    initAudio();
    startSwoosh();
    soundFlags.current = { snowmanPlayed: false, wasPlaying: true };
    stateRef.current = createGameState();
    stateRef.current.status = 'playing';
    onStatusChange?.({ status: 'playing', distance: 0, score: 0, speed: 'Medium' });
  }, [onStatusChange]);

  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    stateRef.current = createGameState();

    // Draw initial start screen background
    ctx.fillStyle = '#F0F0F0';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      const state = stateRef.current;
      if (!state) return;

      if (state.status === 'start' && (e.key === ' ' || e.key === 'Enter')) {
        startGame();
        return;
      }

      if (state.status === 'over' && (e.key === ' ' || e.key === 'Enter')) {
        restartGame();
        return;
      }

      if (state.status === 'playing') {
        state.keys[e.key] = true;
      }
    };

    const handleKeyUp = (e) => {
      const state = stateRef.current;
      if (state) {
        state.keys[e.key] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Track previous state for sound triggers
    let prevCrashed = false;
    let prevJumping = false;
    let prevBoosting = false;

    // Game loop
    function gameLoop() {
      const state = stateRef.current;
      if (!state) return;

      const now = performance.now();

      if (state.status === 'playing') {
        updateGame(state, now);

        // Sound triggers
        const sk = state.skier;

        // Swoosh (continuous wind based on speed)
        updateSwoosh(sk.speed, SKIER_MAX_SPEED);

        // Crash sound
        if (sk.crashed && !prevCrashed) {
          playCrash();
        }
        prevCrashed = sk.crashed;

        // Jump sound
        if (sk.jumping && !prevJumping) {
          playJump();
        }
        prevJumping = sk.jumping;

        // Boost sound
        if (sk.boosting && !prevBoosting) {
          playBoost();
        }
        prevBoosting = sk.boosting;

        // Snowman appear sound (plays each time it enters the visible screen)
        if (state.snowman) {
          const smScreenY = state.snowman.y - state.camera.y;
          const smOnScreen = smScreenY > -30 && smScreenY < CANVAS_HEIGHT + 30;
          if (smOnScreen && !soundFlags.current.snowmanOnScreen) {
            playSnowmanAppear();
          }
          soundFlags.current.snowmanOnScreen = smOnScreen;
        }

        onStatusChange?.({
          status: state.status,
          distance: Math.floor(state.distance),
          score: Math.floor(state.distance) + state.score,
          speed: getSpeedLabel(state.skier.speed, state.skier.boosting),
          snowmanActive: !!state.snowman,
        });
      }

      // Game over sound
      if (state.status === 'over' && soundFlags.current.wasPlaying) {
        soundFlags.current.wasPlaying = false;
        stopSwoosh();
        playGameOver();
      }

      render(ctx, state, now);
      rafRef.current = requestAnimationFrame(gameLoop);
    }

    rafRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      stopSwoosh();
    };
  }, [onStatusChange, startGame, restartGame]);

  // Expose start/restart for buttons
  useEffect(() => {
    window.__skifreeStart = startGame;
    window.__skifreeRestart = restartGame;
    return () => {
      delete window.__skifreeStart;
      delete window.__skifreeRestart;
    };
  }, [startGame, restartGame]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      style={{ display: 'block', imageRendering: 'pixelated' }}
      tabIndex={0}
    />
  );
}
