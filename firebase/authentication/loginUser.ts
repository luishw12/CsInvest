import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebaseConfig";
import { toast } from "react-toastify";

const auth = getAuth(app);

export default function loginUser(login: string, password: string) {
  signInWithEmailAndPassword(auth, login, password)
    .then((userCredential) => {
      const user = userCredential.user;

      toast.success("Login realizado com sucesso!")
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      toast.error(`${errorCode}: ${errorMessage}`);
    });
}
