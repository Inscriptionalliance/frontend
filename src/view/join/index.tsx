import { useParams } from "react-router-dom";
import JoinHome from "./joinHome";
import JoinStep from "./joingStep";
import JoinPerson from "./joinPerson";
import CommunityCardDetail from "./CommunityCardDetail";

const App = () => {
  const params = useParams();
  console.log(params);
  return (
    <>
      {String(params?.step) === "home" ? (
        <JoinHome />
      ) : String(params?.step) === "step" ? (
        <JoinStep />
      ) : String(params?.step) === "CommunityCardDetail" ? (
        <CommunityCardDetail />
      ) : (
        <JoinPerson />
      )}
    </>
  );
};
export default App;
