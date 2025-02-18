import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupUserHotelComponent } from './setup-user-hotel.component';

describe('SetupUserHotelComponent', () => {
  let component: SetupUserHotelComponent;
  let fixture: ComponentFixture<SetupUserHotelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupUserHotelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetupUserHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
