import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  DoctorServicesService,
  DoctorService,
} from '../../services/doctor-services/doctor-services.service';
import { RouterLink } from '@angular/router';

type ViewerRole = 'viewer' | 'owner';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [MatButtonModule, RouterLink],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.scss',
})
export class ServiceCardComponent {
  @Input() role: ViewerRole = 'viewer';
  @Input() data!: DoctorService;

  constructor(private doctorService: DoctorServicesService) {}

  onDelete() {
    this.doctorService.deleteService(this.data.id).subscribe();
  }
}
