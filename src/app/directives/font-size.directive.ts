import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appFontSize]'
})
export class FontSizeDirective {

  @Input() appFontSize: string = "";

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    this.setSize();
  }

  setSize(): void {
    this.renderer.setStyle(this.elementRef.nativeElement, 'font-size', `${this.appFontSize}px`);
  }

}


