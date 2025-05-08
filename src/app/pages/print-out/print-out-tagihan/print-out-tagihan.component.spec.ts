import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintOutTagihanComponent } from './print-out-tagihan.component';

describe('PrintOutTagihanComponent', () => {
  let component: PrintOutTagihanComponent;
  let fixture: ComponentFixture<PrintOutTagihanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintOutTagihanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrintOutTagihanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
