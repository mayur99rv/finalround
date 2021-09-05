/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import React, { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../lib/context";
import router, { useRouter } from "next/router";
import { auth, firestore, googleAuthProvider } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function LoginPage() {
//   const { user, username } = useContext(UserContext);

  const [euser, setEuser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [hasAcc, setHasAcc] = useState(false);

  const clearInputs = () => {
    setEmail("");
    setPassword("");
  };

  const clearError = () => {
    setEmailError("");
    setPasswordError("");
  };
  const handleLogin = () => {
    clearError();
    auth.signInWithEmailAndPassword(email, password).catch((err) => {
      switch (err.code) {
        case "auth/Invalid-email":
        case "auth/user-disabled":
        case "auth/user-not-found":
        case "auth/user-not-found":
          setEmailError(err.message);
          break;
        case "auth/wrong-password":
          setPasswordError(err.message);
          break;
      }
    });
  };

  const handleSignUp = () => {
    clearError();
    auth.createUserWithEmailAndPassword(email, password).catch((err) => {
      switch (err.code) {
        case "auth/email-already-in-use":
        case "auth/invalid-email":
        case "auth/user-not-found":
          setEmailError(err.message);
          break;
        case "auth/weak-password":
          setPasswordError(err.message);
          break;
      }
    });
  };
  const handleLogout = () => {
    auth.signOut();
  };
  const authListener = () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        clearInputs();
        setEuser(user);
        router.push("/enter");
        console.log(euser);
      } else setEuser("");
    });
  };

  useEffect(() => {
    authListener();
  }, []);
  return (
    <>
      {euser ? (
        " "
      ) : (
        <div className="login">
          <Login
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleLogin={handleLogin}
            handleSignUp={handleSignUp}
            hasAcc={hasAcc}
            setHasAcc={setHasAcc}
            emailError={emailError}
            passwordError={passwordError}
          />
        </div>
      )}
    </>
  );
}

const Login = (props) => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    handleSignUp,
    hasAcc,
    setHasAcc,
    emailError,
    passwordError,
  } = props;
  return (
    <section className="login">
      <div className="login-container">
        <label htmlFor="">Username </label>
        <input
          type="text"
          autoFocus
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className="errorMsg">{emailError}</p>
        <label htmlFor="">Password </label>
        <input
          type="password"
          autoFocus
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="errorMsg">{passwordError}</p>
        <div className="btnContainer">
          {hasAcc ? (
            <>
              <button onClick={handleLogin}> Sign In </button>
              <p>
                Don't have an account?{" "}
                <span onClick={() => setHasAcc(!hasAcc)}>SignUp</span>{" "}
              </p>
            </>
          ) : (
            <>
              <button onClick={handleSignUp}>Sign Up</button>
              <p>
                Have an account?{" "}
                <span onClick={() => setHasAcc(!hasAcc)}>SignIn</span>{" "}
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
