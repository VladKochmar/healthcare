import { Component } from '@angular/core';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { RouterLink } from '@angular/router';
import { AuthHeaderSectionComponent } from '../auth-header-section/auth-header-section.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SearchBarComponent, AuthHeaderSectionComponent, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {}
