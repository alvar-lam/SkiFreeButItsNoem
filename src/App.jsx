import { useState, useCallback } from 'react';
import GameCanvas from './components/GameCanvas';
import StartScreen from './components/StartScreen';
import GameOver from './components/GameOver';
import './App.css';

export default function App() {
  const [gameInfo, setGameInfo] = useState({
    status: 'start',
    distance: 0,
    score: 0,
    speed: 'Medium',
    snowmanActive: false,
  });

  const handleStatusChange = useCallback((info) => {
    setGameInfo(prev => {
      if (
        prev.status === info.status &&
        prev.distance === info.distance &&
        prev.score === info.score
      ) return prev;
      return info;
    });
  }, []);

  return (
    <div className="desktop">
      <div className="window game-window">
        <div className="title-bar">
          <div className="title-bar-text">SkiFree</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
          </div>
        </div>
        <div className="window-body game-body">
          <div className="canvas-container">
            <GameCanvas onStatusChange={handleStatusChange} />
            {gameInfo.status === 'start' && <StartScreen />}
            {gameInfo.status === 'over' && (
              <GameOver score={gameInfo.score} distance={gameInfo.distance} />
            )}
          </div>
        </div>
        <div className="status-bar">
          <p className="status-bar-field">
            Distance: {gameInfo.distance}m
          </p>
          <p className="status-bar-field">
            Score: {gameInfo.score}
          </p>
          <p className="status-bar-field">
            Speed: {gameInfo.speed}
          </p>
          <p className="status-bar-field">
            {gameInfo.snowmanActive ? '🏔️ ⚠️' : '⛷️'}
          </p>
        </div>
      </div>
    </div>
  );
}
