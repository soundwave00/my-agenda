import { Directive, AfterViewInit, ElementRef } from "@angular/core";

@Directive({
  selector: "[preventKeyboard]",
})
export class PreventKeyboardDirective implements AfterViewInit {
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    setTimeout(() => {
      const input = this.el.nativeElement.querySelector("input");
      if (input) {
        input.setAttribute("readonly", "readonly");
      }
    }, 0);
  }
}
