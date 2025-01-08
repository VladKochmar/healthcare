import { Component, OnInit, signal } from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../services/auth/auth.service';
import { ValidationService } from '../../services/validation/validation.service';
import { ErrorMessagesService } from '../../services/error-messages/error-messages.service';
import { Router } from '@angular/router';
import { ClearObservable } from '../../directives/clear-observable/clear-observable.directive';
import { catchError, of, takeUntil, tap } from 'rxjs';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-sing-up',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './sing-up.component.html',
  styleUrl: './sing-up.component.scss',
})
export class SingUpComponent extends ClearObservable implements OnInit {
  authError: string | null = null;
  form!: FormGroup;
  hide = signal(true);

  constructor(
    private authService: AuthService,
    private userService: UserService,
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
      password: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(8),
        ValidationService.containsLetter,
        ValidationService.containsNumber,
      ]),
      role_id: new FormControl<number | null>(null, [Validators.required]),
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
      name: this.form.value['name'],
      email: this.form.value['email'],
      password: this.form.value['password'],
      role_id: this.form.value['role_id'],
    };

    this.authService
      .signup(userData)
      .pipe(
        tap(() => {
          this.router.navigate(['/']);
          this.userService.updateUserAfterRegistration();
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
