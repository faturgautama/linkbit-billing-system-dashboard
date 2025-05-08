import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingPelangganProductComponent } from './setting-pelanggan-product.component';

describe('SettingPelangganProductComponent', () => {
  let component: SettingPelangganProductComponent;
  let fixture: ComponentFixture<SettingPelangganProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingPelangganProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SettingPelangganProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
