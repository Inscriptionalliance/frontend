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
  FlexSACBox,
  FlexSASBox,
  FlexSBCBox,
  FlexSCBox,
  FlexSECBox,
} from "../components/FlexBox/index";
import { useViewport } from "../components/viewportContext";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import closeIcon from "../assets/image/closeIcon.svg";

import NoData from "../components/NoData";
import { Dropdown, Menu, Modal, Pagination, PaginationProps } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AddrHandle, EtherFun, addMessage, showLoding } from "../utils/tool";
import { hangSaleList, myMint, pay, teamInfo } from "../API";
import { throttle } from "lodash";
import BNBChainIcon from "../assets/image/Market/BNBChainIcon.svg";
import BTCChainIcon from "../assets/image/Market/BTCChainIcon.svg";
import SOLChainIcon from "../assets/image/Market/SOLChainIcon.svg";
import ETHChainIcon from "../assets/image/Market/ETHChainIcon.svg";
import activeBNBChainIcon from "../assets/image/Market/activeBNBChainIcon.svg";
import activeBTCChainIcon from "../assets/image/Market/activeBTCChainIcon.svg";
import activeSOLChainIcon from "../assets/image/Market/activeSOLChainIcon.svg";
import activeETHChainIcon from "../assets/image/Market/activeETHChainIcon.svg";
import AllIcon from "../assets/image/Market/AllIcon.svg";
import SearchIcon from "../assets/image/Market/SearchIcon.svg";
import DropDownIcon from "../assets/image/Market/DropDownIcon.svg";
import RefreshIcon from "../assets/image/Market/RefreshIcon.svg";
import ItemBg from "../assets/image/Market/ItemBg.gif";
import JsonItemBg from "../assets/image/Market/JsonItemBg.png";
import PersonIcon from "../assets/image/Market/PersonIcon.svg";
import IdItemBg from "../assets/image/Market/IdItemBg.png";
import SubTitleItemBg from "../assets/image/Market/SubTitleItemBg.png";
import PersonalItemBg from "../assets/image/Market/PersonalItemBg.png";
import MarketModalBg from "../assets/image/Market/MarketModalBg.png";
import { BNBIcon, SuccessIcon, sbBack } from "../assets/image/MintBox";
import { Btn, InfoModal } from "./Market/InscriptionDetail";
import { BuyModalBg, detailBtnBg } from "../assets/image/MarketBox";
import { Contracts } from "../web3";
import { PaginationContainer } from "./Rank";
import ReactJson from "react-json-view";
export const ChainList = [
  {
    name: "Binance",
    icon: BNBChainIcon,
    activeIcon: activeBNBChainIcon,
    symbol: "BNB",
  },
  {
    name: "Bitcoin",
    icon: BTCChainIcon,
    activeIcon: activeBTCChainIcon,
    symbol: "BTC",
  },
  {
    name: "Ethereum",
    icon: ETHChainIcon,
    activeIcon: activeETHChainIcon,
    symbol: "ETH",
  },
  {
    name: "Solana",
    icon: SOLChainIcon,
    activeIcon: activeSOLChainIcon,
    symbol: "SOL",
  },
];

const RankBox_Left_Tab = styled(FlexSCBox)`
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
`;
const RankBox_Left_Tab_Item = styled(FlexCCBox)`
  margin-right: 5.67rem;
  @media (max-width: 768px) {
    margin-right: 3rem;
  }
`;

export const ChainBox = styled(FlexBox)`
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

export const ChainBox_Item_Btn = styled(FlexSASBox)`
  color: #fff;
  font-family: CKTKingkong;
  font-size: 22px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-right: 30px;
  white-space: nowrap;
  > img {
    margin-left: 10px;
    color: #fff;
    font-family: CKTKingkong;
    font-size: 22px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-right: 11px;
  }

  @media (max-width: 1440px) {
    color: #fff;
    font-family: "Gen Shin Gothic P";
    font-size: 14px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
    margin-right: 12px;

    > img {
      width: 22px;
    }
  }
`;

export const ChainBox_Item_Box = styled(FlexBox)`
  > div {
    &:last-child {
      margin-right: 0px;
    }
  }
`;

export const ChainBox_Item_Box_Item = styled(FlexBox)`
  margin-right: 30px;
  align-items: center;
  > div {
    color: #fff;
    font-family: "CKTKingkong";
    font-size: 22px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-left: 5px;
  }

  @media (max-width: 1440px) {
    margin-right: 12px;
    > div {
      font-size: 12px;
    }
    > img {
      width: 22px;
    }
  }
