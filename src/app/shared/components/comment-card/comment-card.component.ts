import {Component, Input, OnInit} from '@angular/core';
import {CommentResponseType} from "../../../../types/comment-response.type";
import {CommentActionType} from "../../../../types/comment-action.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {CommentService} from "../../services/comment.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActionResponseType} from "../../../../types/action-response.type";
import {AuthService} from "../../../core/auth/auth.service";

@Component({
  selector: 'comment-card',
  templateUrl: './comment-card.component.html',
  styleUrls: ['./comment-card.component.scss']
})
export class CommentCardComponent implements OnInit {
  @Input() comment!: CommentResponseType;
  actionType = CommentActionType;
  isLogged: boolean = false;

  constructor(private commentService: CommentService,
              private _snackBar: MatSnackBar,
              private authService: AuthService) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit() {

  }

  applyAction(commentId: string, action: CommentActionType) {
    if (this.isLogged) {
      this.commentService.applyActionForComment(commentId, action)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if (data.error) {
              this._snackBar.open(data.message);
              throw  new Error(data.message);
            }
            if (action === this.actionType.violate && !data.error) {
              this._snackBar.open('Ваша жалоба отправлена');
            } else {
              this.getAction(commentId);
              this._snackBar.open('Ваш голос учтен');

            }

          },
          error: (errorResponse: HttpErrorResponse) => {
            if (action === this.actionType.violate) {
              this._snackBar.open('Жалоба уже отправлена');
              throw  new Error(errorResponse.error.message);
            }
            this._snackBar.open(errorResponse.error.message);
            throw  new Error(errorResponse.error.message);
          }
        })
    } else {
      this._snackBar.open('Чтобы оставлять реакцию, войдите или зарегистрируйтесь');

    }
  }

  getAction(commentId: string) {
    this.commentService.getActionsForComment(commentId).subscribe((data: ActionResponseType[] | DefaultResponseType) => {
      const found = (data as ActionResponseType[]).find(found => found.comment === commentId);
      if (found) {
        if (found.action === CommentActionType.like && !this.comment.likeFlag) {
          this.comment.likeFlag = true;
          this.comment.likesCount++;
          if (this.comment.dislikeFlag) {
            this.comment.dislikeFlag = false;
            this.comment.dislikesCount--;
          }
        }
        if (found.action === CommentActionType.dislike && !this.comment.dislikeFlag) {
          this.comment.dislikeFlag = true;
          this.comment.dislikesCount++;
          if (this.comment.likeFlag) {
            this.comment.likeFlag = false;
            this.comment.likesCount--;
          }
        }

      }
    })

  }

}
