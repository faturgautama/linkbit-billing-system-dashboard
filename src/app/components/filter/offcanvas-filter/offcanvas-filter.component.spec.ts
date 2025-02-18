import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffcanvasFilterComponent } from './offcanvas-filter.component';

describe('OffcanvasFilterComponent', () => {
  let component: OffcanvasFilterComponent;
  let fixture: ComponentFixture<OffcanvasFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ OffcanvasFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffcanvasFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