`;

const CommunityContainer = styled.div`
  padding: 10rem 20px;
  width: 100%;
  max-width: 1240px;

  > div {
    margin-bottom: 25px;
  }
  /* overflow: auto; */
  /* height: 100%; */
  /* @media (min-width: 1920px) {
    max-width: 1650px;
  } */
  @media (max-width: 1400px) {
    padding: 20px;
  }
  @media (max-width: 650px) {
    padding: 16px;

    > div {
      margin-bottom: 16px;
    }
  }
`;

const CommunityBox = styled(FlexBox)`
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-between;

  > div {
    width: 32%;
  }
  @media (max-width: 768px) {
    > div {
      width: 32%;
    }
  }
  @media (max-width: 650px) {
    > div {
      width: 48%;
    }
  }
  @media (max-width: 375px) {
    > div {
      width: 100%;
    }
  }
`;

const CommunityBox_Item = styled(FlexBox)`
  width: 100%;
  padding: 12px;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  background: #222222;
  border-radius: 2.5rem;
  box-shadow: 5px 5px 10px 0px #000, -3px -3px 20px 0px rgba(255, 255, 255, 0.2);
  margin-bottom: 3.75rem;

  @media (max-width: 768px) {
    margin-bottom: 2.75rem;
  }

  @media (max-width: 650px) {
    margin-bottom: 3.6575rem;
  }
  @media (max-width: 430px) {
    padding: 1.5rem;
    /* border-radius: 5rem; */
  }

  @media (max-width: 375px) {
    padding: 2.67rem 3.33rem;
    /* border-radius: 5rem; */
  }
`;
const CommunityBox_Item_Content_Box = styled(FlexCCBox)`
  position: relative;
  border-radius: 2.5rem;
  /* border: 1px solid #f6f022; */
  background: #000;
  overflow: hidden;
  > img {
    &:first-child {
      position: absolute;
      top: 0.5rem;
      left: 0.5rem;
      width: 3.5rem;
      height: 3.5rem;
      flex-shrink: 0;
    }
  }
  @media (max-width: 430px) {
    border-radius: 2.5rem;
  }
  @media (max-width: 375px) {
    > img {
      &:first-child {
        position: absolute;
        top: 1rem;
        left: 1rem;
        width: 7rem;
        height: 7rem;
        flex-shrink: 0;
      }
    }
  }
`;

const CommunityBox_Item_Content = styled.img`
  width: 100%;
  object-fit: cover;
  z-index: 1;
`;
// const CommunityBox_Item_Content = styled.div<{ src: any }>`
//   width: 100%;
//   height: 18.66rem;
//   position: relative;
//   background: transparent;
//   background-image: ${({ src }) => `url(${src})`};
//   background-size: 100% 100%;

//   background-repeat: no-repeat;
//   border-radius: 0.91667rem;
//   border: 1px solid #f6f022;
//   > img {
//     width: 3.5rem;
//     height: 3.5rem;
//   }
// `;

export const NoDataContainer = styled(FlexCCBox)`
  padding: 50px;
`;

const LoadingBox = styled(FlexCCBox)`
  width: 100%;
  color: #fff;
  font-family: CKTKingkong;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const NoMoreBox = styled(LoadingBox)`
  width: 100%;
`;
const ManageBox = styled(FlexSBCBox)`
  width: 100%;
  /* margin: 25px 0px; */
  @media (max-width: 650px) {
    display: block;
  }
`;

export const ManageBox_Left = styled(FlexBox)`
  justify-content: space-between;
  > div {
    display: flex;
    align-items: center;
    &:first-child {
      color: #fff;
      font-family: CKTKingkong;
      font-size: 24px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      > img {
        margin-left: 10px;
        width: 30px;
        height: 30px;
      }
    }
  }
  @media (max-width: 650px) {
    margin-bottom: 16px;
    > div {
      &:first-child {
        font-size: 12px;
        > img {
          width: 22px;
          margin-right: 2px;
        }
      }
    }
  }
`;
const ManageBox_Right = styled(FlexBox)`
  justify-content: flex-end;
  align-items: center;
