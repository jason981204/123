
import React, { useEffect, useRef, useState } from 'react';
import { GameStatus, GameSettings, Vector2, Entity } from '../types';
import { PLAYER_RADIUS, MONSTER_RADIUS, DIFFICULTY_MODIFIERS, DEFAULT_MONSTER_IMAGE } from '../constants';

interface GameCanvasProps {
  status: GameStatus;
  settings: GameSettings;
  onGameOver: (score: number) => void;
  onScoreUpdate: (score: number) => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ status, settings, onGameOver, onScoreUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Initialized with 0 to satisfy the expected 1 argument requirement in some TypeScript environments
  const requestRef = useRef<number>(0);
  
  // Game Entities
  const playerRef = useRef<Entity>({ 
    pos: { x: 0, y: 0 }, 
    radius: PLAYER_RADIUS, 
    speed: settings.playerSpeed, 
    color: '#3b82f6' 
  });
  const monsterRef = useRef<Entity>({ 
    pos: { x: 0, y: 0 }, 
    radius: MONSTER_RADIUS, 
    speed: settings.monsterSpeed, 
    color: '#ef4444' 
  });
  
  const scoreRef = useRef(0);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const monsterImgRef = useRef<HTMLImageElement | null>(null);

  // Initialize Assets
  useEffect(() => {
    const img = new Image();
    img.src = settings.monsterTexture || DEFAULT_MONSTER_IMAGE;
    img.onload = () => {
      monsterImgRef.current = img;
    };
  }, [settings.monsterTexture]);

  // Handle Resize
  useEffect(() => {
    const resize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', resize);
    resize();
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Handle Input
  useEffect(() => {
    const down = (e: KeyboardEvent) => { keysRef.current[e.key] = true; };
    const up = (e: KeyboardEvent) => { keysRef.current[e.key] = false; };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  // Main Game Loop
  const update = (time: number) => {
    if (status !== GameStatus.PLAYING) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Logic Update
    const player = playerRef.current;
    const monster = monsterRef.current;
    
    // Player Movement
    const dx = (keysRef.current['ArrowRight'] || keysRef.current['d'] || keysRef.current['D'] ? 1 : 0) - 
               (keysRef.current['ArrowLeft'] || keysRef.current['a'] || keysRef.current['A'] ? 1 : 0);
    const dy = (keysRef.current['ArrowDown'] || keysRef.current['s'] || keysRef.current['S'] ? 1 : 0) - 
               (keysRef.current['ArrowUp'] || keysRef.current['w'] || keysRef.current['W'] ? 1 : 0);

    const mag = Math.sqrt(dx * dx + dy * dy);
    const speedMod = DIFFICULTY_MODIFIERS[settings.difficulty].player;
    const currentSpeed = settings.playerSpeed * speedMod;

    if (mag > 0) {
      player.pos.x += (dx / mag) * currentSpeed;
      player.pos.y += (dy / mag) * currentSpeed;
    }

    // Boundary Checks
    player.pos.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.pos.x));
    player.pos.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.pos.y));

    // Monster AI (Simple Chase)
    const mDx = player.pos.x - monster.pos.x;
    const mDy = player.pos.y - monster.pos.y;
    const mMag = Math.sqrt(mDx * mDx + mDy * mDy);
    
    const mSpeedMod = DIFFICULTY_MODIFIERS[settings.difficulty].monster;
    const mCurrentSpeed = settings.monsterSpeed * mSpeedMod;

    if (mMag > 0) {
      monster.pos.x += (mDx / mMag) * mCurrentSpeed;
      monster.pos.y += (mDy / mMag) * mCurrentSpeed;
    }

    // Collision Detection
    const dist = Math.sqrt(Math.pow(player.pos.x - monster.pos.x, 2) + Math.pow(player.pos.y - monster.pos.y, 2));
    if (dist < player.radius + monster.radius) {
      onGameOver(Math.floor(scoreRef.current));
      return;
    }

    // Update Score
    scoreRef.current += 1/60; // Approx 1 point per second
    onScoreUpdate(Math.floor(scoreRef.current));

    // 2. Rendering
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Grid (Background)
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    const gridSize = 50;
    for(let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for(let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw Player
    ctx.shadowBlur = 15;
    ctx.shadowColor = player.color;
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(player.pos.x, player.pos.y, player.radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw Monster
    ctx.shadowColor = monster.color;
    if (monsterImgRef.current) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(monster.pos.x, monster.pos.y, monster.radius, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(
        monsterImgRef.current, 
        monster.pos.x - monster.radius, 
        monster.pos.y - monster.radius, 
        monster.radius * 2, 
        monster.radius * 2
      );
      ctx.restore();
      
      // Add a border to the monster
      ctx.strokeStyle = monster.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(monster.pos.x, monster.pos.y, monster.radius, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.fillStyle = monster.color;
      ctx.beginPath();
      ctx.arc(monster.pos.x, monster.pos.y, monster.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    requestRef.current = requestAnimationFrame(update);
  };

  // Reset/Start Session
  useEffect(() => {
    if (status === GameStatus.PLAYING) {
      const canvas = canvasRef.current;
      if (canvas) {
        playerRef.current.pos = { x: canvas.width / 4, y: canvas.height / 2 };
        monsterRef.current.pos = { x: canvas.width * 0.75, y: canvas.height / 2 };
        scoreRef.current = 0;
        requestRef.current = requestAnimationFrame(update);
      }
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [status]);

  return <canvas ref={canvasRef} className="block w-full h-full bg-slate-900" />;
};

export default GameCanvas;
