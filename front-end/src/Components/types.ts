import { Rect, Circle, Image, G } from '@svgdotjs/svg.js';
export type user_stats = {
  winsRat: number;
  wins: number;
  achievement: number;
  total_matches: number;
};

export type History = {
  score1: number;
  user2: string;
  score2: number;
};

export type user = {
  id: string;
  username: string;
  rank: number;
  avatar: string;
  achievement: number;
  user_stats: user_stats;
  // Add other properties as needed
};

export type cercle = {
  x: number,
  y: number,
  r:  number,
}
export interface User {
  id_player: string;
  email?: string;
  username: string;
  avatar: string;
  isAuthenticated: boolean;
}

  // define a type of one plaer
export interface Player {
  s_id: string;
  user_id: string,
  host: boolean,
  width: string,
  username: string,
  ratio: number,
  vxratio: number,
  x: number;
  y: number;
  padl: number;
  paddleDirection: number;
  score: number;
  paddle? : Rect;
  paddleSpeed : number;
  state: string;
}

// define a type of all players
export interface Players {
    [key: string]: Player;
}

// define a type of ball
export interface Ball {
  cx: number;
  cy: number;
  cercle : G;
  vx: number;
  vy: number;
}

export enum inviteStatus {
  NONE,
  INVITED,
  ACCEPTED,
  DECLINED,
  ABORTED,
}