import HomeMain from "./HomeMain"
import { useLoaderData } from "react-router"

const HomePage = () => {
  const posts = useLoaderData()
  return (
    <div>
      <HomeMain posts={posts}/>
    </div>
  )
}

export default HomePage