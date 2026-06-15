import { Component, OnInit, signal, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Turf } from '../../domain/models/turf.model';
import { NotificationService } from '../../core/services/notification.service';
import { TurfRepository } from '../../domain/repositories/turf.repository';

@Component({
  selector: 'app-liked-turfs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './liked-turfs.html',
})
export class LikedTurfsComponent implements OnInit {
  likedTurfs = signal<Turf[]>([]);

  constructor(
    private notificationService: NotificationService,
    @Inject('TurfRepository') private turfRepository: TurfRepository
  ) {}

  ngOnInit() {
    this.loadLikedTurfs();
  }

  loadLikedTurfs() {
    const saved = localStorage.getItem('likedTurfs');
    if (saved) {
      try {
        const parsedTurfs: Turf[] = JSON.parse(saved);
        this.likedTurfs.set(parsedTurfs);
        
        // Sync with backend to get latest ratings and prices
        this.turfRepository.getAll({ page: 1, pageSize: 100, sort: 'rating_desc' }).subscribe({
          next: (res: any) => {
            const apiTurfs: Turf[] = res.items || [];
            const syncedTurfs = parsedTurfs.map(liked => {
              const latest = apiTurfs.find((t: Turf) => t.id === liked.id);
              if (latest) {
                return { ...liked, rating: latest.rating, pricePerHour: latest.pricePerHour, name: latest.name, location: latest.location, imageUrl: latest.imageUrl };
              }
              return liked;
            });
            this.likedTurfs.set(syncedTurfs);
            localStorage.setItem('likedTurfs', JSON.stringify(syncedTurfs));
          }
        });
      } catch (e) {
        // Failed to parse liked turfs
      }
    }
  }

  removeLikedTurf(id: number) {
    const current = this.likedTurfs().filter(t => t.id !== id);
    this.likedTurfs.set(current);
    localStorage.setItem('likedTurfs', JSON.stringify(current));
    this.notificationService.success('Removed from liked turfs.');
  }

  onImageError(event: any) {
    event.target.src = '/images/turf_sports_ground.png';
  }
}
