import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  @Input() avatar: string | null = null;
  @Input() name: string = 'U';
  @Input() size: number = 42;
  @Input() font: number = 18;
}
