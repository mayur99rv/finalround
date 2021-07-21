import Head from "next/head";
import styles from "../styles/Home.module.css";
import Loader from "../components/Loader";
import { useState } from "react";
import PostFeed from "../components/PostFeed";
import { firestore, fromMillis, postToJSON } from "../lib/firebase";
// Max post to query per page
const LIMIT = 1;

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
    <main>
      <div className="card card-info">
        <h2>💡 Next.js + Firebase - The Full Course</h2>
        <p>
          Welcome! This app is built with Next.js and Firebase and is loosely
          inspired by Dev.to.
        </p>
        <p>
          Sign up for an 👨‍🎤 account, ✍️ write posts, then 💞 heart content
          created by other users. All public content is server-rendered and
          search-engine optimized.
        </p>
      </div>
      <PostFeed posts={posts} admin={false} />

      {!loading && !postsEnd && (
        <button onClick={getMorePosts}>Load more</button>
      )}
      <Loader show={loading} />

      {postsEnd && "You have reached the end!"}
    </main>
  );
}
