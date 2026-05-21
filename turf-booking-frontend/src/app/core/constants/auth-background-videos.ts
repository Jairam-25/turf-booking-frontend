/** Local asset (always works) + CDN fallbacks */
export const LOCAL_AUTH_BACKGROUND_VIDEO = '/videos/turf-bg.mp4';

export const AUTH_BACKGROUND_VIDEOS = [
  LOCAL_AUTH_BACKGROUND_VIDEO,
  'https://cdn.coverr.co/videos/coverr-soccer-game-on-a-green-field-4707/1080p.mp4',
  'https://cdn.coverr.co/videos/coverr-football-player-kicking-the-ball-1572/1080p.mp4',
  'https://cdn.coverr.co/videos/coverr-people-playing-soccer-1567/1080p.mp4',
] as const;

export const DEFAULT_AUTH_BACKGROUND_VIDEO = LOCAL_AUTH_BACKGROUND_VIDEO;

export function pickRandomAuthVideo(): string {
  return LOCAL_AUTH_BACKGROUND_VIDEO;
}
