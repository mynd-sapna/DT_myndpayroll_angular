import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportCompanyComponent } from './export-company.component';

describe('ExportCompanyComponent', () => {
  let component: ExportCompanyComponent;
  let fixture: ComponentFixture<ExportCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportCompanyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
