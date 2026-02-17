export default function StartScreen() {
  return (
    <div className="dialog-overlay">
      <div className="window dialog-window">
        <div className="title-bar">
          <div className="title-bar-text">Welcome to SkiFreeButItsNoem!</div>
        </div>
        <div className="window-body">
          <p style={{ textAlign: 'center', margin: '8px 0' }}>
            <span style={{ fontSize: '32px' }}>🐕</span>
          </p>
          <p style={{ margin: '8px 0' }}>
            Help your dog ski down the mountain!
          </p>
          <ul className="tree-view" style={{ margin: '8px 0', padding: '4px 8px' }}>
            <li><b>←→</b> Steer left/right</li>
            <li><b>↓</b> Speed up</li>
            <li><b>↑</b> Slow down</li>
            <li>Hit ramps to jump for bonus points</li>
            <li>Watch out for Kristi Noem!</li>
          </ul>
          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <button
              onClick={() => window.__skifreeStart?.()}
              style={{ padding: '4px 24px' }}
            >
              Start Game
            </button>
          </div>
          <p style={{ textAlign: 'center', fontSize: '11px', color: '#666', marginTop: '8px' }}>
            Press Space or Enter to start
          </p>
        </div>
      </div>
    </div>
  );
}
