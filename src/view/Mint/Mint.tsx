import "../../assets/style/Mint.scss";
import txt from "../../assets/image/logo.svg";
// import mf from "../../assets/image/Mint/mf.png";
import mfen from "../../assets/image/Mint/mfEn.png";
import mfft from "../../assets/image/Mint/mfFt.png";
import jfen from "../../assets/image/Mint/jfEn.png";
import jfft from "../../assets/image/Mint/jfFt.png";
import minten from "../../assets/image/Mint/mintEn.png";
import mintft from "../../assets/image/Mint/mintFt.png";
import currentAddressNumBg from "../../assets/image/Mint/currentAddressNumBg.gif";
import currentMintNumBg from "../../assets/image/Mint/currentMintNumBg.gif";
import { useEffect, useState, useRef } from "react";
import { Pagination, PaginationProps } from "antd";
import { useTranslation } from "react-i18next";
import ZhuanYiModal from "../../components/Mint";
import { useNavigate } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { useDispatch, useSelector } from "react-redux";
import { useViewport } from "../../components/viewportContext";
import {
  mintDeployInfo,
  mintUserMintList,
  mintUserMintRankList,
  teamInfo,
  mint,
  payBox,
  mintUserBox,
  mintAuth,
  payBoxAuth,
  mintStatus,
  authStatusList,
  mintAuthError,
  payBoxAuthError,
  mintListUser,
} from "../../API";
import {
  setCreditAction,
  setFreeCodeAction,
  setMintFeeAction,
} from "../../store/actions";
import store from "../../store";
import {
  AddrHandle,
  EtherFun,
  addMessage,
  dateFormat,
  showLoding,
  thousandsSeparator,
} from "../../utils/tool";
import styled from "styled-components";
import {
  FlexBox,
  FlexCCBox,
  FlexSACBox,
  FlexSBCBox,
  FlexSECBox,
} from "../../components/FlexBox";
import nocode from "../../assets/image/join/nocode.png";
import i18n from "../../lang/i18n";
import { decimalNum } from "../../utils/decimalNum";
import rightIcon from "../../assets/image/Rank/rightIcon.svg";
import leftIcon from "../../assets/image/Rank/leftIcon.svg";
import { Btn, InfoModal } from "../Market/InscriptionDetail";
import {
  INSBOX,
  INSBOXActive,
  ToLinkIcon,
  sbBack,
} from "../../assets/image/MintBox";
import { closeIcon } from "../../assets/image/LayoutBox";
import { Contracts } from "../../web3";
import {
  ChainBox_Item_Box,
  ChainBox_Item_Box_Item,
  ChainBox_Item_Btn,
  ChainList,
} from "../Market";
import AllIcon from "../../assets/image/Market/AllIcon.svg";
import noActiveOrder from "../../assets/image/join/white.png";
import activeOrder from "../../assets/image/join/active.png";
import competedIcon from "../../assets/image/Mint/competedIcon.svg";
import refreshIcon from "../../assets/image/Mint/refreshIcon.svg";

import { PaginationContainer, PaginationContainerTip } from "../Rank";
import useTime from "../../hooks/useTime";
import NoData from "../../components/NoData";
import { useBindState } from "../../hooks/useBindState";
import { LodingImg } from "../../components/loding";
import { io } from "socket.io-client";
import useWebsocket from "../../hooks/useSocketIO";
import { webSocketUrl } from "../../config";
import { throttle } from "lodash";
import { InfoModalBg } from "../../assets/image/MarketBox";
import { AllTipModal } from "../Swap";
// import useSocketIOComponent from "../../hooks/useSocketIO";
import copyFun from "copy-to-clipboard";
import PageLoding from "../../components/PageLoding";
import { DropIcon } from "../../assets/image/SwapBox";

interface RefType {
  showModal: () => void;
}
const MintContainer = styled.div`
  width: 100%;
  max-width: 1440px;

  @media (min-width: 1920px) {
    max-width: 1650px;
  }
  @media (max-width: 1440px) {
    padding: 0 20px;
  }
  @media (max-width: 650px) {
    padding: 0px;
  }
`;

const NoData_Box = styled(FlexCCBox)`
  padding: 20px;
  > img {
    width: 14rem;
    @media (max-width: 768px) {
      /* max-width: 100px; */
      width: 16rem;
    }
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
const MintProcessContentModal = styled(ContentModal)`
  > div {
    margin-top: 0px;
  }
