import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SearchComponent } from "./components/pages/search/search.component";
import { HomeComponent } from "./components/pages/home/home.component";

const routes: Routes = [
  { path: "search", component: SearchComponent },
  { path: "", component: HomeComponent }, // Aggiungi la rotta per HomeComponent
  { path: "**", redirectTo: "" }, // Redirect per tutte le altre rotte non specificate
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
