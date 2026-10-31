
import DetailMain from "./DetailMain"
import { useLoaderData } from "react-router"

const DetailsPage = () => {
  const post = useLoaderData();
  return (
    <>
      <DetailMain post={post}/>
    </>
  )
}

export default DetailsPage