import config from "@config/config.json";
import social from "@config/social.json";
import Base from "@layouts/Baseof";
import ImageFallback from "@layouts/components/ImageFallback";
import Pagination from "@layouts/components/Pagination";
import Post from "@layouts/components/Post";
import Social from "@layouts/components/Social";
import { getSinglePage } from "@lib/contentParser";
import { sortByDate } from "@lib/utils/sortFunctions";
import { markdownify } from "@lib/utils/textConverter";
const { blog_folder } = config.settings;

const Home = ({ posts }) => {
  const { pagination } = config.settings;
  const { name, image, designation, bio } = config.profile;
  const sortPostByDate = sortByDate(posts);

  return (
    <Base>
      {/* profile */}
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="mx-auto text-center lg:col-8">
              <ImageFallback
                className="mx-auto rounded-full"
                src={image}
                width={220}
                height={220}
                priority={true}
                alt={name}
              />
              {markdownify(
                name,
                "h1",
                "mt-12 text-6xl lg:text-8xl font-semibold"
              )}
              {markdownify(designation, "p", "mt-6 text-primary text-xl")}
              {markdownify(bio, "p", "mt-4 leading-9 text-xl")}
              <Social source={social} className="profile-social-icons mt-8" />
            </div>
          </div>
        </div>
      </div>

      {/* posts */}
      <div className="section">
        <div className="container">
          <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="w-full lg:col-span-6 h-full overflow-y-auto">
              <div className="row">
                {sortPostByDate.map((post, i) => (
                  <Post
                    className="col-12 mb-6"
                    key={"key-" + i}
                    post={post}
                  />
                ))}
              </div>
            </div>
            <div className="w-full lg:col-span-6 h-full overflow-y-auto flex flex-col items-center">
              <iframe src="https://www.linkedin.com/embed/feed/update/urn:li:share:7393690199102246913?collapsed=1" height="536" width="504" frameborder="0" allowfullscreen="" title="Embedded post"></iframe>
              <iframe src="https://www.linkedin.com/embed/feed/update/urn:li:share:7391890186550312960" height="1111" width="504" frameborder="0" allowfullscreen="" title="Embedded post"></iframe>
              <iframe src="https://www.linkedin.com/embed/feed/update/urn:li:share:7384017792473186304" height="838" width="504" frameborder="0" allowfullscreen="" title="Embedded post"></iframe>
            </div>
          </div>
        </div>
      </div>
    </Base >
  );
};

export default Home;

// for homepage data
export const getStaticProps = async () => {
  const posts = getSinglePage(`content/${blog_folder}`);
  return {
    props: {
      posts: posts,
    },
  };
};
