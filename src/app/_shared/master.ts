import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PatientModel } from '../model/PatientModel';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Master {

  // ✅ base URL should be STRING (not http call)
  baseUrl = `${environment.apiUrl}/patients`;

  constructor(private http: HttpClient) {}

  // ➕ Create
  savePatient(data: PatientModel) {
    return this.http.post(this.baseUrl, data);
  }

  // ✏️ Update
  updatePatient(data: PatientModel, id: string) {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  // ❌ Delete
  deletePatient(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // 📄 Get all
  getAllPatient() {
    return this.http.get<PatientModel[]>(this.baseUrl);
  }

  // 🔍 Get one
  getPatient(id: string) {
    return this.http.get<PatientModel>(`${this.baseUrl}/${id}`);
  }
}