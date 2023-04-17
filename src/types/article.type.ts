import {CommentResponseType} from "./comment-response.type";

export type ArticleType={
  id: string,
  title: string,
  description: string,
  image: string,
  date: string,
  category: string,
  url: string


  text?: string,
  comments?: CommentResponseType[],
  commentsCount?: number,
}
