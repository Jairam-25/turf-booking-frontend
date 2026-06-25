import { Injectable, inject, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import {
 Auth,
 GoogleAuthProvider,
 signInWithPopup,
 signOut,
 UserCredential
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

export interface GoogleUserInfo {
 uid: string;
 email: string | null;
 displayName: string | null;
 photoURL: string | null;
 idToken: string;

 
}

@Injectable({
 providedIn: 'root'
})
export class FirebaseAuthService {
 private auth = inject(Auth);
 private injector = inject(EnvironmentInjector);
 private provider = new GoogleAuthProvider();

 constructor() {
 this.provider.addScope('profile');
 this.provider.addScope('email');
 this.provider.setCustomParameters({ prompt: 'select_account' });
 }

 /**
 * Opens the Google account selector popup.
 * Uses runInInjectionContext so AngularFire zone-patching works correctly
 * in Angular 21 zoneless mode.
 */
 signInWithGoogle(): Observable<GoogleUserInfo> {
 return new Observable<GoogleUserInfo>(observer => {
 runInInjectionContext(this.injector, () => {
 signInWithPopup(this.auth, this.provider)
 .then((credential: UserCredential) => {
 const googleCredential = GoogleAuthProvider.credentialFromResult(credential);
 const idToken = googleCredential?.idToken || '';
 const user = credential.user;
 observer.next({
 uid: user.uid,
 email: user.email,
 displayName: user.displayName,
 photoURL: user.photoURL,
 idToken
 });
 observer.complete();
 })
 .catch((err) => {
 observer.error(err);
 });
 });
 });
 }

 signOutFirebase(): Observable<void> {
 return new Observable<void>(observer => {
 runInInjectionContext(this.injector, () => {
 signOut(this.auth)
 .then(() => { observer.next(); observer.complete(); })
 .catch(err => observer.error(err));
 });
 });
 }

 getIdToken(): Observable<string | null> {
 const currentUser = this.auth.currentUser;
 if (!currentUser) {
 return new Observable(obs => { obs.next(null); obs.complete(); });
 }
 return new Observable<string>(observer => {
 runInInjectionContext(this.injector, () => {
 currentUser.getIdToken()
 .then(token => { observer.next(token); observer.complete(); })
 .catch(err => observer.error(err));
 });
 });
 }
}
