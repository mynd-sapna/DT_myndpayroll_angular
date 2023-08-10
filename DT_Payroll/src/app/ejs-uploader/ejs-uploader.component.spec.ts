import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjsUploaderComponent } from './ejs-uploader.component';

describe('EjsUploaderComponent', () => {
  let component: EjsUploaderComponent;
  let fixture: ComponentFixture<EjsUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EjsUploaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EjsUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
