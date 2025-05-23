import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ResetPassword } from '../../core/shared/Models/ResetPassword';
import { ActivatedRoute, Router } from '@angular/router';
import { IdentityService } from '../identity.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit {
  FormGroup: FormGroup;
  ResetValue: ResetPassword = new ResetPassword();
  isLoading: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private identityService: IdentityService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Get parameters from URL
    this.route.queryParams.subscribe((params) => {
      const email = params['email'];
      const code = params['code'];

      if (!email || !code) {
        this.toastr.error('Invalid reset link. Please request a new password reset.', 'ERROR');
        this.router.navigate(['/account/login']);
        return;
      }

      // Decode the email and code if they are URL encoded
      this.ResetValue.email = decodeURIComponent(email);
      this.ResetValue.token = decodeURIComponent(code);

      console.log('Email:', this.ResetValue.email);
      console.log('Code:', this.ResetValue.token);
    });
    this.FormValidation();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  FormValidation() {
    this.FormGroup = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.PasswordMatchValidation,
      }
    );
  }

  get _password() {
    return this.FormGroup.get('password');
  }

  get _confirmPassword() {
    return this.FormGroup.get('confirmPassword');
  }

  PasswordMatchValidation(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }

  Submit() {
    if (this.FormGroup.valid) {
      this.isLoading = true;
      this.ResetValue.password = this.FormGroup.get('password')?.value;

      if (!this.ResetValue.email || !this.ResetValue.token) {
        this.toastr.error('Invalid reset link. Please request a new password reset.', 'ERROR');
        this.isLoading = false;
        return;
      }

      this.identityService.ResetPassword(this.ResetValue).subscribe({
        next: (response) => {
          console.log('Password reset successful:', response);
          this.toastr.success('Password reset successful', 'SUCCESS');
          setTimeout(() => {
            this.router.navigate(['/account/login']);
          }, 2000);
        },
        error: (error) => {
          console.error('Password reset failed:', error);
          if (error.status === 400) {
            this.toastr.error('Invalid reset link or password requirements not met', 'ERROR');
          } else {
            this.toastr.error('Password reset failed. Please try again.', 'ERROR');
          }
          this.isLoading = false;
        }
      });
    } else {
      this.toastr.error('Please fill in all fields correctly', 'ERROR');
    }
  }
}
