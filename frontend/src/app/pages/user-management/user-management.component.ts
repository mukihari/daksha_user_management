import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl, FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { DepartmentService } from '../../services/department.service';
import { forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div class="flex-1 w-full md:w-auto flex gap-4">
            <!-- Search Bar -->
            <div class="relative flex-1">
              <input 
                type="text" 
                [formControl]="searchControl" 
                placeholder="Search by name, email, phone, role..." 
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>

            <!-- Address Filter -->
            <select 
              [formControl]="addressFilterControl" 
              class="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All Addresses</option>
              <option *ngFor="let addr of uniqueAddresses()" [value]="addr">{{ addr }}</option>
            </select>

            <!-- Department Filter -->
            <select 
              [formControl]="deptFilterControl" 
              class="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All Departments</option>
              <option *ngFor="let dept of uniqueDepartments()" [value]="dept">{{ dept }}</option>
            </select>
          </div>

          <button (click)="openModal()" class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap">
            Add User
          </button>
        </div>

        <!-- Card Grid -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div *ngFor="let user of filteredUsers()" class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
            <div class="px-4 py-5 sm:px-6 flex justify-between items-start">
              <div>
                <h3 class="text-lg leading-6 font-medium text-gray-900">{{ user.name }}</h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">{{ user.email }}</p>
              </div>
              <span [ngClass]="user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize">
                {{ user.role }}
              </span>
            </div>
            <div class="px-4 py-5 sm:p-6">
              <div class="space-y-4">
                <div>
                  <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Contact</h4>
                  <p class="mt-1 text-sm text-gray-900">{{ user.phone }}</p>
                </div>
                
                <div>
                  <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Addresses</h4>
                  <ul class="mt-1 space-y-1">
                    <li *ngFor="let addr of user.addresses" class="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                      {{ addr.address }}
                    </li>
                    <li *ngIf="user.addresses?.length === 0" class="text-sm text-gray-500 italic">No addresses found</li>
                  </ul>
                </div>

                <div>
                  <h4 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Departments</h4>
                  <div class="mt-1 flex flex-wrap gap-2">
                    <span *ngFor="let dept of user.departments" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {{ dept.name }}
                    </span>
                    <span *ngIf="user.departments?.length === 0" class="text-sm text-gray-500 italic">No departments</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="px-4 py-4 sm:px-6 bg-gray-50 flex justify-end space-x-3">
              <button (click)="editUser(user)" class="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Edit</button>
              <button (click)="deleteUser(user.id)" class="text-red-600 hover:text-red-900 text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
        
        <div *ngIf="filteredUsers().length === 0" class="text-center py-10">
          <p class="text-gray-500 text-lg">No users found matching your criteria.</p>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div *ngIf="showModal()" class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <!-- Background backdrop -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <!-- Modal panel -->
          <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                {{ isEditing() ? 'Edit User' : 'Add User' }}
              </h3>
              <div class="mt-2">
                <form [formGroup]="userForm" class="space-y-4">
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" id="name" formControlName="name" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md p-2">
                  </div>
                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" formControlName="email" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md p-2">
                  </div>
                  <div>
                    <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
                    <input type="text" id="phone" formControlName="phone" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md p-2">
                  </div>
                  <div>
                    <label for="role" class="block text-sm font-medium text-gray-700">Role</label>
                    <select id="role" formControlName="role" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  
                  <!-- Address Management Section -->
                  <div *ngIf="isEditing()" class="border-t border-gray-200 pt-4 mt-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Addresses</label>
                    <ul class="space-y-2 mb-3">
                      <li *ngFor="let addr of currentAddresses()" class="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-200">
                        <span class="text-sm text-gray-900">{{ addr.address }}</span>
                        <button type="button" (click)="deleteAddress(addr.id)" class="text-red-600 hover:text-red-800 text-xs font-medium">Remove</button>
                      </li>
                      <li *ngIf="currentAddresses().length === 0" class="text-sm text-gray-500 italic">No addresses added yet.</li>
                    </ul>
                    <div class="flex gap-2">
                      <input type="text" [formControl]="newAddressControl" placeholder="Enter new address" class="flex-1 shadow-sm sm:text-sm border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500">
                      <button type="button" (click)="addAddress()" class="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">Add</button>
                    </div>
                  </div>

                  <div *ngIf="!isEditing()">
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" id="password" formControlName="password" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md p-2">
                  </div>
                </form>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse justify-between">
              <div class="flex flex-row-reverse">
                <button type="button" (click)="saveUser()" [disabled]="userForm.invalid" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                  Save
                </button>
                <button type="button" (click)="closeModal()" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                  Cancel
                </button>
              </div>
              <button *ngIf="isEditing()" type="button" (click)="resetPassword()" class="mt-3 w-full inline-flex justify-center rounded-md border border-yellow-600 shadow-sm px-4 py-2 bg-white text-base font-medium text-yellow-600 hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:mt-0 sm:w-auto sm:text-sm">
                Reset Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UserManagementComponent implements OnInit {
  users = signal<any[]>([]);
  showModal = signal(false);
  isEditing = signal(false);
  userForm: FormGroup;
  currentUserId = signal<string | null>(null);
  currentAddresses = signal<any[]>([]);
  newAddressControl = new FormControl('');

  // Search and Filter Controls
  searchControl = new FormControl('');
  addressFilterControl = new FormControl('');
  deptFilterControl = new FormControl('');

  // Computed signals for filters
  searchQuery = signal('');
  addressFilter = signal('');
  deptFilter = signal('');

  private userService = inject(UserService);
  private deptService = inject(DepartmentService);
  private fb = inject(FormBuilder);

  constructor() {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      role: ['user', Validators.required],
      password: [''] // Required only for create
    });

    // Subscribe to filter changes
    this.searchControl.valueChanges.subscribe(val => this.searchQuery.set(val || ''));
    this.addressFilterControl.valueChanges.subscribe(val => this.addressFilter.set(val || ''));
    this.deptFilterControl.valueChanges.subscribe(val => this.deptFilter.set(val || ''));
  }

  // Computed property for filtered users
  filteredUsers = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const addrFilter = this.addressFilter();
    const dFilter = this.deptFilter();

    return this.users().filter(user => {
      // 1. Search Query Filter
      const matchesSearch = !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        user.addresses?.some((a: any) => a.address.toLowerCase().includes(query)) ||
        user.departments?.some((d: any) => d.name.toLowerCase().includes(query));

      // 2. Address Filter
      const matchesAddress = !addrFilter ||
        user.addresses?.some((a: any) => a.address === addrFilter);

      // 3. Department Filter
      const matchesDept = !dFilter ||
        user.departments?.some((d: any) => d.name === dFilter);

      return matchesSearch && matchesAddress && matchesDept;
    });
  });

  // Computed properties for dropdown options
  uniqueAddresses = computed(() => {
    const allAddresses = this.users().flatMap(u => u.addresses?.map((a: any) => a.address) || []);
    return [...new Set(allAddresses)].sort();
  });

  uniqueDepartments = computed(() => {
    const allDepts = this.users().flatMap(u => u.departments?.map((d: any) => d.name) || []);
    return [...new Set(allDepts)].sort();
  });

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    forkJoin({
      users: this.userService.getUsers(),
      departments: this.deptService.getDepartments()
    }).pipe(
      switchMap(({ users, departments }) => {
        // Fetch addresses for each user
        const addressReqs = users.map(u => this.userService.getAddresses(u.id).pipe(
          map(addresses => ({ userId: u.id, addresses })),
          catchError(() => of({ userId: u.id, addresses: [] }))
        ));

        // Fetch assignments for each department to map back to users
        const deptUserReqs = departments.map(d => this.deptService.getDepartmentUsers(d.id).pipe(
          map(assignments => ({ dept: d, assignments })),
          catchError(() => of({ dept: d, assignments: [] }))
        ));

        return forkJoin({
          addresses: addressReqs.length ? forkJoin(addressReqs) : of([]),
          deptAssignments: deptUserReqs.length ? forkJoin(deptUserReqs) : of([])
        }).pipe(
          map(({ addresses, deptAssignments }) => {
            const addressMap = new Map(addresses.map((a: any) => [a.userId, a.addresses]));

            const userDeptsMap = new Map<string, any[]>();
            deptAssignments.forEach((da: any) => {
              da.assignments.forEach((assignment: any) => {
                const uid = assignment.user_id;
                if (!userDeptsMap.has(uid)) {
                  userDeptsMap.set(uid, []);
                }
                userDeptsMap.get(uid)?.push(da.dept);
              });
            });

            return users.map(u => ({
              ...u,
              addresses: addressMap.get(u.id) || [],
              departments: userDeptsMap.get(u.id) || []
            }));
          })
        );
      })
    ).subscribe({
      next: (enrichedUsers) => {
        this.users.set(enrichedUsers);
      },
      error: (err) => console.error('Failed to load users data', err)
    });
  }

  openModal() {
    this.showModal.set(true);
    this.isEditing.set(false);
    this.currentUserId.set(null);
    this.userForm.reset({ role: 'user' });
    this.userForm.get('password')?.setValidators(Validators.required);
    this.currentAddresses.set([]);
    this.newAddressControl.reset();
  }

  editUser(user: any) {
    this.showModal.set(true);
    this.isEditing.set(true);
    this.currentUserId.set(user.id);
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    });
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.currentAddresses.set(user.addresses || []);
    this.newAddressControl.reset();
  }

  closeModal() {
    this.showModal.set(false);
  }

  saveUser() {
    if (this.userForm.valid) {
      const userData = this.userForm.value;
      if (this.isEditing() && this.currentUserId()) {
        if (!userData.password) {
          delete userData.password;
        }
        this.userService.updateUser(this.currentUserId()!, userData).subscribe(() => {
          this.loadUsers();
          this.closeModal();
        });
      } else {
        this.userService.createUser(userData).subscribe(() => {
          this.loadUsers();
          this.closeModal();
        });
      }
    }
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe(() => {
        this.loadUsers();
      });
    }
  }

  addAddress() {
    const address = this.newAddressControl.value;
    const userId = this.currentUserId();
    if (address && userId) {
      this.userService.createAddress({ address, user_id: userId }).subscribe({
        next: (newAddr) => {
          this.currentAddresses.update(addrs => [...addrs, newAddr]);
          this.newAddressControl.reset();
          this.loadUsers(); // Refresh main list
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
          this.loadUsers(); // Refresh main list
        },
        error: (err) => console.error('Failed to delete address', err)
      });
    }
  }

  resetPassword() {
    if (confirm('Are you sure you want to reset the password to "Welcome@123"?')) {
      const userId = this.currentUserId();
      if (userId) {
        this.userService.updateUser(userId, { password: 'Welcome@123' }).subscribe({
          next: () => {
            alert('Password reset successfully.');
          },
          error: (err) => console.error('Failed to reset password', err)
        });
      }
    }
  }
}
