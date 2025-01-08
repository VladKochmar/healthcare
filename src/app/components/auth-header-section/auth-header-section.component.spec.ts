import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthHeaderSectionComponent } from './auth-header-section.component';

describe('AuthHeaderSectionComponent', () => {
  let component: AuthHeaderSectionComponent;
  let fixture: ComponentFixture<AuthHeaderSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthHeaderSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthHeaderSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
