import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceEditorComponent } from './service-editor.component';

describe('ServiceEditorComponent', () => {
  let component: ServiceEditorComponent;
  let fixture: ComponentFixture<ServiceEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
