import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidationService {
  static containsLetter(control: AbstractControl): ValidationErrors | null {
    const hasLetter = /[a-zA-Z]/.test(control.value || '');
    return hasLetter ? null : { letterRequired: true };
  }

  static containsNumber(control: AbstractControl): ValidationErrors | null {
    const hasNumber = /\d/.test(control.value || '');
    return hasNumber ? null : { numberRequired: true };
  }

  static lettersOnly(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    const regex = /^[a-zA-Z\s]+$/;

    if (value && !regex.test(value)) return { lettersOnly: true };

    return null;
  }
}
