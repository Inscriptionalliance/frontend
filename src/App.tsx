import "./App.scss";
import "./App.css";
import { useEffect } from "react";
import "./lang/i18n";
import { useWeb3React } from "@web3-react/core";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import Routers from "./router";
import { GetQueryString, startWord } from "./utils/tool";
// import web3 from 'web3';
import { stateType } from "./store/reducer";
import { createDelMessageAction, setAddInfoAction } from "./store/actions";
import { Login } from "./API";
import Loding from "./components/loding";
import ViewportProvider from "./components/viewportContext";
import prohibit from "./assets/image/prohibit.png";
import cloneIcon from "./assets/image/closeIcon.svg";

import { t } from "i18next";
import useConnectWallet from "./hooks/useConnectWallet";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { isMain } from "./config";
import { message } from "antd";
import { AllTipModal, NoDataContentModal, SoonOpenModal } from "./view/Swap";
import { sbBack } from "./assets/image/MintBox";
import { closeIcon } from "./assets/image/LayoutBox";
import { FlexBox } from "./components/FlexBox";

declare let window: any;

const MessageBox = styled.div`
  position: fixed;
  z-index: 9999;
  top: 90px;
  right: 40px;
  @media screen and (max-width: 967px) {
    right: 0 !important;
  }
`;
const ContentModal = styled(FlexBox)`
  flex-direction: column;
  align-items: center;
  color: #fefefe;
  text-align: center;
  font-family: CKTKingkong;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-top: 30px;
  > img {
    border-radius: 3.3333rem;
    width: 100%;
  }
  > div {
    margin-top: 40px;
  }
`;

const AllTipContent = styled(ContentModal)`
  height: 100%;
  /* padding: 30px 0px 0px; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;
function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const web3React = useWeb3React();
  let state = useSelector<stateType, stateType>((state) => state);

  return (
    <ViewportProvider>
      <MessageBox>
        {state?.message?.map((item, index) => (
          <div className="messageItem" key={index}>
            <div className="messageLebel">
              <img src={prohibit} alt="" />
            </div>
            <div className="messageConter">
              {/* <div className="title">{t("73")}</div> */}
              <div className="messageConter_content">{item.message}</div>
              <img
                className="clone"
                onClick={() => {
                  dispatch(createDelMessageAction(item.index));
                }}
                src={cloneIcon}
                alt=""
              />
            </div>
          </div>
        ))}
      </MessageBox>
      <Routers></Routers>
      {state.showLoding && <Loding></Loding>}

      <AllTipModal
        visible={!!state?.userInfo?.isBindReferee}
        className="allTipModal"
        centered
        width={510}
        closable={false}
        footer={null}
        onCancel={() => {
          // setNoSoonModal(false);
          dispatch(
            setAddInfoAction({ ...state?.userInfo, isBindReferee: false })
          );
        }}
        src={sbBack}
      >
        <div
          className="close"
          onClick={() => {
            // setNoSoonModal(false);
            dispatch(
              setAddInfoAction({ ...state?.userInfo, isBindReferee: false })
            );
          }}
        >
          <img src={closeIcon} alt="" />
        </div>

        <AllTipContent>{t("399")}</AllTipContent>
      </AllTipModal>
    </ViewportProvider>
  );
}

export default App;
