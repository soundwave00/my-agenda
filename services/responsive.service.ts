import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ResponsiveService {
  private isMobileViewSubject = new BehaviorSubject<boolean>(false);
  public isMobileView$: Observable<boolean> =
    this.isMobileViewSubject.asObservable();

  private mobileBreakpoint = 768;

  constructor() {
    this.checkScreenSize();

    window.addEventListener("resize", () => {
      this.checkScreenSize();
    });
  }

  private checkScreenSize(): void {
    const isMobile = window.innerWidth < this.mobileBreakpoint;

    // Only emit if the mobile state has changed
    if (this.isMobileViewSubject.getValue() !== isMobile) {
      this.isMobileViewSubject.next(isMobile);
    }
  }

  public isMobile(): boolean {
    return window.innerWidth < this.mobileBreakpoint;
  }

  public setMobileBreakpoint(breakpoint: number): void {
    this.mobileBreakpoint = breakpoint;
    this.checkScreenSize();
  }
}
