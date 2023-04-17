import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router,} from "@angular/router";
import {ArticleService} from "../../../shared/services/article.service";
import {ArticleType} from "../../../../types/article.type";
import {environment} from "../../../../environments/environment";
import {CommentResponseType} from "../../../../types/comment-response.type";
import {CommentService} from "../../../shared/services/comment.service";
import {AuthService} from "../../../core/auth/auth.service";
import {FormBuilder} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActionResponseType} from "../../../../types/action-response.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {CommentActionType} from "../../../../types/comment-action.type";
import {LoaderService} from "../../../shared/services/loader.service";
import {tap} from "rxjs";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  @ViewChild('detailContentText') detailContentText!: HTMLElement;
  article!: ArticleType;
  relatedArticles: ArticleType[] = [];
  serverStaticPath = environment.serverStaticPath;
  comments: CommentResponseType[] = [];
  commentCount: number = 0;
  offset: number = 3;
  isLoggedIn: boolean = false;
  commentForm = this.fb.group({
    text: ['']
  });
  toggleLoader: boolean = false;

  constructor(private activatedRoute: ActivatedRoute,
              private articleService: ArticleService,
              private commentService: CommentService,
              private authService: AuthService,
              private fb: FormBuilder,
              private router: Router,
              private _snackBar: MatSnackBar,
              private loaderService: LoaderService) {
    this.isLoggedIn = this.authService.getIsLoggedIn();

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.articleService.getArticle(params['url']).subscribe((data: ArticleType) => {
        this.article = data;
        this.getComments();

      });
      this.articleService.getRelatedArticles(params['url']).subscribe((data: ArticleType[]) => {
        this.relatedArticles = data;
      });


    })
  }

  getComments() {
    this.comments = [];
    this.commentService.getComments({offset: 0, article: this.article.id})
      .subscribe((data) => {
        this.commentCount = data.allCount;
        if (this.commentCount) {
          if (this.commentCount >= 3) {
            for (let i = 0; i < 3; i++) {
              this.comments.push(data.comments[i]);
            }
          } else {
            for (let i = 0; i < this.commentCount; i++) {
              this.comments.push(data.comments[i]);
            }
          }
          this.getActionsForComments();
        }
      })
  }

  getActionsForComments() {
    if (this.isLoggedIn) {
      this.commentService.getActionsForComments(this.article.id).subscribe({
        next: (data: ActionResponseType[] | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined && (data as DefaultResponseType).message) {
            this._snackBar.open((data as DefaultResponseType).message);
            throw new Error((data as DefaultResponseType).message);
          }
          this.comments.forEach(comment => {
            const foundComment = (data as ActionResponseType[]).find(item => item.comment === comment.id);
            if (foundComment) {
              if (foundComment.action === CommentActionType.like && !comment.likeFlag) {
                comment.likeFlag = true;
                comment.dislikeFlag = false;
              }
              if (foundComment.action === CommentActionType.dislike && !comment.dislikeFlag) {
                comment.dislikeFlag = true;
                comment.likeFlag = false;
              }
            }
          })

        }
      })
    }
  }

  downloadNextComments() {
    this.loaderService.show();
    this.toggleLoader = true;
    this.commentService.getComments({offset: this.offset, article: this.article.id})
      .pipe(
        tap(() => {
          this.loaderService.hide();
          this.toggleLoader = false;
        })
      )
      .subscribe((data) => {
        data.comments.forEach(item => {
          this.comments.push(item);
        });
        this.getActionsForComments();

      })
    this.offset += 10;
  }

  addComment() {
    if (this.commentForm.value.text) {
      this.commentService.addComment(this.article.id, this.commentForm.value.text)
        .subscribe((data) => {
          if (data.error) {
            this._snackBar.open(data.message);
            throw new Error(data.message);
          }
          this._snackBar.open('Комментарий добавлен');
          this.commentForm.setValue({text: ''});
          this.getComments();

        })
    }
  }

}
