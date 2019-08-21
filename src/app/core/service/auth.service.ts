import { Base64 } from 'js-base64';
import { auth } from 'firebase/app';
import { StorageKeys } from './../../storage-keys';
import { User } from './../models/user.model';
import { Injectable, NgZone } from '@angular/core';
import { Observable, of, ReplaySubject, throwError, from } from 'rxjs';
import { catchError, map, mergeMap, take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authUser: User;
  redirectUrl: string;
  keepSigned: boolean;
  rememberMe: boolean;
  private _isAuthenticated = new ReplaySubject<boolean>(1);


  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    public ngZone: NgZone
  ) {
    this.isAuthenticated.subscribe();
    this.init();
  }

  init(): void {
    this.keepSigned = JSON.parse(localStorage.getItem(StorageKeys.KEEP_SIGNED));
    this.rememberMe = JSON.parse(window.localStorage.getItem(StorageKeys.REMEMBER_ME));
  }

  get isAuthenticated(): Observable<boolean> {
    return this._isAuthenticated.asObservable();
  }

  signinUser(variables: { email: string, password: string }): Observable<any> {
    const observable = from(this.afAuth.auth.signInWithEmailAndPassword(variables.email, variables.password));
    return observable.pipe(
      map(res => res.user),
      tap(res => this.setAuthState({ id: res && res.uid, token: res && res.refreshToken, isAuthenticated: res != null })),
      catchError(err => {
        this.setAuthState({ id: null, token: null, isAuthenticated: false });
        return throwError(err);
      })
    );
  }

  signupUser(variables: { name: string, email: string, password: string }): Observable<any> {
    const observable = from(this.afAuth.auth.createUserWithEmailAndPassword(variables.email, variables.password));

    return observable.pipe(
      map(res => res.user),
      tap(res => this.setAuthState({ id: res && res.uid, token: res && res.refreshToken, isAuthenticated: res != null })),
      catchError(err => {

        switch (err.code) {
          case 'auth/email-already-in-use':
            err.message = 'O e-mail já está em uso';
            break;
          case 'auth/invalid-email':
            err.message = 'E-mail inválido';
            break;
          case 'auth/operation-not-allowed':
            err.message = 'Não esta habilitado a criar usuarios';
            break;
          case 'auth/weak-password':
            err.message = 'Senha não é forte o suficiente';
            break;
        }
        return throwError(err);
      })
    );
  }

  // Sign in with Google
  GoogleAuth(): Observable<any> {
    return this.AuthLogin(new auth.GoogleAuthProvider());
  }

  // Sign in with Microsoft
  MicrosoftAuth(): Observable<any> {
    const provider = new auth.OAuthProvider('microsoft.com');
    provider.addScope('user.read');
    provider.setCustomParameters({ tenant: '43b6efd3-133a-4e68-b1e8-84c18550db5d', prompt: 'consent'});
    return this.AuthLogin(provider);
  }

  // Auth logic to run auth providers
  AuthLogin(provider): Observable<any> {
    const observable =  from(this.afAuth.auth.signInWithPopup(provider));
    return observable
      .pipe(
        map(res => res.user),
        tap(res => this.setAuthState({ id: res && res.uid, token: res && res.refreshToken, isAuthenticated: res != null })),
        catchError(err => throwError(err))
      );
  }

  autoLogin(): Observable<{}> {
    if (!this.keepSigned) {
      this.logout();
      return of();
    }

    return this.validateToken()
      .pipe(
        tap(authData => {
          const token = localStorage.getItem(StorageKeys.AUTH_TOKEN);
          this.setAuthState({ id: authData && authData.id, token, isAuthenticated: authData.isAuthenticated }, true);
        }),
        mergeMap(res => of()),
        catchError(error => {
          this.setAuthState({ id: null, token: null, isAuthenticated: false });
          return throwError(error);
        })
      );
  }

  private validateToken(): Observable<{ id: string, isAuthenticated: boolean }> {
    return of<any>().pipe(
      map(res => {
        const user = res.data.loggedInUser;
        return {
          id: user && user.id,
          isAuthenticated: user != null
        };
      }),
      mergeMap(authData => (authData.isAuthenticated) ? of(authData) : throwError('Token Inválido'))
    );
  }

  toggleKeepSigned(): void {
    this.keepSigned = !this.keepSigned;
    localStorage.setItem(StorageKeys.KEEP_SIGNED, this.keepSigned.toString());
  }

  toggleRememberMe(): void {
    this.rememberMe = !this.rememberMe;
    window.localStorage.setItem(StorageKeys.REMEMBER_ME, this.rememberMe.toString());
    if (!this.rememberMe) {
      window.localStorage.removeItem(StorageKeys.USER_EMAIL);
      window.localStorage.removeItem(StorageKeys.USER_PASSWORD);
    }
  }

  setRememberMe(user: { email: string, password: string }): void {
    if (this.rememberMe) {
      window.localStorage.setItem(StorageKeys.USER_EMAIL, Base64.encode(user.email));
      window.localStorage.setItem(StorageKeys.USER_PASSWORD, Base64.encode(user.password));
    }
  }

  getRememberMe(): { email: string, password: string } {
    if (!this.rememberMe) { return null; }

    const email = localStorage.getItem(StorageKeys.USER_EMAIL);
    const password = localStorage.getItem(StorageKeys.USER_PASSWORD);

    return {
      email: (email) ? Base64.decode(email) : '',
      password: (password) ? Base64.decode(password) : ''
    };
  }

  logout(): void {
    localStorage.removeItem(StorageKeys.AUTH_TOKEN);
    localStorage.removeItem(StorageKeys.KEEP_SIGNED);
    this.keepSigned = false;
    this._isAuthenticated.next(false);
    this.router.navigate(['/login']);
  }

  private setAuthUser(userId: string): Observable<User> {
    return of<any>((userId))
      .pipe(
        tap((user: User) => this.authUser = user)
      );
  }

  private setAuthState(authData: { id: string, token: string, isAuthenticated: boolean }, isRefresh: boolean = false): void {
    if (authData.isAuthenticated) {
      localStorage.setItem(StorageKeys.AUTH_TOKEN, authData.token);
      this.setAuthUser(authData.id)
        .pipe(
          take(1),
          tap(() => this._isAuthenticated.next(authData.isAuthenticated))
        ).subscribe();
      if (!isRefresh) {
        // close connect
      }
      return;
    }
    this._isAuthenticated.next(authData.isAuthenticated);
  }
}
