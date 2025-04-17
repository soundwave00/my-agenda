import { Injectable } from "@angular/core";

@Injectable()
export class AuthService {
  constructor() {}

  // --- GET FUNCTIONS ---
  getCustomerUsername() {
    return localStorage.getItem("username");
  }

  getCustomerId() {
    return localStorage.getItem("customerid");
  }

  getAppleState() {
    return localStorage.getItem("apple-state-login");
  }

  getTokenWeb() {
    return localStorage.getItem("tokenweb");
  }

  getDebug() {
    return localStorage.getItem("debug");
  }

  // --- REMOVE FUNCTIONS ---
  removeCustomerUsername() {
    localStorage.removeItem("username");
  }

  removeCustomerId() {
    localStorage.removeItem("customerid");
  }

  removeCustomerProfile() {
    localStorage.removeItem("customer-profile");
  }

  removeCustomerServices() {
    localStorage.removeItem("customer-services");
  }

  removeNotification() {
    localStorage.removeItem("customer-notification");
  }

  removeAppleState() {
    localStorage.removeItem("apple-state-login");
  }

  removeTokenWeb() {
    localStorage.removeItem("tokenweb");
  }

  removeDebug() {
    localStorage.removeItem("debug");
  }
  removeOAuthToken() {
    localStorage.removeItem("oauth-token");
  }
}
