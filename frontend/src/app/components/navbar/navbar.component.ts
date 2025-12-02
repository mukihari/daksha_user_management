import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="bg-gray-800" *ngIf="isLoggedIn$ | async">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <span class="text-white font-bold">Daksha</span>
            </div>
            <div class="hidden md:block">
              <div class="ml-10 flex items-baseline space-x-4">
                <ng-container *ngIf="isAdmin()">
                    <a routerLink="/admin" routerLinkActive="bg-gray-900 text-white" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Users</a>
                    <a routerLink="/departments" routerLinkActive="bg-gray-900 text-white" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Departments</a>
                </ng-container>
                <a routerLink="/users" routerLinkActive="bg-gray-900 text-white" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">My profile</a>
              </div>
            </div>
          </div>
          <div class="flex items-center">
            <span class="text-gray-300 text-sm font-medium mr-4">Hi {{ currentUser()?.name }}!</span>
            <button (click)="logout()" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  private authService = inject(AuthService);
  isLoggedIn$ = this.authService.isAuthenticated();
  currentUser = this.authService.currentUser;

  isAdmin() {
    return this.currentUser()?.role === 'admin';
  }

  logout() {
    this.authService.logout();
  }
}
