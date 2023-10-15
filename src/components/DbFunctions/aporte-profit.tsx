import {User} from "firebase/auth";
import {doc, DocumentData, getDoc, setDoc} from "firebase/firestore";
import {months} from "@/components/Calender";
import {db} from "../../../firebase/firebaseConfig";
import {toast} from "react-toastify";

export async function handleUpdateAporte(
  e: any,
  type: "aporte" | "profit",
  month: number,
  year: number,
  user: User,
  infos?: DocumentData,
  aporteType?: "add" | "remove"
) {
  const nameMonth = months.find((i) => i.number === month)?.name;
  if (!nameMonth || !infos) return;

  try {
    // Obter uma referência ao documento do usuário
    const userDocRef = doc(db, user.uid, infos.id);
    const docSnapshot = await getDoc(userDocRef);

    if (docSnapshot.exists()) {
      const userData = docSnapshot.data();

      if(type === "aporte") {
        // Verificar se o campo 'aporte' existe
        if (!userData.aporte) {
          userData.aporte = {};
        }

        // Verificar se o 'year' existe
        if (!userData.aporte[year]) {
          userData.aporte[year] = {};
        }

        // Verificar se 'nameMonth' existe
        if (!userData.aporte[year][nameMonth]) {
          userData.aporte[year][nameMonth] = 0;
        }

        // Atualizar o valor de 'nameMonth' com base em 'type'
        if(aporteType) {
          switch (aporteType) {
            case "add":
              userData.aporte[year][nameMonth] = userData.aporte[year][nameMonth] + Number(e.aporte);
              break;
            case "remove":
              userData.aporte[year][nameMonth] = userData.aporte[year][nameMonth] - Number(e.aporte);
              break;
          }
        }
      } else {
        userData[type][year][nameMonth] = Math.round(e[type] * 100) / 100;
      }

      // Atualizar o documento no Firestore
      await setDoc(userDocRef, userData, { merge: true });
      if(type === "aporte") toast.success('Aporte atualizado com sucesso.', {autoClose: 1000});
    } else {
      if(type === "aporte") toast.error('Documento do usuário não encontrado.');
    }
  } catch (error:any) {
    if(type === "aporte") toast.error('Erro ao atualizar aporte:', error);
  }
}