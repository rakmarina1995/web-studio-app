export type CommentResponseType = {
  id: string,
  text: string,
  date: Date,
  likesCount: number,
  dislikesCount: number,
  user: {
    id: string,
    name: string
  },
  likeFlag?: boolean,
  dislikeFlag?: boolean
}
