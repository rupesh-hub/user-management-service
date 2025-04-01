import {inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment.development';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesPermissionsService {


  private router: Router = inject(Router);
  private httpClient: HttpClient = inject(HttpClient);
  private ROLES_BASE_URL = `${environment.API_URL}/roles`;
  private PERMISSIONS_BASE_URL = `${environment.API_URL}/permissions`;

  constructor() { }

  public getRolesPermissions = (): Observable<any> => {
    return this.httpClient.get(`${this.ROLES_BASE_URL}`);
  }

  public createRole = (role: any): Observable<any> => {
    return this.httpClient.post(`${this.ROLES_BASE_URL}`, role);
  }

  public getRoleByName = (name: string): Observable<any> => {
    return this.httpClient.get(`${this.ROLES_BASE_URL}/by.name/${name}`);
  }

  public updateRole = (roleId:any, role: any): Observable<any> => {
    return this.httpClient.put(`${this.ROLES_BASE_URL}/${roleId}`, role);
  }

  public deleteRole = (roleId: string): Observable<any> => {
    return this.httpClient.delete(`${this.ROLES_BASE_URL}/${roleId}`);
  }

  public getPermissions = (): Observable<any> => {
    return this.httpClient.get(`${this.PERMISSIONS_BASE_URL}`);
  }

  public permissionByCategories = (): Observable<any> => {
    return this.httpClient.get(`${this.PERMISSIONS_BASE_URL}/categories`);
  }

  public assignPermissionsToRole = (roleId: string, permissions: any[]): Observable<any> => {
    return this.httpClient.put(`${this.ROLES_BASE_URL}/${roleId}/permissions`, permissions);
  }

  public getRolePermissionsByRoleId = (roleId: string): Observable<any> => {
    return this.httpClient.get(`${this.ROLES_BASE_URL}/${roleId}/permissions`);
  }

  public getRoleById = (roleId: string): Observable<any> => {
    return this.httpClient.get(`${this.ROLES_BASE_URL}/${roleId}`);
  }

  public getUsersByRole = (roleId: string): Observable<any> => {
    return this.httpClient.get(`${this.ROLES_BASE_URL}/${roleId}/users`);
  }

  public getUsersNotInRole = (roleId: string): Observable<any> => {
    return this.httpClient.get(`${this.ROLES_BASE_URL}/${roleId}/users/not-in-role`);
  }

  public assignUserToRole = (roleId: string, userId: string): Observable<any> => {
    return this.httpClient.post(`${this.ROLES_BASE_URL}/${roleId}/users/${userId}`, {});
  }

  public removeUserFromRole = (roleId: string, userId: string): Observable<any> => {
    return this.httpClient.delete(`${this.ROLES_BASE_URL}/${roleId}/users/${userId}`);
  }

  public getPermissionsByCategory = (category: string): Observable<any> => {
    return this.httpClient.get(`${this.ROLES_BASE_URL}/permissions/category/${category}`);
  }

  public getPermissionById = (permissionId: string): Observable<any> => {
    return this.httpClient.get(`${this.ROLES_BASE_URL}/permissions/${permissionId}`);
  }

  public getUsersByPermission = (permissionId: string): Observable<any> => {
    return this.httpClient.get(`${this.ROLES_BASE_URL}/permissions/${permissionId}/users`);
  }
}
