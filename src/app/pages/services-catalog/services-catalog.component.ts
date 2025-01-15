import { Component, OnInit } from '@angular/core';
import { FiltersComponent } from '../../components/filters/filters.component';
import {
  DoctorService,
  DoctorServicesService,
} from '../../services/doctor-services/doctor-services.service';
import { Observable, take } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ServiceCardComponent } from '../../components/service-card/service-card.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CustomPaginationDirective } from '../../directives/custom-pagination/custom-pagination.directive';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-services-catalog',
  standalone: true,
  imports: [
    FiltersComponent,
    AsyncPipe,
    ServiceCardComponent,
    MatPaginatorModule,
    CustomPaginationDirective,
  ],
  templateUrl: './services-catalog.component.html',
  styleUrl: './services-catalog.component.scss',
})
export class ServicesCatalogComponent implements OnInit {
  services$ = new Observable<DoctorService[]>();
  totalServices$ = new Observable<number>();
  currentPage = 0;
  pageSize = 10;

  constructor(
    private doctorService: DoctorServicesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.services$ = this.doctorService.getServices();
    this.totalServices$ = this.doctorService.getCount();

    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      this.currentPage = params['page'] ?? 1;
    });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.currentPage + 1, perPage: this.pageSize },
      queryParamsHandling: 'merge',
    });

    this.loadServices();
  }

  private loadServices(extraParams: { [key: string]: any } = {}): void {
    const queryParamsObject = {
      ...this.route.snapshot.queryParams,
      ...extraParams,
      page: this.currentPage + 1,
      perPage: this.pageSize,
    };

    const queryParams = new HttpParams({ fromObject: queryParamsObject });

    this.doctorService.loadServices(queryParams).subscribe();
  }
}
