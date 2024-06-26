import {onAuthStateChanged } from "firebase/auth";
import {authCorrect} from "@/lib/fireBase/firebase";

onAuthStateChanged(authCorrect, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        // ...
    } else {
        // User is signed out
        // ...
    }
});