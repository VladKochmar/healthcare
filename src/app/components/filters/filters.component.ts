import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  DoctorServicesService,
  ServiceTemplate,
} from '../../services/doctor-services/doctor-services.service';
import { debounceTime, Observable, take, takeUntil, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ClearObservable } from '../../directives/clear-observable/clear-observable.directive';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    AsyncPipe,
  ],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
})
export class FiltersComponent extends ClearObservable implements OnInit {
  templates$: Observable<ServiceTemplate[]> = new Observable();
  filtersForm!: FormGroup;

  constructor(
    private doctorService: DoctorServicesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.templates$ = this.doctorService.getTemplates();

    this.initForm();

    this.route.queryParams
      .pipe(
        take(1),
        tap((params) => {
          const filters = this.parseQueryParams(params);
          this.filtersForm.patchValue(filters, { emitEvent: false });
        })
      )
      .subscribe((params) => {
        const queryParams = this.buildQueryParams(this.filtersForm.value);
        if (params['page']) queryParams['page'] = params['page'];
        queryParams['perPage'] = '10';
        const httpParams = new HttpParams({ fromObject: queryParams });
        this.doctorService.loadServices(httpParams).subscribe();
      });

    this.listenToFormChanges();
    this.loadQueryParams();

    this.doctorService
      .loadServiceTemplates()
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  initForm(): void {
    this.filtersForm = new FormGroup({
      price: new FormGroup({
        min: new FormControl(10, [Validators.min(0)]),
        max: new FormControl(2000, [Validators.min(0)]),
      }),
      duration: new FormGroup({
        min: new FormControl(5, [Validators.min(0)]),
        max: new FormControl(120, [Validators.min(0)]),
      }),
      selectedTemplates: new FormControl<number[]>([]),
      sort: new FormControl<string | null>(null),
    });
  }

  private listenToFormChanges(): void {
    this.filtersForm.valueChanges
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((filters) => {
        const queryParams = this.buildQueryParams(filters);
        queryParams['page'] = '1';
        queryParams['perPage'] = '10';

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams,
          queryParamsHandling: 'merge',
        });

        const httpParams = new HttpParams({
          fromObject: queryParams,
        });

        this.doctorService
          .loadServices(httpParams)
          .pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }

  private loadQueryParams(): void {
    this.route.queryParams.subscribe((params) => {
      const filters = this.parseQueryParams(params);
      this.filtersForm.patchValue(filters, { emitEvent: false });
    });
  }

  private buildQueryParams(filters: any): { [key: string]: string | string[] } {
    const params: { [key: string]: string | string[] } = {};

    const priceParams: string[] = [];
    if (filters.price.min) priceParams.push(`gte:${filters.price.min}`);
    if (filters.price.max) priceParams.push(`lte:${filters.price.max}`);
    if (priceParams.length) params['custom_price'] = priceParams;

    const durationParams: string[] = [];
    if (filters.duration.min)
      durationParams.push(`gte:${filters.duration.min}`);
    if (filters.duration.max)
      durationParams.push(`lte:${filters.duration.max}`);
    if (durationParams.length) params['custom_duration'] = durationParams;

    if (filters.selectedTemplates.length > 0) {
      params['service_id'] = filters.selectedTemplates.join(',');
    } else {
      params['service_id'] = '';
    }

    if (filters.sort) params['sort'] = filters.sort;

    return params;
  }

  private parseQueryParams(params: any): any {
    const priceParams = params['custom_price'] || [];
    const durationParams = params['custom_duration'] || [];

    return {
      price: {
        min:
          priceParams
            .find((p: string) => p.startsWith('gte:'))
            ?.split(':')[1] || null,
        max:
          priceParams
            .find((p: string) => p.startsWith('lte:'))
            ?.split(':')[1] || null,
      },
      duration: {
        min:
          durationParams
            .find((d: string) => d.startsWith('gte:'))
            ?.split(':')[1] || null,
        max:
          durationParams
            .find((d: string) => d.startsWith('lte:'))
            ?.split(':')[1] || null,
      },
      selectedTemplates: params['service_id']
        ? params['service_id'].split(',').map(Number)
        : [],
      sort: params['sort'] || '',
    };
  }
}
