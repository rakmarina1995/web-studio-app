import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subject, throwError} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {LoginResponseType} from "../../../types/login-response.type";
import {environment} from "../../../environments/environment";
import {UserInfoType} from "../../../types/user-info.type";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public accessTokenKey: string = 'accessToken';
  public refreshTokenKey: string = 'refreshToken';
  public userIdKey: string = 'userId';
  public userNameKey: string = 'userName';
  public isLogged$: Subject<boolean> = new Subject<boolean>();
  private isLogged: boolean = false;

  constructor(private http: HttpClient) {
    this.isLogged = !!localStorage.getItem(this.accessTokenKey);
  }

  public getIsLoggedIn() {
    return this.isLogged;
  }

  set userId(id: string | null) {
    if (id) {
      localStorage.setItem(this.userIdKey, id);
    } else {
      localStorage.removeItem(this.userIdKey);
    }
  }

  get userId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }

  set userName(name: string | null) {
    if (name) {
      localStorage.setItem(this.userNameKey, name);
    } else {
      localStorage.removeItem(this.userNameKey);
    }
  }

  get userName(): string | null {
    return localStorage.getItem(this.userNameKey);
  }


  login(email: string, password: string, rememberMe: boolean): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'login', {
      email,
      password,
      rememberMe
    })
  }

  signup(name: string, email: string, password: string): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'signup', {
      name, email, password
    })
  }

  refresh(): Observable<DefaultResponseType | LoginResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'refresh', {
        refreshToken: tokens.refreshToken
      })
    }
    throw throwError(() => 'Can not use token');
  }

  logout(): Observable<DefaultResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType>(environment.api + 'logout', {refreshToken: tokens.refreshToken});
    }
    throw throwError(() => 'Can not find token');
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    this.isLogged = true;
    this.isLogged$.next(true);
  }

  getTokens(): { accessToken: string | null, refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey)
    }
  }

  removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLogged = false;
    this.isLogged$.next(false);
  }

  getUserInfo(): Observable<UserInfoType | DefaultResponseType> {
    return this.http.get<UserInfoType | DefaultResponseType>(environment.api + 'users');
  }

}
