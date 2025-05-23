import { Component, OnInit } from '@angular/core';
import { ActiveAccount } from '../../core/shared/Models/ActiveAccount';
import { ActivatedRoute, Router } from '@angular/router';
import { IdentityService } from '../identity.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-active',
  standalone: false,
  templateUrl: './active.component.html',
  styleUrl: './active.component.scss',
})
export class ActiveComponent implements OnInit {
  activeParam: ActiveAccount = new ActiveAccount();
  isLoading: boolean = true;
  activationStatus: 'loading' | 'success' | 'error' = 'loading';

  constructor(
    private route: ActivatedRoute,
    private identityService: IdentityService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe({
      next: (params) => {
        if (!params['email'] || !params['code']) {
          this.activationStatus = 'error';
          this.isLoading = false;
          this.toastr.error('Invalid activation link', 'ERROR');
          setTimeout(() => {
            this.router.navigate(['/account/register']);
          }, 2000);
          return;
        }

        this.activeParam.email = params['email'];
        this.activeParam.token = params['code'];
        this.activateAccount();
      },
      error: (err) => {
        console.error('Error reading URL parameters:', err);
        this.activationStatus = 'error';
        this.isLoading = false;
        this.toastr.error('Invalid activation link', 'ERROR');
        setTimeout(() => {
          this.router.navigate(['/account/register']);
        }, 2000);
      }
    });
  }

  private activateAccount(): void {
    this.isLoading = true;
    this.activationStatus = 'loading';

    this.identityService.ActiveAccount(this.activeParam).subscribe({
      next: (res) => {
        console.log('Activation response:', res);
        this.activationStatus = 'success';
        // Clear any existing toasts before showing new one
        this.toastr.clear();
        this.toastr.success('Account activated successfully', 'SUCCESS');
        setTimeout(() => {
          this.router.navigate(['/account/register']);
        }, 2000);
      },
      error: (err) => {
        console.error('Activation error:', err);
        this.activationStatus = 'error';
        // Clear any existing toasts before showing new one
        this.toastr.clear();
        // this.toastr.error('Your account is not active, token is expired', 'ERROR');
        setTimeout(() => {
          this.router.navigate(['/account/register']);
        }, 2000);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
