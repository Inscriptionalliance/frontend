// @ts-nocheck

import React, {
  useState,
  useEffect,
  Fragment,
  useRef,
  useCallback,
} from "react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { useWeb3React } from "@web3-react/core";
import { useTranslation } from "react-i18next";
import {
  FlexBox,
  FlexCCBox,
  FlexSBCBox,
  FlexSCBox,
} from "../components/FlexBox/index";
import { useViewport } from "../components/viewportContext";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import closeIcon from "../assets/image/closeIcon.svg";
import SwapBg from "../assets/image/Swap/SwapBg.png";
import settingIcon from "../assets/image/Swap/settingIcon.svg";
import swapIcon from "../assets/image/Swap/swapIcon.svg";
import USDT from "../assets/image/Swap/USDT.svg";
import BTIA from "../assets/image/Swap/BTIA.svg";
import InsIcon from "../assets/image/Swap/InsIcon.svg";
import BTIAToken from "../assets/image/Swap/BTIAToken.svg";
import transferIcon from "../assets/image/Swap/transferIcon.svg";

import NoData from "../components/NoData";
import { Dropdown, Menu, Modal, Pagination, PaginationProps } from "antd";
import { useSelector } from "react-redux";
import {
  AddrHandle,
  EtherFun,
  NumSplic,
  NumSplic1,
  addMessage,
  showLoding,
} from "../utils/tool";
import useUSDTGroup from "../hooks/useUSDTGroup";
import { contractAddress } from "../config";
import { CoinIconDemo, DropIcon } from "../assets/image/SwapBox";
import { Contracts } from "../web3";
import { drawSwapUsda, getPrice, mintSwap, mintSwapInfo } from "../API";
import { throttle } from "lodash";
import { InfoModal } from "./Market/InscriptionDetail";
import { sbBack } from "../assets/image/MintBox";
import { select } from "redux-saga/effects";
import BigNumber from "big.js";
import TradingViewWidget from "../components/ChartBox";
import { createChart } from "lightweight-charts";
import { useBindState } from "../hooks/useBindState";

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

export const SwapBox = styled.div`
  width: 100%;
  max-width: 1440px;

  /* @media (min-width: 1920px) {
    max-width: 1650px;
  } */
  @media (max-width: 1440px) {
    padding: 0px 12px;
  }
`;

const SwapContainer = styled(FlexBox)`
  flex-direction: column;
  align-items: center;
  width: 100%;
  /* max-width: 1400px; */
`;

const Box_Container = styled(FlexSBCBox)`
  width: 100%;
  align-items: flex-start;
  margin: 3.83rem auto 0px;
  > div {
    margin-top: 0;
  }
  @media (max-width: 1024px) {
    display: block;
  }
`;

const ChatBox_Container = styled.div`
  flex: 1;
  margin-right: 20px;
  @media (max-width: 1024px) {
    margin-right: 0px;
    margin: 0px auto;
    max-width: 500px;
    padding: 0rem 2.5rem;
    max-height: 650px;
  }
`;

const SwapBox_Container = styled(FlexBox)<{ src: any }>`
  margin: 3.83rem auto 0px;
  width: 100%;
  max-width: 600px;
  min-height: 900px;
  flex-direction: column;
  align-items: center;
  background: transparent;
  background-image: ${({ src }) => `url(${src})`};
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding: 4.83rem 3.33rem;

  @media (max-width: 1650px) {
    margin: 4.75rem auto 0px;

    padding: 7.25rem 5rem;
  }
  @media (max-width: 1400px) {
    max-width: 500px;
    min-height: 800px;
  }
  @media (max-width: 1024px) {
    min-height: fit-content;
  }
`;
const SwapBox_Container1 = styled(FlexBox)<{ src: any }>`
  margin: 3.83rem auto 0px;
  width: 100%;
  max-width: 600px;
  /* min-height: 900px; */
  flex-direction: column;
  align-items: center;
  background: transparent;
  background-image: ${({ src }) => `url(${src})`};
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding: 4.83rem 3.33rem;

  @media (max-width: 1650px) {
    margin: 4.75rem auto 0px;

    padding: 7.25rem 5rem;
  }
  @media (max-width: 1400px) {
    max-width: 500px;
    min-height: 800px;
  }
  @media (max-width: 1024px) {
    min-height: fit-content;
  }
`;

const SwapBox_Container_Title = styled(FlexSBCBox)`
  width: 100%;
  padding: 2.33rem 3.33rem;
  @media (max-width: 1400px) {
    margin-bottom: 3.25rem;
    padding: 4.33rem 3.33rem 2.33rem;

    /* padding: 5rem 7.25rem; */
  }
  @media (max-width: 650px) {
    margin-bottom: 2rem;
  }
`;

const SwapBox_Container_Title_Left = styled(FlexSCBox)`
  width: 100%;
  flex: 1;
  text-align: right;
  font-family: "CKTKingkong";
  font-size: 2rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  background: linear-gradient(111deg, #f6f022 0%, #95fa31 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  > img {
    width: 3.33333rem;
    height: 3.33333rem;
    margin-right: 2rem;
  }
  @media (max-width: 1400px) {
    font-size: 3.75rem;
    > img {
      width: 5rem;
      height: 5rem;
      margin-right: 1.5rem;
    }
  }
`;

const SwapBox_Container_Title_Right = styled(FlexCCBox)``;

