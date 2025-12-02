import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DepartmentService {
    private apiUrl = 'http://localhost:3000/dept';

    constructor(private http: HttpClient) { }

    getDepartments(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    createDepartment(dept: any): Observable<any> {
        return this.http.post(this.apiUrl, dept);
    }

    updateDepartment(id: string, dept: any): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${id}`, dept);
    }

    deleteDepartment(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    assignUser(deptId: string, userId: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/assign`, { dept_id: deptId, user_id: userId });
    }

    getDepartmentUsers(deptId: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/${deptId}/users`);
    }

    removeUser(assignmentId: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/assignments/${assignmentId}`);
    }
}
