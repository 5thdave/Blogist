

const DetailMain = ({ post }) => {
  const postData = post?.data

  if (!postData) {
    return <p>Post not found.</p>
  }

  return (
    <article className="grid gap-4">
      <h1>{postData.post_title}</h1>
      <img src={postData.post_image} alt={postData.post_title} />
      <p>{postData.post_content}</p>
      <small>{postData.post_created_at}</small>
    </article>
  )
}

export default DetailMain