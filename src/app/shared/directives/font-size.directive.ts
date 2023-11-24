import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appFontSize]'
})
export class FontSizeDirective implements OnInit {

  @Input() appFontSize: string = "";

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit() {
    this.setSize();
  }

  private setSize(): void {
    // this.elementRef.nativeElement.style.fontSize = `${this.appFontSize}px`;
    this.renderer.setStyle(this.elementRef.nativeElement, 'font-size', `${this.appFontSize}px`);
  }

}