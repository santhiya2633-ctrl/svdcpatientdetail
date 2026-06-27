import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Master } from '../_shared/master';
import { PatientModel } from '../model/PatientModel';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import jsPDF from 'jspdf';
@Component({
  selector: 'app-viewpatient',
  standalone: true,
  imports: [
    MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule,
    MatButtonModule, MatIconModule
  ],
  templateUrl: './viewpatient.html'
})
export class Viewpatient {
  cdr = inject(ChangeDetectorRef);
  route = inject(ActivatedRoute);
  router = inject(Router);
  service = inject(Master);
  editdata!: PatientModel;
  title = 'View Patient Details'
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.service.getPatient(id).subscribe((res: any) => {

          this.editdata = res;
          console.log(this.editdata)
          // ✅ THIS LINE FIXES NG0100
          this.cdr.detectChanges();

        });
      }
    });
  }
  goBack() {
    this.router.navigateByUrl('/patient');
  }
  getBase64ImageFromURL(url: string): Promise<string> {
    return fetch(url)
      .then(res => res.blob())
      .then(blob => new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      }));
  }

  async downloadPDF(data: any) {

    const doc = new jsPDF();
    let y = 20;
    const gap = 5;

    // =========================
    // LOAD LOGO (LOCAL ONLY)
    // =========================
    const getBase64ImageFromURL = async (url: string): Promise<string> => {
      const res = await fetch(url);
      const blob = await res.blob();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    };

    const logo = await getBase64ImageFromURL('assets/cliniclogo.png');

    // =========================
    // HEADER
    // =========================
    const addHeader = () => {

      // Logo
      doc.addImage(logo, 'PNG', 10, 8, 25, 25);

      // Clinic Name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Sai Visoka Dental Care', 40, 12);

      // Address
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('Opp. EB Office,', 40, 17);
      doc.text('Union Office Road,', 40, 21);
      doc.text('Valliyur - 627 117, Tamil Nadu.', 40, 25);

      // Doctor
      doc.setFont('helvetica', 'bold');
      doc.text('Dr. Sagar Muthuraj B.D.S. (Mumbai)', 40, 30);
      doc.text('Reg No. 42831', 40, 34);

      // Right side contact
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text('Mobile/Whatsapp: 9619895865', 140, 18);
      doc.text('Email: dr.sagarmuthuraj@gmail.com', 140, 23);

      // Line
      doc.line(10, 40, 200, 40);

      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('Patient Report'+'-'+data.patientId, 105, 48, { align: 'center' });

      // Date (RIGHT SIDE)
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');

      y = 60;
    };

    // =========================
    // FOOTER (MATCH IMAGE)
    // =========================
   const addFooter = (pageNumber: number) => {

  doc.setFontSize(9);

  // Top line
  doc.line(10, 280, 200, 280);

  // 🔹 Confidential text (small & center)
  doc.setFontSize(7);
  doc.text(
    'This document contains confidential patient information and is intended solely for clinical and legal record purpose',
    105,
    283,
    { align: 'center', maxWidth: 180 }
  );

  // 🔹 Main footer text (center)
  doc.setFontSize(9);
  doc.text(
    'Sai Visoka Dental Care - "We Care for your smile always!"',
    105,
    287,
    { align: 'center' }
  );

  // 🔹 Page number (right side)
  doc.text(
    `Page ${pageNumber}`,
    200,
    292,
    { align: 'right' }
  );

};

    // =========================
    // PAGE BREAK
    // =========================
    const checkPageBreak = () => {
      if (y > 270) {
        addFooter(doc.getNumberOfPages());
        doc.addPage();
        addHeader();
      }
    };

    addHeader();

    // =========================
    // GRID ROW
    // =========================
    const addGridRow = (
      l1: string, v1: string,
      l2: string, v2: string,
      l3: string, v3: string
    ) => {

      const draw = (label: string, value: string, x: number) => {
        const labelText = label + ': ';

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text(labelText, x, y);

        doc.setFont('helvetica', 'normal');
        doc.text(value || '', x + doc.getTextWidth(labelText) + gap, y);
      };

      checkPageBreak();

      draw(l1, v1, 10);
      draw(l2, v2, 75);
      draw(l3, v3, 140);

      y += 8;
    };

    const addFull = (label: string, value: string) => {

      const labelText = label + ': ';

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text(labelText, 10, y);

      doc.setFont('helvetica', 'normal');

      const labelWidth = doc.getTextWidth(labelText);
      const lines = doc.splitTextToSize(value || '', 180 - labelWidth);

      lines.forEach((line: string) => {
        checkPageBreak();
        doc.text(line, 10 + labelWidth + gap, y);
        y += 6;
      });

      y += 3;
    };

    // =========================
    // DATA
    // =========================
    addGridRow('Branch', data.branch, 'Patient Name', data.patientName, 'Age', data.age);
    addGridRow( 'Gender', data.gender, 'Mobile', data.mobileNumber,'Address', data.address);


    y += 3;

    // =========================
    // TREATMENT
    // =========================
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Treatment Details', 105, y, { align: 'center' });

    y += 8;

    data.treatment?.forEach((t: any, i: number) => {

      checkPageBreak();

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(`Treatment #${i + 1}`, 10, y);

      y += 6;

      const addLine = (label: string, value: string) => {

        const labelText = label + ': ';

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text(labelText, 10, y);

        doc.setFont('helvetica', 'normal');

        const labelWidth = doc.getTextWidth(labelText);
        const lines = doc.splitTextToSize(value || '', 180 - labelWidth);

        lines.forEach((line: string) => {
          checkPageBreak();
          doc.text(line, 10 + labelWidth + gap, y);
          y += 6;
        });

        y += 2;
      };

      addLine('Date', t.date);
      addLine('Chief Complaint', t.chiefComplaint);
      addLine('Dental History', t.dentalHistory);
      addLine('Medical History', t.medicalHistory);
      addLine('On Examination', t.onExamination);
      addLine('X-Ray', t.isXray);
      addLine('Diagnosis', t.diagnosis);
      addLine('Treatment Advised', t.treatmentAdvised);
      addLine('Patient Remark', t.patientRemark);
      addLine('Treatment Done', t.treatmentDone);
      addLine('Prescription', t.prescription);
      addLine('Payment', t.payment);

      y += 4;

      // doc.line(10, y, 200, y);
      // y += 8;
    });

    addFooter(doc.getNumberOfPages());

    doc.save(`patient-${data.patientId}.pdf`);
  }
}