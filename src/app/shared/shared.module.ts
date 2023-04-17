import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ArticleCardComponent} from "./components/article-card/article-card.component";
import {RouterModule} from "@angular/router";
import {CategoryFilterComponent} from './components/category-filter/category-filter.component';
import {ReactiveFormsModule} from "@angular/forms";
import {ServiceCardComponent} from "./components/service-card/service-card.component";
import {PopupComponent} from "./components/popup/popup.component";
import {MatMenuModule} from "@angular/material/menu";
import {MatSelectModule} from "@angular/material/select";
import {LoaderComponent} from './components/loader/loader.component';
import {CommentCardComponent} from './components/comment-card/comment-card.component';
import {MatInputModule} from "@angular/material/input";


@NgModule({
  declarations: [
    ArticleCardComponent,
    CategoryFilterComponent,
    ServiceCardComponent,
    PopupComponent,
    LoaderComponent,
    CommentCardComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatMenuModule,
    MatSelectModule,
    MatInputModule

  ],
  exports: [
    ArticleCardComponent,
    ServiceCardComponent,
    PopupComponent,
    CategoryFilterComponent,
    LoaderComponent,
    CommentCardComponent,

  ]
})
export class SharedModule {
}
