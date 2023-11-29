import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appShowHidePassword]'
})
export class ShowHidePasswordDirective {

  private isPasswordVisible = false;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('click') onClick() {
    const passwordCell = this.el.nativeElement.closest('td');
    if (passwordCell) {
      const passwordElement = passwordCell.querySelector('span.password');
      if (passwordElement) {
        this.isPasswordVisible = !this.isPasswordVisible;
        this.togglePasswordVisibility(passwordElement);
      }
    }
  }

  private togglePasswordVisibility(passwordElement: HTMLElement) {
    const displayStyle = this.isPasswordVisible ? 'inline' : 'none';
    this.renderer.setStyle(passwordElement, 'display', displayStyle);
  }


}
