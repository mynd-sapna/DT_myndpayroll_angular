import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
@Directive({
  selector: '[appVerification]'
})
export class VerificationDirective {
  @Input('appVerification') isVerified: boolean | any;

  constructor( private ElementRef:ElementRef,private renderer: Renderer2) { }

  ngOnChanges() {
    if (this.isVerified) {
      this.renderer.addClass(this.ElementRef.nativeElement, 'green');
      this.renderer.removeClass(this.ElementRef.nativeElement, 'red');
    } else {
      this.renderer.addClass(this.ElementRef.nativeElement, 'red');
      this.renderer.removeClass(this.ElementRef.nativeElement, 'green');
    }
  }
}
