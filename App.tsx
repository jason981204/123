
import React, { useState, useCallback, useEffect } from 'react';
import { GameStatus, GameSettings } from './types';
import GameCanvas from './components/GameCanvas';
import MenuUI from './components/MenuUI';
import GameOverUI from './components/GameOverUI';
import { Trophy, Ghost, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<GameStatus>(GameStatus.MENU);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('pixel-chase-highscore');
    return saved ? parseInt(saved) : 0;
  });
  
  const [settings, setSettings] = useState<GameSettings>({
    monsterTexture: null,
    monsterSpeed: 3.2,
    playerSpeed: 4,
    difficulty: 'Normal'
  });

  const handleGameOver = useCallback((finalScore: number) => {
    setScore(finalScore);
    setStatus(GameStatus.GAMEOVER);
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem('pixel-chase-highscore', finalScore.toString());
    }
  }, [highScore]);

  const startGame = () => {
    setStatus(GameStatus.PLAYING);
    setScore(0);
  };

  const backToMenu = () => {
    setStatus(GameStatus.MENU);
  };

  return (
    <div className="relative w-screen h-screen bg-slate-900 overflow-hidden select-none">
      {/* HUD */}
      {status === GameStatus.PLAYING && (
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 pointer-events-none">
          <div className="flex items-center gap-2 text-white bg-slate-800/80 px-4 py-2 rounded-full border border-slate-600 backdrop-blur-sm">
            <Trophy size={18} className="text-yellow-400" />
            <span className="font-pixel text-xs">Score: {score}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300 bg-slate-800/80 px-4 py-2 rounded-full border border-slate-600/50 backdrop-blur-sm">
            <Ghost size={18} />
            <span className="text-xs uppercase font-bold tracking-widest">{settings.difficulty} MODE</span>
          </div>
        </div>
      )}

      {/* Game Engine */}
      <GameCanvas 
        status={status} 
        settings={settings} 
        onGameOver={handleGameOver}
        onScoreUpdate={setScore}
      />

      {/* UI Overlays */}
      {status === GameStatus.MENU && (
        <MenuUI 
          settings={settings} 
          setSettings={setSettings} 
          onStart={startGame} 
          highScore={highScore}
        />
      )}

      {status === GameStatus.GAMEOVER && (
        <GameOverUI 
          score={score} 
          highScore={highScore} 
          onRestart={startGame} 
          onMenu={backToMenu} 
        />
      )}

      {/* Footer Info */}
      {status === GameStatus.MENU && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-slate-500 text-[10px] font-pixel text-center">
          USE WASD OR ARROW KEYS TO MOVE
        </div>
      )}
    </div>
  );
};

export default App;
