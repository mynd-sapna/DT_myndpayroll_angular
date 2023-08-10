import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportCompanyComponent } from './import-company.component';

describe('ImportCompanyComponent', () => {
  let component: ImportCompanyComponent;
  let fixture: ComponentFixture<ImportCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportCompanyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
