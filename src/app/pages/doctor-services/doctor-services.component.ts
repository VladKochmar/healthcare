import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ServiceCardComponent } from '../../components/service-card/service-card.component';
import { filter, Observable, of, switchMap } from 'rxjs';
import {
  DoctorService,
  DoctorServicesService,
} from '../../services/doctor-services/doctor-services.service';
import { UserProfile, UserService } from '../../services/user/user.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-doctor-services',
  standalone: true,
  imports: [MatButtonModule, ServiceCardComponent, AsyncPipe, NgIf, RouterLink],
  templateUrl: './doctor-services.component.html',
  styleUrl: './doctor-services.component.scss',
})
export class DoctorServicesComponent implements OnInit {
  user$ = new Observable<UserProfile | null>();
  services$ = new Observable<DoctorService[]>();

  constructor(
    private doctorService: DoctorServicesService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.user$ = this.userService.ensureUserLoaded();

    this.services$ = this.user$.pipe(
      filter((user) => user !== null),
      switchMap((user) => {
        this.doctorService.loadSerivcesByDoctorId(user.id).subscribe();
        return this.doctorService.getServices();
      })
    );
  }
}
