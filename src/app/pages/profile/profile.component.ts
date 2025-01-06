import { Component, inject, OnInit } from '@angular/core';
import { Observable, takeUntil, tap } from 'rxjs';
import { UserProfile, UserService } from '../../services/user/user.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AvatarComponent } from '../../components/avatar/avatar.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ValidationService } from '../../services/validation/validation.service';
import { ClearObservable } from '../../directives/clear-observable/clear-observable.directive';
import { Router } from '@angular/router';

import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    AvatarComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent extends ClearObservable implements OnInit {
  private _snackBar = inject(MatSnackBar);

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  form!: FormGroup;
  user$!: Observable<UserProfile | null>;
  user: UserProfile | null = null;

  constructor(private userService: UserService, private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.user$ = this.userService.ensureUserLoaded();

    this.initForm();
    this.user$
      .pipe(
        tap((data) => {
          if (data) this.form.patchValue(data);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((user) => {
        this.user = user;
      });
  }

  initForm() {
    this.form = new FormGroup({
      name: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        ValidationService.lettersOnly,
      ]),
      email: new FormControl<string>('', [
        Validators.required,
        Validators.email,
      ]),
      phone_number: new FormControl<string | null>(null),
      bio: new FormControl<string | null>(null),
      avatar: new FormControl<File | null>(null),
    });
  }

  onImagePicked(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.length ? input.files[0] : null;
    if (file) {
      this.form.patchValue({ avatar: file });
    }
  }

  onDelete() {
    this.userService
      .deleteAccount()
      .pipe(
        tap(() => {
          this.router.navigate(['/log-in']);
        })
      )
      .subscribe();
  }

  openSnackBar() {
    this._snackBar.open('Profile successfully updated!', 'Close', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.user) {
      const formData = new FormData();
      formData.append('name', this.form.value['name']);
      formData.append('email', this.form.value['email']);
      formData.append('phone_number', this.form.value['phone_number']);
      formData.append('bio', this.form.value['bio']);

      const avatar = this.form.value['avatar'];
      if (avatar && avatar instanceof File) {
        formData.append('avatar', avatar, avatar.name);
      }

      this.userService
        .updateProfile(formData)
        .pipe(
          tap(() => {
            this.openSnackBar();
            this.userService.getProfile();
          })
        )
        .subscribe();
    }
  }
}
