import { Component, inject } from '@angular/core';
import { Master } from '../../_shared/master';
import { PatientModel } from '../../model/PatientModel';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-patientlist',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule
  ],
  templateUrl: './patientlist.html',
  styleUrl: './patientlist.css',
})
export class Patientlist {

  title = 'Patient List';

  service = inject(Master);
  router = inject(Router);

  patientList: PatientModel[] = [];

  displayColums = [
    'patientId',
    'patientName',
    'gender',
    'age',
    'mobileNumber',
    'address',
    'action'
  ];

  datasource = new MatTableDataSource<PatientModel>([]);

 ngOnInit() {
  this.getPatients();

  this.datasource.filterPredicate = (data: PatientModel, filter: string) => {
    const searchText = filter.toLowerCase();

    return (
      data.patientId?.toString().toLowerCase().includes(searchText) ||
      data.patientName?.toLowerCase().includes(searchText) ||
      data.gender?.toLowerCase().includes(searchText) ||
      data.age?.toString().includes(searchText) ||
      data.mobileNumber?.toString().includes(searchText) ||
      data.address?.toLowerCase().includes(searchText)
    );
    
  };
}

  // =========================
  // 🔥 GET + SORT (LATEST FIRST)
  // =========================
  getPatients() {
    this.service.getAllPatient().subscribe(data => {

      // 🔥 latest first
      const sortedData = data.slice().reverse();

      this.patientList = sortedData;
      this.datasource.data = sortedData;

      this.datasource.data = sortedData;
    this.datasource.filter = ''; // reset filter
    });
  }

  // =========================
  // NAVIGATION
  // =========================
  addPatient() {
    this.router.navigateByUrl('/addpatient');
  }

  editPatient(id: string) {
    this.router.navigateByUrl('/editpatient/' + id);
  }

  viewPatient(id: string) {
    this.router.navigateByUrl('/viewpatient/' + id);
  }

  deletePatient(id: string) {
    if (confirm('Are you sure to delete?')) {
      this.service.deletePatient(id).subscribe(() => {
        alert('Patient Remove Successfully');
        this.getPatients(); // 🔥 reload with latest order
      });
    }
  }

  // =========================
  // EXCEL DOWNLOAD
  // =========================
  downloadExcel(data: any[]) {

    const filteredData = data.map(item => ({
      Branch: item.branch,
      Patient_ID: item.patientId,
      Patient_Name: item.patientName,
      Age: item.age,
      Mobile_Number: item.mobileNumber,

      // 🔥 hidden fields (UIல இல்லை)
      Treatment_Done: item.treatment?.map((t: any) => t.treatmentDone).join(', ') || '',
      Prescription: item.treatment?.map((t: any) => t.prescription).join(', ') || ''
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);

    // 🔥 header bold
    const headers = Object.keys(filteredData[0]);
    headers.forEach((_, index) => {
      const cell = XLSX.utils.encode_cell({ r: 0, c: index });
      if (worksheet[cell]) {
        worksheet[cell].s = { font: { bold: true } };
      }
    });

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Patients': worksheet },
      SheetNames: ['Patients']
    };

    const buffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    saveAs(blob, 'patient-list.xlsx');
  }

  applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.datasource.filter = filterValue.trim().toLowerCase();
}
}