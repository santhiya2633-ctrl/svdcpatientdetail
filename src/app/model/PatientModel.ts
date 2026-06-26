export interface PatientModel {
    id:string,
    branch: string,
    patientId: string,
    patientName: string,
    age: string,
    gender: string,
    mobileNumber: string,
    address: string,
    
    treatment: TreatmentDetails[]
}

export interface TreatmentDetails{
    date: string,
    chiefComplaint:string,
    dentalHistory: string,
    medicalHistory: string,
    onExamination: string,
    isXray: string,
    diagnosis: string,
    treatmentAdvised: string,
    patientRemark: string,
    treatmentDone: string,
    prescription: string,
    payment: string,
    habits: string,
    allergy: string
}