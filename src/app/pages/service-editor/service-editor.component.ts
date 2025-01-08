import { Component, inject, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  DoctorService,
  DoctorServicesService,
  ServiceTemplate,
} from '../../services/doctor-services/doctor-services.service';
import { Observable, of, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe, NgFor } from '@angular/common';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-service-editor',
  standalone: true,
  imports: [
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    NgFor,
  ],
  templateUrl: './service-editor.component.html',
  styleUrl: './service-editor.component.scss',
})
export class ServiceEditorComponent implements OnInit {
  private _snackBar = inject(MatSnackBar);

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  form!: FormGroup;

  serviceId: number | null = null;
  isEditMode: boolean = false;

  templates$ = new Observable<ServiceTemplate[]>();
  selectedTemplate?: ServiceTemplate;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private doctorService: DoctorServicesService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.templates$ = this.doctorService.getTemplates();

    this.route.params
      .pipe(
        tap((params) => {
          this.serviceId = params['id'] ? parseInt(params['id'], 10) : null;
          this.isEditMode = !!this.serviceId;
        }),
        switchMap(() => {
          if (this.isEditMode && this.serviceId) {
            return this.doctorService.loadServiceById(this.serviceId).pipe(
              tap((response) => {
                this.populateForm(response.data);
              })
            );
          }
          return of(null);
        }),
        switchMap(() => this.doctorService.loadServiceTemplates())
      )
      .subscribe({
        next: () => console.log('Data loaded successfully'),
        error: (err) => console.error('Error loading data:', err),
      });

    this.form.get('service_id')?.valueChanges.subscribe((templateId) => {
      if (!this.isEditMode && templateId) {
        this.doctorService
          .loadTemplateById(templateId)
          .subscribe((response) => {
            this.selectedTemplate = response.data;
            // this.updateFormWithTemplate(response.data);
          });
      }
    });
  }

  openSnackBar() {
    this._snackBar.open(
      `Service successfully ${this.serviceId ? 'updated' : 'created'}!`,
      'Close',
      {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      }
    );
  }

  initializeForm(): void {
    this.form = new FormGroup({
      service_id: new FormControl<number | null>(null, Validators.required),
      custom_price: new FormControl<number | null>(null, [Validators.min(0)]),
      custom_duration: new FormControl<number | null>(null, [
        Validators.min(0),
      ]),
      custom_description: new FormControl<string | null>(null),
    });
  }

  populateForm(service: DoctorService): void {
    this.form.patchValue({
      service_id: service.service_id,
      custom_price: service.price,
      custom_duration: service.duration,
      custom_description: service.description,
    });
  }

  updateFormWithTemplate(template: ServiceTemplate): void {
    this.form.patchValue({
      custom_price: template.default_price,
      custom_duration: template.default_duration,
      custom_description: template.default_description,
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      console.error('Form is invalid');
      return;
    }

    const serviceData: DoctorService = {
      ...this.form.value,
    };

    this.doctorService
      .editService(serviceData, this.serviceId)
      .pipe(
        tap(() => {
          this.openSnackBar();
          this.router.navigate(['/your-services']);
        })
      )
      .subscribe();
  }
}
