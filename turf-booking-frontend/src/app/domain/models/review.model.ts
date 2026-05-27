export interface Review {
  id: number;
  turfId: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateReview {
  turfId: number;
  rating: number;
  comment: string;
}
