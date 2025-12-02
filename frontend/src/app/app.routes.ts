import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { DepartmentManagementComponent } from './pages/department-management/department-management.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { map } from 'rxjs';

const authGuard = () => {
    const authService = inject(AuthService);
    const router = inject(AuthService)['router'];
    return authService.isAuthenticated().pipe(
        map(isAuth => {
            if (isAuth) return true;
            router.navigate(['/login']);
            return false;
        })
    );
};

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'admin', component: UserManagementComponent, canActivate: [authGuard] },
    { path: 'users', component: ProfileComponent, canActivate: [authGuard] },
    { path: 'departments', component: DepartmentManagementComponent, canActivate: [authGuard] },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];
