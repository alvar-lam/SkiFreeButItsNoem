import { useRef, useEffect, useCallback } from 'react';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../game/constants.js';
import { createGameState, updateGame, getSpeedLabel } from '../game/engine.js';
import { render } from '../game/renderer.js';

export default function GameCanvas({ onStatusChange }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const rafRef = useRef(null);

  const startGame = useCallback(() => {
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

    // Game loop
    function gameLoop() {
      const state = stateRef.current;
      if (!state) return;

      const now = performance.now();

      if (state.status === 'playing') {
        updateGame(state, now);

        onStatusChange?.({
          status: state.status,
          distance: Math.floor(state.distance),
          score: Math.floor(state.distance) + state.score,
          speed: getSpeedLabel(state.skier.speed),
          snowmanActive: !!state.snowman,
        });
      }

      render(ctx, state, now);
      rafRef.current = requestAnimationFrame(gameLoop);
    }

    rafRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
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
