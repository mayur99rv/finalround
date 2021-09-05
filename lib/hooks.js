import { auth, firestore } from "../lib/firebase";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export function useUserData() {
  //here auth has been imported from lib/firebase.js
  // and user is an object
  const [user] = useAuthState(auth);
  // console.log(user);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
      const ref = firestore.collection("users").doc(user.uid); //user here is from useAuthSate
      unsubscribe = ref.onSnapshot((doc) => {
        console.log(doc.data());
        setUsername(doc.data()?.username);
      });
    } else {
      setUsername(null);
    }
    // console.log(unsubscribe);
    return unsubscribe;
  }, [user]);

  return { user, username };
}
