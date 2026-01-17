
export enum GameStatus {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  GAMEOVER = 'GAMEOVER'
}

export interface Vector2 {
  x: number;
  y: number;
}

export interface Entity {
  pos: Vector2;
  radius: number;
  speed: number;
  color: string;
}

export interface GameSettings {
  monsterTexture: string | null;
  monsterSpeed: number;
  playerSpeed: number;
  difficulty: 'Easy' | 'Normal' | 'Hard' | 'Insane';
}
