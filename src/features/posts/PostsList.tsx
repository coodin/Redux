import { useDispatch, useSelector } from "react-redux"
import "../../index.css"
import { Link } from "react-router-dom"
import { PostAuthor } from "./PostAuthor"
import { TimeAgo } from "./TimeAgo"
import { ReactionButtons } from "./ReactionButtons"
import { useMemo } from "react"
import { Spinner } from "../../components/Spinner"
import { useGetPostsQuery } from "../api/apiSlice"
import classnames from "classnames"
import { MyPost } from "../../models/Post"

const PostExcerpt = ({ post }: { post: MyPost }) => {
  //  const post = useSelector((state: RootState) => selectPostById(state, postId))
  if (!post) {
    return <div>There is no post</div>
  }
  return (
    <article className="post-excerpt">
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
}
//This way make component rerender based on only paramter change
//const NewPostExcerpt = React.memo(PostExcerpt)

const PostList = () => {
  const {
    data: posts = [],
    isLoading,
    isError,
    isSuccess,
    error,
    isFetching,
    refetch,
  } = useGetPostsQuery()
  const sortedPosts = useMemo(() => {
    const sortedPosts = posts.slice()
    sortedPosts.sort((a, b) => b.date.localeCompare(a.date))
    return sortedPosts
  }, [posts])
  // const orderedPosts = useSelector(selectPostIds)
  // //const posts = useSelector(selectAllPosts)
  // const postStatus = useSelector((state: RootState) => state.posts.status)
  // const error = useSelector((state: RootState) => state.posts.error)
  // const dispatch = useAppDispatch()
  // useEffect(() => {
  //   if (postStatus === "idle") {
  //     dispatch(fetchPost())
  //   }
  // }, [postStatus, dispatch])
  // Sort posts in reverse chronological order by datetime string
  let content
  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    // Sort posts in reverse chronological order by datetime string
    // const orderedPosts = posts
    //   .slice()
    //   .sort((a, b) => b.date.localeCompare(a.date))

    // content = sortedPosts.map((post) => (
    //   <PostExcerpt key={post.id} post={post} />
    // ))
    const renderedPosts = sortedPosts.map((post) => (
      <PostExcerpt key={post.id} post={post} />
    ))

    const containerClassname = classnames("posts-container", {
      disabled: isFetching,
    })

    content = <div className={containerClassname}>{renderedPosts}</div>
  } else if (isError) {
    content = <div>{error.toString()}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}

export default PostList
