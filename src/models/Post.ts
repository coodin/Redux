export type MyPost = {
  id: string
  title: string
  content: string
  user: string
  date: string
  reactions: {
    thumbsUp: number
    hooray: number
    heart: number
    rocket: number
    eyes: number
  }
}
