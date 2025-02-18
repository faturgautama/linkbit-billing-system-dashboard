import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPilihPasienForDokumenComponent } from './form-pilih-pasien-for-dokumen.component';

describe('FormPilihPasienForDokumenComponent', () => {
  let component: FormPilihPasienForDokumenComponent;
  let fixture: ComponentFixture<FormPilihPasienForDokumenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPilihPasienForDokumenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormPilihPasienForDokumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
