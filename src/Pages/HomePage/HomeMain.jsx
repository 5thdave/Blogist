import { NavLink } from "react-router";

const HomeMain = ({ posts }) => {
  const postList = posts?.data ?? [];

  return (
    <div className="flex flex-col gap-10 m-10">
      <section className="bg-center bg-no-repeat bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/conference.jpg')] bg-dark bg-blend-multiply rounded-base">
        <div className="px-4 mx-auto text-center py-24 lg:py-40">
          <h1 className="mb-6 text-4xl font-bold tracking-tighter text-white md:text-5xl lg:text-6xl">
            We bring you the hottest trending stories
          </h1>
          <p className="mb-8 text-base font-normal text-white md:text-xl sm:px-16 lg:px-48">
            Blogist is dedicated to sharing quality, authentic blog posts that inform and inspire.
          </p>
        </div>
      </section>

      <div className="flex flex-wrap gap-6">
        {postList.map((post) => (
          <article
            key={post.post_id}
            className="bg-neutral-primary-soft block max-w-sm p-6 border border-default rounded-base shadow-xs"
          >
            <img className="rounded-base" src={post.post_image} alt={post.post_title} />
            <h2 className="mt-6 mb-2 text-2xl font-semibold tracking-tight text-heading">
              {post.post_title}
            </h2>
            <p className="mb-6 text-body">{post.post_content}</p>
            <NavLink
              to={`/details/${post.post_id}`}
              className="inline-flex items-center text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
            >
              Read more
              <svg
                className="w-4 h-4 ms-1.5 rtl:rotate-180 -me-0.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 12H5m14 0-4 4m4-4-4-4"
                />
              </svg>
            </NavLink>
          </article>
        ))}
      </div>
    </div>
  );
};

export default HomeMain;
