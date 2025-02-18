import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetupRoleComponent } from './setup-role.component';

describe('SetupRoleComponent', () => {
  let component: SetupRoleComponent;
  let fixture: ComponentFixture<SetupRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupRoleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SetupRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
