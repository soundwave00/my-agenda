import { Component, Input } from "@angular/core";

@Component({
  selector: "app-custom-label",
  templateUrl: "./custom-label.component.html",
  styleUrls: ["./custom-label.component.scss"],
})
export class CustomLabelComponent {
  @Input() isImage: boolean = false; // Se true, usa un'immagine, altrimenti un'icona
  @Input() icon: string = ""; // Path dell'immagine o classe dell'icona
  @Input() text: string = ""; // Testo visualizzato
  @Input() textClass: string = ""; // Classe personalizzata per il testo
  @Input() iconClass: string = ""; // Classe personalizzata per l'icona
}
