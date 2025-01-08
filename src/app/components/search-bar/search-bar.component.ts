import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    NgClass,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent implements OnInit {
  form!: FormGroup;
  isOpened: boolean = false;

  ngOnInit(): void {
    this.form = new FormGroup({
      search: new FormControl<string>(''),
    });
  }

  switchMenu() {
    this.isOpened = !this.isOpened;
  }
}
