import { Component, signal, inject, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { switchMap, of } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-2xl transform transition-all hover:scale-[1.01]">
        <div>
          <h1 class="text-center text-4xl font-extrabold text-indigo-600 tracking-tight">
            Daksha
          </h1>
          <h2 class="mt-4 text-center text-2xl font-bold text-gray-900">
            {{ isSignUp() ? 'Create your account' : 'Sign in to your account' }}
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            {{ isSignUp() ? 'Join us today! Enter your details below.' : 'Welcome back! Please enter your details.' }}
          </p>
        </div>

        <!-- Login Form -->
        <form *ngIf="!isSignUp()" class="mt-8 space-y-6" [formGroup]="loginForm" (ngSubmit)="onLogin()">
          <div class="space-y-4">
            <div>
              <label for="email-address" class="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input id="email-address" formControlName="email" type="email" autocomplete="email" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" placeholder="Enter your email">
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input id="password" formControlName="password" type="password" autocomplete="current-password" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" placeholder="Enter your password">
            </div>
          </div>

          <div *ngIf="error()" class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 text-center animate-pulse">
            {{ error() }}
          </div>
          <div *ngIf="successMessage()" class="bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg p-3 text-center animate-pulse">
            {{ successMessage() }}
          </div>

          <div>
            <button type="submit" [disabled]="loginForm.invalid || loading()" class="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed shadow-md transition-all duration-200 hover:shadow-lg">
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg *ngIf="!loading()" class="h-5 w-5 text-indigo-300 group-hover:text-indigo-200 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
                <svg *ngIf="loading()" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ loading() ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>
        </form>

        <!-- Sign Up Form -->
        <form *ngIf="isSignUp()" class="mt-8 space-y-6" [formGroup]="signUpForm" (ngSubmit)="onSignUp()">
          <div class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input id="name" formControlName="name" type="text" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" placeholder="Enter your full name">
            </div>
            <div>
              <label for="signup-email" class="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input id="signup-email" formControlName="email" type="email" autocomplete="email" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" placeholder="Enter your email">
            </div>
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input id="phone" formControlName="phone" type="tel" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" placeholder="Enter your phone number">
            </div>
            <div>
              <label for="signup-password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input id="signup-password" formControlName="password" type="password" required class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" placeholder="Create a password">
            </div>
            <div>
              <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Address <span class="text-gray-400 font-normal">(Optional)</span></label>
              <textarea id="address" formControlName="address" rows="2" class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" placeholder="Enter your address"></textarea>
            </div>
          </div>

          <div *ngIf="error()" class="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 text-center animate-pulse">
            {{ error() }}
          </div>

          <div>
            <button type="submit" [disabled]="signUpForm.invalid || loading()" class="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed shadow-md transition-all duration-200 hover:shadow-lg">
              <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg *ngIf="!loading()" class="h-5 w-5 text-indigo-300 group-hover:text-indigo-200 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
                <svg *ngIf="loading()" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ loading() ? 'Creating account...' : 'Sign up' }}
            </button>
          </div>
        </form>

        <div class="text-center mt-4">
          <button (click)="toggleMode()" class="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
            {{ toggleButtonText() }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  signUpForm: FormGroup;
  loading = signal(false);
  error = signal('');
  successMessage = signal('');
  isSignUp = signal(false);

  toggleButtonText = computed(() =>
    this.isSignUp() ? 'Already have an account? Sign in' : "Don't have an account? Sign up"
  );

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.signUpForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      address: [''] // Optional
    });
  }

  toggleMode(clearMessages = true) {
    this.isSignUp.update(val => !val);
    if (clearMessages) {
      this.error.set('');
      this.successMessage.set('');
    }
    this.loginForm.reset();
    this.signUpForm.reset();
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.loading.set(true);
      this.error.set('');
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.loading.set(false);
          if (response.redirect_url) {
            this.router.navigate([response.redirect_url]);
          } else {
            this.router.navigate(['/users']);
          }
        },
        error: (err) => {
          console.error('Login error:', err);
          if (err.status === 401) {
            this.error.set('Invalid credentials');
          } else {
            this.error.set('An error occurred. Please try again later.');
          }
          this.loading.set(false);
        }
      });
    }
  }

  onSignUp() {
    if (this.signUpForm.valid) {
      this.loading.set(true);
      this.error.set('');

      const formValue = this.signUpForm.value;
      const newUser = {
        name: formValue.name,
        email: formValue.email,
        phone: formValue.phone,
        password: formValue.password,
        role: 'user' // Default role
      };

      this.userService.createUser(newUser).pipe(
        switchMap((createdUser: any) => {
          if (formValue.address && createdUser.id) {
            return this.userService.createAddress({
              address: formValue.address,
              user_id: createdUser.id
            });
          } else {
            return of(createdUser);
          }
        })
      ).subscribe({
        next: () => {
          this.loading.set(false);
          this.successMessage.set(`Congratulations ${newUser.name}, you've signed up, now you can login with your credentials.`);
          this.toggleMode(false); // Switch back to login without clearing message
        },
        error: (err) => {
          console.error('Signup failed', err);
          this.error.set('Failed to create account. Please try again.');
          this.loading.set(false);
        }
      });
    }
  }
}