`;

const ContentModal_Items = styled(FlexSACBox)`
  width: 100%;
  > div {
    width: 100%;
    padding: 10px;
    max-width: 82px;

    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 14px;
    opacity: 0.5;
    background: linear-gradient(0deg, #95fa31 0.01%, #f6f022 99.99%);
    box-shadow: 4px 8px 0px 0px #4a8e00;
    color: #000;
    text-align: center;
    font-family: "CKTKingkong";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    > div {
      width: 100%;
      color: #000;
      text-align: center;
      font-family: "CKTKingkong";
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 16px;
    }
  }
  .Active {
    opacity: 1;
  }

  @media (max-width: 650px) {
    margin-top: 18px !important;
    > div {
      font-size: 3rem;
      width: 23%;
      line-height: 3rem;

      > div {
        font-size: 3rem;
        line-height: 3rem;
      }
    }
  }
`;

const MintBtn = styled(Btn)`
  border-radius: 14px;
  max-width: 290px;
  /* min-height: 44px; */
  padding: 12px;
  margin-bottom: 40px;
  white-space: nowrap;
  @media (max-width: 650px) {
    font-size: 3rem;
  }
`;
const MintResultBtn = styled(MintBtn)`
  max-width: 210px;
`;

const TitleModal = styled.div`
  background: linear-gradient(91deg, #95fa31 0%, #f6f022 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: left;
  font-family: "CKTKingkong";
  font-size: 2rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const MintTitleModal = styled(TitleModal)`
  font-size: 24px;
  @media (max-width: 650px) {
    font-size: 3.75rem;
  }
`;
export const MintProcessTitleModal = styled(TitleModal)`
  font-size: 24px;
  margin-top: 30px;
  @media (max-width: 650px) {
    font-size: 3.75rem;
  }
`;

const RightBox = styled.div`
  flex: 1;
  @media (max-width: 650px) {
    width: 100%;
    padding: 0 3.75rem;
  }
`;

const ChainBox = styled(FlexBox)`
  padding: 17px 38px;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  border-radius: 55px;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 7px 7px 12px 0px #000 inset,
    -5px -5px 7px 0px rgba(255, 255, 255, 0.2) inset;
  backdrop-filter: blur(28.5px);

  margin-bottom: 2.5rem;
  @media (max-width: 1024px) {
    padding: 11px 20px;
    max-width: 100%;
    margin-bottom: 16px;
  }
`;

export const MintChainBox = styled(ChainBox)`
  /* max-width: 83rem; */
  margin-bottom: 2.5rem;

  @media (max-width: 650px) {
    margin-bottom: 24px;

    padding: 11px 20px;
    max-width: 100%;
    border-radius: 45px;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 2.464px 2.464px 4.224px 0px #000 inset,
      -1.76px -1.76px 2.464px 0px rgba(255, 255, 255, 0.2) inset;
    backdrop-filter: blur(10.033162117004395px);
  }
`;

const PicketBox = styled(ChainBox)`
  justify-content: space-between;
  /* max-width: 83rem; */
  margin-bottom: 0rem;
  margin-top: 4rem;
  border-radius: 45px;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 2.464px 2.464px 4.224px 0px #000 inset,
    -1.76px -1.76px 2.464px 0px rgba(255, 255, 255, 0.2) inset;
  backdrop-filter: blur(10.033162117004395px);
  padding: 3px 12px;
  @media (max-width: 650px) {
    margin-top: 30px;
  }
`;
export const MintChainBox_Item_Box_Item = styled(ChainBox_Item_Box_Item)`
  @media (max-width: 650px) {
    > img {
      width: 22px;
    }
  }
`;

export const MintChainBox_Item_Btn = styled(ChainBox_Item_Btn)`
  @media (max-width: 650px) {
    color: #fff;
    font-family: "Gen Shin Gothic P";
    font-size: 14px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;

    > img {
      width: 22px;
    }
  }
`;

const MyIns = styled.div`
  > img {
    width: 100%;
    margin-bottom: 16px;
    border-radius: 40px;
    @media (max-width: 650px) {
      border-radius: 3.3333rem;
      margin-bottom: 12px;
    }
  }
`;
const MyIns_SubTitle = styled(FlexBox)`
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  color: #fff;
  font-family: "CKTKingkong";
  font-size: 2rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  @media (max-width: 650px) {
    font-size: 3.75rem;
    line-height: 3.75rem;
    > svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const InsResult = styled(InfoModal)`
  background-image: none;
`;

const MintRight = styled.div`
  width: 100%;
`;

const InfoItems = styled.div`
  position: relative;
  width: 100%;
  z-index: 99;
  margin-bottom: 30px;
  > div {
    &:last-child {
      margin-bottom: 0;
    }
    &:nth-child(2) {
      align-items: center;
    }
    &:nth-child(4) {
      align-items: flex-end;
    }
  }
`;

const LeftBg = styled.div`
  position: absolute;
  z-index: -1;
  left: 21.5px;
  top: 50%;
  transform: translateY(-50%);
  width: 1px;
  height: calc(100% - 30px);
  background: #95fa31;
`;

const InfoItem = styled(FlexBox)`
  z-index: 999;
  align-items: center;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin-bottom: 35px;
`;
const InfoLeft = styled(FlexCCBox)<{ src: any }>`
  width: 44px;
  height: 44px;
  color: #000;
  font-family: "CKTKingkong";
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 3.24px;
  margin-right: 13px;
  background-image: ${({ src }) => `url(${src})`};
  background-position: center;
  background-size: 100% 100%;
  background-repeat: no-repeat;
`;
const InfoRight = styled(FlexSBCBox)`
  color: #fefefe;
  font-family: "CKTKingkong";
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-align: left;
  flex: 1;
  /* width: 100% */
  > div {
    color: #7681aa;
    font-family: Source Han Sans CN;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 140%; /* 16.8px */
    text-align: left;

    /* width: 100% */
  }
  @media (max-width: 650px) {
    font-size: 2.91666rem;
    img {
      width: 26px;
    }
  }
`;

const InputItem = styled.div`
  margin-top: 0px !important;
  width: 100%;
  color: #fff;
  font-family: "CKTKingkong";
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-align: left;
  > input {
    margin-top: 12px;
    width: 100%;
    border-radius: 40px;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 5px 5px 10px 0px #000 inset,
      -3px -3px 5px 0px rgba(255, 255, 255, 0.2) inset;
    backdrop-filter: blur(28.5px);
    padding: 18px;
    color: #fff;
    font-family: "CKTKingkong";
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    border: none;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
  @media (max-width: 650px) {
    font-size: 2.91666rem;
    > input {
      padding: 12px 18px;
      font-size: 2.91666rem;
    }
  }
`;

const TipItem = styled.div`
  width: 100%;
  text-align: left;
  color: #fefefe;
  font-family: "CKTKingkong";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 48px;
  @media (max-width: 650px) {
    font-size: 2.91666rem;
    margin-bottom: 30px;
  }
`;

const FlexCCBoxWarn = styled(FlexCCBox)`
  margin-bottom: 12px;
  color: #d23035;
`;
const FlexCCBoxTip = styled(FlexCCBox)`
  margin: 24px 12px;
  background: linear-gradient(91deg, #95fa31 0%, #f6f022 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;
const RecordTable_Content_NoData = styled(FlexCCBox)`
  padding: 20px;
`;
const Rank_RecordTable_Content_NoData = styled(RecordTable_Content_NoData)`
  padding: 11rem 0px;
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
const MyLeftMintData = styled(FlexSBCBox)`
  width: 100%;
  margin-top: 2.5rem;
  @media (max-width: 650px) {
    justify-content: space-around;
    margin-top: 0px;
  }
`;
const MyLeftMintData_Item = styled(FlexBox)`
  width: 17.5rem;
  position: relative;
  flex-direction: column;
  align-items: center;
  > img {
    width: 100%;
    position: absolute;
    top: 0;
    z-index: -1;
  }

  @media (max-width: 650px) {
    width: 32.7rem;
  }
`;

const MyLeftMintData_Item_Top = styled(FlexBox)`
  flex-direction: column;
  align-items: center;
  color: #fff;
  text-shadow: 0rem 0rem 0.3333rem rgba(0, 0, 0, 0.25);
  font-family: "CKTKingkong";
  font-size: 2rem;
  line-height: 2rem;
  text-align: center;
  white-space: nowrap;
  > div {
    margin: 3.33rem 0px 7.58rem;
    color: #07b257;
    font-size: 1.5rem;
    font-weight: 400;
    font-family: "CKTKingkong";
    line-height: 1.5rem;
  }
  @media (max-width: 650px) {
    padding-top: 30px;
    font-size: 2.91666rem;
    line-height: 2.91666rem;
    > div {
      margin: 24px 0px 54px;
      font-size: 2.91666rem;
    }
  }
`;

const MyLeftMintData_Item_Bottom = styled(FlexCCBox)`
  color: #d2d6d3;
  font-size: 1.5rem;
  font-weight: 400;
  font-family: "CKTKingkong";
  line-height: 1.5rem;
  @media (max-width: 650px) {
    font-size: 2.91666rem;
    line-height: 2.91666rem;
    text-align: center;
  }
`;

const PicketBox_Item = styled(FlexCCBox)`
  font-size: 2.91666rem;
  line-height: 2.91666rem;
  color: #fff;
  text-align: left;
  font-family: "CKTKingkong";
  font-weight: 400;
  img {
    width: 38px;
    margin-right: 8px;
  }
`;

const LongBox = styled.div`
  width: 100%;
  padding: 0rem 3.33rem;
  > div {
    padding: 1rem 0px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: rgba(255, 255, 255, 0.8);
    font-family: CKTKingkong;
    font-size: 1.33333rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    &:last-child {
      padding: 0px 0px 2rem;
    }
    > span {
      font-size: 1.33333rem;
    }
    @media (max-width: 768px) {
      font-size: 2.2rem;
      > span {
        font-size: 2.2rem;
      }
      /* padding: 2rem 0rem; */
    }
  }
  @media (max-width: 768px) {
    padding: 0 2.91666rem;
  }
`;

let intervalItem: any;
let intervalRef: any;
// -
let intervalReConnect: any;

const Mint = () => {
  const { t, i18n } = useTranslation();
  const nav = useNavigate();
  const web3React = useWeb3React();
  const { width } = useViewport();
  const token = useSelector<any>((state) => state.token);

  let dispatch = useDispatch();
  const Navigate = useNavigate();
  const [type, setType] = useState<any>(1);
  const [tHeader, setHeader] = useState<any>([]);
  const [tBody, setBody] = useState<any>([]);
  const modalref = useRef<RefType>(null);
  const [tootalInfo, setInfo] = useState<any>({});
  const [MintDeployInfo, setMintDeployInfo] = useState<any>({});
  const [MintUserBox, setMintUserBox] = useState<any>({});
  const [ResApiObj, setResApiObj] = useState<any>({});
  const [intervalCode, setIntervalCode] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageNum, setPageNum] = useState(1);
  const [MintModal, setMintModal] = useState(false);
  const [MintProcessModal, setMintProcessModal] = useState(false);
  const [MintResultModal, setMintResultModal] = useState(false);
  const [IsOneStepCompeted, setIsOneStepCompeted] = useState(false);
  const [IsOneIntervalFun, setIsOneIntervalFun] = useState(false);
  const [MintedSuccessToChain, setMintedSuccessToChain] = useState(false);
  const [IsMakeUpPrice, setIsMakeUpPrice] = useState(true);
  const [IsMakeUpPriceTip, setIsMakeUpPriceTip] = useState(false);
  const [ShowTipModal, setShowTipModal] = useState(false);
  const [IsReconnect, setIsReconnect] = useState(false);
  const [inputAmount, setInputAmount] = useState(1);
  const [ChainName, setChainName] = useState("Binance");

  const [ActiveStep, setActiveStep] = useState<any>(0);
  const [MintBtnState, setMintBtnState] = useState<any>(0);
  const [dataLoding, setDataLoding] = useState(true);
  const [OpenList, setOpenList] = useState<any>([]);

  const [diffTime, status, initDiffTime, setDiffTime] = useTime({
    initDiffTime: 0,
  });
  const { getBindStateFun } = useBindState();
  // const { startListening, sendMessage } = useSocketIOComponent();
  const {
    wsData,
    readyState,
    closeWebSocket,
    reconnect,
    sendMessage,
    OpenState,
    setOpenState,
  } = useWebsocket({
    url: webSocketUrl, // -ebsocket-
    verify: true, // --
  });

  const onChange: PaginationProps["onChange"] = (page) => {
    console.log(page);
    setPageNum(page);
  };
  const itemRender: PaginationProps["itemRender"] = (
    _,
    type,
    originalElement
  ) => {
    if (type === "prev") {
      return (
        <FlexCCBox style={{ width: "100%" }}>
          <img src={leftIcon} alt="" />
        </FlexCCBox>
      );
    }
    if (type === "next") {
      return (
        <FlexCCBox style={{ width: "100%" }}>
          <img src={rightIcon} alt="" />
        </FlexCCBox>
      );
    }
    return originalElement;
  };

  const MintProcessArr = [
    { order: 1, name: "522", status: false },
    // { order: 2, name: "-OX", status: false },
    { order: 3, name: "523", status: false },
    // { order: 4, name: "Mint-, status: false },
  ];

  const statusType = {
    "-1": "550",
    "0": "551",
    "1": "552",
    "2": "553",
    "3": "554",
    "4": "555",
    "5": "556",
  };

  const changeType = (typer: number) => {
    if (type === typer) return;
    setType(typer);
    setPageNum(1);
  };
  const getInitDataFun = () => {
    mintDeployInfo({})?.then((res: any) => {
      setMintBtnState(res?.data?.isAllowMint ?? 0);
      setMintDeployInfo(res?.data || {});
    });
    mintUserBox({})?.then((res: any) => {
      setMintUserBox(res?.data || {});
    });
  };

  const getWebsocketFun = () => {
    // if (readyState.key === 1) {
    console.log("-");

    sendMessage(
      JSON.stringify({
        token: token,
        lang: i18n.language,
        operate: 1,
        data: "111",
      })
    );
    // }
  };

  const getTeamInfo = () => {
    teamInfo({}).then((res: any) => {
      if (res.code === 200) {
        setInfo(res.data);
        dispatch(setFreeCodeAction(res?.data?.freeTicket));
        dispatch(setCreditAction(res?.data?.credit));
        dispatch(setMintFeeAction(res?.data?.mintTicket));
      }
    });
  };

  const mintStep2 = async (call: any, isFirst: any = 0) => {
    let resContract: any;
    let resApiObj: any;
    try {
      resApiObj = await mint({});
      await call();
      changeMintProcess(3);
      setResApiObj(resApiObj || {});
      resContract = await Contracts?.example?.sendTransaction(
        web3React?.account as string,
        resApiObj?.data?.toAddress,
        resApiObj?.data?.mintJsonHex,
        async (error: any) => {
          if (error?.code === 4001) return console.log("error-1");
          await mintAuth({ authNum: resApiObj?.data?.authNum });
        }
      );
    } catch (error: any) {
      if (error?.code === 4001) {
        console.log("error-2");
        changeMintProcess(2);
        await mintAuthError({ authNum: resApiObj?.data?.authNum });
      }
    }
    showLoding(false);
    if (!!resContract?.status) {
      resContract = null;
      setMintedSuccessToChain(true);
    } else {
      if (resContract?.status === false) {
        await mintAuthError({ authNum: resApiObj?.data?.authNum });
        return addMessage(t("342"));
      }
    }
  };

  const changeMintProcess = (type: -1 | 0 | 1 | 2 | 3 | 4) => {
    setActiveStep(type);
  };

  const mintFun = async (num: number) => {
    if (!token) return;
    let item: any;
    let errorFlag: boolean = false;
    if (Number(ActiveStep) === 2) return mintStep2(() => {}, true);
    try {
      item = await payBox({ mintNum: num });
      console.log(item, "item");
    } catch (error: any) {
      return addMessage("error");
    }
    if (item?.code === 200) {
      // showLoding(true);
      changeMintProcess(1);
      let resContract: any;
      let BNBNum = await Contracts?.example?.queryWethByUsdt(
        web3React?.account as string,
        item?.data?.amount
      );
      console.log(BNBNum, "BNBNum");

      try {
        resContract = await Contracts?.example?.mintBox(
          web3React?.account as string,
          item?.data?.sign,
          EtherFun(BNBNum ?? "0"),
          async (error: any) => {
            if (error?.code === 4001) return console.log("error-1");
            await payBoxAuth({ authNum: item?.data?.authNum });
            console.log("error-1");
          }
        );
      } catch (e: any) {
        if (e?.code === 4001) {
          console.log("error-2");
          errorFlag = true;
          changeMintProcess(0);
          await payBoxAuthError({ authNum: item?.data?.authNum });
        }
      }
      if (!!resContract?.status) {
        setIsOneStepCompeted(true);
        resContract = null;
      } else {
        if (!errorFlag) {
          await payBoxAuthError({ authNum: item?.data?.authNum });
        }
        if (resContract?.status === false) {
          showLoding(false);
          console.log(resContract, "resContract1");
          return addMessage(t("342"));
        }
      }
    } else {
      getInitDataFun();
      getTeamInfo();
      return addMessage(item?.msg);
    }
  };
  // -
  const successFun = async () => {
    setMintProcessModal(false);
    await getRecordFun();
    await getInitDataFun();
    await getTeamInfo();
    setInputAmount(1);
    if (!!ResApiObj?.data?.isFirst) {
      setMintResultModal(true);
    } else {
      addMessage(t("524"));
    }
  };

  const getRecordFun = () => {
    setDataLoding(true);
    setBody([]);
    if (type === 1) {
      setHeader(["343", "344", "585", "346"]);
      mintUserMintList({ pageNum, pageSize }).then((res: any) => {
        setDataLoding(false);

        setBody(res?.data || []);
      });
    } else if (type === 2) {
      setHeader(["347", "344", "349", "585"]);
      mintUserMintRankList({ pageNum, pageSize }).then((res: any) => {
        setDataLoding(false);

        setBody(res?.data || []);
      });
    } else {
      if (width > 650) {
        setHeader(["545", "546", "580", "581", "585", "548"]);
      } else {
        setHeader(["545", "546", "585", "548"]);
      }
      mintListUser({ pageNum, pageSize }).then((res: any) => {
        setDataLoding(false);

        setBody(res?.data || []);
      });
    }
  };

  const reconnectFun = () => {
    // webSocketInit();
    intervalReConnect = setInterval(() => {
      reconnect();
    }, 5000);
  };

  // -
  const getWebsocketData = (code: -1 | 0 | 2 | 1 | 3 | 4) => {
    // -int-
    setMintBtnState(Number(code));
    // --int）
    if (
      Number(ActiveStep) < Number(code) ||
      (Number(ActiveStep) === 3 && Number(code) === 0)
    ) {
      changeMintProcess(code);
    }
    // -
    // if (
    //   Number(wsData?.operate) === 2 &&
    //   Number(wsData?.type) === 1 &&
    //   Number(code) === 4
    // ) {
    //   setMintProcessModal(false);
    //   setMintModal(false);
    //   return setShowTipModal(true);
    // }
    // -
    if (
      IsMakeUpPrice &&
      Number(wsData?.operate) === 1 &&
      Number(wsData?.type) === 1 &&
      Number(code) === -1
    ) {
      mintFun(0);
      setMintProcessModal(true);
      setIsMakeUpPriceTip(true);
      setIsMakeUpPrice(false);
    }
    // -ox-
    if (IsOneStepCompeted && Number(code) === 2) {
      mintStep2(() => {}, true);
      return setIsOneStepCompeted(false);
    }
    // mint-
    if (MintedSuccessToChain && Number(code) === 0) {
      successFun();
      setMintProcessModal(false);
      setIsMakeUpPriceTip(false);
      setMintedSuccessToChain(false);
    }
  };

  // -
  const getNoWebsocketData = (code: any) => {
    // -int-
    setMintBtnState(Number(code));
    // -mint）
    if (
      Number(ActiveStep) < Number(code) ||
      (Number(ActiveStep) === 3 && Number(code) === 0)
    ) {
      changeMintProcess(code);
    }
    //-
    if (IsMakeUpPrice && Number(code) === -1) {
      mintFun(0);
      setMintProcessModal(true);
      setIsMakeUpPriceTip(true);
      setIsMakeUpPrice(false);
    }
    //-bo-
    if (IsOneStepCompeted && Number(code) === 2) {
      mintStep2(() => {}, true);
      return setIsOneStepCompeted(false);
    }
    // min-
    if (MintedSuccessToChain && Number(code) === 0) {
      successFun();
      setMintProcessModal(false);
      setIsMakeUpPriceTip(false);
      setMintedSuccessToChain(false);
    }
  };

  //-websocke-
  const getWebsocketDataNoWork = async () => {
    let item: any;
    let item1: any;
    intervalRef = setInterval(async () => {
      try {
        item = await mintStatus({});
        //-
        item1 = await authStatusList({ expireType: 1 });
        // if (
        //   item1?.code === 200 &&
        //   Number(item1?.data?.expireType) === 1 &&
        //   Number(item1?.data?.expireStatus) === 4
        // ) {
        //   setMintProcessModal(false);
        //   setMintModal(false);
        //   return setShowTipModal(true);
        // }
        if (item?.code === 200) {
          setIntervalCode(item?.data?.mintStatus);
        }
      } catch (error: any) {}
    }, 5000);
  };

  //-min-
  const getMintRecord = async () => {
    intervalItem = setInterval(async () => {
      try {
        mintDeployInfo({})?.then((res: any) => {
          setMintBtnState(res?.data?.isAllowMint ?? 0);
          setMintDeployInfo(res?.data || {});
        });
        if (type === 1) {
          mintUserMintList({ pageNum, pageSize }).then((res: any) => {
            setDataLoding(false);
            setBody(res?.data || []);
          });
        }
      } catch (error: any) {}
    }, 20000);
  };
  const openFun = (type: any) => {
    let Arr: any = OpenList;
    if (Arr?.some((item: any) => Number(item) === Number(type))) {
      Arr = Arr?.filter((item: any) => Number(item) !== Number(type));
    } else {
      Arr = [...Arr, type];
    }
    setOpenList(Arr);
    console.log(Arr, "Arr");
  };

  useEffect(() => {
    getTeamInfo();
    if (token) {
      getInitDataFun();
    }
  }, [token]);
  useEffect(() => {
    if (token && Number(OpenState) === 1) {
      setTimeout(() => getWebsocketFun(), 1000);
    }
  }, [token, OpenState]);

  useEffect(() => {
    if (!token) return;
    getRecordFun();
    getMintRecord();
    return () => {
      clearInterval(intervalItem);
    };
  }, [token, pageNum, type]);

  useEffect(() => {
    console.log(wsData, readyState);
    if (!!token) {
      if (
        Object.keys(wsData).length !== 0 &&
        readyState.key === 1 &&
        Number(wsData?.code) <= 100
      ) {
        getWebsocketData(wsData?.code);
        clearInterval(intervalRef);
        clearInterval(intervalReConnect);
        setIsReconnect(false);
      } else {
        getNoWebsocketData(Number(intervalCode));
      }
      if (readyState.key === 3) {
        console.log("goushi");
        setOpenState(0);
        setIsReconnect(true);
      }
    }
  }, [
    token,
    wsData,
    readyState,
    ActiveStep,
    IsOneStepCompeted,
    MintedSuccessToChain,
    intervalCode,
    IsMakeUpPrice,
  ]);

  useEffect(() => {
    // console.log(wsData, readyState);
    if (IsReconnect) {
      //-
      reconnectFun();
    }
  }, [IsReconnect]);

  useEffect(() => {
    return () => {
      console.log("");
      closeWebSocket();
    };
  }, []);

  useEffect(() => {
    if (!!token) {
      if (Object.keys(wsData).length === 0 && !IsOneIntervalFun) {
        getWebsocketDataNoWork();
        setIsOneIntervalFun(true);
      }
    }
  }, [token, wsData]);

  return (
    <MintContainer className="mint">
      <div>
        <div className="left">
          <MyIns>
            <img
              src={!!MintUserBox?.isMintBox ? INSBOXActive : INSBOX}
              alt=""
            />
            <MyIns_SubTitle
              onClick={() => {
                Navigate("/View/join/person", {
                  state: { activeTab: "asset" },
                });
              }}
            >
              {t("261")} <ToLinkIcon />
            </MyIns_SubTitle>
          </MyIns>
          {/* <div className="left_b">
            <img src={txt} alt="" />
            <div>
              {web3React.account?.replace(/^(.{7})(.*)(.{6})$/, "$1...$3")}
            </div>
            <div>
              {t("79")} :{" "}
              {tootalInfo?.freeTicket
                ? thousandsSeparator(tootalInfo?.freeTicket ?? "0")
                : 0}
              <img src={i18n.language === "zh" ? mfft : mfen} alt="" />
            </div>
            <div>
              {t("80")} :{" "}
              {tootalInfo?.mintTicket
                ? thousandsSeparator(tootalInfo?.mintTicket ?? "0")
                : 0}
              <img src={i18n.language === "zh" ? mintft : minten} alt="" />
            </div>
            <div style={{ marginBottom: "28.8px" }}>
              {t("81")} :{" "}
              {tootalInfo?.credit
                ? thousandsSeparator(tootalInfo?.credit ?? "0")
                : 0}
              <img src={i18n.language === "zh" ? jfft : jfen} alt="" />
            </div>

            <div>{tootalInfo?.rank ? tootalInfo?.rank : t("51")}</div>
            <div>{t("82")}</div>
          </div> */}

          {/* {width <= 650 && (
            <PicketBox>
              <PicketBox_Item>
                <img src={i18n.language === "zh" ? mfft : mfen} alt="" />
                {tootalInfo?.freeTicket
                  ? thousandsSeparator(tootalInfo?.freeTicket ?? "0")
                  : 0}
              </PicketBox_Item>
              <PicketBox_Item>
                <img src={i18n.language === "zh" ? mintft : minten} alt="" />
                {tootalInfo?.mintTicket
                  ? thousandsSeparator(tootalInfo?.mintTicket ?? "0")
                  : 0}
              </PicketBox_Item>
              <PicketBox_Item>
                <img src={i18n.language === "zh" ? jfft : jfen} alt="" />
                {tootalInfo?.credit
                  ? thousandsSeparator(tootalInfo?.credit ?? "0")
                  : 0}
              </PicketBox_Item>
            </PicketBox>
          )} */}

          <MyLeftMintData>
            <MyLeftMintData_Item>
              <img src={currentMintNumBg} alt="" />
              <MyLeftMintData_Item_Top>
                {thousandsSeparator(MintDeployInfo?.mintNum ?? "0") ?? 0}
                <div>BTIA</div>
              </MyLeftMintData_Item_Top>
              <MyLeftMintData_Item_Bottom>
                {t("577")}
              </MyLeftMintData_Item_Bottom>
            </MyLeftMintData_Item>
            <MyLeftMintData_Item>
              <img src={currentAddressNumBg} alt="" />
              <MyLeftMintData_Item_Top>
                {thousandsSeparator(MintDeployInfo?.peopleNum ?? "0") ?? 0}
                <div style={{ color: "#90B207" }}>BTIA</div>
              </MyLeftMintData_Item_Top>
              <MyLeftMintData_Item_Bottom>
                {t("578")}
              </MyLeftMintData_Item_Bottom>
            </MyLeftMintData_Item>
          </MyLeftMintData>
        </div>

        <RightBox>
          <MintChainBox>
            {/* <MintChainBox_Item_Btn>
            <img src={AllIcon} alt="" />
            {t("265")}
          </MintChainBox_Item_Btn> */}
            <ChainBox_Item_Box>
              {ChainList?.map((item: any, index: any) => (
                <MintChainBox_Item_Box_Item key={index}>
                  <img
                    src={
                      String(item?.name) === String(ChainName)
                        ? item?.activeIcon
                        : item?.icon
                    }
                    alt=""
                    onClick={() => {
                      if (String(item?.name) === "Binance") {
                        setChainName(item?.name);
                      } else {
                        return addMessage(t("67"));
                      }
                    }}
                  />
                </MintChainBox_Item_Box_Item>
              ))}
            </ChainBox_Item_Box>
          </MintChainBox>
          <MintRight className="right">
            <div>
              <div>
                <span>
                  {t("83")} : {MintDeployInfo?.myMintNum ?? 0} {t("355")}
                </span>
                <span>{MintDeployInfo?.accord ?? "--"}</span>
              </div>

              <div>
                <div>
                  {t("84")} : {MintDeployInfo?.rank ?? 0}
                  {/* {t("186")} */}
                </div>
                <div>
                  <div onClick={() => modalref.current?.showModal()}>
                    {t("85")}
                  </div>
                  <div
                    onClick={() => {
                      // return addMessage(t("Open soon"));
                      Navigate("/View/Market/1");
                    }}
                  >
                    {t("86")}
                  </div>
                </div>
              </div>

              <div>
                <div>
                  <div
                    className="inner"
                    style={{
                      width: `${MintDeployInfo?.castRatio ?? 0}`,
                    }}
                  ></div>
                </div>
                <span>{MintDeployInfo?.castRatio ?? "--"}</span>
              </div>
            </div>

            <div>
              <div>
                <span>{t("360")}</span>
                <span>
                  {/* {width > 425
                ? web3React.account
                : web3React.account?.replace(/^(.{8})(.*)(.{9})$/, "$1...$3")} */}
                  {/* {AddrHandle(MintDeployInfo?.ethscription, 6, 10) ?? 0} */}
                  {MintDeployInfo?.accord ?? "--"}
                </span>
              </div>
              <div>
                <span>
                  {t("87")}
                  {/* {t("355")} */}
                </span>
                <span>{MintDeployInfo?.mintAll ?? 0}</span>
              </div>
              <div>
                <span>
                  {t("88")}
                  {/* {t("355")} */}
                </span>
                <span>
                  {thousandsSeparator(MintDeployInfo?.mintNum ?? "0") ?? 0}{" "}
                </span>
              </div>
              <div>
                <span>{t("89")}</span>
                <span>
                  {thousandsSeparator(MintDeployInfo?.mintOne ?? "0") ?? 0}
                </span>
              </div>

              <div>
                <span>{t("350")}</span>
                <span>
                  {MintDeployInfo?.deployAddress?.length > 20
                    ? AddrHandle(MintDeployInfo?.deployAddress, 6, 6)
                    : "--"}
                </span>
              </div>
              <div>
                <span>{t("92")}</span>
                {MintDeployInfo?.createTime ? (
                  <span>{MintDeployInfo?.createTime ?? "--:--:--"}</span>
                ) : (
                  <span>--/--/--</span>
                )}
              </div>
              <div>
                <span>{t("93")}</span>
                <span>
                  {thousandsSeparator(MintDeployInfo?.peopleNum ?? "0") ?? 0}
                </span>
              </div>
              <div>
                <span>{t("94")}</span>
                <span>
                  {thousandsSeparator(MintDeployInfo?.tradeAmount ?? "0") ?? 0}
                </span>
              </div>
              <div>
                {Number(MintDeployInfo?.mintAll) !==
                Number(MintDeployInfo?.mintNum) ? (
                  <div
                    className="btn"
                    onClick={() => {
                      //--min-  -min- --
                      if (Number(MintBtnState) === 0) {
                        setMintModal(true);
                      } else {
                        if (Number(MintBtnState) === 2) {
                          getBindStateFun(
                            () => mintFun(inputAmount),
                            () => {
                              setMintModal(false);
                            }
                          );
                          setMintProcessModal(true);
                        } else if (Number(MintBtnState) === -1) {
                          getBindStateFun(
                            () => mintFun(0),
                            () => {
                              setMintModal(false);
                            }
                          );
                          setMintProcessModal(true);
                        } else if (
                          Number(MintBtnState) === 3 ||
                          Number(MintBtnState) === 1
                        ) {
                          setMintProcessModal(true);
                        }
                      }
                    }}
                  >
                    {t("95")}
                  </div>
                ) : (
                  <div
                    className="btn"
                    style={{ opacity: "0.5" }}
                    onClick={() => {}}
                  >
                    {t("530")}
                  </div>
                )}
              </div>
            </div>

            <div>
              <span
                onClick={() => changeType(1)}
                className={type === 1 ? "active" : ""}
              >
                {t("351")}
              </span>
              <span
                onClick={() => changeType(3)}
                className={type === 3 ? "active" : ""}
              >
                {t("544")}
              </span>
              <span
                onClick={() => changeType(2)}
                className={type === 2 ? "active" : ""}
              >
                {t("352")}
              </span>
            </div>

            <div>
              <header>
                {tHeader.map((item: any, index: number) => {
                  return (
                    <div
                      className={
                        type === 1
                          ? ""
                          : type === 2
                          ? "small_head autoRank_head"
                          : "small_head"
                      }
                      key={index}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {t(item)}
                    </div>
                  );
                })}
              </header>
              <div style={{ display: "none" }} />
              {type === 1 &&
                (!dataLoding ? (
                  tBody?.list?.length > 0 ? (
                    tBody?.list?.map((item: any, index: number) => {
                      return (
                        <div
                          className="td"
                          id={width > 425 ? "" : "small_size"}
                          key={index}
                        >
                          <div style={{ lineHeight: "normal" }}>
                            {item?.createTime}
                          </div>
                          <div>{AddrHandle(item?.userAddress, 4, 4)}</div>
                          <div>
                            {thousandsSeparator(item?.mintNum ?? "0") ?? 0}
                          </div>
                          <div
                            style={{ color: "#95FA31" }}
                            onClick={() => {
                              copyFun(item?.mintHash);
                              addMessage(t("Copied successfully"));
                            }}
                          >
                            {AddrHandle(item?.mintHash, 6, 6)}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <NoData_Box>
                      {/* <img src={nocode} alt="" /> */}
                      <NoData />
                    </NoData_Box>
                  )
                ) : (
                  <Rank_RecordTable_Content_NoData>
                    <PageLoding></PageLoding>
                  </Rank_RecordTable_Content_NoData>
                ))}

              {type === 2 &&
                (!dataLoding ? (
                  tBody?.list?.length > 0 ? (
                    tBody?.list?.map((item: any, index: number) => {
                      return (
                        <div
                          className="td"
                          id={width > 425 ? "" : "small_size"}
                          key={index}
                        >
                          <div>{item?.rank}</div>
                          <div>{item?.userAddress ?? "--"}</div>
                          <div>{item?.ratio ?? "--"}</div>
                          <div
                            // style={{ color: "#95FA31" }}
                            // onClick={() => {
                            //   copyFun(item?.mintHash);
                            //   addMessage(t("Copied successfully"));
                            // }}
                            className="autoRank"
                          >
                            {thousandsSeparator(item?.mintNum ?? "0") ?? "0"}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <NoData_Box>
                      {/* <img src={nocode} alt="" /> */}
                      <NoData />
                    </NoData_Box>
                  )
                ) : (
                  <Rank_RecordTable_Content_NoData>
                    <PageLoding></PageLoding>
                  </Rank_RecordTable_Content_NoData>
                ))}
              {type === 3 &&
                (width > 650 ? (
                  !dataLoding ? (
                    tBody?.list?.length > 0 ? (
                      tBody?.list?.map((item: any, index: number) => {
                        return (
                          <>
                            <div
                              className="td"
                              id={width > 425 ? "" : "small_size"}
                              key={index}
                            >
                              <div style={{ lineHeight: "normal" }}>
                                {item?.createTime}
                              </div>
                              <div style={{ lineHeight: "normal" }}>
                                {t(statusType[item?.status])}
                              </div>
                              <div>
                                {thousandsSeparator(item?.mintNumFree ?? "0") ??
                                  "--"}
                              </div>
                              <div>
                                {thousandsSeparator(item?.mintNumPaid ?? "0") ??
                                  "--"}
                              </div>
                              <div>
                                {thousandsSeparator(item?.mintNum ?? "0") ??
                                  "--"}
                              </div>
                              <div
                                style={{ color: "#95FA31" }}
                                onClick={() => {
                                  copyFun(item?.hash);
                                  addMessage(t("Copied successfully"));
                                }}
                              >
                                {item?.hash?.length > 16
                                  ? AddrHandle(item?.hash, 6, 6)
                                  : ""}
                              </div>
                            </div>
                          </>
                        );
                      })
                    ) : (
                      <NoData_Box>
                        {/* <img src={nocode} alt="" /> */}
                        <NoData />
                      </NoData_Box>
                    )
                  ) : (
                    <Rank_RecordTable_Content_NoData>
                      <PageLoding></PageLoding>
                    </Rank_RecordTable_Content_NoData>
                  )
                ) : !dataLoding ? (
                  tBody?.list?.length > 0 ? (
                    tBody?.list?.map((item: any, index: number) => {
                      return (
                        <>
                          <div
                            className="td"
                            id={width > 425 ? "" : "small_size"}
                            key={index}
                          >
                            <div style={{ lineHeight: "normal" }}>
                              {item?.createTime}
                            </div>
                            <div style={{ lineHeight: "normal" }}>
                              {t(statusType[item?.status])}
                            </div>
                            <div>
                              {thousandsSeparator(item?.mintNum ?? "0") ?? "--"}
                            </div>
                            <div
                              style={{ color: "#95FA31" }}
                              onClick={() => {
                                copyFun(item?.hash);
                                addMessage(t("Copied successfully"));
                              }}
                            >
                              {item?.hash?.length > 16
                                ? AddrHandle(item?.hash, 6, 6)
                                : ""}
                            </div>
                            <div
                              onClick={() => {
                                openFun(item?.id);
                              }}
                              className="dropBox"
                            >
                              {" "}
                              <DropIcon
                                className={
                                  OpenList?.some(
                                    (item1: any) =>
                                      Number(item1) === Number(item?.id)
                                  )
                                    ? "rotetaOpen"
                                    : "rotetaClose"
                                }
                              />
                            </div>
                          </div>
                          {OpenList?.some(
                            (item1: any) => Number(item1) === Number(item?.id)
                          ) && (
                            <LongBox>
                              <div>
                                {t("580")} :
                                <span>
                                  {thousandsSeparator(
                                    item?.mintNumFree ?? "0"
                                  ) ?? "--"}
                                </span>
                              </div>
                              <div>
                                {t("581")} :
                                <span>
                                  {thousandsSeparator(
                                    item?.mintNumPaid ?? "0"
                                  ) ?? "--"}
                                </span>
                              </div>
                            </LongBox>
                          )}
                        </>
                      );
                    })
                  ) : (
                    <NoData_Box>
                      {/* <img src={nocode} alt="" /> */}
                      <NoData />
                    </NoData_Box>
                  )
                ) : (
                  <Rank_RecordTable_Content_NoData>
                    <PageLoding></PageLoding>
                  </Rank_RecordTable_Content_NoData>
                ))}
            </div>

            <PaginationContainer>
              <Pagination
                current={pageNum}
                pageSize={10}
                onChange={onChange}
                total={tBody?.total}
                showQuickJumper
                defaultCurrent={1}
                itemRender={itemRender}
              />
              {type !== 3 && (
                <PaginationContainerTip>( {t("558")} )</PaginationContainerTip>
              )}
            </PaginationContainer>
          </MintRight>
        </RightBox>
        {/*- */}
        <InfoModal
          visible={MintModal}
          className="Modal"
          centered
          width={510}
          closable={false}
          footer={null}
          onCancel={() => {
            setMintModal(false);
          }}
          src={sbBack}
        >
          <div
            className="close"
            onClick={() => {
              setMintModal(false);
            }}
          >
            <img src={closeIcon} alt="" />
          </div>
          <MintTitleModal>{t("353")}</MintTitleModal>
          <ContentModal>
            <InputItem>
              {t("525")}：
              <input
                type="number"
                min={1}
                max={100}
                value={inputAmount}
                onChange={(e: any) => {
                  let newValue = e.target.value;
                  //-
                  if (/^\d*$/.test(newValue)) {
                    const numValue = Number(newValue);
                    //- 1- 100-
                    if (newValue === "" || (numValue >= 1 && numValue <= 100)) {
                      setInputAmount(newValue);
                    }
                  }
                }}
              />
            </InputItem>
            <ContentModal_Items>
              <div
                onClick={() => {
                  setInputAmount(1);
                }}
                className={Number(inputAmount) === 1 ? "Active" : ""}
              >
                <div>1</div>
                {t("355")}
              </div>
              <div
                onClick={() => {
                  setInputAmount(20);
                }}
                className={Number(inputAmount) === 20 ? "Active" : ""}
              >
                <div>20</div>
                {t("355")}
              </div>
              <div
                onClick={() => {
                  setInputAmount(50);
                }}
                className={Number(inputAmount) === 50 ? "Active" : ""}
              >
                <div>50</div>
                {t("355")}
              </div>
              <div
                onClick={() => {
                  setInputAmount(100);
                }}
                className={Number(inputAmount) === 100 ? "Active" : ""}
              >
                <div>100</div>
                {t("355")}
              </div>
            </ContentModal_Items>
            <MintBtn
              onClick={() => {
                if (Number(tootalInfo?.mintTicket) >= Number(inputAmount)) {
                  getBindStateFun(
                    () => mintFun(inputAmount),
                    () => {
                      setMintModal(false);
                    }
                  );
                  setMintModal(false);
                  setMintProcessModal(true);
                } else {
                  return addMessage(t("526"));
                }
              }}
            >
              Mint
            </MintBtn>
          </ContentModal>
        </InfoModal>

        {/* min- */}
        <InfoModal
          visible={MintProcessModal}
          className="Modal"
          centered
          width={510}
          closable={false}
          footer={null}
          onCancel={() => {
            setMintProcessModal(false);
          }}
          src={sbBack}
        >
          <div
            className="close"
            onClick={() => {
              setMintProcessModal(false);
            }}
          >
            <img src={closeIcon} alt="" />
          </div>
          <MintProcessTitleModal>{t("527")}</MintProcessTitleModal>
          <MintProcessContentModal>
            <InfoItems>
              <LeftBg></LeftBg>
              {MintProcessArr?.map((item: any, index: any) => (
                <InfoItem key={index}>
                  <InfoLeft
                    src={
                      Number(ActiveStep) >= Number(item?.order)
                        ? activeOrder
                        : noActiveOrder
                    }
                  >
                    {Number(item?.order) === 3 ? 2 : item?.order}
                  </InfoLeft>
                  <InfoRight>
                    {t(item?.name)}

                    {Number(ActiveStep) >= Number(item?.order) && (
                      <div>
                        {Number(ActiveStep) === Number(item?.order) ? (
                          <LodingImg>
                            <img src={refreshIcon} alt="" />
                          </LodingImg>
                        ) : (
                          <img src={competedIcon} alt="" />
                        )}
                      </div>
                    )}
                  </InfoRight>
                </InfoItem>
              ))}
            </InfoItems>

            {IsMakeUpPriceTip && <FlexCCBoxWarn>{t("538")}</FlexCCBoxWarn>}
            <TipItem>{t("528")}</TipItem>

            <MintBtn
              style={{ opacity: "0.5" }}
              onClick={() => {
                // return addMessage(t("Open soon"));
                // mintFun();
                // getBindStateFun(mintFun, () => {
                //   setMintProcessModal(false);
                // });
                // return setMintProcessModal(false);
              }}
            >
              {t("557")}
            </MintBtn>
          </MintProcessContentModal>
        </InfoModal>

        <InsResult
          visible={MintResultModal}
          className="Modal"
          centered
          width={510}
          closable={false}
          footer={null}
          onCancel={() => {
            setMintResultModal(false);
          }}
          src={"none"}
        >
          <ContentModal>
            <img src={INSBOXActive} alt="" />
            <MintResultBtn
              onClick={() => {
                setMintResultModal(false);
              }}
            >
              {t("356")}
            </MintResultBtn>
          </ContentModal>
        </InsResult>

        <ZhuanYiModal
          ref={modalref}
          callback={() => {
            getInitDataFun();
            getTeamInfo();
          }}
          modalType="mint"
        />

        <AllTipModal
          visible={ShowTipModal}
          className="allTipModal"
          centered
          width={510}
          closable={false}
          footer={null}
          onCancel={() => {
            setShowTipModal(false);
          }}
          src={sbBack}
        >
          <div
            className="close"
            onClick={() => {
              setShowTipModal(false);
            }}
          >
            <img src={closeIcon} alt="" />
          </div>

          <AllTipContent>{t("537")}</AllTipContent>
        </AllTipModal>
      </div>
    </MintContainer>
  );
};

export default Mint;
