/** Curated premium Football and Cricket background videos */
export const AUTH_BACKGROUND_VIDEOS = [
  // Premium Football CDN Videos
  'https://cdn.coverr.co/videos/coverr-man-playing-football-on-a-grass-field-5698/1080p.mp4',
  'https://cdn.coverr.co/videos/coverr-soccer-game-on-a-green-field-4707/1080p.mp4',
  'https://cdn.coverr.co/videos/coverr-football-player-kicking-the-ball-1572/1080p.mp4',
  
  // Premium Cricket CDN Videos
  'https://usacricket.org/whatiscricket/batting.mp4',
  'https://usacricket.org/whatiscricket/bowling.mp4'
] as const;

// Pick a default video from the premium list
export const DEFAULT_AUTH_BACKGROUND_VIDEO = AUTH_BACKGROUND_VIDEOS[0];

export function pickRandomAuthVideo(): string {
  const index = Math.floor(Math.random() * AUTH_BACKGROUND_VIDEOS.length);
  return AUTH_BACKGROUND_VIDEOS[index];
}
