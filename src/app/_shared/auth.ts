import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Auth {
 apiUrl = `${environment.apiUrl}/users`;
  // private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(users => {

        const user = users.find(u =>
          u.email.trim() === email.trim() &&
          u.password.trim() === password.trim()
        );

        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          return true;
        }

        return false;
      })
    );
  }
}