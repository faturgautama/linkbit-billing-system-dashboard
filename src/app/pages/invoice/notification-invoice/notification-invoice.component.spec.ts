import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationInvoiceComponent } from './notification-invoice.component';

describe('NotificationInvoiceComponent', () => {
  let component: NotificationInvoiceComponent;
  let fixture: ComponentFixture<NotificationInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationInvoiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotificationInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
