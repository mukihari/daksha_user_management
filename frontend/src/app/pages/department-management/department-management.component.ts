import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl, FormsModule } from '@angular/forms';
import { DepartmentService } from '../../services/department.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-department-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="flex justify-between items-center mb-6 gap-4">
          <div class="flex-1">
            <h1 class="text-2xl font-semibold text-gray-900 mb-4 md:mb-0">Department Management</h1>
          </div>
          
          <div class="flex items-center gap-4">
            <!-- Search Bar -->
            <div class="relative w-64">
              <input 
                type="text" 
                [formControl]="searchControl" 
                placeholder="Search departments..." 
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>

            <button (click)="openModal()" class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 whitespace-nowrap">
              Add Department
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div *ngFor="let dept of filteredDepartments()" class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200">
            <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 class="text-lg leading-6 font-medium text-gray-900">{{ dept.name }}</h3>
              <div class="flex space-x-2">
                <button (click)="editDepartment(dept)" class="text-indigo-600 hover:text-indigo-900">Edit</button>
                <button (click)="deleteDepartment(dept.id)" class="text-red-600 hover:text-red-900">Delete</button>
              </div>
            </div>
            <div class="px-4 py-5 sm:p-6">
              <h4 class="text-sm font-medium text-gray-500 mb-2">Members</h4>
              <ul class="divide-y divide-gray-200 mb-4">
                <li *ngFor="let member of deptMembers()[dept.id]" class="py-2 flex justify-between items-center">
                  <span class="text-sm text-gray-900">{{ getUserName(member.user_id) }}</span>
                  <button (click)="removeMember(member.id, dept.id)" class="text-xs text-red-500 hover:text-red-700">Remove</button>
                </li>
                <li *ngIf="!deptMembers()[dept.id]?.length" class="py-2 text-sm text-gray-400">No members</li>
              </ul>
              
              <div class="mt-4">
                <select (change)="assignUser($event, dept.id)" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                  <option value="">Assign User...</option>
                  <option *ngFor="let user of users()" [value]="user.id">{{ user.name }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div *ngIf="filteredDepartments().length === 0" class="text-center py-10">
          <p class="text-gray-500 text-lg">No departments found matching your search.</p>
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
                {{ isEditing() ? 'Edit Department' : 'Add Department' }}
              </h3>
              <div class="mt-2">
                <form [formGroup]="deptForm" class="space-y-4">
                  <div>
                    <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" id="name" formControlName="name" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md p-2">
                  </div>
                </form>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button type="button" (click)="saveDepartment()" [disabled]="deptForm.invalid" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                Save
              </button>
              <button type="button" (click)="closeModal()" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DepartmentManagementComponent implements OnInit {
  departments = signal<any[]>([]);
  users = signal<any[]>([]);
  deptMembers = signal<{ [key: string]: any[] }>({});
  showModal = signal(false);
  isEditing = signal(false);
  deptForm: FormGroup;
  currentDeptId = signal<string | null>(null);

  // Search Controls
  searchControl = new FormControl('');
  searchQuery = signal('');

  constructor(
    private deptService: DepartmentService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.deptForm = this.fb.group({
      name: ['', Validators.required]
    });

    this.searchControl.valueChanges.subscribe(val => this.searchQuery.set(val || ''));
  }

  // Computed property for filtered departments
  filteredDepartments = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.departments().filter(dept =>
      !query || dept.name.toLowerCase().includes(query)
    );
  });

  ngOnInit() {
    this.loadDepartments();
    this.loadUsers();
  }

  loadDepartments() {
    this.deptService.getDepartments().subscribe(depts => {
      this.departments.set(depts);
      this.departments().forEach(dept => this.loadDeptMembers(dept.id));
    });
  }

  loadUsers() {
    this.userService.getUsers().subscribe(users => {
      this.users.set(users);
    });
  }

  loadDeptMembers(deptId: string) {
    this.deptService.getDepartmentUsers(deptId).subscribe(members => {
      this.deptMembers.update(current => ({ ...current, [deptId]: members }));
    });
  }

  openModal() {
    this.showModal.set(true);
    this.isEditing.set(false);
    this.currentDeptId.set(null);
    this.deptForm.reset();
  }

  editDepartment(dept: any) {
    this.showModal.set(true);
    this.isEditing.set(true);
    this.currentDeptId.set(dept.id);
    this.deptForm.patchValue({
      name: dept.name
    });
  }

  closeModal() {
    this.showModal.set(false);
  }

  getUserName(userId: string): string {
    const user = this.users().find(u => u.id === userId);
    return user ? user.name : 'Unknown';
  }

  saveDepartment() {
    if (this.deptForm.valid) {
      const deptData = this.deptForm.value;
      if (this.isEditing() && this.currentDeptId()) {
        this.deptService.updateDepartment(this.currentDeptId()!, deptData).subscribe({
          next: () => {
            this.loadDepartments();
            this.closeModal();
          },
          error: (err) => console.error('Failed to update department', err)
        });
      } else {
        this.deptService.createDepartment(deptData).subscribe({
          next: () => {
            this.loadDepartments();
            this.closeModal();
          },
          error: (err) => console.error('Failed to create department', err)
        });
      }
    }
  }

  deleteDepartment(id: string) {
    if (confirm('Are you sure you want to delete this department?')) {
      this.deptService.deleteDepartment(id).subscribe({
        next: () => this.loadDepartments(),
        error: (err) => console.error('Failed to delete department', err)
      });
    }
  }

  assignUser(event: any, deptId: string) {
    const userId = event.target.value;
    if (userId) {
      this.deptService.assignUser(deptId, userId).subscribe({
        next: () => {
          this.loadDeptMembers(deptId);
          event.target.value = ""; // Reset select
        },
        error: (err) => console.error('Failed to assign user', err)
      });
    }
  }

  removeMember(assignmentId: string, deptId: string) {
    if (confirm('Remove user from department?')) {
      this.deptService.removeUser(assignmentId).subscribe({
        next: () => this.loadDeptMembers(deptId),
        error: (err) => console.error('Failed to remove member', err)
      });
    }
  }
}
