import styles from "../styles/Home.module.css";
import Loader from "../components/Loader";
import { useState } from "react";
import PostFeed from "../components/PostFeed";
import { firestore, fromMillis, postToJSON } from "../lib/firebase";
import Metatags from "../components/Metatags";

// Max post to query per page
const LIMIT = 4;

export async function getServerSideProps(context) {
  const postsQuery = await firestore
    .collectionGroup("posts")
    .where("published", "==", true)
    .orderBy("createdAt", "desc")
    .limit(LIMIT);
  // .get();
  // const posts = postsQuery.docs.map(postToJSON);
  // console.log(posts);

  const posts = (await postsQuery.get()).docs.map(postToJSON);

  return {
    props: { posts }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  // console.log(posts);
  const [loading, setLoading] = useState(false);

  const [postsEnd, setPostsEnd] = useState(false);

  // Get next page in pagination query
  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    const cursor =
      typeof last.createdAt === "number"
        ? fromMillis(last.createdAt)
        : last.createdAt;

    const query = firestore
      .collectionGroup("posts")
      .where("published", "==", true)
      .orderBy("createdAt", "desc")
      .startAfter(cursor)
      .limit(LIMIT);

    const newPosts = (await query.get()).docs.map((doc) => doc.data());

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  return (
    <main className="">
      <Metatags
        title="Home Page"
        description="Get the latest posts on our site"
      />
      <div className="card card-info ">
        <h2>💡Made using Next.js + 🔥Firebase + ❄React.js </h2>
        <p>
          Welcome! This webapp is built by Mayur R vaswani for UEM final round.
        </p>
        <p>
          Sign up for an 👨‍🎤 account, ✍️ write posts, then 💞 heart or 💟 Comment
          content created by other users. All public content is server-rendered
          and search-engine optimized.
        </p>
      </div>
      <h2>Posts</h2>
      <PostFeed posts={posts} admin={false} />

      {!loading && !postsEnd && (
        <button onClick={getMorePosts}>Load more</button>
      )}
      <Loader show={loading} />

      {postsEnd && "You have reached the end!"}
    </main>
  );
}
