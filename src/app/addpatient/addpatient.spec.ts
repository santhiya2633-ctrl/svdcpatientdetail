import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addpatient } from './addpatient';

describe('Addpatient', () => {
  let component: Addpatient;
  let fixture: ComponentFixture<Addpatient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Addpatient],
    }).compileComponents();

    fixture = TestBed.createComponent(Addpatient);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
