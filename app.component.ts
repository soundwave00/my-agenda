import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ResponsiveService } from "./services/responsive.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  constructor(
    private translate: TranslateService,
    private router: Router,
    private responsiveService: ResponsiveService
  ) {
    // Imposta la lingua predefinita
    this.translate.setDefaultLang("it");

    // Carica la lingua selezionata
    this.translate.use("it");
  }

  selectedCountry: { name: string; code: string; locale: string } | null = null;
  showAllisone = false;
  items: any[] = [];
  isMobileView: boolean = false;

  ngOnInit(): void {
    this.responsiveService.isMobileView$.subscribe((isMobile) => {
      this.isMobileView = isMobile;
    });

    this.translate.addLangs(["it", "en", "es", "pt"]);
    this.translate.setDefaultLang("it");

    let browserLang = this.translate.getBrowserLang();
    if (browserLang) {
      browserLang = browserLang.match(/it|en|es|pt/) ? browserLang : "it";
      this.translate.use(browserLang);
    }

    if (browserLang === "it") {
      this.showAllisone = true;
    } else {
      this.showAllisone = false;
    }

    this.items = [
      { name: "Italian", code: "it", locale: "it" },
      { name: "English", code: "gb", locale: "en" },
      { name: "Portugues", code: "pt", locale: "pt" },
      { name: "Espanol", code: "es", locale: "es" },
      { name: "German", code: "de", locale: "de" },
    ];

    this.selectedCountry =
      this.items.find((x) => x.locale === browserLang) || this.items[0];
  }

  onSelectedLangChange(event: any): void {
    this.translate.use(event.value.locale);
    if (event.value.locale === "it") {
      this.showAllisone = true;
    } else {
      this.showAllisone = false;
    }
  }

  navigateHome() {
    this.router.navigate(["/"]);
  }
}