`;

const InputBox = styled(FlexSBCBox)`
  padding: 11px 27px;
  color: rgba(255, 255, 255, 0.6);
  font-family: CKTKingkong;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 5px 5px 10px 0px #000 inset,
    -3px -3px 5px 0px rgba(255, 255, 255, 0.2) inset;
  backdrop-filter: blur(28px);
  margin-right: 24px;
  > input {
    color: rgba(255, 255, 255, 0.6);
    font-family: CKTKingkong;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    background: transparent;
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
  > img {
    width: 30px;
    height: 30px;
  }

  @media (max-width: 650px) {
    width: 100%;
    margin-right: 0px;
    > input {
      font-size: 12px;
    }
    > img {
      width: 22px;
    }
  }
`;

export const FlterItem = styled(FlexCCBox)`
  padding: 8px 27px;
  color: #000;
  font-family: CKTKingkong;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  border-radius: 14px;
  background: linear-gradient(0deg, #95fa31 0.01%, #f6f022 99.99%);
  box-shadow: 4px 8px 0px 0px #4a8e00;
  white-space: nowrap;
  position: relative;
  .ant-dropdown {
    .ant-dropdown-menu {
      padding: 2.25rem 4.33333rem;
      flex-direction: column;
      justify-content: center;
      border-radius: 3.33333rem;
      background: rgba(255, 255, 255, 0.1);
      box-shadow: 5px 5px 10px 0px #000 inset,
        -3px -3px 5px 0px rgba(255, 255, 255, 0.2) inset;
      backdrop-filter: blur(28.5px);
      .LangItem {
        width: 100%;
        text-align: center;
        color: rgba(255, 255, 255, 0.6) !important;
        font-family: CKTKingkong;
        /* font-size: 1.5rem; */
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        white-space: nowrap;
      }
      .ActiveLangItem {
        color: #95fa31 !important;
      }
    }
  }
  > img {
    width: 30px;
    height: 30px;
    /* @media (max-width: 768px) {
      width: 18.875px;
      height: 18.875px;
      flex-shrink: 0;
    } */
  }
  @media (max-width: 1440px) {
    padding: 7.364px 12.741px;
    color: #000;
    font-family: "Gen Shin Gothic P";
    font-size: 12px;
    font-style: normal;
    font-weight: 900;
    line-height: 12px;
    border-radius: 8px;
    border-radius: 8px;
    background: linear-gradient(0deg, #95fa31 0.01%, #f6f022 99.99%);
    box-shadow: 1.888px 3.775px 0px 0px #4a8e00;
    text-align: center;
    > img {
      width: 18.875px;
      height: 18.875px;
    }
    .ant-dropdown {
      .ant-dropdown-menu {
        .LangItem {
          font-size: 12px;
        }
        .ActiveLangItem {
          color: #95fa31 !important;
        }
      }
    }
  }
`;

const CommunityBox_Item_SubTitle = styled(FlexCCBox)<{ src: any }>`
  position: absolute;
  left: 0px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  color: #95fa31;
  white-space: nowrap;
  writing-mode: vertical-rl;
  /* background: linear-gradient(91deg, #95fa31 0%, #f6f022 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent; */
  background-image: ${({ src }) => `url(${src})`};
  background-position: center;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  font-family: "CKTKingkong";
  font-size: 1.33333rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  padding: 12px;
  width: fit-content;
`;

const ChainTag = styled(FlexCCBox)<{ color: string }>`
  position: absolute;
  top: 6.8px;
  left: 6.8px;
  padding: 7px 16px;
  border-radius: 40px;
  background: #1b1b1b;
  color: ${({ color }) => color};
  text-align: center;
  font-family: CKTKingkong;
  font-size: 1.33333rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  z-index: 2;
  @media (max-width: 375px) {
    font-size: 2.32rem;
  }
`;

const CommunityBox_Item_Id = styled(FlexCCBox)<{ src: any }>`
  position: absolute;
  top: 0px;
  right: 0px;
  font-family: CKTKingkong;
  font-size: 1.33333rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  color: #95fa31;
  padding: 7px 12px 7px 40px;
  background-image: ${({ src }) => `url(${src})`};
  background-position: center;
  background-size: 100% 100%; //-
  background-repeat: no-repeat;
  z-index: 2;
  @media (max-width: 375px) {
    font-size: 2.6666rem;
  }
`;

const CommunityBox_Item_Bottom = styled(FlexSBCBox)`
  width: 100%;
  position: absolute;
  bottom: 0px;
  left: 0px;
  z-index: 2;
  border-radius: 0rem 0rem 1.5rem 0rem;
  background: linear-gradient(180deg, #f6f022 0%, #95fa31 100%);
`;
const Detail_CommunityBox_Item_Bottom = styled(CommunityBox_Item_Bottom)`
  background: transparent;
`;

const CommunityBox_Item_Bottom_Left = styled(FlexBox)<{ src: any }>`
  min-height: 4.2785rem;
  width: 65%;
  align-items: center;

  color: #95fa31;
  padding: 7px 12px 7px 40px;
  background-image: ${({ src }) => `url(${src})`};
  background-position: center;
  background-size: 100% 104%; //-
  background-repeat: no-repeat;
  padding: 1.25rem 0.5rem;
  font-family: CKTKingkong;
  font-size: 1.33333rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  > img {
    margin-right: 5px;
  }
  @media (max-width: 375px) {
    font-size: 2.32rem;
  }
`;

const CommunityBox_Item_Bottom_Right = styled.div`
  width: 35%;

  > div {
    display: flex;
    align-items: center;
    /* justify-content: space-evenly; */
    color: #000;
    font-family: "CKTKingkong";
    font-size: 1.33333rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    white-space: nowrap;
    > img {
      margin-left: 2px;
      width: 1.5rem;
      height: 1.5rem;
      flex-shrink: 0;
    }
  }
  @media (max-width: 375px) {
    width: 40%;

    > div {
      font-size: 1.3rem;
      > img {
        width: 2rem;
        height: 2rem;
      }
    }
  }
  @media (max-width: 375px) {
    > div {
      font-size: 2rem;
      > img {
        width: 3rem;
        height: 3rem;
      }
    }
  }
`;

const Detail_CommunityBox_Item_Bottom_Right = styled(
  CommunityBox_Item_Bottom_Right
)`
  height: 100%;
  > div {
    margin: -3% 10% 2% -9%;
  }
`;

const PurchaseModal = styled(Modal)<{ src: any }>`
  position: relative;
  background: transparent;
  background-image: ${({ src }) => `url(${src})`};
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  min-height: auto;

  .ant-modal-content {
    background: transparent !important;
    box-shadow: none;
    .ant-modal-body {
      padding: 4.7rem 6.2rem 80px;
    }
  }
  .close {
    width: 2.5rem;
    height: 2.5rem;
    position: absolute;
    right: 2.0833333333333335rem;
    top: 3.0833333333333335rem;
    > img {
      width: 100%;
    }
  }
  @media (max-width: 650px) {
    max-width: auto;
    background-size: 106% 100%;

    .close {
      width: 30px;
      height: 30px;
      right: 3%;
      top: 7px;
    }
    .ant-modal-content {
      .ant-modal-body {
        padding: 30px 10% 50px;
      }
    }
  }
`;

const BuyBtn = styled(Btn)<{ status: boolean }>`
  width: 100%;
  opacity: ${({ status }) => (status ? "1" : "0.6")};
  @media (max-width: 650px) {
    font-size: 14px;
    max-width: 220px;
    margin-top: 50px;
  }
`;

const PurchaseModal_Content = styled(FlexSBCBox)`
  width: 100%;
  margin-top: 3.33rem;
  > div {
    width: 47%;
  }
  @media (max-width: 650px) {
    display: block;
    > div {
      width: 100%;
    }
  }
`;

const PurchaseModal_Content_Left = styled(FlexCCBox)`
  position: relative;
  border-radius: 1.5rem;
  padding: 1.04rem;
  border: 1px solid #f6f022;
  height: 100%;

  > img {
    width: 100%;
  }
  @media (max-width: 650px) {
    max-width: 180px;
    margin: 18px auto 20px;
    > img {
    }
  }
`;

const PurchaseModal_Content_Right = styled(FlexBox)`
  width: 100%;
  flex-direction: column;
  align-items: center;
  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    color: rgba(255, 255, 255, 0.8);
    font-family: CKTKingkong;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-bottom: 1.5rem;
    @media (min-width: 650px) {
      &:last-child {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 7rem;
        color: #000;
        font-family: "CKTKingkong";
        font-size: 1.5rem;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        display: inline-flex;
        padding: 1.25rem 0px;
      }
    }
    > span {
      color: rgba(255, 255, 255, 0.8);
      font-family: CKTKingkong;
      font-size: 18px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
  }

  @media (max-width: 650px) {
    > div {
      font-size: 14px;

      > span {
        font-size: 14px;
      }
    }
  }
`;

const ContentModal_Items = styled(FlexSACBox)`
  justify-content: flex-start;
  width: 100%;
  > div {
    width: 100%;
    max-width: 124px;
    margin-right: 20px;

    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 14px;
    opacity: 0.5;

    padding: 8px 27px;
    color: #000;
    font-family: CKTKingkong;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    border-radius: 14px;
    background: linear-gradient(0deg, #95fa31 0.01%, #f6f022 99.99%);
    box-shadow: 4px 8px 0px 0px #4a8e00;
  }
  .Active {
    opacity: 1;
  }

  @media (max-width: 650px) {
    > div {
      padding: 7.364px;
      font-size: 12px;
      width: 100%;

      max-width: 80px;
      border-radius: 8px;
      background: linear-gradient(0deg, #95fa31 0.01%, #f6f022 99.99%);
      box-shadow: 2px 3px 0px 0px #4a8e00;
      margin-right: 10px;
    }
  }
`;

const JsonDiv = styled(FlexBox)`
  justify-content: flex-start;
  width: 100%;
  padding-left: 20px;
  text-align: left;
  font-size: 2rem;
  white-space: nowrap;
  @media (max-width: 650px) {
    font-size: 14px;
  }
`;

export const DetailBtn = styled(FlexCCBox)<{ src: any }>`
  background-image: ${({ src }) => `url(${src})`};
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  padding: 1.25rem 0.5rem;
  line-height: 16px !important;
`;
export const JsonBox = styled(FlexCCBox)`
  flex-direction: column;
  align-items: center;
  position: absolute;
  width: 100%;
  max-width: 200px;
  /* word-wrap: break-word; */
  height: 100%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(91deg, #95fa31 0%, #f6f022 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  @media (max-width: 650px) {
    > div {
      display: flex;
      justify-content: center;
      &:first-child {
        width: 60%;
        justify-content: flex-start;
      }
      &:last-child {
        width: 60%;
        justify-content: flex-start;
      }
    }
  }
`;

export const JsonBox_Right = styled.div`
  width: 100%;
  text-align: left;
  font-size: 2rem;
  @media (max-width: 650px) {
    font-size: 14px;
  }
`;
export const JsonBox_Left = styled(JsonBox_Right)``;

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

export let textType = {
  1: { name: "306" },
  2: { name: "306" },
};

export default function Community() {
  const { state: stateObj } = useLocation();
  const token = useSelector<any>((state) => state.token);
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const { width } = useViewport();
  const Navigate = useNavigate();
  const [PageSize, setPageSize] = useState(10);
  const [PageNum, setPageNum] = useState(1);
  const [PurchaseItemModal, setPurchaseItemModal] = useState(false);
  const [HangSaleList, setHangSaleList] = useState<any>({});
  const [searchId, setSearchId] = useState(0);
  const scrollContainerRef = useRef<any>(null);
  const [ActiveTab, setActiveTab] = useState(
    Number(stateObj?.tabIndex ?? 1) ?? 1
  );
  const [SubType, setSubType] = useState(0);
  const [ActiveFlterItem, setActiveFlterItem] = useState(1);
  const [ChainName, setChainName] = useState("Binance");
  let [SwitchState, setSwitchState] = useState(false);
  let [MyMint, setMyMint] = useState<any>([]);
  let [CurrentItem, setCurrentItem] = useState<any>({});

  let flterObj = [
    { name: "256", key: "1" },
    { name: "257", key: "2" },
  ];
  function changeFlterFun(item: any) {
    setActiveFlterItem(item?.key);
  }

  const menu = (
    <Menu
      onClick={changeFlterFun}
      items={flterObj.map((item: any) => {
        return {
          label: (
            <span
              className={
                Number(ActiveFlterItem) === Number(item?.key)
                  ? "ActiveLangItem LangItem"
                  : "LangItem"
              }
            >
              {t(item.name)}
            </span>
          ),
          key: item?.key,
        };
      })}
    />
  );

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
      return <a>{t("Previous")}</a>;
    }
    if (type === "next") {
      return <a>{t("Next")}</a>;
    }
    return originalElement;
  };

  const getInitData = async () => {
    if (!token) return;
    await hangSaleList({
      id: 0,
      isMe: 0,
      order: 1,
      pageNum: PageNum,
      pageSize: PageSize,
      chain: ChainName,
    }).then((res: any) => {
      if (res?.code === 200) {
        let Arr;
        Arr =
          width > 650 && res?.data?.list?.length % 3 !== 0
            ? fillArrayToMultipleOfFour(res?.data?.list, 4)
            : res?.data?.list;
        Arr =
          width > 768 && res?.data?.list?.length % 4 !== 0
            ? fillArrayToMultipleOfFour(res?.data?.list, 4)
            : res?.data?.list;
        res.data.list = Arr;
        setHangSaleList(res?.data || {});
      }
    });
  };

  const getMyInitData = async (id: any) => {
    let myList = await myMint({});
    let myListed = await hangSaleList({
      id: id ?? 0,
      isMe: 1,
      order: ActiveFlterItem ?? 1,
      pageNum: PageNum,
      pageSize: PageSize,
      chain: ChainName,
    });

    if (!!myList?.data || myListed?.data?.list?.length > 0) {
      myList.data = { ...myList.data, myId: "myList" + myList.data?.id };
      myListed.data.list = myListed?.data?.list?.map((item: any) => {
        return { ...item, myId: "myListed" + item?.id };
      });
      console.log(myList?.data, myListed?.data?.list, "333");

      let Arr1: any = [myList?.data, ...myListed?.data?.list];
      let Arr2: any = [...myListed?.data?.list];
      let Arr3: any = [myList?.data];

      Arr1 =
        width > 650 && Arr1?.length % 3 !== 0
          ? fillArrayToMultipleOfFour(Arr1, 4)
          : Arr1;
      Arr1 =
        width > 768 && Arr1?.length % 4 !== 0
          ? fillArrayToMultipleOfFour(Arr1, 4)
          : Arr1;
      Arr2 =
        width > 650 && Arr2?.length % 3 !== 0
          ? fillArrayToMultipleOfFour(Arr2, 4)
          : Arr2;
      Arr2 =
        width > 768 && Arr2?.length % 4 !== 0
          ? fillArrayToMultipleOfFour(Arr2, 4)
          : Arr2;
      Arr3 =
        width > 768 && Arr3?.length % 3 !== 0
          ? fillArrayToMultipleOfFour(Arr3, 4)
          : Arr3;
      Arr3 =
        width > 768 && Arr3?.length % 4 !== 0
          ? fillArrayToMultipleOfFour(Arr3, 4)
          : Arr3;

      setMyMint([Arr1, Arr2, Arr3] ?? []);
    } else {
      setMyMint([]);
    }
  };

  const searchFun = throttle((id: any) => {
    if (!token) return;
    if (Number(id) <= 0) return;
    getMyInitData(id);
  }, 3000);

  function fillArrayToMultipleOfFour(arr: any, num: number) {
    // -
    const fillCount = (4 - (arr?.length % num)) % num; // - 4--
    // --
    const newArr = new Array(arr?.length + fillCount).fill({});
    // -
    for (let i = 0; i < arr?.length; i++) {
      newArr[i] = arr[i];
    }
    return newArr;
  }

  const buyFun = async (id: any) => {
    console.log(id, "lid");

    if (!token || !id) return;
    let item: any;
    try {
      item = await pay({ id: id });
    } catch (error: any) {
      return addMessage("error");
    }
    console.log(item, "item");

    if (item?.code === 200) {
      showLoding(true);
      let res: any;
      try {
        let amount: any =
          Number(item?.data?.amount) +
          Number(EtherFun(item?.data?.free + "" ?? "0"));

        res = await Contracts?.example?.buy(
          account as string,
          item?.data?.sign,
          amount + ""
        );
      } catch (error: any) {}
      showLoding(false);
      if (!!res?.status) {
        getInitData();
        setPurchaseItemModal(false);
        return addMessage(t("258"));
      } else {
        return addMessage(t("259"));
      }
    } else {
      showLoding(false);
      return addMessage(item?.msg);
    }
  };

  const SplitJsonFun = (jsonData: any) => {
    return Object?.keys(jsonData).map((key, index) => (
      <JsonDiv key={index}>
        "{key}": "{jsonData[key]}"
        {Number(Object?.keys(jsonData)?.length) - 1 !== Number(index) && ","}
      </JsonDiv>
    ));
  };

  useEffect(() => {
    if (Number(ActiveTab) === 1 && token) {
      getInitData();
    } else if (Number(ActiveTab) === 2 && token) {
      getMyInitData(searchId);
    }
  }, [token, ActiveTab, searchId]);

  return (
    <CommunityContainer ref={scrollContainerRef}>
      <RankBox_Left_Tab>
        <RankBox_Left_Tab_Item
          className={Number(ActiveTab) === 1 ? "activeTab" : ""}
          onClick={() => {
            setPageNum(1);
            setActiveTab(1);
          }}
        >
          {t("260")}
        </RankBox_Left_Tab_Item>
        <RankBox_Left_Tab_Item
          className={Number(ActiveTab) === 2 ? "activeTab" : ""}
          onClick={() => {
            setPageNum(1);
            setActiveTab(2);
          }}
        >
          {t("261")}
        </RankBox_Left_Tab_Item>
      </RankBox_Left_Tab>
      {Number(ActiveTab) === 1 && (
        <>
          <ChainBox>
            <ChainBox_Item_Btn>
              <img src={AllIcon} alt="" />
              {t("114")}
            </ChainBox_Item_Btn>
            <ChainBox_Item_Box>
              {ChainList?.map((item: any, index: any) => (
                <ChainBox_Item_Box_Item key={index}>
                  <img
                    src={
                      String(item?.name) === String(ChainName)
                        ? item?.activeIcon
                        : item?.icon
                    }
                    alt=""
                    onClick={() => {
                      setChainName(item?.name);
                    }}
                  />
                </ChainBox_Item_Box_Item>
              ))}
            </ChainBox_Item_Box>
          </ChainBox>

          <ManageBox>
            <ManageBox_Left>
              <div>
                Result : {HangSaleList?.total ?? 0}{" "}
                <img
                  src={RefreshIcon}
                  alt=""
                  onClick={() => {
                    // setRefreshState(true);
                    getInitData();
                  }}
                  className={""}
                />
              </div>
              {width <= 650 && (
                <Dropdown
                  overlay={menu}
                  placement="bottom"
                  overlayClassName="LangDropDown"
                  trigger={["click"]}
                  arrow={false}
                  getPopupContainer={(triggerNode) => triggerNode}
                  onOpenChange={(value) => {
                    setSwitchState(value);
                  }}
                >
                  <FlterItem>
                    {t(
                      flterObj?.find(
                        (item: any) =>
                          Number(item?.key) === Number(ActiveFlterItem)
                      )?.name + ""
                    )}
                    <img
                      src={DropDownIcon}
                      alt=""
                      className={
                        SwitchState
                          ? "langIcon rotetaOpen"
                          : "langIcon rotetaClose"
                      }
                    />
                  </FlterItem>
                </Dropdown>
              )}
            </ManageBox_Left>
            <ManageBox_Right>
              <InputBox>
                <input
                  type="number"
                  placeholder={t("262")}
                  onChange={(e: any) => searchFun(e?.target?.value)}
                />
                <img src={SearchIcon} alt="" />
              </InputBox>

              {width > 650 && (
                <Dropdown
                  overlay={menu}
                  placement="bottom"
                  overlayClassName="LangDropDown"
                  trigger={["click"]}
                  arrow={false}
                  getPopupContainer={(triggerNode) => triggerNode}
                  onOpenChange={(value) => {
                    setSwitchState(value);
                  }}
                >
                  <FlterItem>
                    {t(
                      flterObj?.find(
                        (item: any) =>
                          Number(item?.key) === Number(ActiveFlterItem)
                      )?.name ?? ""
                    )}
                    <img
                      src={DropDownIcon}
                      alt=""
                      className={
                        SwitchState
                          ? "langIcon rotetaOpen"
                          : "langIcon rotetaClose"
                      }
                    />
                  </FlterItem>
                </Dropdown>
              )}
            </ManageBox_Right>
          </ManageBox>
        </>
      )}

      {Number(ActiveTab) === 1 &&
        (HangSaleList?.list?.length > 0 ? (
          <>
            <CommunityBox>
              {HangSaleList?.list?.map((item: any, index: any) =>
                !!item?.id ? (
                  <CommunityBox_Item
                    key={index}
                    onClick={() => {
                      setPurchaseItemModal(true);
                      setCurrentItem(item);
                    }}
                  >
                    <CommunityBox_Item_Content_Box>
                      <ChainTag color={"#F3BA2F"}>BNB</ChainTag>
                      <CommunityBox_Item_Id src={IdItemBg}>
                        ID:{item?.id}
                      </CommunityBox_Item_Id>

                      <CommunityBox_Item_SubTitle src={SubTitleItemBg}>
                        INSCRIPTION ALLIANCE
                      </CommunityBox_Item_SubTitle>
                      <CommunityBox_Item_Bottom>
                        <CommunityBox_Item_Bottom_Left src={PersonalItemBg}>
                          <img src={PersonIcon} alt="" />{" "}
                          {AddrHandle(item?.userAddress, 6, 6)}
                        </CommunityBox_Item_Bottom_Left>
                        <CommunityBox_Item_Bottom_Right>
                          <div>
                            {t("263")}
                            {item?.unitPrice} <img src={BNBIcon} alt="" />
                          </div>
                          <div>
                            {t("264")}
                            {item?.totalPrice} <img src={BNBIcon} alt="" />
                          </div>
                        </CommunityBox_Item_Bottom_Right>
                      </CommunityBox_Item_Bottom>

                      <CommunityBox_Item_Content
                        src={
                          ItemBg
                          // "https://inscriptionalliance.com/download/inscription/image/web/ItemBg.gif"
                        }
                      ></CommunityBox_Item_Content>
                    </CommunityBox_Item_Content_Box>
                  </CommunityBox_Item>
                ) : (
                  <div></div>
                )
              )}
            </CommunityBox>

            <PaginationContainer>
              <Pagination
                current={PageNum}
                pageSize={10}
                onChange={onChange}
                total={HangSaleList?.total}
                showQuickJumper
                defaultCurrent={1}
                itemRender={itemRender}
              />
            </PaginationContainer>
          </>
        ) : (
          <NoData />
        ))}
      {Number(ActiveTab) === 2 && (
        <ContentModal_Items>
          <div
            onClick={() => {
              setSubType(0);
            }}
            className={Number(SubType) === 0 ? "Active" : ""}
          >
            {t("265")}
          </div>
          <div
            onClick={() => {
              setSubType(1);
            }}
            className={Number(SubType) === 1 ? "Active" : ""}
          >
            {t("266")}
          </div>
          <div
            onClick={() => {
              setSubType(2);
            }}
            className={Number(SubType) === 2 ? "Active" : ""}
          >
            {t("267")}
          </div>
        </ContentModal_Items>
      )}
      {Number(ActiveTab) === 2 &&
        (MyMint?.length > 0 ? (
          <>
            <CommunityBox>
              {MyMint[SubType]?.map((item: any, index: any) =>
                !!item?.id ? (
                  <CommunityBox_Item
                    key={index}
                    onClick={() => {
                      console.log(1212);
                      return Navigate("/View/Market/2", {
                        state: { currentItem: item },
                      });
                    }}
                  >
                    <CommunityBox_Item_Content_Box>
                      <ChainTag color={"#F3BA2F"}>BNB</ChainTag>
                      <CommunityBox_Item_Id src={IdItemBg}>
                        ID : {item?.id}
                      </CommunityBox_Item_Id>

                      <CommunityBox_Item_SubTitle src={SubTitleItemBg}>
                        INSCRIPTION ALLIANCE
                      </CommunityBox_Item_SubTitle>
                      <Detail_CommunityBox_Item_Bottom>
                        <CommunityBox_Item_Bottom_Left src={PersonalItemBg}>
                          <img src={PersonIcon} alt="" />{" "}
                          {AddrHandle(item?.userAddress, 6, 6)}
                        </CommunityBox_Item_Bottom_Left>
                        <Detail_CommunityBox_Item_Bottom_Right>
                          {!!item?.totalPrice ? (
                            <DetailBtn src={detailBtnBg}>{t("266")}</DetailBtn>
                          ) : (
                            <DetailBtn src={detailBtnBg}>{t("268")}</DetailBtn>
                          )}
                        </Detail_CommunityBox_Item_Bottom_Right>
                      </Detail_CommunityBox_Item_Bottom>

                      <CommunityBox_Item_Content
                        src={
                          ItemBg
                          // "https://inscriptionalliance.com/download/inscription/image/web/ItemBg.gif"
                        }
                      ></CommunityBox_Item_Content>
                    </CommunityBox_Item_Content_Box>
                  </CommunityBox_Item>
                ) : (
                  <div></div>
                )
              )}
            </CommunityBox>
          </>
        ) : (
          <NoData />
        ))}

      <PurchaseModal
        visible={PurchaseItemModal}
        className="Modal"
        centered
        width={844}
        closable={false}
        footer={null}
        onCancel={() => {
          setPurchaseItemModal(false);
        }}
        src={width > 650 ? MarketModalBg : BuyModalBg}
      >
        <div
          className="close"
          onClick={() => {
            setPurchaseItemModal(false);
          }}
        >
          <img src={closeIcon} alt="" />
        </div>
        <MintTitleModal>{t("269")}</MintTitleModal>

        <PurchaseModal_Content>
          <PurchaseModal_Content_Left>
            <img src={JsonItemBg} alt="" />
            <JsonBox>
              <JsonBox_Left>{"{"}</JsonBox_Left>
              {CurrentItem?.mintJson &&
                SplitJsonFun(JSON.parse(CurrentItem?.mintJson?.slice(6)))}

              <JsonBox_Right>{"}"}</JsonBox_Right>
            </JsonBox>

            {/* <JsonBox>{CurrentItem?.mintJson}</JsonBox> */}
          </PurchaseModal_Content_Left>
          <PurchaseModal_Content_Right>
            <div>
              {t("270")} <span>ID:{CurrentItem?.id ?? "-"}</span>{" "}
            </div>
            <div>
              {t("271")}{" "}
              <span>{AddrHandle(CurrentItem?.userAddress, 6, 6)}</span>{" "}
            </div>
            <div>
              {t("272")}{" "}
              <span>
                {t(textType[CurrentItem?.fileType ?? 1]?.name ?? "1")}
              </span>{" "}
            </div>
            <div>
              {t("273")} <span>{CurrentItem?.createTime ?? "--"}</span>{" "}
            </div>
            <div>
              {t("274")}{" "}
              <span>
                {CurrentItem?.unitPrice ?? 0} <img src="" alt="" />
              </span>{" "}
            </div>
            <div>
              {t("275")}{" "}
              <span>
                {CurrentItem?.totalPrice ?? 0} <img src="" alt="" />
              </span>{" "}
            </div>
            <BuyBtn
              onClick={() => {
                if (
                  String(CurrentItem?.userAddress).toLocaleLowerCase() !==
                  String(account).toLocaleLowerCase()
                ) {
                  buyFun(CurrentItem?.id);
                }
              }}
              status={
                String(CurrentItem?.userAddress).toLocaleLowerCase() !==
                String(account).toLocaleLowerCase()
              }
            >
              {t("276")}
            </BuyBtn>
          </PurchaseModal_Content_Right>
        </PurchaseModal_Content>
      </PurchaseModal>
    </CommunityContainer>
  );
}
