import { ApplicationConfig } from '@angular/core';

import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';

import { routes } from './app.routes';
import { AuthRepository } from './domain/repositories/auth.repository';
import { AuthRepositoryImpl } from './data/repositories/auth.repository.impl';
import { TurfRepository } from './domain/repositories/turf.repository';
import { TurfRepositoryImpl } from './data/repositories/turf.repository.impl';
import { BookingRepository } from './domain/repositories/booking.repository';
import { BookingRepositoryImpl } from './data/repositories/booking.repository.impl';
import { ReviewRepository } from './domain/repositories/review.repository';
import { ReviewRepositoryImpl } from './data/repositories/review.repository.impl';

export const appConfig: ApplicationConfig = {

  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    // Firebase initialization
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    // Repository bindings
    { provide: AuthRepository, useClass: AuthRepositoryImpl },
    { provide: TurfRepository, useClass: TurfRepositoryImpl },
    { provide: BookingRepository, useClass: BookingRepositoryImpl },
    { provide: ReviewRepository, useClass: ReviewRepositoryImpl }
  ]

};