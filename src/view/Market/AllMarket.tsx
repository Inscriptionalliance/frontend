import { useParams } from "react-router-dom";
import Market from "../Market";
import InscriptionDetail from "./InscriptionDetail";
import Sale from "./Sale";
import WithdrawInscription from "./WithdrawInscription";

const App = () => {
  const params = useParams();

  const Nav = (id: any) => {
    if (Number(id) === 1) {
      return <Market />;
    } else if (Number(id) === 2) {
      return <InscriptionDetail />;
    } else if (Number(id) === 3) {
      return <Sale />;
    } else if (Number(id) === 4) {
      return <WithdrawInscription />;
    } else {
      return <Market />;
    }
  };

  return <>{Nav(params?.id)}</>;
};
export default App;
