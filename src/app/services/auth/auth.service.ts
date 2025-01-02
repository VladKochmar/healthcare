import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

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
  role_id: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$ = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {}

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
