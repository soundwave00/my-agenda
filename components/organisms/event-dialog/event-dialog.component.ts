import { Component, Input, OnInit } from "@angular/core";
import { ResponsiveService } from "../../../services/responsive.service";

@Component({
  selector: "app-event-dialog",
  templateUrl: "./event-dialog.component.html",
  styleUrls: ["./event-dialog.component.scss"],
})
export class EventDialogComponent implements OnInit {
  @Input() position: string = "center";
  isMobileView: boolean = false;

  constructor(private responsiveService: ResponsiveService) {}

  ngOnInit(): void {
    this.responsiveService.isMobileView$.subscribe((isMobile) => {
      this.isMobileView = isMobile;
    });
  }
}
