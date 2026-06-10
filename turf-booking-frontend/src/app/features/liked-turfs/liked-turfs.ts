import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Turf } from '../../domain/models/turf.model';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-liked-turfs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './liked-turfs.html',
})
export class LikedTurfsComponent implements OnInit {
  likedTurfs = signal<Turf[]>([]);

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.loadLikedTurfs();
  }

  loadLikedTurfs() {
    const saved = localStorage.getItem('likedTurfs');
    if (saved) {
      try {
        this.likedTurfs.set(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse liked turfs', e);
      }
    }
  }

  removeLikedTurf(id: number) {
    const current = this.likedTurfs().filter(t => t.id !== id);
    this.likedTurfs.set(current);
    localStorage.setItem('likedTurfs', JSON.stringify(current));
    this.notificationService.success('Removed from liked turfs.');
  }
}
