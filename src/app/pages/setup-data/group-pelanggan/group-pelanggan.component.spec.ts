import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupPelangganComponent } from './group-pelanggan.component';

describe('GroupPelangganComponent', () => {
  let component: GroupPelangganComponent;
  let fixture: ComponentFixture<GroupPelangganComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupPelangganComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupPelangganComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
