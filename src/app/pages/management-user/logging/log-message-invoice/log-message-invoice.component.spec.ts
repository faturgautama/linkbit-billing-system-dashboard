import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogMessageInvoiceComponent } from './log-message-invoice.component';

describe('LogMessageInvoiceComponent', () => {
  let component: LogMessageInvoiceComponent;
  let fixture: ComponentFixture<LogMessageInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogMessageInvoiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LogMessageInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
