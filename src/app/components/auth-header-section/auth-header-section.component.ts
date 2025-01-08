import { Component, HostListener, OnInit } from '@angular/core';
import { AvatarComponent } from '../avatar/avatar.component';
import { Router, RouterLink } from '@angular/router';
import { UserProfile, UserService } from '../../services/user/user.service';
import { Observable } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../services/auth/auth.service';

interface PageLink {
  id: number;
  title: string;
  icon: string;
  path: string;
  role_id: number[];
}

@Component({
  selector: 'app-auth-header-section',
  standalone: true,
  imports: [AvatarComponent, RouterLink, AsyncPipe, MatIcon, NgClass],
  templateUrl: './auth-header-section.component.html',
  styleUrl: './auth-header-section.component.scss',
})
export class AuthHeaderSectionComponent implements OnInit {
  user$!: Observable<UserProfile | null>;
  isMenuOpen: boolean = false;
  pagesList: PageLink[] = [
    {
      id: 1,
      title: 'My profile',
      icon: 'person',
      path: '/profile',
      role_id: [1, 2],
    },
    {
      id: 2,
      title: 'My services',
      icon: 'folder',
      path: '/your-services',
      role_id: [1],
    },
    {
      id: 3,
      title: 'My favorites',
      icon: 'favorite',
      path: '/profile',
      role_id: [2],
    },
  ];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user$ = this.userService.getUser();
    this.userService.ensureUserLoaded().subscribe();
  }

  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  closeMenu(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu')) {
      this.isMenuOpen = false;
    }
  }

  onDelete(): void {
    this.authService.logout();
    this.userService.clearUser();
    this.user$ = this.userService.getUser();
    this.router.navigate(['/']);
  }
}
