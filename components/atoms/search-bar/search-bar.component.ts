import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  HostListener,
} from "@angular/core";
import { SearchService } from "../../../services/search.service";
import { SearchResult } from "../../../models/search-result.model";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import { CalendarService } from "../../../services/calendar.service";
import { EventDialogService } from "../../../services/event-dialog.service";

@Component({
  selector: "app-search-bar",
  templateUrl: "./search-bar.component.html",
  styleUrl: "./search-bar.component.scss",
})
export class SearchBarComponent implements OnInit, OnDestroy {
  @ViewChild("iconSearchInput") iconSearchInput?: ElementRef;
  searchTerm: string = "";
  searchResults: SearchResult[] = [];
  isIconSearchExpanded = false;
  showResults: boolean = false;
  loading: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private searchService: SearchService,
    private calendarService: CalendarService,
    private eventDialogService: EventDialogService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    // Sottoscrizione ai risultati di ricerca
    this.subscription.add(
      this.searchService.results$.subscribe((results) => {
        this.searchResults = results;
        this.loading = false;

        // Mostra i risultati solo se c'è un termine di ricerca valido
        this.showResults = this.searchTerm.length >= 3;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onInputChange(): void {
    if (this.searchTerm.length >= 3) {
      this.loading = true;
      this.showResults = true;
      this.searchService.search(this.searchTerm);
    } else {
      this.showResults = false;
      this.searchService.search("");
    }
  }

  toggleIconSearch(): void {
    this.isIconSearchExpanded = !this.isIconSearchExpanded;

    if (this.isIconSearchExpanded) {
      setTimeout(() => {
        this.iconSearchInput?.nativeElement?.focus();
      }, 0);
    }
  }

  @HostListener("document:click", ["$event"])
  clickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isIconSearchExpanded = false;
      this.showResults = false;
    }
  }

  onResultClick(result: SearchResult): void {
    this.showResults = false;

    this.calendarService.getEvents().subscribe((events) => {
      const event = events.find((e) => e.id === result.id);
      if (event) {
        this.eventDialogService.openViewEventDialog(event);
      }
    });
  }

  clearSearch(): void {
    this.searchTerm = "";
    this.showResults = false;
    this.searchService.search("");
  }
}
