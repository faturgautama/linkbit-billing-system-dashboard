import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupUserDeviceComponent } from './setup-user-device.component';

describe('SetupUserDeviceComponent', () => {
  let component: SetupUserDeviceComponent;
  let fixture: ComponentFixture<SetupUserDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupUserDeviceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetupUserDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
