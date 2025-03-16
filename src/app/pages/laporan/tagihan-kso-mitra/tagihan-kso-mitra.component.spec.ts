import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagihanKsoMitraComponent } from './tagihan-kso-mitra.component';

describe('TagihanKsoMitraComponent', () => {
  let component: TagihanKsoMitraComponent;
  let fixture: ComponentFixture<TagihanKsoMitraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagihanKsoMitraComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TagihanKsoMitraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
