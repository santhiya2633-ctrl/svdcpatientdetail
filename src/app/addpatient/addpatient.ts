import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Master } from '../_shared/master';
import { PatientModel, TreatmentDetails } from '../model/PatientModel';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-addpatient',
  standalone: true,
  imports: [ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule,
    MatButtonModule, MatIconModule
  ],
  templateUrl: './addpatient.html',
  styleUrl: './addpatient.css',
})
export class Addpatient {
  builder = inject(FormBuilder);
  service = inject(Master);
  router = inject(Router);
  _actroute = inject(ActivatedRoute);
  title = 'Add Patient Details';
  isedit = false;
  editdata!: PatientModel;
  ngOnInit() {
    let editId = this._actroute.snapshot.paramMap.get('id');
    if (editId != null) {
      this.isedit = true;
      this.title = 'Edit Patient Details';
      this.setEditData(editId);
    }

  }
  setEditData(id: string) {
    this.service.getPatient(id).subscribe((item: PatientModel) => {
      this.editdata = item;
      if (this.editdata.treatment.length > 0) {
        this.editdata.treatment.forEach(item => {
          this.updateTreatmentHistory(item);
        })
      }
      this._form.setValue({
        id: this.editdata.id,
        branch: this.editdata.branch,
        patientId: this.editdata.patientId,
        patientName: this.editdata.patientName,
        gender: this.editdata.gender,
        mobileNumber: this.editdata.mobileNumber,
        address: this.editdata.address,
        age: this.editdata.age,
        treatment: []
      })
    })
    
  }
  get treatmentHistory() {
    return this._form.get('treatment') as FormArray;
  }

  addTreatmentHistory() {
    this.treatmentHistory.push(
      this.builder.group({
        date: this.builder.control(''),
        chiefComplaint: this.builder.control(''),
        dentalHistory: this.builder.control(''),
        medicalHistory: this.builder.control(''),
        habits: this.builder.control(''),
        allergy: this.builder.control(''),
        onExamination: this.builder.control(''),
        isXray: this.builder.control(''),
        diagnosis: this.builder.control(''),
        treatmentAdvised: this.builder.control(''),
        patientRemark: this.builder.control(''),
        treatmentDone: this.builder.control(''),
        prescription: this.builder.control(''),
        payment: this.builder.control(''),
      })
    )
  }
  updateTreatmentHistory(data: TreatmentDetails) {
    this.treatmentHistory.push(
      this.builder.group({
        date: this.builder.control(data.date),
        chiefComplaint: this.builder.control(data.chiefComplaint),
        dentalHistory: this.builder.control(data.dentalHistory),
        medicalHistory: this.builder.control(data.medicalHistory),
        habits: this.builder.control(data.habits),
        allergy: this.builder.control(data.allergy),
        onExamination: this.builder.control(data.onExamination),
        isXray: this.builder.control(data.isXray),
        diagnosis: this.builder.control(data.diagnosis),
        treatmentAdvised: this.builder.control(data.treatmentAdvised),
        patientRemark: this.builder.control(data.patientRemark),
        treatmentDone: this.builder.control(data.treatmentDone),
        prescription: this.builder.control(data.prescription),
        payment: this.builder.control(data.payment),
      })
    )
  }
  _form = this.builder.group({

    id: this.builder.control({ value: '', disabled: true }),
    branch: this.builder.control(''),
    patientId: this.builder.control(''),
    patientName: this.builder.control(''),
    age: this.builder.control(''),
    gender: this.builder.control(''),
    mobileNumber: this.builder.control(''),
    address: this.builder.control(''),
    treatment: this.builder.array([])
  })

  savePatient() {
    console.log('adfasd' + this._form)
    if (this._form.valid && !this.editdata?.id) {
      let _obj = this._form.value as unknown as PatientModel;
      if (confirm('Are you sure to add patient?')) {
        this.service.savePatient(_obj).subscribe(item => {
          alert('Patient Details are Saved Successfully');
          this.router.navigateByUrl('/patient');
        });
      }

    } else if (this._form.valid && this.editdata?.id) {
      let _obj = this._form.value as unknown as PatientModel;
      if(confirm('Are you sure you want to update the patient details?')){
  this.service.updatePatient(_obj, this.editdata.id).subscribe(item => {
        alert('Patient Details are Updated Successfully');
        this.router.navigateByUrl('/patient');
      });
      }
    
    } 
  }
goBack() {
    this.router.navigateByUrl('/patient');
  }
  removePatient(index: number) {
    this.treatmentHistory.removeAt(index)
  }
}
