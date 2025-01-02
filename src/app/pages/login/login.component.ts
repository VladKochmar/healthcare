import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';

import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../services/auth/auth.service';
import { ValidationService } from '../../services/validation/validation.service';
import { ErrorMessagesService } from '../../services/error-messages/error-messages.service';
import { catchError, of, takeUntil, tap } from 'rxjs';
import { ClearObservable } from '../../directives/clear-observable/clear-observable.directive';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent extends ClearObservable implements OnInit {
  authError: string | null = null;
  hide = signal(true);
  form!: FormGroup;

  constructor(
    private authService: AuthService,
    private errorMessagesService: ErrorMessagesService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = new FormGroup({
      email: new FormControl<string>('', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(8),
        ValidationService.containsLetter,
        ValidationService.containsNumber,
      ]),
    });
  }

  getError(controlName: string): string | null {
    const control = this.form.get(controlName);
    return control && control.touched
      ? this.errorMessagesService.getErrorMessage(control)
      : null;
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const userData = {
      email: this.form.value['email'],
      password: this.form.value['password'],
    };

    this.authService
      .login(userData)
      .pipe(
        tap(() => {
          this.router.navigate(['/']);
        }),
        catchError((error) => {
          this.authError = error.message;
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
