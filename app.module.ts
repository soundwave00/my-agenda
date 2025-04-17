// Angular Core & Common Modules
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MenubarModule } from "primeng/menubar";
import { MegaMenuModule } from "primeng/megamenu";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

// 3) Import del plugin "premium" per le risorse
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";

// Routing
import { AppRoutingModule } from "./app-routing.module";

// HTTP & Forms
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// Third-party Libraries
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { FullCalendarModule } from "@fullcalendar/angular";
import {
  ConfirmationService,
  MessageService,
  PrimeNGConfig,
} from "primeng/api";

// PrimeNG UI Modules
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { InputSwitchModule } from "primeng/inputswitch";
import { SelectButtonModule } from "primeng/selectbutton";
import { SidebarModule } from "primeng/sidebar";
import { ToastModule } from "primeng/toast";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { MultiSelectModule } from "primeng/multiselect";
import { InputTextareaModule } from "primeng/inputtextarea";
import { TagModule } from "primeng/tag";
import { DividerModule } from "primeng/divider";
import { TableModule } from "primeng/table";
import { AccordionModule } from "primeng/accordion";
import { InputTextModule } from "primeng/inputtext";
import { OverlayPanelModule } from "primeng/overlaypanel";

// Application Components
import { AppComponent } from "./app.component";
import { CalendarComponent } from "./components/organisms/calendar/calendar.component";
import { SidebarComponent } from "./components/organisms/sidebar/sidebar.component";
import { NewEventDialogComponent } from "./components/molecules/new-event-dialog/new-event-dialog.component";
import { ViewEventDialogComponent } from "./components/molecules/view-event-dialog/view-event-dialog.component";
import { EventDialogComponent } from "./components/organisms/event-dialog/event-dialog.component";
import { FiltersBarComponent } from "./components/organisms/filters-bar/filters-bar.component";
import { HeaderBarMobileComponent } from "./components/organisms/header-bar-mobile/header-bar-mobile.component";
import { SearchComponent } from "./components/pages/search/search.component";
import { BottomBarMobileComponent } from "./components/organisms/bottom-bar-mobile/bottom-bar-mobile.component";

// Custom UI Components (Atoms)
import { CustomButtonComponent } from "./components/atoms/custom-button/custom-button.component";
import { CustomDropdownComponent } from "./components/atoms/custom-dropdown/custom-dropdown.component";
import { CustomInputComponent } from "./components/atoms/custom-input/custom-input.component";
import { CustomLabelComponent } from "./components/atoms/custom-label/custom-label.component";
import { CustomSwitchComponent } from "./components/atoms/custom-switch/custom-switch.component";
import { CustomSelectButtonComponent } from "./components/atoms/custom-select-button/custom-select-button.component";
import { HomeComponent } from "./components/pages/home/home.component";
import { MultiSelectDropdownComponent } from "./components/atoms/multi-select-dropdown/multi-select-dropdown.component";
import { SearchBarComponent } from "./components/atoms/search-bar/search-bar.component";
import { MobileEventDialogComponent } from "./components/molecules/mobile-event-dialog/mobile-event-dialog.component";
import { MobileNewEventDialogComponent } from "./components/molecules/mobile-new-event-dialog/mobile-new-event-dialog.component";

// Directives
import { PreventKeyboardDirective } from "./directives/prevent-keyboard.directive";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    HomeComponent,
    SidebarComponent,
    MultiSelectDropdownComponent,
    NewEventDialogComponent,
    ViewEventDialogComponent,
    EventDialogComponent,
    CalendarComponent,
    CustomButtonComponent,
    CustomDropdownComponent,
    CustomInputComponent,
    CustomLabelComponent,
    FiltersBarComponent,
    CustomSwitchComponent,
    CustomSelectButtonComponent,
    SearchBarComponent,
    HeaderBarMobileComponent,
    PreventKeyboardDirective,
    SearchComponent,
    MobileEventDialogComponent,
    MobileNewEventDialogComponent,
    BottomBarMobileComponent,
  ],
  imports: [
    CommonModule,
    DialogModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    DropdownModule,
    InputSwitchModule,
    FormsModule,
    ToastModule,
    TableModule,
    DialogModule,
    SelectButtonModule,
    ToastModule,
    TranslateModule.forChild(),
    CommonModule,
    CalendarModule,
    FullCalendarModule,
    AppRoutingModule,
    ToastModule,
    DropdownModule,
    DialogModule,
    SidebarModule,
    ButtonModule,
    ReactiveFormsModule,
    AccordionModule,
    BrowserModule,
    HttpClientModule,
    InputTextModule,
    OverlayPanelModule,
    ConfirmDialogModule,
    MultiSelectModule,
    InputTextareaModule,
    TagModule,
    DividerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: "it",
    }),
    MenubarModule,
    MegaMenuModule,
  ],
  providers: [ConfirmationService, MessageService],
  bootstrap: [AppComponent],
})
export class AppModule {
  public static FullCalendarPlugins = [
    dayGridPlugin,
    timeGridPlugin,
    interactionPlugin,
    resourceTimeGridPlugin,
  ];

  constructor(private primengConfig: PrimeNGConfig) {
    this.initializeCalendarLocale();
  }

  private initializeCalendarLocale(): void {
    this.primengConfig.setTranslation({
      firstDayOfWeek: 1,
      dayNames: [
        "Domenica",
        "Lunedì",
        "Martedì",
        "Mercoledì",
        "Giovedì",
        "Venerdì",
        "Sabato",
      ],
      dayNamesShort: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"],
      dayNamesMin: ["Do", "Lu", "Ma", "Me", "Gi", "Ve", "Sa"],
      monthNames: [
        "Gennaio",
        "Febbraio",
        "Marzo",
        "Aprile",
        "Maggio",
        "Giugno",
        "Luglio",
        "Agosto",
        "Settembre",
        "Ottobre",
        "Novembre",
        "Dicembre",
      ],
      monthNamesShort: [
        "Gen",
        "Feb",
        "Mar",
        "Apr",
        "Mag",
        "Giu",
        "Lug",
        "Ago",
        "Set",
        "Ott",
        "Nov",
        "Dic",
      ],
      today: "Oggi",
      clear: "Cancella",
    });
  }
}
