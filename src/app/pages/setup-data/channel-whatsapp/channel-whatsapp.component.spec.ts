import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelWhatsappComponent } from './channel-whatsapp.component';

describe('ChannelWhatsappComponent', () => {
  let component: ChannelWhatsappComponent;
  let fixture: ComponentFixture<ChannelWhatsappComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelWhatsappComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChannelWhatsappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
