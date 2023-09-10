import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { app } from "../firebaseConfig";
import { toast } from "react-toastify";

const auth = getAuth(app);

export default function registerUser(name: string, email: string, password: string, r_password: string) {
  if (password !== r_password) return toast.error("As senhas devem ser iguais!");

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      updateProfile(user, {
        displayName: name,
      }).then(()=> toast.success("Conta criada com sucesso!"))
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      toast.error(`${errorCode}: ${errorMessage}`);
    });
}
