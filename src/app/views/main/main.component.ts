import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ArticleType} from "../../../types/article.type";
import {ArticleService} from "../../shared/services/article.service";
import {ServiceType} from "../../../types/service.type";
import {ReviewType} from "../../../types/review.type";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ServiceUtil} from "../../shared/utils/service-util";
import {ActivatedRoute, Params} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  popularArticles: ArticleType[] = [];
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false
  }
  customOptionsReviews: OwlOptions = {
    loop: true,
    margin: 23,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: false
  };

  services: ServiceType[] =ServiceUtil.getServiceData();
  reviews: ReviewType[] = [
    {
      image: 'comment1.png',
      name: 'Станислав',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться\n' +
        '              в тему SMM и начать свою карьеру.',
    },
    {
      image: 'comment2.png',
      name: 'Алёна',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают\n' +
        '              душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.',
    },
    {
      image: 'comment3.png',
      name: 'Мария',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге\n' +
        '              продвижения выросла в мощный блог о важности личного бренда. Класс!',
    },
  ];
  dialogRef: MatDialogRef<any> | null = null;
  @ViewChild('popup') popup!: TemplateRef<ElementRef>;
  serviceValue: string = ''


  constructor(private articleService: ArticleService, private dialog: MatDialog,private activatedRoute:ActivatedRoute,
              private location:Location) {
  }

  ngOnInit() {
    this.articleService.getPopularArticles().subscribe((data: ArticleType[]) => {
      this.popularArticles = data;
    })
  }

  createOrder(service: string) {
    this.serviceValue = service;
    this.dialogRef = this.dialog.open(this.popup);

  }

}
