/* eslint-disable @next/next/link-passhref */
import Link from "next/link";
import React from "react";

const PostFeed = ({ posts, admin = false }) => {
  return posts.length > 0
    ? posts.map((post) => {
        // console.log("inside", post, admin);
        return <PostItem post={post} key={post.slug} admin={admin} />;
      })
    : null;
  // return <PostItem posts={posts[0]} admin={admin} />;
};

export default PostFeed;

function PostItem({ post, admin = false }) {
  // Naive method to calc word count and read time
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  return (
    <div className="card">
      <Link href={`/${post.username}`}>
        <a>
          <strong>By @{post.username} </strong>
        </a>
      </Link>
      <Link href={`/${post.username}/${post?.slug}`}>
        <h2>
          <a>{post.title}</a>
        </h2>
      </Link>
      <footer>
        <span>
          {wordCount} words. {minutesToRead} mins read
        </span>
        <span className="push-left">💗 {post.heartCount || 0} Hearts</span>
      </footer>
    </div>
  );
}
