import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost:3000/users';

    constructor(private http: HttpClient) { }

    getUsers(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    getUser(id: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    getAddresses(id: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/${id}/address`);
    }

    createUser(user: any): Observable<any> {
        return this.http.post(this.apiUrl, user);
    }

    updateUser(id: string, user: any): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${id}`, user);
    }

    deleteUser(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    createAddress(address: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/address`, address);
    }

    updateAddress(id: string, address: any): Observable<any> {
        return this.http.patch(`${this.apiUrl}/address/${id}`, address);
    }

    deleteAddress(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/address/${id}`);
    }
}
