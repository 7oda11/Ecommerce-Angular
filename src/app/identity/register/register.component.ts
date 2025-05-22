import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IdentityService } from '../identity.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  formGroup: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private identityService: IdentityService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.FormValidation();
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  FormValidation() {
    this.formGroup = this.fb.group({
      UserName: ['', [Validators.required, Validators.minLength(6)]],
      Email: ['', [Validators.required, Validators.email]],
      DisplayName: ['', [Validators.required]],
      Password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[0-9])(?=.*[#$@!.\-])[A-Za-z\d#$@!.\-]{8,}$/),
        ],
      ],
    });
  }
  get _UserName() {
    return this.formGroup.get('UserName');
  }
  get _Email() {
    return this.formGroup.get('Email');
  }
  get _DisplayName() {
    return this.formGroup.get('DisplayName');
  }
  get _Password() {
    return this.formGroup.get('Password');
  }
  Submit() {
    if (this.formGroup.valid) {
      this.identityService.Register(this.formGroup.value).subscribe({
        next: () => {
          console.log('Register Success');
          this.toastr.success('Register Success ,please confirm your email',"SUCCESS");
        },
        error: (error:any) => {
          this.toastr.error(error.error.message,"ERROR");
        },
      });
    }
  }
}
