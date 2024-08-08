import { useParams } from "react-router-dom";
import Mint from "./Mint";
import Shop from "./Mint2";

const App = () => {
  const params = useParams();
  return <>{Number(params?.id) === 1 ? <Mint /> : <Shop />}</>;
};
export default App;
