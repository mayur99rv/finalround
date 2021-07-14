/* eslint-disable @next/next/no-img-element */
import React, { useContext } from "react";
import { UserContext } from "../lib/context";
import { auth, googleAuthProvider } from "../lib/firebase";

const EnterPage = () => {
  const { user, username } = useContext(UserContext);
  // 1. User signed out <SignInButton/>
  // 2. User signed in, but missing username <UsernameForm/>
  // 3. User signed in, has username <SignOutButton/>

  return (
    <main>
      {user ? (
        !username ? (
          <>
            <UsernameForm />
            <SignOutButton />
          </>
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
};

function SignInButton() {
  const signInWithGoogle = async () => {
    const ent = await auth.signInWithPopup(googleAuthProvider);
    console.log(ent);
  };
  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src={"./google.png"} width="30px" alt="google-logo" />
      Sign In With Google
    </button>
  );
}

function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
}

function UsernameForm() {
  return null;
}

export default EnterPage;
