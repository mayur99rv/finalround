/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/link-passhref */
import styles from "../../styles/Post.module.css";
import PostContent from "../../components/PostContent";
import Showcomments from "../../components/ShowComments";
import {
  firestore,
  getUserWithUsername,
  postToJSON,
  auth,
  serverTimestamp,
  increment,
} from "../../lib/firebase";
import { useDocument, useDocumentData } from "react-firebase-hooks/firestore";

import HeartButton from "../../components/HeartButton";
import AuthCheck from "../../components/AuthCheck";
import Metatags from "../../components/Metatags";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../lib/context";
//to prerender a page we use this function
export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    //if username exists then we refrence to the actual post itself with slug as the id
    const postRef = userDoc.ref.collection("posts").doc(slug);
    // console.log(postRef);
    post = postToJSON(await postRef.get()); // we are getting the data here
    path = postRef.path;
    // console.log(path);
  }
  let comments;
  if (post) {
    const commRef = userDoc.ref
      .collection("posts")
      .doc(slug)
      .collection("comments")
      .orderBy("createdAt", "desc")
      .limit(5);
    comments = (await commRef.get()).docs.map(postToJSON);
  }
  return {
    props: { post, path, comments },
    revalidate: 5000,
  };
}

export async function getStaticPaths() {
  const snapshot = await firestore.collectionGroup("posts").get();

  const paths = snapshot.docs.map((doc) => {
    const { username, slug } = doc.data();

    return {
      params: { username, slug },
    };
  });

  return {
    //must be in this format
    //paths: [
    // {params: {username, slug}}
    // ]
    paths,
    fallback: "blocking",
  };
}

export default function PostPage(props) {
  const postRef = firestore.doc(props.path);
  const [realTimePost] = useDocumentData(postRef);
  const post = realTimePost || props.post;
  const { user: currentUser, username } = useContext(UserContext);
  // const { comments } = props;
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [comments, setComments] = useState(props.comments);
  // const commentRef = postRef.collection("comments").doc(auth.currentUser.uid);
  // const [commentDoc] = useDocument(commentRef);
  var commentc;
  const addComment = async () => {
    const countget = await postRef.get();
    const cc = countget?.data()?.CommentCount;
    const commentRef = postRef
      .collection("comments")
      .doc(auth.currentUser.uid + cc);

    const uid = auth.currentUser.uid;
    const batch = firestore.batch();
    batch.update(postRef, { CommentCount: increment(1) });
    batch.set(commentRef, {
      uid: uid,
      username: username,
      comment: formValue,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await batch.commit();
    commentc = cc;
  };
  async function getComm() {
    const commentRef = postRef
      .collection("comments")
      .orderBy("createdAt", "desc")
      .limit(5);
    const cs = (await commentRef.get())?.docs.map(postToJSON);
    setComments(cs);
    const countget = await postRef.get();
    const cc = countget?.data()?.CommentCount;
    commentc = cc;
  }
  useEffect(() => {
    getComm();
  }, [formValue]);

  const onSubmit = (e) => {
    e.preventDefault();
    addComment();
    setFormValue("");
  };

  const onChange = (e) => {
    const val = e.target.value;
    setFormValue(val);

    // Only set form value if length is < 3
    if (val.length < 3) {
      setIsValid(false);
    } else setIsValid(true);
  };

  return (
    <>
      <main className={styles.container}>
        <Metatags title={post.title} description={post.title} />
        <section>
          <PostContent post={post} />
        </section>

        <aside className="card">
          <p>
            <strong>{post.heartCount || 0} ❤ </strong>
          </p>

          <AuthCheck
            fallback={
              <Link href="/enter">
                <button>💗 Sign Up</button>
              </Link>
            }
          >
            <HeartButton postRef={postRef} />
          </AuthCheck>

          {currentUser?.uid === post.uid && (
            <Link href={`/admin/${post.slug}`}>
              <button className="btn-blue">Edit Post</button>
            </Link>
          )}
        </aside>
      </main>

      <div className="add-comment">
        <AuthCheck
          fallback={
            <Link href="/enter">
              <button> Login In to add comments ✍ </button>
            </Link>
          }
        >
          <h1>Add to the comments</h1>
          <form onSubmit={onSubmit}>
            <input
              name="comment"
              placeholder="Type here"
              value={formValue}
              onChange={onChange}
            />
            <button type="submit" className="btn-green" disabled={!isValid}>
              Add Comment
            </button>
          </form>
        </AuthCheck>
        <h3 className="begin-comms">Comments </h3>
        <Showcomments comms={comments} />
      </div>
    </>
  );
}
