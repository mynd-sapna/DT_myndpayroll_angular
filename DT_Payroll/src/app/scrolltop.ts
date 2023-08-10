import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
@Directive({
  selector: '[appVerification]'
})
export class VerificationDirective {
  constructor(private router: Router) {}

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event) {
    // Optionally, you can add logic here to determine when to scroll to the top
    window.scrollTo(0, 0);
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: PopStateEvent) {
    // Scroll to top when the browser's back or forward button is clicked
    window.scrollTo(0, 0);
  }

  @HostListener('window:scroll', ['$event'])
  onRouterNavigation(event: NavigationEnd) {
    // Scroll to top when the router navigates to a new page
    window.scrollTo(0, 0);
  }
}
