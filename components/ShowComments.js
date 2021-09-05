/* eslint-disable @next/next/link-passhref */
import { firestore, auth, increment, postToJSON } from "@lib/firebase";
import { useDocument } from "react-firebase-hooks/firestore";
import Link from "next/link";

export default function Showcomments({ comms }) {
  return comms
    ? comms.map((comm) => {
        //  const ca = new Date(comm.createdAt)
        return <CommItem comm={comm} key={comm.createdAt} admin={false} />;
      })
    : null;
}

function CommItem({ comm, admin }) {
  return (
    <div className="comment-card">
      {/* <Link href={`/${comm.username}`}>
            <a>
              <strong>By @{comm.username} </strong>
            </a>
          </Link> */}
      <Link href={`/${comm.username}`}>
        <h2>
          <a>
            By <strong className="text-info">@{comm.username} </strong>
            <span className="date-format">
              🟪🟣 {new Date(comm.createdAt).toDateString()}
            </span>
          </a>
        </h2>
      </Link>
      <h3> {comm.comment} </h3>
    </div>
  );
}
