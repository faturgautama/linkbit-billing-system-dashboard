import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RekapPembayaranComponent } from './rekap-pembayaran.component';

describe('RekapPembayaranComponent', () => {
  let component: RekapPembayaranComponent;
  let fixture: ComponentFixture<RekapPembayaranComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RekapPembayaranComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RekapPembayaranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
