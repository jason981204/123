
import React, { useRef } from 'react';
import { GameSettings } from '../types';
import { Upload, Play, Settings as SettingsIcon, Ghost } from 'lucide-react';

interface MenuUIProps {
  settings: GameSettings;
  setSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
  onStart: () => void;
  highScore: number;
}

const MenuUI: React.FC<MenuUIProps> = ({ settings, setSettings, onStart, highScore }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSettings(prev => ({ ...prev, monsterTexture: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDifficultyChange = (level: GameSettings['difficulty']) => {
    setSettings(prev => ({ ...prev, difficulty: level }));
  };

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-md p-6 text-white animate-in fade-in duration-500">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-pixel text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
            PIXEL CHASE
          </h1>
          <p className="text-slate-400 font-medium tracking-widest uppercase text-sm">
            Monster Creator Edition
          </p>
          <div className="flex items-center justify-center gap-2 text-yellow-500 mt-4">
            <span className="font-pixel text-[10px]">High Score: {highScore}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
          {/* Monster Customization */}
          <div className="space-y-4">
            <label className="text-xs font-pixel block text-slate-300">Custom Monster</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-square w-full rounded-xl bg-slate-700 border-2 border-dashed border-slate-500 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-slate-700/80 transition-all overflow-hidden"
            >
              {settings.monsterTexture ? (
                <>
                  <img src={settings.monsterTexture} className="w-full h-full object-cover" alt="Custom Monster" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Upload size={24} />
                  </div>
                </>
              ) : (
                <div className="text-center p-4">
                  <Upload size={32} className="mx-auto text-slate-400 mb-2" />
                  <span className="text-[10px] text-slate-500 font-pixel">Upload JPG/PNG</span>
                </div>
              )}
            </div>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              className="hidden" 
            />
          </div>

          {/* Difficulty Selection */}
          <div className="space-y-4">
            <label className="text-xs font-pixel block text-slate-300">Difficulty</label>
            <div className="flex flex-col gap-2">
              {(['Easy', 'Normal', 'Hard', 'Insane'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => handleDifficultyChange(level)}
                  className={`py-2 px-3 rounded-lg text-left text-xs font-bold transition-all ${
                    settings.difficulty === level 
                      ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' 
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full bg-blue-500 hover:bg-blue-400 text-white font-pixel py-4 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Play size={20} fill="currentColor" />
          <span>START GAME</span>
        </button>

        <p className="text-center text-slate-500 text-[10px] leading-relaxed px-4">
          The monster will chase you. Survival time is your score. 
          Use your customized texture to make it uniquely terrifying!
        </p>
      </div>
    </div>
  );
};

export default MenuUI;
