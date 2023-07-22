import { MyPost } from "./Post"

export type MyUser = {
  id: string
  firstName: string
  lastName: string
  name: string
  username: string
  posts: MyPost[]
}
