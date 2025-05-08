import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintOutPosComponent } from './print-out-pos.component';

describe('PrintOutPosComponent', () => {
  let component: PrintOutPosComponent;
  let fixture: ComponentFixture<PrintOutPosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrintOutPosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrintOutPosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
