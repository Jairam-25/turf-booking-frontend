import { Injectable } from '@angular/core';

/**
 * Service that provides a random sport background video URL.
 * Currently supports football and cricket videos.
 */
@Injectable({
  providedIn: 'root'
})
export class SportBackgroundService {
  /** List of video URLs – royalty‑free, short loop clips. */
  private readonly videos: string[] = [
    // Football (soccer) clip – grass field, players in action
    'https://cdn.coverr.co/videos/coverr-man-playing-football-on-a-grass-field-5698/1080p.mp4',
    // Cricket clip – bowler delivering ball on a green pitch
    'https://cdn.coverr.co/videos/coverr-cricket-bowlers-in-action-5609/1080p.mp4'
  ];

  /** Returns a random video URL from the list. */
  getRandomVideo(): string {
    const idx = Math.floor(Math.random() * this.videos.length);
    return this.videos[idx];
  }
}
