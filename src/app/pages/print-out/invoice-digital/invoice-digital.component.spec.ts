import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceDigitalComponent } from './invoice-digital.component';

describe('InvoiceDigitalComponent', () => {
  let component: InvoiceDigitalComponent;
  let fixture: ComponentFixture<InvoiceDigitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceDigitalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvoiceDigitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
