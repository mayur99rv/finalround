import PostFeed from "../../components/PostFeed";
import UserProfile from "../../components/UserProfile";
import { firestore, getUserWithUsername, postToJSON } from "../../lib/firebase";

const UserProfilePage = ({ user, posts }) => {
  // console.log(posts);
  let admin = false;
  return (
    <main>
      <h1>User Posts</h1>
      <UserProfile user={user} />
      <PostFeed posts={posts} admin={admin} />
    </main>
  );
};

export default UserProfilePage;

export async function getServerSideProps({ params, query }) {
  // console.log(params, query.username);
  const { username } = query;

  const userDoc = await getUserWithUsername(username);

  // If no user, short circuit to 404 page
  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  // JSON serializable data
  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();
    // console.log(user);
    const postsQuery = await userDoc.ref
      .collection("posts")
      .where("published", "==", true)
      .orderBy("createdAt", "desc")
      .limit(5)
      .get();
    // const postsQuery = firestore
    //   .collection(`users/${user.uid}/posts`)
    //   .where("published", "==", true)
    //   .orderBy("createdAt", "desc")
    //   .limit(5);
    // console.log(postsQuery);
    posts = postsQuery.docs.map(postToJSON);

    // posts = (await postsQuery.get()).docs.map(postToJSON);
  }

  return {
    props: { user, posts }, // will be passed to the page component as props
  };
}
