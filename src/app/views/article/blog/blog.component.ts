import {Component, OnInit} from '@angular/core';
import {ArticleService} from "../../../shared/services/article.service";
import {ArticleType} from "../../../../types/article.type";
import {CategoryType} from "../../../../types/category.type";
import {CategoryService} from "../../../shared/services/category.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {AppliedFilterType} from "../../../../types/applied-filter.type";
import {debounceTime} from "rxjs";
import {ActiveParamsUtil} from "../../../shared/utils/active-params.util";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  articles: ArticleType[] = [];
  categories: CategoryType[] = [];
  openFilter: boolean = false;
  activeParams: ActiveParamsType = {
    categories: [],
  };
  appliedFilters: AppliedFilterType[] = [];
  pages: number[] = [];

  constructor(private articleService: ArticleService,
              private categoryService: CategoryService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.categoryService.getCategories().subscribe((data: CategoryType[]) => {
      this.categories = data;
      this.activatedRoute.queryParams
        .pipe(
          debounceTime(100)
        )
        .subscribe((params: Params) => {
          this.activeParams = ActiveParamsUtil.processParams(params);
          this.appliedFilters = [];
          this.activeParams.categories.forEach(item => {
            const foundFilter = this.categories.find(category => category.url === item);
            if (foundFilter) {
              this.appliedFilters.push({
                name: foundFilter.name,
                urlParam: foundFilter.url
              });
            }
          })

          this.articleService.getArticles(this.activeParams)
            .subscribe((data) => {
              this.pages = [];
              for (let i = 1; i <= data.pages; i++) {
                this.pages.push(i);
              }
                this.pages = [];
                for (let i = 1; i <= data.pages; i++) {
                  this.pages.push(i);
                }

              this.articles = data.items;

            });
        })
    })


  }

  toggle() {
    this.openFilter = !this.openFilter;
  }


  removeAppliedFilter(appliedFilter: AppliedFilterType) {
    this.activeParams.categories = this.activeParams.categories.filter(item => item !== appliedFilter.urlParam);
    this.activeParams.page = 1;
    this.router.navigate(['blog'], {queryParams: this.activeParams})
  }

  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/blog'], {queryParams: this.activeParams});
    }
  }

  openNextPage() {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
      this.router.navigate(['/blog'], {queryParams: this.activeParams});
    }
  }

  openPage(page: number) {
    this.activeParams.page = page;
    this.router.navigate(['blog'], {queryParams: this.activeParams})

  }

}
