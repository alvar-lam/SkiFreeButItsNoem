export default function GameOver({ score, distance }) {
  return (
    <div className="dialog-overlay">
      <div className="window dialog-window">
        <div className="title-bar">
          <div className="title-bar-text">Game Over</div>
        </div>
        <div className="window-body">
          <p style={{ textAlign: 'center', margin: '8px 0' }}>
            <span style={{ fontSize: '32px' }}>☠️</span>
          </p>
          <p style={{ textAlign: 'center', fontWeight: 'bold', margin: '4px 0' }}>
            The Abominable Snowman caught you!
          </p>
          <fieldset style={{ margin: '8px 0' }}>
            <legend>Results</legend>
            <p>Distance: <b>{distance}m</b></p>
            <p>Score: <b>{score}</b></p>
          </fieldset>
          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <button
              onClick={() => window.__skifreeRestart?.()}
              style={{ padding: '4px 24px' }}
            >
              Play Again
            </button>
          </div>
          <p style={{ textAlign: 'center', fontSize: '11px', color: '#666', marginTop: '8px' }}>
            Press Space or Enter to restart
          </p>
        </div>
      </div>
    </div>
  );
}
