import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../_shared/auth';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {

  email = '';
  password = '';
  errorMsg = '';

  constructor(private auth: Auth, private router: Router) {}

  onLogin() {
    const email = this.email.trim();
    const password = this.password.trim();

    this.auth.login(email, password).subscribe(res => {
      if (res) {
        this.router.navigateByUrl('/patient');
      } else {
        this.errorMsg = 'Invalid email or password';
      }
    });
  }
}