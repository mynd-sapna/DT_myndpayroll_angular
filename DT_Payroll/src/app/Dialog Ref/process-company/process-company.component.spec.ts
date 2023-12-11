import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessCompanyComponent } from './process-company.component';

describe('ProcessCompanyComponent', () => {
  let component: ProcessCompanyComponent;
  let fixture: ComponentFixture<ProcessCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessCompanyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
