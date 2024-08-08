import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import PageLoding from "../components/DataPageLoding";
import MainLayout from "../Layout/MainLayout";
import DeputyLayout from "../Layout/DeputyLayout";
import Mint from "../view/Mint";
import JoinHome from "../view/join/joinHome";
const Home = React.lazy(() => import("../view/Home"));
const Community = React.lazy(() => import("../view/Community"));
const Rank = React.lazy(() => import("../view/Rank"));
const Swap = React.lazy(() => import("../view/Swap"));
const Bridge = React.lazy(() => import("../view/Bridge"));
const Ecology = React.lazy(() => import("../view/Ecology"));
const AllMarket = React.lazy(() => import("../view/Market/AllMarket"));
const BTCEnvironment = React.lazy(() => import("../view/BTCEnvironment"));
const FinalistRanking = React.lazy(() => import("../view/FinalistRanking"));

const Register = React.lazy(() => import("../view/join"));

export default function Router() {
  return (
    <Suspense fallback={<PageLoding></PageLoding>}>
      <Routes>
        <Route path="/*" element={<MainLayout />}>
          <Route path=":address/">
            <Route index element={<JoinHome />}></Route>

            <Route path="BTCEnvironment" element={<BTCEnvironment />}></Route>
            <Route path="Market/:id" element={<AllMarket />}></Route>
            <Route path="Community" element={<Community />}></Route>
            <Route path="Rank" element={<Rank />}></Route>
            <Route path="Swap" element={<Swap />}></Route>
            <Route path="Bridge" element={<Bridge />}></Route>
            <Route path="mint/:id" element={<Mint />}></Route>
            <Route path="join/:step" element={<Register />}></Route>
            <Route path="Ecology" element={<Ecology />}></Route>
            <Route path="FinalistRanking" element={<FinalistRanking />}></Route>

            {/* <Route path="demo" element={<Demo />}></Route> */}
            {/* <Route path="demo1" element={<Demo1 />}></Route> */}
          </Route>
          <Route path="" element={<JoinHome />}></Route>
        </Route>
        <Route path="/DeputyLayout" element={<DeputyLayout />}></Route>
      </Routes>
    </Suspense>
  );
}
