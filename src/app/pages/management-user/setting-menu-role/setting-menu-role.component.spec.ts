import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingMenuRoleComponent } from './setting-menu-role.component';

describe('SettingMenuRoleComponent', () => {
  let component: SettingMenuRoleComponent;
  let fixture: ComponentFixture<SettingMenuRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingMenuRoleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SettingMenuRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
