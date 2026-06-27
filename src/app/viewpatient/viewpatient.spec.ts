import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Viewpatient } from './viewpatient';

describe('Viewpatient', () => {
  let component: Viewpatient;
  let fixture: ComponentFixture<Viewpatient>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Viewpatient],
    }).compileComponents();

    fixture = TestBed.createComponent(Viewpatient);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
