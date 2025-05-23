import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IdentityService } from '../identity.service';
import { ToastrService } from 'ngx-toastr';
declare var bootstrap: any;

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  forgetPasswordForm: FormGroup;
  showPassword: boolean = false;
  isLoading: boolean = false;
  showForgetPasswordModal: boolean = false;
  EmailModel: string = '';

  constructor(
    private fb: FormBuilder,
    private identityService: IdentityService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  openForgetPasswordModal() {
    this.showForgetPasswordModal = true;
  }

  closeForgetPasswordModal() {
    this.showForgetPasswordModal = false;
    this.forgetPasswordForm.reset();
  }

  SendEmailForgetPassword() {
    if (!this.EmailModel) {
      this.toastr.error('Please enter your email address', 'ERROR');
      return;
    }

    this.identityService.ForgetPassword(this.EmailModel).subscribe({
      next: (response) => {
        console.log('Email sent successfully:', response);
        this.toastr.success('Please check your email for password reset instructions', 'SUCCESS');
        // Close the modal
        const modalElement = document.getElementById('exampleModal');
        if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();
          }
        }
        this.EmailModel = ''; // Clear the email input
      },
      error: (error) => {
        console.error('Email sending failed:', error);
        this.toastr.error('Failed to send reset email. Please try again.', 'ERROR');
      }
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.identityService.Login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.toastr.success('Login successful', 'SUCCESS');
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.toastr.error('Invalid email or password', 'ERROR');
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    } else {
      this.toastr.error('Please fill in all required fields correctly', 'ERROR');
    }
  }
}
