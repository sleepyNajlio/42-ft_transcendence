export type user_stats = {
  winsRat: number;
  wins: number;
  achievement: number;
  total_matches: number;
};

export type achievement = {
  name: string;
  description: string;
  progress: number;
  max: number;
};

export type user = {
  id: string;
  name: string;
  rank: number;
  image: string;
  achievement: achievement[];
  user_stats: user_stats;
  // Add other properties as needed
};

export type cercle = {
  x: number,
  y: number,
  r:  number,
}
export interface User {
  email: string;
  username: string;
  avatar: string;
  isAuthenticated: boolean;
}