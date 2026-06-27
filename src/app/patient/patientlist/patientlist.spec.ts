import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Patientlist } from './patientlist';

describe('Patientlist', () => {
  let component: Patientlist;
  let fixture: ComponentFixture<Patientlist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Patientlist],
    }).compileComponents();

    fixture = TestBed.createComponent(Patientlist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
