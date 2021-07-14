/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/link-passhref */
import Link from "next/link";

const Navbar = () => {
  const user = null;
  const username = null;

  return (
    <>
      <nav className="navbar">
        <ul>
          <li>
            <Link href="/">
              <button className="btn-logo">BlogIt</button>
            </Link>
          </li>
          {/* {user is signed in and has username} */}
          {username && (
            <>
              <li className="push-left">
                <Link href="/admin">
                  <button className="btn-blue">Write Posts</button>
                </Link>
              </li>

              <li>
                <Link href={`/${username}`}>
                  <img src={`${user?.photoURL}`} alt="user-image" />
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
    </>
  );
};

export default Navbar;
