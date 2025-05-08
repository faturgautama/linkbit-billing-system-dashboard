import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchOfficeComponent } from './branch-office.component';

describe('BranchOfficeComponent', () => {
  let component: BranchOfficeComponent;
  let fixture: ComponentFixture<BranchOfficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchOfficeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BranchOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
