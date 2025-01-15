import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesCatalogComponent } from './services-catalog.component';

describe('ServicesCatalogComponent', () => {
  let component: ServicesCatalogComponent;
  let fixture: ComponentFixture<ServicesCatalogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesCatalogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
