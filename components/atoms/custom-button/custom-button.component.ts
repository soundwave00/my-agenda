import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-custom-button",
  templateUrl: "./custom-button.component.html",
  styleUrl: "./custom-button.component.scss",
})
export class CustomButtonComponent {
  @Input() label: string = "";
  @Input() icon: string = "";
  @Input() styleClass: string = "";
  @Output() onClick = new EventEmitter<Event>();

  handleClick(event: Event) {
    this.onClick.emit(event);
  }
}
