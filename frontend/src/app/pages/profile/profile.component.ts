import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { DepartmentService } from '../../services/department.service';
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        
        <!-- Profile Header Card -->
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div class="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          <div class="px-6 pb-6">
            <div class="relative flex justify-between items-end -mt-12 mb-4">
              <div class="flex items-end">
                <div class="h-24 w-24 rounded-full ring-4 ring-white bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500 shadow-lg">
                  {{ user()?.name?.charAt(0).toUpperCase() }}
                </div>
                <div class="ml-4 mb-1">
                  <h1 class="text-3xl font-bold text-gray-900 bg-gray-50 px-4 py-1 rounded-lg inline-block">{{ user()?.name }}</h1>
                  <p class="text-sm font-medium text-indigo-600 uppercase tracking-wide mt-1">{{ user()?.role }}</p>
                </div>
              </div>
              <button (click)="openEditModal()" class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full shadow-md transition-colors duration-200 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Profile
              </button>
            </div>

            <!-- Info Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Department</p>
                <div class="flex flex-wrap gap-2">
                  <span *ngFor="let dept of user()?.departments" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {{ dept.name }}
                  </span>
                  <span *ngIf="!user()?.departments?.length" class="text-gray-400 italic text-sm">None assigned</span>
                </div>
              </div>

              <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</p>
                <p class="text-gray-900 font-medium truncate" title="{{ user()?.email }}">{{ user()?.email }}</p>
              </div>

              <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                <p class="text-gray-900 font-medium">{{ user()?.phone || 'Not set' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Addresses Section -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div class="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
              My Addresses
            </h3>
          </div>
          <div class="p-6">
            <div *ngIf="user()?.addresses?.length; else noAddresses" class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div *ngFor="let addr of user()?.addresses" class="flex items-start p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-sm transition-all duration-200 bg-white">
                <div class="flex-shrink-0 mt-0.5">
                  <div class="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  </div>
                </div>
                <div class="ml-4 flex-1">
                  <p class="text-sm font-medium text-gray-900">{{ addr.address }}</p>
                </div>
              </div>
            </div>
            <ng-template #noAddresses>
              <div class="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p class="mt-2 text-sm text-gray-500">No addresses added yet.</p>
                <button (click)="openEditModal()" class="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">Add an address</button>
              </div>
            </ng-template>
          </div>
        </div>

      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div *ngIf="showModal()" class="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity"></div>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="flex justify-between items-center mb-5">
                <h3 class="text-xl font-bold text-gray-900" id="modal-title">Edit Profile</h3>
                <button (click)="closeModal()" class="text-gray-400 hover:text-gray-500">
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div class="mt-2">
                <form [formGroup]="profileForm" class="space-y-5">
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" id="name" formControlName="name" class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border">
                  </div>
                  <div>
                    <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input type="text" id="phone" formControlName="phone" class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border">
                  </div>

                  <!-- Address Management Section -->
                  <div class="border-t border-gray-100 pt-5 mt-5">
                    <label class="block text-sm font-medium text-gray-900 mb-3">Manage Addresses</label>
                    <ul class="space-y-3 mb-4">
                      <li *ngFor="let addr of currentAddresses()" class="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200 group hover:border-indigo-200 transition-colors">
                        <span class="text-sm text-gray-700">{{ addr.address }}</span>
                        <button type="button" (click)="deleteAddress(addr.id)" class="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors" title="Delete address">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                          </svg>
                        </button>
                      </li>
                      <li *ngIf="currentAddresses().length === 0" class="text-sm text-gray-500 italic text-center py-2">No addresses added yet.</li>
                    </ul>
                    <div class="flex gap-2">
                      <input type="text" [formControl]="newAddressControl" placeholder="Enter new address" class="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5 border">
                      <button type="button" (click)="addAddress()" class="px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors">Add</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-4 sm:px-6 flex flex-col sm:flex-row-reverse gap-3 sm:gap-0 sm:justify-between items-center">
              <div class="flex flex-row-reverse gap-3 w-full sm:w-auto">
                <button type="button" (click)="saveProfile()" [disabled]="profileForm.invalid" class="w-full sm:w-auto inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Save Changes
                </button>
                <button type="button" (click)="closeModal()" class="w-full sm:w-auto inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm transition-colors">
                  Cancel
                </button>
              </div>
              <button type="button" (click)="resetPassword()" class="w-full sm:w-auto mt-3 sm:mt-0 inline-flex justify-center items-center gap-2 rounded-lg border border-amber-200 shadow-sm px-4 py-2 bg-amber-50 text-base font-medium text-amber-700 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 sm:text-sm transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
                Reset Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  user = signal<any>(null);
  showModal = signal(false);
  profileForm: FormGroup;
  currentAddresses = signal<any[]>([]);
  newAddressControl = new FormControl('');

  private authService = inject(AuthService);
  private userService = inject(UserService);
  private deptService = inject(DepartmentService);
  private fb = inject(FormBuilder);

  constructor() {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['']
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    const savedUser = localStorage.getItem('user_details');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      this.user.set(parsedUser);

      if (parsedUser.id) {
        forkJoin({
          user: this.userService.getUser(parsedUser.id),
          addresses: this.userService.getAddresses(parsedUser.id),
          departments: this.deptService.getDepartments()
        }).pipe(
          map(data => ({ ...data, userId: parsedUser.id }))
        ).subscribe({
          next: ({ user, addresses, departments, userId }) => {
            // Fetch assignments for all departments to find which ones the user belongs to
            const deptReqs = departments.map((d: any) =>
              this.deptService.getDepartmentUsers(d.id).pipe(
                map(members => ({ dept: d, members })),
                catchError(() => of({ dept: d, members: [] }))
              )
            );

            forkJoin(deptReqs).subscribe((deptResults: any[]) => {
              const userDepartments = deptResults
                .filter(res => res.members.some((m: any) => m.user_id === userId))
                .map(res => res.dept);

              const fullUser = { ...user, addresses, departments: userDepartments };
              this.user.set(fullUser);
              localStorage.setItem('user_details', JSON.stringify(fullUser));
            });
          },
          error: (err) => console.error('Failed to fetch user data', err)
        });
      }
    }
  }

  openEditModal() {
    const currentUser = this.user();
    if (currentUser) {
      this.profileForm.patchValue({
        name: currentUser.name,
        phone: currentUser.phone
      });
      this.currentAddresses.set(currentUser.addresses || []);
      this.newAddressControl.reset();
      this.showModal.set(true);
    }
  }

  closeModal() {
    this.showModal.set(false);
  }

  saveProfile() {
    if (this.profileForm.valid) {
      const updatedData = this.profileForm.value;
      const currentUser = this.user();

      if (currentUser && currentUser.id) {
        this.userService.updateUser(currentUser.id, updatedData).subscribe({
          next: (updatedUser) => {
            // Refresh data to get latest state including addresses
            this.loadUserData();
            this.closeModal();
          },
          error: (err) => console.error('Failed to update profile', err)
        });
      }
    }
  }

  addAddress() {
    const address = this.newAddressControl.value;
    const currentUser = this.user();
    if (address && currentUser?.id) {
      this.userService.createAddress({ address, user_id: currentUser.id }).subscribe({
        next: (newAddr) => {
          this.currentAddresses.update(addrs => [...addrs, newAddr]);
          this.newAddressControl.reset();
          this.loadUserData(); // Refresh main profile view
        },
        error: (err) => console.error('Failed to add address', err)
      });
    }
  }

  deleteAddress(addressId: string) {
    if (confirm('Delete this address?')) {
      this.userService.deleteAddress(addressId).subscribe({
        next: () => {
          this.currentAddresses.update(addrs => addrs.filter(a => a.id !== addressId));
          this.loadUserData(); // Refresh main profile view
        },
        error: (err) => console.error('Failed to delete address', err)
      });
    }
  }

  resetPassword() {
    if (confirm('Are you sure you want to reset your password to "Welcome@123"?')) {
      const currentUser = this.user();
      if (currentUser && currentUser.id) {
        this.userService.updateUser(currentUser.id, { password: 'Welcome@123' }).subscribe({
          next: () => {
            alert('Password reset successfully.');
          },
          error: (err) => console.error('Failed to reset password', err)
        });
      }
    }
  }
}
