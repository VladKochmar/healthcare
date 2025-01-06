import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject, filter, Observable, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export interface UserProfile {
  id: number;
  role_id: number;
  name: string;
  email: string;
  phone_number: string | null;
  avatar: string | null;
  bio: string | null;
}

export interface UpdatedUser {
  name: string;
  email: string;
  phone_number: string | null;
  avatar: File | null;
  bio: string | null;
}

interface UserResponse {
  user: UserProfile;
}

interface UserUpdateResponse {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user$ = new BehaviorSubject<UserProfile | null>(null);

  constructor(private http: HttpClient, private authService: AuthService) {}

  public getUser(): Observable<UserProfile | null> {
    return this.user$;
  }

  public ensureUserLoaded(): Observable<UserProfile> {
    return this.getUser().pipe(
      switchMap((user) => {
        if (user) {
          return of(user);
        } else {
          return this.getProfile().pipe(
            switchMap(() => this.getUser()),
            filter(
              (updatedUser): updatedUser is UserProfile => updatedUser !== null
            )
          );
        }
      })
    );
  }

  public getProfile(): Observable<UserProfile> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
    });

    const url = `${environment.API_URL}/users/me`;

    return this.http.get<UserResponse>(url, { headers }).pipe(
      tap((response) => {
        this.user$.next(response.user);
      }),
      switchMap(() => this.getUser()),
      filter((user): user is UserProfile => user !== null)
    );
  }

  public updateProfile(updatedData: FormData) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
    });

    const url = `${environment.API_URL}/users/update`;

    return this.http
      .post<UserUpdateResponse>(url, updatedData, { headers })
      .pipe(
        tap(() => {
          this.getProfile().subscribe();
        })
      );
  }

  public deleteAccount() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
    });

    const url = `${environment.API_URL}/users`;

    return this.http.delete(url, { headers }).pipe(
      tap(() => {
        this.authService.logout();
      })
    );
  }
}
