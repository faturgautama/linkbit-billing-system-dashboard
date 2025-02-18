import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WildcardNotFoundComponent } from './wildcard-not-found.component';

describe('WildcardNotFoundComponent', () => {
  let component: WildcardNotFoundComponent;
  let fixture: ComponentFixture<WildcardNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ WildcardNotFoundComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WildcardNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
