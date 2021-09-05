/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-children-prop */
import React from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import remarkGfm from "remark-gfm";

//UI component for main post content

export default function PostContent({ post }) {
  const createdAt =
    typeof post?.createdAt === "number"
      ? new Date(post.createdAt)
      : post.createdAt.toDate();
  let content = post?.content;
  return (
    <>
      <div className="cover">
        {post?.BI ? <img src={post?.BI} alt="cover-img" /> : null}
      </div>
      <div className="card inside">
        <h1 className="card-title">{post?.title}</h1>
        <span className="text">
          Written by 💖
          <Link href={`/${post.username}`}>
            <a className="text-info"> @{post?.username} </a>
          </Link>
        </span>
        <span className="text-sm">
          ✔ Published on {new Date(createdAt).toDateString()}
        </span>

        {/*  this line will convert the markdown to html for the end user  */}
        {/* <ReactMarkdown > {content} </ReactMarkdown> */}
        <ReactMarkdown children={content} remarkPlugins={[remarkGfm]} />
      </div>
    </>
  );
}
