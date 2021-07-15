/* eslint-disable @next/next/no-img-element */
import debounce from "lodash.debounce";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../lib/context";
import { auth, firestore, googleAuthProvider } from "../lib/firebase";

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

// Sign in component
function SignInButton() {
  const signInWithGoogle = async () => {
    const ent = await auth.signInWithPopup(googleAuthProvider);
    // console.log(ent);
  };
  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src={"./google.png"} width="30px" alt="google-logo" />
      Sign In With Google
    </button>
  );
}

// signout component
function SignOutButton() {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
}

// username form/checker component
function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const onChange = (e) => {
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true); // to check asynchronously in the database
      setIsValid(false);
    }

    //
  };

  useEffect(() => {
    checkUsername(formValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValue]);

  //Hit the database for username match after each debounced changed
  // useCallback is required for debounce to work
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = firestore.doc(`usernames/${username}`);
        const { exists } = await ref.get();
        // console.log("firestore read executed!");
        setIsValid(!exists);
        setLoading(false);
      }
    }, 500),
    []
  );

  const onSubmit = async (e) => {
    e.preventDefault();

    // create refs for both documents
    const userDoc = firestore.doc(`users/${user.uid}`);
    const usernameDoc = firestore.doc(`usernames/${formValue}`);

    // commit both docs together as a batch write
    const batch = firestore.batch();
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
  };

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input
            name="username"
            placeholder="username"
            value={formValue}
            onChange={onChange}
          />
          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />
          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>

          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );
}

export default EnterPage;

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}