export const SwapBox_Container_Devider = styled.div`
  opacity: 0.6;
  height: 1px;
  width: 100%;
  background: linear-gradient(
    90deg,
    rgba(149, 250, 49, 0) 1.07%,
    #95fa31 53.32%,
    rgba(149, 250, 49, 0) 100.4%
  );
`;

const SwapBox_Container_Content = styled(FlexBox)`
  width: 100%;
  flex-direction: column;
  align-items: center;
  padding: 2.33rem 3.33rem;
  > span {
    width: 100%;
    color: #fefefe;
    font-family: CKTKingkong;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-bottom: 12px;
  }
  > img {
    margin: 1.83rem auto;
    width: 3.33333rem;
    height: 3.33333rem;
    flex-shrink: 0;
  }
  @media (max-width: 1400px) {
    padding: 20px 1rem;

    > img {
      margin: 2.75rem auto;
      width: 5rem;
      height: 5rem;
      flex-shrink: 0;
      flex-shrink: 0;
    }
    > span {
      font-size: 2.5rem;
    }
  }
`;

const SwapBox_Container_Content_Item = styled.div`
  width: 100%;
  border-radius: 3.33333rem;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: -5px -5px 7px 0px rgba(255, 255, 255, 0.2) inset,
    7px 7px 12px 0px #000 inset;
  backdrop-filter: blur(28.5px);
  padding: 2.25rem 2.5rem 2.33333rem 2.5rem;

  @media (max-width: 1400px) {
    padding: 3.38rem 3.75rem;
  }
`;
const SwapBox_Container_Content_Item_Top = styled(FlexSBCBox)`
  width: 100%;
  margin-bottom: 2.25rem;
  input {
    width: 100%;
    background: transparent;
    border: none;
    color: #fefefe;
    font-family: "CKTKingkong";
    font-size: 1.66667rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
  > div {
    display: flex;
    justify-content: end;
    align-items: center;
    color: #fff;
    text-align: right;
    font-family: "CKTKingkong";
    font-size: 1.66667rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    img {
      width: 2.16rem;
      height: 2.16rem;
      flex-shrink: 0;
      margin: 0px 1rem;
    }
    > div {
      color: #95fa31;
      text-align: right;
      font-family: "CKTKingkong";
      font-size: 1.33333rem;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
    > svg {
      width: 20px;
      height: 20px;
      margin-left: 8px;
    }
    @media (max-width: 650px) {
      > svg {
        width: 3.25rem;
        height: 3.25rem;
      }
    }
  }

  @media (max-width: 1400px) {
    margin-bottom: 3.75rem;
    > input {
      font-size: 12px;
    }
    > div {
      font-size: 2.5rem;
      img {
        width: 3.25rem;
        height: 3.25rem;
        flex-shrink: 0;
      }
      > div {
        font-size: 2.5rem;
      }
    }
  }
`;
const SwapBox_Container_Content_Item_Bottom = styled(FlexSBCBox)`
  width: 100%;
  > div {
    color: rgba(254, 254, 254, 0.6);
    font-family: "CKTKingkong";
    font-size: 1.33333rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  @media (max-width: 1400px) {
    > div {
      font-size: 2.5rem;
    }
  }
`;

const SwapBox_Container_Content_Tip = styled(FlexSCBox)`
  width: 100%;
  margin: 1.33rem 0px 1.33rem;
  color: #95fa31;
  font-family: "CKTKingkong";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  @media (max-width: 650px) {
    margin: 20px 0px;
  }
`;

const SwapBox_Container_Content_Tip1 = styled(SwapBox_Container_Content_Tip)`
  margin: 0px 0px 20px 0px;
`;

const Btn = styled(FlexCCBox)<{ active: any }>`
  opacity: ${({ active }) => (active ? 1 : 0.5)};
  width: 100%;
  max-width: 30rem;
  padding: 1.25rem;
  color: #000;
  font-family: "CKTKingkong";
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  border-radius: 1.16667rem;
  background: ${({ active }) =>
    active
      ? `linear-gradient(0deg, #95FA31 0.01%, #F6F022 99.99%)`
      : "linear-gradient(270deg, rgba(158, 210, 172, 0.50) 0.16%, rgba(33, 210, 172, 0.50) 99.76%)"};
  box-shadow: 6px 10px 0px 0px #4a8e00;

  @media (max-width: 1400px) {
    font-size: 2.5rem;
    box-shadow: 0.75rem 1.25rem 0rem 0rem #4a8e00;
  }
  @media (max-width: 768px) {
    /* padding: 11px; */
  }
