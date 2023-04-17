import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CommentParamsType} from "../../../types/comment-params.type";
import {Observable} from "rxjs";
import {CommentResponseType} from "../../../types/comment-response.type";
import {environment} from "../../../environments/environment";
import {DefaultResponseType} from "../../../types/default-response.type";
import {CommentActionType} from "../../../types/comment-action.type";
import {ActionResponseType} from "../../../types/action-response.type";


@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) {
  }

  getComments(params: CommentParamsType): Observable<{ allCount: number, comments: CommentResponseType[] }> {
    return this.http.get<{ allCount: number, comments: CommentResponseType[] }>(environment.api + 'comments', {params: params})
  }

  addComment(article: string, text: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', {
      article,
      text
    })
  }

  applyActionForComment(id: string, action: CommentActionType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + id + '/apply-action', {action})
  }

  getActionsForComment(id: string): Observable<ActionResponseType[] | DefaultResponseType> {
    return this.http.get<ActionResponseType[] | DefaultResponseType>(environment.api + 'comments/' + id + '/actions')
  }
  getActionsForComments(articleId: string): Observable<ActionResponseType[] | DefaultResponseType> {
    return this.http.get<ActionResponseType[] | DefaultResponseType>(environment.api + 'comments/article-comment-actions/',{params:{articleId}})
  }

}
