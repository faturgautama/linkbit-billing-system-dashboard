import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RekapPembayaranTahunanComponent } from './rekap-pembayaran-tahunan.component';

describe('RekapPembayaranTahunanComponent', () => {
  let component: RekapPembayaranTahunanComponent;
  let fixture: ComponentFixture<RekapPembayaranTahunanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RekapPembayaranTahunanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RekapPembayaranTahunanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
