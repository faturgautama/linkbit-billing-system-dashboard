import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelFilterComponent } from './panel-filter.component';

describe('PanelFilterComponent', () => {
  let component: PanelFilterComponent;
  let fixture: ComponentFixture<PanelFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanelFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PanelFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
