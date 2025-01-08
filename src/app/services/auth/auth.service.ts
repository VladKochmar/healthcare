import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { jwtDecode } from 'jwt-decode';
import { UserService } from '../user/user.service';

interface SignupForm {
  name: string;
  email: string;
  password: string;
  role_id: number;
}

interface LoginForm {
  email: string;
  password: string;
}

interface AuthResponse {
  result: string;
  user: User;
  token: {
    expiresInMs: number;
    token: string;
  };
}

interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
}

interface DecodedToken {
  role_id: number;
  exp: number;
  iat: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$ = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {}

  getToken() {
    return localStorage.getItem('jwt_token');
  }

  isTokenValid() {
    const token = this.getToken();

    if (!token) return false;

    try {
      const decoded: DecodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp < currentTime) {
        this.logout();
        return false;
      }

      return true;
    } catch (err) {
      this.logout();
      return false;
    }
  }

  hasDoctorRole() {
    const token = this.getToken();

    if (!token) return false;

    const decoded: DecodedToken = jwtDecode(token);
    const isDoctor = decoded.role_id === 1;

    return isDoctor;
  }

  login(formData: LoginForm) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
    });

    const url = `${environment.API_URL}/auth/login`;

    return this.http.post<AuthResponse>(url, formData, { headers }).pipe(
      tap((resp) => {
        this.user$.next(resp.user);
        localStorage.setItem('jwt_token', resp.token.token);
      }),
      catchError((err) => {
        return throwError(() => new Error(err.error.error));
      })
    );
  }

  signup(formData: SignupForm) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = `${environment.API_URL}/auth/signup`;

    return this.http.post<AuthResponse>(url, formData, { headers }).pipe(
      tap((resp) => {
        this.user$.next(resp.user);
        localStorage.setItem('jwt_token', resp.token.token);
      }),
      catchError((err) => {
        return throwError(() => new Error(err.error.error));
      })
    );
  }

  logout() {
    localStorage.removeItem('jwt_token');
  }
}
