import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FogetPasswordComponent } from './foget-password-component';

describe('FogetPasswordComponent', () => {
  let component: FogetPasswordComponent;
  let fixture: ComponentFixture<FogetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FogetPasswordComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FogetPasswordComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
