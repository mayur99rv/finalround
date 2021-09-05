/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/link-passhref */
import Link from "next/link";
import React, { useContext } from "react";
import { useRouter } from "next/router";
import { UserContext } from "../lib/context";
import { auth } from "../lib/firebase";

const Navbar = () => {
  const { user, username } = useContext(UserContext);

  const router = useRouter();

  const signOut = () => {
    auth.signOut();
    router.reload();
  };

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button className="btn-logo">BlogIt
     <img src="/home.png" alt="home" />
    </button>
          </Link>
        </li>

        {/* {user is signed in and has username} */}
        {username && (
          <>
            <li className="push-left">
              <button onClick={signOut}>Sign Out</button>
            </li>

            <li>
              <Link href="/admin">
                <button className="btn-blue">Write Posts</button>
              </Link>
            </li>

            <li>
              <Link href={`/${username}`}>
                <img alt="ho" src={user?.photoURL || "/hacker.png"} />
              </Link>
            </li>
          </>
        )}
        {/* {user is not signed in OR has not created username} */}
        {!username && (
          <>
            <li>
              <Link href="/enter">
                <button className="btn-blue">Login In</button>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
