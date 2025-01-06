import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface DoctorService {
  id: number;
  doctor_name?: string;
  title: string;
  price: number;
  duration: number;
  description: string;
  service_id: number;
}

export interface ServiceTemplate {
  template_id: number;
  name: string;
  default_duration: number;
  default_price: number;
  default_description: string;
}

export interface TemplateName {
  template_id: number;
  name: string;
}

interface GetResponse {
  data: DoctorService[];
}

interface MessageResponse {
  message: string;
}

interface ResnponseServiceTemplates {
  data: {
    count: number;
    documents: ServiceTemplate[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class DoctorServicesService {
  services$ = new BehaviorSubject<DoctorService[]>([]);
  templates$ = new BehaviorSubject<ServiceTemplate[]>([]);

  constructor(private http: HttpClient) {}

  public getServices() {
    return this.services$;
  }

  public getTemplates() {
    return this.templates$;
  }

  public loadSerivcesByDoctorId(id: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
    });

    const url = `${environment.API_URL}/services/doctor/${id}`;

    return this.http.get<GetResponse>(url, { headers }).pipe(
      tap((resposne) => {
        this.services$.next(resposne.data);
      })
    );
  }

  public loadServiceById(id: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
    });

    const url = `${environment.API_URL}/services/${id}`;

    return this.http.get<{ data: DoctorService }>(url, { headers }).pipe(
      tap((response) => {
        this.services$.next([response.data]);
      })
    );
  }

  public editService(serviceData: DoctorService, id: number | null = null) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
    });

    const url = `${environment.API_URL}/services/form${id ? '/' + id : ''}`;

    return this.http.post<MessageResponse>(url, serviceData, { headers });
  }

  public loadServiceTemplates() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
    });

    const url = `${environment.API_URL}/service-templates`;

    return this.http.get<ResnponseServiceTemplates>(url, { headers }).pipe(
      tap((response) => {
        this.templates$.next(response.data.documents);
      })
    );
  }

  public loadTemplatesNames() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
    });

    const url = `${environment.API_URL}/service-templates/names`;

    return this.http.get<{ data: TemplateName[] }>(url, { headers });
  }

  public loadTemplateById(id: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
    });

    const url = `${environment.API_URL}/service-templates/${id}`;

    return this.http.get<{ data: ServiceTemplate }>(url, { headers });
  }

  public deleteService(id: number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('jwt_token')}`,
    });

    const url = `${environment.API_URL}/services`;

    return this.http
      .delete<MessageResponse>(url, { headers, body: { id } })
      .pipe(
        tap(() => {
          const currentServices = this.services$.getValue();
          const updatedServices = currentServices.filter(
            (service) => service.id !== id
          );
          this.services$.next(updatedServices);
        })
      );
  }
}
