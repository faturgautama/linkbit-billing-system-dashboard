import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailTagihanComponent } from './detail-tagihan.component';

describe('DetailTagihanComponent', () => {
  let component: DetailTagihanComponent;
  let fixture: ComponentFixture<DetailTagihanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailTagihanComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailTagihanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
