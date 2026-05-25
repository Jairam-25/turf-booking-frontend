export interface BackgroundVideo {
  url: string;
  type: 'football' | 'cricket';
  title: string;
}

export const HOME_BACKGROUND_VIDEOS: BackgroundVideo[] = [
  // Premium Football CDN Videos
  {
    url: 'https://cdn.coverr.co/videos/coverr-man-playing-football-on-a-grass-field-5698/1080p.mp4',
    type: 'football',
    title: 'Elite Grass Turf Training'
  },
  {
    url: 'https://cdn.coverr.co/videos/coverr-soccer-game-on-a-green-field-4707/1080p.mp4',
    type: 'football',
    title: 'Football Match Practice'
  },
  {
    url: 'https://cdn.coverr.co/videos/coverr-football-player-kicking-the-ball-1572/1080p.mp4',
    type: 'football',
    title: 'Penalty Kick Practice'
  },
  // Premium Cricket CDN Videos
  {
    url: 'https://usacricket.org/whatiscricket/batting.mp4',
    type: 'cricket',
    title: 'Professional Cricket Batting'
  },
  {
    url: 'https://usacricket.org/whatiscricket/bowling.mp4',
    type: 'cricket',
    title: 'Pro Cricket Bowling Action'
  }
];

export function getRandomHomeVideo(): BackgroundVideo {
  const index = Math.floor(Math.random() * HOME_BACKGROUND_VIDEOS.length);
  return HOME_BACKGROUND_VIDEOS[index];
}
