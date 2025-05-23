import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ActiveAccount } from '../core/shared/Models/ActiveAccount';
import { ResetPassword } from '../core/shared/Models/ResetPassword';

@Injectable({
  providedIn: 'root',
})
export class IdentityService {
  baseUrl = environment.baseURL;
  constructor(private http: HttpClient) {}
  Register(form: any) {
    return this.http.post(this.baseUrl + 'Account/Register', form);
  }
  ActiveAccount(param: ActiveAccount) {
    return this.http.post(this.baseUrl + 'Account/active-account', param);
  }
  Login(form: any) {
    return this.http.post(this.baseUrl + 'Account/Login', form);
  }
  ForgetPassword(email: string) {
    return this.http.get(
      this.baseUrl + `Account/send-email-forget-password?email=${email}`
    );
  }
  ResetPassword(resetPassword: ResetPassword) {
    return this.http.post(this.baseUrl + 'Account/reset-password', {
      email: resetPassword.email,
      password: resetPassword.password,
      token: resetPassword.token
    });
  }
}