`;

const SwapBtn = styled(Btn)`
  @media (max-width: 650px) {
    max-width: 220px;
    border-radius: 8px;
    background: linear-gradient(0deg, #95fa31 0.01%, #f6f022 99.99%);
    box-shadow: 2.855px 5.709px 0px 0px #4a8e00;
  }
`;

export const NoDataContainer = styled(FlexCCBox)`
  padding: 50px;
`;

const DropContaienr = styled.div`
  width: fit-content;

  .CoinDropDown {
    .ant-dropdown-menu {
      .CoinItem {
        display: flex;
        align-items: center;
        color: #000000;
        font-family: Alibaba PuHuiTi 3;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 100%; /* 28px */
        text-transform: uppercase;
        > img {
          margin-right: 12px;
          width: 38px;
          height: 38px;
        }
        /* @media (max-width: 768px) { */
        > img {
          margin-right: 8px;
          width: 20px;
          height: 20px;
        }
        /* } */
      }
    }
  }
`;

const DropBox = styled(FlexBox)`
  justify-content: flex-start;
  align-items: center;
  color: #ffd178;
  text-align: center;
  font-family: Alibaba PuHuiTi 3;
  font-size: 16px;
  font-style: normal;
  font-weight: 1000;
  line-height: 28px; /* 100% */
  text-transform: uppercase;
  > img {
    width: 28px;
    margin: 0px 10px;
  }
  > span {
    white-space: nowrap;
    color: #fff;
    text-align: center;
    font-family: Alibaba PuHuiTi 3;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 28px; /* 100% */
    text-transform: uppercase;
    min-width: 50px;
  }
  > svg {
    width: 20px;
    height: 20px;
    margin-left: 8px;
  }
  @media (max-width: 650px) {
    > span {
      font-size: 12px;
      min-width: 40px;
    }
    > svg {
      width: 3.25rem;
      height: 3.25rem;
    }
  }
`;

export const RankBox_Left_Tab = styled(FlexSCBox)`
  width: 100%;

  > div {
    color: #808080;
    font-family: "CKTKingkong";
    font-size: 2.5rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    text-transform: uppercase;
  }
  .activeTab {
    color: #fff;
    font-family: "CKTKingkong";
    font-size: 2.5rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  @media (max-width: 768px) {
    > div {
      font-size: 4rem;
    }
    .activeTab {
      font-size: 4rem;
    }
  }
  @media (max-width: 374px) {
    > div {
      font-size: 3rem;
    }
    .activeTab {
      font-size: 3rem;
    }
  }
`;
export const RankBox_Left_Tab_Item = styled(FlexCCBox)`
  margin-right: 5.67rem;
  @media (max-width: 768px) {
    margin-right: 3rem;
  }
`;

const ContentModal = styled.div`
  width: 100%;
  color: #fefefe;
  font-family: "CKTKingkong";
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-top: 30px;
  @media (max-width: 650px) {
    margin-top: 20px;
  }
  > input {
    width: 100%;

    padding: 18px 28px;
    border-radius: 40px;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 5px 5px 10px 0px #000 inset,
      -3px -3px 5px 0px rgba(255, 255, 255, 0.2) inset;
    backdrop-filter: blur(28.5px);
    color: rgba(255, 255, 255, 0.6);
    font-family: "CKTKingkong";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    border: none;
    @media (max-width: 650px) {
      font-size: 12px;
    }
    @media (max-width: 425px) {
      padding: 18px 12px;
    }
  }
`;
const CoinList = styled.div`
  width: 100%;
  color: rgba(254, 254, 254, 0.8);
  font-family: CKTKingkong;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-top: 30px;
`;

const CoinList_Item_Box = styled.div`
  max-height: 320px;
  width: 100%;
  overflow: auto;
  margin-top: 12px;
  padding-right: 12px;
  ::-webkit-scrollbar {
    width: 0.3333rem;
  }

  /* -*/
  ::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10.9992px;
  }

  /* -*/
  ::-webkit-scrollbar-thumb {
    background: #95fa31;
    border-radius: 2.8333rem;
  }
  > div {
    margin-bottom: 12px;
  }
`;

const CoinList_Item = styled(FlexSBCBox)`
  > div {
    color: rgba(255, 255, 255, 0.8);
    font-family: CKTKingkong;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  &:hover {
    > div {
      color: #95fa31;
    }
  }
`;

const CoinList_Item_Left = styled(FlexCCBox)`
  width: fit-content;
  > svg {
    margin-right: 12px;
  }
  > img {
    width: 30px;
    margin-right: 12px;
  }
`;

const CoinList_Item_Right = styled(CoinList_Item_Left)``;

const CoinListModal = styled(InfoModal)`
  .close {
    top: 10%;
    @media (max-width: 650px) {
      top: 2%;
    }
  }
  .ant-modal-content .ant-modal-body {
    padding: 13% 12% 20%;
    @media (max-width: 650px) {
      padding: 6% 12% 12%;
    }
    @media (max-width: 425px) {
      padding: 6% 6% 12%;
    }
  }
`;

export const SoonOpenModal = styled(CoinListModal)`
  .close {
    top: 5%;

    @media (max-width: 650px) {
      top: -2%;
    }
  }
  .allTipModal {
    .ant-modal-content {
      min-height: 250px !important;
      display: flex;
      align-items: center;
    }
  }
`;
export const AllTipModal = styled(CoinListModal)`
  .close {
    top: 5%;

    @media (max-width: 650px) {
      top: -2%;
    }
  }

  .ant-modal-content {
    min-height: 250px !important;
    display: flex;
    align-items: center;
    .ant-modal-body {
      width: 100%;
    }
  }
`;

const SwapBox_Container_Content_Item_Bottom_Radio = styled(FlexSBCBox)`
  display: block;
  margin-top: 2.25rem;
  > div {
    margin-bottom: 12px;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const SwapBox_Container_Content_Item_Bottom_Item = styled(FlexSBCBox)`
  width: 100%;
  > div {
    color: #fff;
    text-align: right;
    font-family: "CKTKingkong";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  @media (max-width: 1400px) {
    > div {
      font-size: 2.5rem;
    }
  }
`;

const AddLiquiltyBox_Container_Content_Subtitle = styled(FlexCCBox)`
  width: 100%;
  color: #fefefe;
  text-align: center;
  font-family: "CKTKingkong";
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 60px;
`;

const AddLiquiltyBox_Container_Content = styled(FlexCCBox)`
  width: 100%;
  flex-direction: column;
  align-items: center;
  padding: 60px 0px;
`;
const AddLiquiltyBox_Container_Content_Bottom = styled(
  AddLiquiltyBox_Container_Content
)`
  padding: 26px 0px;
`;

export const NoDataContentModal = styled(ContentModal)`
  height: 100%;
  padding: 30px 0px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;
const AllTipContent = styled(ContentModal)`
  height: 100%;
  /* padding: 30px 0px 0px; */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const MintTitleModal_Title = styled(MintTitleModal)`
  @media (max-width: 650px) {
    margin-top: 15px;
  }
`;

let USDASymbol: any = "USDA";
let USDTSymbol: any = "USDT";
let BTIASymbol: any = "BTIA";

let timeRef: any;

export default function Swap() {
  const token = useSelector<any>((state) => state.token);
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const { width } = useViewport();
  const navigate = useNavigate();
  const [PageSize, setPageSize] = useState(10);
  const [PageNum, setPageNum] = useState(1);
  const [ActiveTab, setActiveTab] = useState(1);
  const [SelectCoinType, setSelectCoinType] = useState(1);
  const [SelectCoinModal, setSelectCoinModal] = useState(false);
  const [MintSwapInfo, setMintSwapInfo] = useState<any>({});
  const inputRef = useRef<any>();
  const [amount1, setAmount1] = useState<any>("");
  const [amount2, setAmount2] = useState<any>("");
  const [Price1, setPrice1] = useState<any>("0");
  const [CoinType1, setCoinType1] = useState("BTIA");
  const [CoinType2, setCoinType2] = useState("USDA");
  const [SwitchState1, setSwitchState1] = useState<any>(false);
  const [SwitchState2, setSwitchState2] = useState<any>(false);
  const [NoSoonModal, setNoSoonModal] = useState<any>(false);
  // -
  const [SwitchState3, setSwitchState3] = useState<any>(false);
  const [CoinBalanceList, setCoinBalanceList] = useState<any>([]);
  const { getBindStateFun } = useBindState();
  const TokenGroup: any = (type1: any, type2: any) => {
    if (
      (String(type1) === USDASymbol && String(type2) === USDTSymbol) ||
      (String(type1) === USDTSymbol && String(type2) === USDASymbol)
    ) {
      return [contractAddress.USDA, type1];
    } else if (String(type1) === BTIASymbol && String(type2) === USDASymbol) {
      return [contractAddress.BTIARouter, type1];
    } else if (String(type1) === USDASymbol && String(type2) === BTIASymbol) {
      return [contractAddress.BTIARouter, type1];
    } else if (String(type2) === USDASymbol || String(type2) === USDTSymbol) {
      return [contractAddress.USDA, type2];
    } else if (String(type1) === BTIASymbol) {
      return [contractAddress.BTIARouter, type1];
    } else if (String(type2) === BTIASymbol) {
      return [contractAddress.BTIARouter, type2];
    } else {
      return [contractAddress.BTIARouter, "BTIA"];
    }
  };
  const {
    TOKENBalance: TOKENBalance1,
    TOKENAllowance: TOKENAllowance1,
    handleApprove: handleApprove1,
    handleTransaction: handleTransaction1,
    handleUSDTRefresh: handleUSDTRefresh1,
  } = useUSDTGroup(
    TokenGroup(CoinType1, CoinType2)[0],
    TokenGroup(CoinType1, CoinType2)[1]
  );
  const {
    TOKENBalance: TOKENBalance,
    TOKENAllowance: TOKENAllowance,
    handleApprove: handleApprove,
    handleTransaction: handleTransaction,
    handleUSDTRefresh: handleUSDTRefresh,
  } = useUSDTGroup(
    TokenGroup(CoinType2, CoinType1)[0],
    TokenGroup(CoinType2, CoinType1)[1]
  );
  const {
    TOKENBalance: TOKENBalance3,
    TOKENAllowance: TOKENAllowance3,
    handleApprove: handleApprove3,
    handleTransaction: handleTransaction3,
    handleUSDTRefresh: handleUSDTRefresh3,
  } = useUSDTGroup(contractAddress.BTIARouter, "USDA");

  let langObj1 = [
    { coinName: BTIASymbol, coinIcon: InsIcon },
    { coinName: USDTSymbol, coinIcon: USDT },
    { coinName: USDASymbol, coinIcon: BTIAToken },
  ];
  let langObj2 = {
    BTIA: [{ coinName: USDASymbol, coinIcon: BTIAToken }],
    USDT: [{ coinName: USDASymbol, coinIcon: BTIAToken }],
    USDA: [
      { coinName: USDTSymbol, coinIcon: USDT },
      { coinName: BTIASymbol, coinIcon: InsIcon },
    ],
  };

  const getPriceFun = async (num: any, type: any) => {
    if (!token || Number(num) < 10) return;
    let item: any = await getPrice({
      mintNum: num,
      type: String(type) === USDASymbol ? 0 : 1,
    });
    console.log(item?.data?.price, "item?.price");

    return item?.data?.price ?? 0;
  };

  const swapToUSDAFun = async () => {
    if (!token && amount1) return;
    handleTransaction1(amount1, async (call: any) => {
      let res: any;
      try {
        showLoding(true);
        res =
          await Contracts.example?.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            account as string,
            amount1,
            [contractAddress[CoinType1], contractAddress[CoinType2]]
          );
      } catch (error: any) {
        showLoding(false);
        return addMessage(CoinType1 + " " + t("277"));
      }
      showLoding(false);
      if (!!res?.status) {
        call();
        handleUSDTRefresh();
        inputAmountFun(CoinType1, "0");
        addMessage(CoinType1 + " " + t("250"));
      } else {
        addMessage(CoinType1 + " " + t("277"));
      }
    });
  };
  const swapToBTIAFun = async () => {
    if (!token && amount1) return;
    handleTransaction3(amount1, async (call: any) => {
      let res: any;
      try {
        showLoding(true);
        res =
          await Contracts.example?.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            account as string,
            amount1,
            [contractAddress[CoinType1], contractAddress[CoinType2]]
          );
      } catch (error: any) {
        showLoding(false);
        return addMessage(CoinType1 + " " + t("277"));
      }
      showLoding(false);
      if (!!res?.status) {
        call();
        handleUSDTRefresh();
        handleUSDTRefresh3();
        inputAmountFun(CoinType1, "0");
        addMessage(CoinType1 + " " + t("250"));
      } else {
        addMessage(CoinType1 + " " + t("277"));
      }
    });
  };

  // 1:USDT=>MBK 2:MBK=>USDT
  const SwapFun = () => {
    if (!account) return;
    if (Number(amount1) <= 0) return;
    if (String(CoinType1) === BTIASymbol) return swapToUSDAFun();
    if (String(CoinType2) === BTIASymbol) return swapToBTIAFun();
    handleTransaction1(amount1, async (call: any) => {
      let res: any;
      try {
        showLoding(true);
        res = await Contracts.example?.swap(
          account as string,
          contractAddress[CoinType1],
          contractAddress[CoinType2],
          amount1
        );
      } catch (error: any) {
        showLoding(false);
        return addMessage(CoinType1 + " " + t("277"));
      }
      showLoding(false);
      if (!!res?.status) {
        call();
        handleUSDTRefresh();
        inputAmountFun(CoinType1, "0");
        addMessage(CoinType1 + " " + t("250"));
      } else {
        addMessage(CoinType1 + " " + t("277"));
      }
    });
  };

  const inputAmountFun = async (type: any, amount: any) => {
    let amounted = amount;
    if (!account || isNaN(amounted) || Number(amounted) <= 0) {
      setAmount1("");
      setAmount2("");
    } else {
      if (type === BTIASymbol) {
        setAmount1(amounted);

        let res: any;
        try {
          res = await Contracts.example?.getAmountsOut(
            account as string,
            [contractAddress[CoinType1], contractAddress[CoinType2]],
            !!amounted ? amounted : "0"
          );
          setAmount2(EtherFun(res[res?.length - 1] + "" ?? "0") ?? "0");
        } catch (error: any) {}
      } else {
        setAmount1(amounted);
        setAmount2(amounted);
      }
    }
  };

  const getInitData = () => {
    mintSwapInfo({}).then((res: any) => {
      setMintSwapInfo(res?.data || {});
    });
  };

  const selectCoinFun = (type: 0 | 1) => {
    setSelectCoinType(type);
    setSelectCoinModal(true);
  };

  const getCoinList = async () => {
    let USDASymbolItem1 = await Contracts.example?.balanceOf(
      account as string,
      USDASymbol
    );
    let BTIASymbolItem2 = await Contracts.example?.balanceOf(
      account as string,
      BTIASymbol
    );
    let USDTSymbolItem3 = await Contracts.example?.balanceOf(
      account as string,
      USDTSymbol
    );

    setCoinBalanceList({
      [USDASymbol]: NumSplic1(EtherFun(USDASymbolItem1 ?? "0"), 6),
      [BTIASymbol]: NumSplic1(EtherFun(BTIASymbolItem2 ?? "0"), 6),
      [USDTSymbol]: NumSplic1(EtherFun(USDTSymbolItem3 ?? "0"), 6),
    });
  };

  const initialData = [
    { time: "2018-10-01", value: 22.67 },
    { time: "2018-10-02", value: 32.51 },
    { time: "2018-10-03", value: 31.11 },
    { time: "2018-10-04", value: 27.02 },
    { time: "2018-10-05", value: 27.32 },
    { time: "2018-10-06", value: 25.17 },
    { time: "2018-10-07", value: 28.89 },
    { time: "2018-10-08", value: 25.46 },
    { time: "2018-10-09", value: 23.92 },
    { time: "2018-10-10", value: 22.68 },
    { time: "2018-10-11", value: 22.67 },
    { time: "2018-10-12", value: 32.51 },
    { time: "2018-10-13", value: 31.11 },
    { time: "2018-10-14", value: 27.02 },
    { time: "2018-10-15", value: 27.32 },
    { time: "2018-10-16", value: 25.17 },
    { time: "2018-10-17", value: 28.89 },
    { time: "2018-10-18", value: 25.46 },
    { time: "2018-10-19", value: 23.92 },
    { time: "2018-10-20", value: 22.68 },
    { time: "2018-10-21", value: 22.67 },
    { time: "2018-10-22", value: 32.51 },
    { time: "2018-10-23", value: 31.11 },
    { time: "2018-10-24", value: 27.02 },
    { time: "2018-10-25", value: 27.32 },
    { time: "2018-10-26", value: 25.17 },
    { time: "2018-10-27", value: 28.89 },
    { time: "2018-10-28", value: 25.46 },
    { time: "2018-10-29", value: 23.92 },
    { time: "2018-10-30", value: 22.68 },

    { time: "2018-11-01", value: 22.67 },
    { time: "2018-11-02", value: 32.51 },
    { time: "2018-11-03", value: 31.11 },
    { time: "2018-11-04", value: 27.02 },
    { time: "2018-11-05", value: 27.32 },
    { time: "2018-11-06", value: 25.17 },
    { time: "2018-11-07", value: 28.89 },
    { time: "2018-11-08", value: 25.46 },
    { time: "2018-11-09", value: 23.92 },
    { time: "2018-11-10", value: 22.68 },
    { time: "2018-11-11", value: 22.67 },
    { time: "2018-11-12", value: 32.51 },
    { time: "2018-11-13", value: 31.11 },
    { time: "2018-11-14", value: 27.02 },
    { time: "2018-11-15", value: 27.32 },
    { time: "2018-11-16", value: 25.17 },
    { time: "2018-11-17", value: 28.89 },
    { time: "2018-11-18", value: 25.46 },
    { time: "2018-11-19", value: 23.92 },
    { time: "2018-11-20", value: 22.68 },
    { time: "2018-11-21", value: 22.67 },
    { time: "2018-11-22", value: 32.51 },
    { time: "2018-11-23", value: 31.11 },
    { time: "2018-11-24", value: 27.02 },
    { time: "2018-11-25", value: 27.32 },
    { time: "2018-11-26", value: 25.17 },
    { time: "2018-11-27", value: 28.89 },
    { time: "2018-11-28", value: 25.46 },
    { time: "2018-11-29", value: 23.92 },
    { time: "2018-11-30", value: 22.68 },

    { time: "2018-12-01", value: 22.67 },
    { time: "2018-12-02", value: 32.51 },
    { time: "2018-12-03", value: 31.11 },
    { time: "2018-12-04", value: 27.02 },
    { time: "2018-12-05", value: 27.32 },
    { time: "2018-12-06", value: 25.17 },
    { time: "2018-12-07", value: 28.89 },
    { time: "2018-12-08", value: 25.46 },
    { time: "2018-12-09", value: 23.92 },
    { time: "2018-12-10", value: 22.68 },
    { time: "2018-12-11", value: 22.67 },
    { time: "2018-12-12", value: 32.51 },
    { time: "2018-12-13", value: 31.11 },
    { time: "2018-12-14", value: 27.02 },
    { time: "2018-12-15", value: 27.32 },
    { time: "2018-12-16", value: 25.17 },
    { time: "2018-12-17", value: 28.89 },
    { time: "2018-12-18", value: 25.46 },
    { time: "2018-12-19", value: 23.92 },
    { time: "2018-12-20", value: 22.68 },
    { time: "2018-12-21", value: 22.67 },
    { time: "2018-12-22", value: 32.51 },
    { time: "2018-12-23", value: 31.11 },
    { time: "2018-12-24", value: 27.02 },
    { time: "2018-12-25", value: 27.32 },
    { time: "2018-12-26", value: 25.17 },
    { time: "2018-12-27", value: 28.89 },
    { time: "2018-12-28", value: 25.46 },
    { time: "2018-12-29", value: 23.92 },
    { time: "2018-12-30", value: 22.68 },
    { time: "2018-12-31", value: 22.67 },
  ];

  useEffect(() => {
    if (token) {
      getInitData();
    }
    return () => {
      clearInterval(timeRef);
    };
  }, [token, PageNum]);

  useEffect(() => {
    if (account) {
      // 4.23
      getCoinList();
    }
  }, [account, SelectCoinModal]);

  useEffect(() => {
    if (account) {
      Contracts.example
        .token0(account as string, contractAddress.PancakePair)
        .then((res: any) => {
          if (res?.toLowerCase() === contractAddress.BTIA.toLowerCase()) {
            try {
              Contracts.example
                ?.getReserves(account as string, contractAddress.PancakePair)
                .then((res: any) => {
                  setPrice1(
                    NumSplic1(
                      new BigNumber(res["1"])
                        .div(res["0"])
                        .toNumber()
                        .toFixed(4),
                      6
                    )
                  );
                });
            } catch {}
          } else {
            try {
              Contracts.example
                .getReserves(account as string, contractAddress.PancakePair)
                .then((res: any) => {
                  setPrice1(
                    NumSplic1(
                      new BigNumber(res["0"])
                        .div(res["1"])
                        .toNumber()
                        .toFixed(4),
                      6
                    )
                  );
                });
            } catch {}
          }
        });
    }
  }, [account]);

  const BalanceBox1 = (name: string) => {
    return (
      <SwapBox_Container_Content_Item_Bottom>
        <div>${amount1} </div>{" "}
        <div>
          {t("201")} : {TOKENBalance1 ?? 0}
        </div>
      </SwapBox_Container_Content_Item_Bottom>
    );
  };
  const BalanceBox2 = (name: string) => {
    return (
      <SwapBox_Container_Content_Item_Bottom>
        <div>${amount1} </div>{" "}
        <div>
          {t("201")} : {TOKENBalance ?? 0}
        </div>
      </SwapBox_Container_Content_Item_Bottom>
    );
  };

  return (
    <SwapContainer>
      <SwapBox>
        <RankBox_Left_Tab>
          <RankBox_Left_Tab_Item
            className={Number(ActiveTab) === 1 ? "activeTab" : ""}
            onClick={() => {
              setPageNum(1);
              setActiveTab(1);
            }}
          >
            {t("Swap")}
          </RankBox_Left_Tab_Item>
          <RankBox_Left_Tab_Item
            className={Number(ActiveTab) === 2 ? "activeTab" : ""}
            onClick={() => {
              setPageNum(1);
              setActiveTab(2);
            }}
          >
            {t("284")}
          </RankBox_Left_Tab_Item>
        </RankBox_Left_Tab>
        {Number(ActiveTab) === 1 && (
          <Box_Container>
            <ChatBox_Container>
              {/* <ChartComponent data={initialData}></ChartComponent> */}
              <TradingViewWidget></TradingViewWidget>
            </ChatBox_Container>
            <SwapBox_Container src={SwapBg}>
              <SwapBox_Container_Title>
                <SwapBox_Container_Title_Left>
                  <img src={swapIcon} alt="" />
                  {t("DenimSwap")}
                </SwapBox_Container_Title_Left>
                <SwapBox_Container_Title_Right>
                  {/* <img src={settingIcon} alt="" style={{ marginTop: "12px" }} /> */}
                </SwapBox_Container_Title_Right>
              </SwapBox_Container_Title>
              <SwapBox_Container_Devider />
              <SwapBox_Container_Content>
                {/* -*/}
                <span>{t("278")}</span>
                <SwapBox_Container_Content_Item>
                  <SwapBox_Container_Content_Item_Top>
                    <input
                      type="number"
                      placeholder={t("239")}
                      min={0}
                      value={amount1}
                      onChange={(e: any) =>
                        inputAmountFun(CoinType1, e.target.value)
                      }
                    />
                    <div>
                      <div
                        onClick={() => {
                          inputAmountFun(CoinType1, TOKENBalance1);
                        }}
                      >
                        MAX
                      </div>
                      <DropContaienr>
                        {!!CoinType1 ? (
                          <DropBox
                            onClick={() => {
                              selectCoinFun(0);
                            }}
                          >
                            <img
                              src={
                                langObj1?.find(
                                  (item: any) =>
                                    String(item.coinName) === String(CoinType1)
                                )?.coinIcon
                              }
                              alt=""
                              className="langIcon"
                            />
                            <span>
                              {
                                langObj1?.find(
                                  (item: any) =>
                                    String(item.coinName) === String(CoinType1)
                                )?.coinName
                              }
                            </span>
                            <DropIcon
                              className={
                                SwitchState1 ? "rotetaOpen" : "rotetaClose"
                              }
                            />
                          </DropBox>
                        ) : (
                          <DropBox
                            onClick={() => {
                              selectCoinFun(0);
                            }}
                          >
                            <span style={{ marginLeft: "12px" }}>
                              {t("279")}
                            </span>
                            <DropIcon
                              className={
                                SwitchState1 ? "rotetaOpen" : "rotetaClose"
                              }
                            />
                          </DropBox>
                        )}
                        {/* </Dropdown> */}
                      </DropContaienr>
                    </div>
                  </SwapBox_Container_Content_Item_Top>
                  {BalanceBox1(CoinType1)}
                </SwapBox_Container_Content_Item>
                <img
                  src={transferIcon}
                  alt=""
                  onClick={() => {
                    setCoinType1(CoinType2);
                    setCoinType2(CoinType1);
                    inputAmountFun(CoinType1, amount2);
                  }}
                />
                {/* -*/}

                <span>{t("280")}</span>
                <SwapBox_Container_Content_Item>
                  <SwapBox_Container_Content_Item_Top>
                    <input
                      type="number"
                      placeholder="0"
                      value={NumSplic1(amount2, 6)}
                      readOnly={true}
                      onChange={(e: any) => {
                        inputAmountFun(CoinType2, e.target.value);
                      }}
                    />
                    <div>
                      <DropContaienr>
                        {!!CoinType2 ? (
                          <DropBox
                            onClick={() => {
                              selectCoinFun(1);
                            }}
                          >
                            <img
                              src={
                                langObj2[CoinType1]?.find(
                                  (item: any) =>
                                    String(item.coinName) === String(CoinType2)
                                )?.coinIcon
                              }
                              alt=""
                              className="langIcon"
                            />
                            <span>
                              {
                                langObj2[CoinType1]?.find(
                                  (item: any) =>
                                    String(item.coinName) === String(CoinType2)
                                )?.coinName
                              }
                            </span>
                            <DropIcon
                              className={
                                SwitchState2 ? "rotetaOpen" : "rotetaClose"
                              }
                            />
                          </DropBox>
                        ) : (
                          <DropBox
                            onClick={() => {
                              selectCoinFun(1);
                            }}
                          >
                            <span>{t("279")}</span>
                            <DropIcon
                              className={
                                SwitchState1 ? "rotetaOpen" : "rotetaClose"
                              }
                            />
                          </DropBox>
                        )}
                      </DropContaienr>
                    </div>
                  </SwapBox_Container_Content_Item_Top>
                  {BalanceBox2(CoinType2)}
                </SwapBox_Container_Content_Item>

                <SwapBox_Container_Content_Item style={{ marginTop: "28px" }}>
                  <SwapBox_Container_Content_Item_Top
                    style={{ marginBottom: "0px" }}
                    onClick={() => {
                      setSwitchState3(!SwitchState3);
                    }}
                  >
                    <div>{t("281")} </div>{" "}
                    {String(CoinType1) === BTIASymbol ? (
                      <div>
                        1 {CoinType1} = {Price1} {CoinType2}{" "}
                        <DropIcon
                          className={
                            SwitchState3 ? "rotetaOpen" : "rotetaClose"
                          }
                        />
                      </div>
                    ) : (
                      <div>
                        1 {CoinType1}=1 {CoinType2}{" "}
                        <DropIcon
                          className={
                            SwitchState3 ? "rotetaOpen" : "rotetaClose"
                          }
                        />
                      </div>
                    )}
                  </SwapBox_Container_Content_Item_Top>
                  {SwitchState3 && (
                    <SwapBox_Container_Content_Item_Bottom_Radio>
                      <SwapBox_Container_Content_Item_Bottom_Item>
                        <div>{t("282")} </div>{" "}
                        <div style={{ color: "#95FA31" }}>0.15%</div>
                      </SwapBox_Container_Content_Item_Bottom_Item>
                      <SwapBox_Container_Content_Item_Bottom_Item>
                        {" "}
                        <div>{t("283")} </div>{" "}
                        <div>
                          {!!amount2 ? amount2 : "0"} {CoinType2}
                        </div>
                      </SwapBox_Container_Content_Item_Bottom_Item>
                    </SwapBox_Container_Content_Item_Bottom_Radio>
                  )}
                </SwapBox_Container_Content_Item>

                <SwapBox_Container_Content_Tip1></SwapBox_Container_Content_Tip1>

                <SwapBtn
                  active={true}
                  onClick={() => {
                    return addMessage(t("Open soon"));
                    // getBindStateFun(SwapFun, () => {});
                  }}
                >
                  {t("203")}
                </SwapBtn>
              </SwapBox_Container_Content>
            </SwapBox_Container>
          </Box_Container>
        )}
        {Number(ActiveTab) === 2 && (
          <SwapBox_Container1 src={SwapBg}>
            <SwapBox_Container_Title>
              <SwapBox_Container_Title_Left>
                {/* <img src={swapIcon} alt="" /> */}
                {t("285")}
              </SwapBox_Container_Title_Left>
              {/* <SwapBox_Container_Title_Right>
                <img src={settingIcon} alt="" />
              </SwapBox_Container_Title_Right> */}
            </SwapBox_Container_Title>
            <SwapBox_Container_Devider />
            <AddLiquiltyBox_Container_Content>
              <AddLiquiltyBox_Container_Content_Subtitle>
                {t("286")}
              </AddLiquiltyBox_Container_Content_Subtitle>

              <SwapBtn
                active={true}
                onClick={() => {
                  // SwapFun();
                  return setNoSoonModal(true);
                }}
              >
                {t("287")}
              </SwapBtn>
            </AddLiquiltyBox_Container_Content>
            <SwapBox_Container_Devider />
            <AddLiquiltyBox_Container_Content_Bottom>
              <SwapBox_Container_Title>
                <SwapBox_Container_Title_Left>
                  {/* <img src={swapIcon} alt="" /> */}
                  {t("288")}
                </SwapBox_Container_Title_Left>
              </SwapBox_Container_Title>
              <AddLiquiltyBox_Container_Content_Subtitle>
                {t("289")}
              </AddLiquiltyBox_Container_Content_Subtitle>
            </AddLiquiltyBox_Container_Content_Bottom>
          </SwapBox_Container1>
        )}
      </SwapBox>

      <CoinListModal
        visible={SelectCoinModal}
        className="Modal"
        centered
        width={510}
        closable={false}
        footer={null}
        onCancel={() => {
          setSelectCoinModal(false);
        }}
        src={sbBack}
      >
        <div
          className="close"
          onClick={() => {
            setSelectCoinModal(false);
          }}
        >
          <img src={closeIcon} alt="" />
        </div>
        <MintTitleModal_Title>{t("290")}</MintTitleModal_Title>
        <ContentModal>
          <input type="text" placeholder={t("291")} />
          <CoinList>
            {t("292")}
            <CoinList_Item_Box>
              {!SelectCoinType
                ? langObj1?.map((item: any) => (
                    <CoinList_Item
                      onClick={() => {
                        if (!SelectCoinType) {
                          setCoinType1(item?.coinName);
                          setCoinType2(langObj2[item?.coinName][0]?.coinName);
                        } else {
                          setCoinType2(item?.coinName);
                        }
                        setSelectCoinModal(false);
                      }}
                    >
                      <CoinList_Item_Left>
                        <img src={item?.coinIcon} alt="" />
                        {item?.coinName}
                      </CoinList_Item_Left>
                      <CoinList_Item_Right>
                        {CoinBalanceList[item?.coinName] ?? 0}
                      </CoinList_Item_Right>
                    </CoinList_Item>
                  ))
                : langObj2[CoinType1]?.map((item: any) => (
                    <CoinList_Item
                      onClick={() => {
                        if (!SelectCoinType) {
                          setCoinType1(item?.coinName);
                        } else {
                          setCoinType2(item?.coinName);
                        }
                        setSelectCoinModal(false);
                      }}
                    >
                      <CoinList_Item_Left>
                        <img src={item?.coinIcon} alt="" />
                        {item?.coinName}
                      </CoinList_Item_Left>
                      <CoinList_Item_Right>
                        {CoinBalanceList[item?.coinName] ?? 0}
                      </CoinList_Item_Right>
                    </CoinList_Item>
                  ))}
            </CoinList_Item_Box>
          </CoinList>
        </ContentModal>
      </CoinListModal>

      <AllTipModal
        visible={NoSoonModal}
        className="Modal"
        centered
        width={510}
        closable={false}
        footer={null}
        onCancel={() => {
          setNoSoonModal(false);
        }}
        src={sbBack}
      >
        <div
          className="close"
          onClick={() => {
            setNoSoonModal(false);
          }}
        >
          <img src={closeIcon} alt="" />
        </div>

        <AllTipContent>{t("Open soon")}</AllTipContent>
      </AllTipModal>
    </SwapContainer>
  );
}
