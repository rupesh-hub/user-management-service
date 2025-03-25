import { Injectable } from '@angular/core';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class JwtTokenValidatorService {

  constructor() { }

  public decodeToken = (token: string): any => {
    try {
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  }

  // Method to check if the token is expired
  public isTokenExpired = (token: string): boolean => {
    try {
      const decodedToken = this.decodeToken(token);

      // If decoding fails or token is invalid, return true (expired/invalid)
      if (!decodedToken || !decodedToken.exp) {
        return true;
      }

      // Check if the token is expired
      const currentTime = Date.now() / 1000;
      return decodedToken.exp < currentTime;
    } catch (error) {
      console.error('Error decoding or validating token:', error);
      return true; // Mark as expired/invalid if any error occurs
    }
  }

  public getAuthorities = (): string[] => {
    const token = localStorage.getItem('access_token');
    const decodedToken = this.decodeToken(token);
    if (!decodedToken ||!decodedToken.authorities) return [];
    return decodedToken.authorities;
  }


  // Method to validate the token
  public validateToken = (token: string): boolean => {
    if (!token) return false;
    return !this.isTokenExpired(token);
  }

}
