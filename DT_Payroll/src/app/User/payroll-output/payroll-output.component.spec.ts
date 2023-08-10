import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollOutputComponent } from './payroll-output.component';

describe('OutputComponent', () => {
  let component: PayrollOutputComponent;
  let fixture: ComponentFixture<PayrollOutputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollOutputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
