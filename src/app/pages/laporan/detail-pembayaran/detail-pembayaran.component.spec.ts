import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPembayaranComponent } from './detail-pembayaran.component';

describe('DetailPembayaranComponent', () => {
  let component: DetailPembayaranComponent;
  let fixture: ComponentFixture<DetailPembayaranComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailPembayaranComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailPembayaranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
