
import React from 'react';
import { RotateCcw, Home, Skull, Trophy } from 'lucide-react';

interface GameOverUIProps {
  score: number;
  highScore: number;
  onRestart: () => void;
  onMenu: () => void;
}

const GameOverUI: React.FC<GameOverUIProps> = ({ score, highScore, onRestart, onMenu }) => {
  const isNewHigh = score >= highScore && score > 0;

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-red-950/40 backdrop-blur-md p-6 animate-in zoom-in duration-300">
      <div className="max-w-sm w-full bg-slate-900 border-2 border-red-500/30 rounded-3xl p-8 text-center space-y-6 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
        <div className="space-y-2">
          <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/50">
            <Skull size={32} />
          </div>
          <h2 className="text-3xl font-pixel text-red-500">CAUGHT!</h2>
          <p className="text-slate-400 text-sm font-medium">You couldn't outrun your creation.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 py-6 border-y border-slate-800">
          <div>
            <p className="text-[10px] text-slate-500 font-pixel mb-1">FINAL SCORE</p>
            <p className="text-2xl font-pixel text-white">{score}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-pixel mb-1">BEST SCORE</p>
            <p className="text-2xl font-pixel text-white">{highScore}</p>
          </div>
        </div>

        {isNewHigh && (
          <div className="bg-yellow-500/10 border border-yellow-500/50 p-3 rounded-xl flex items-center justify-center gap-2 animate-bounce">
            <Trophy size={16} className="text-yellow-500" />
            <span className="text-yellow-500 font-pixel text-[10px]">NEW BEST!</span>
          </div>
        )}

        <div className="space-y-3 pt-2">
          <button
            onClick={onRestart}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-pixel py-4 rounded-xl transition-all flex items-center justify-center gap-3 transform hover:scale-[1.02]"
          >
            <RotateCcw size={18} />
            <span>TRY AGAIN</span>
          </button>
          <button
            onClick={onMenu}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-pixel py-4 rounded-xl transition-all flex items-center justify-center gap-3"
          >
            <Home size={18} />
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverUI;
