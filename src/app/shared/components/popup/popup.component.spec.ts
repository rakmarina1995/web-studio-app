import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupServiceComponent } from './popup.component';

describe('PopupServiceComponent', () => {
  let component: PopupServiceComponent;
  let fixture: ComponentFixture<PopupServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupServiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
