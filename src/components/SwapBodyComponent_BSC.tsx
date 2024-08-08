import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { FlexBox, FlexCCBox, FlexSBCBox, FlexSCBox } from "./FlexBox";
import { useTranslation } from "react-i18next";
import { DropIcon, WithdrawIcon } from "../assets/image/SwapBox";
import { useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { useViewport } from "./viewportContext";
import { useNavigate } from "react-router-dom";
import { useBindState } from "../hooks/useBindState";
import { Menu, Pagination, PaginationProps } from "antd";

import closeIcon from "../assets/image/closeIcon.svg";
import SwapBg from "../assets/image/Swap/SwapBg.png";
import BridgeModalBg from "../assets/image/Swap/BridgeModalBg.png";
import swapIcon from "../assets/image/Swap/swapIcon.svg";
import BTIAToken from "../assets/image/Swap/BTIAToken.svg";
import BTIA from "../assets/image/Swap/BTIA.svg";
import InsIcon from "../assets/image/Swap/InsIcon.svg";
import transferToDownIcon from "../assets/image/Swap/transferToDownIcon.svg";
import successIcon from "../assets/image/Mint/successIcon.svg";
import rightIcon from "../assets/image/Rank/rightIcon.svg";
import leftIcon from "../assets/image/Rank/leftIcon.svg";
import {
  bridgePay,
  bridgeRecordList,
  getPrice,
  mintUserBoxBridge,
  myMint,
} from "../API";
import {
  AddrHandle,
  EtherFun,
  NumSplic1,
  addMessage,
  showLoding,
} from "../utils/tool";
import { Contracts } from "../web3";
import { InfoModal, TitleModal } from "../view/Market/InscriptionDetail";
import { sbBack } from "../assets/image/MintBox";
import NoData from "./NoData";
import PageLoding from "./PageLoding";

const SwapBox_Container = styled(FlexBox)<{ src: any }>`
  margin: 3.83rem auto 0px;
  width: 100%;
  max-width: 600px;
  flex-direction: column;
  align-items: center;
  background: transparent;
  background-image: ${({ src }) => `url(${src})`};
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding: 4.83rem 3.33rem;

  @media (max-width: 1400px) {
    margin: 4.75rem auto 0px;

    /* max-width: 82.75rem; */
    padding: 9.25rem 5rem;
  }
`;

const SwapBox_Container_Title = styled(FlexSBCBox)`
  width: 100%;
  padding: 2.33rem 3.33rem;
  @media (max-width: 1400px) {
    margin-bottom: 3.25rem;
    /* padding: 5rem 7.25rem; */
  }
  @media (max-width: 650px) {
    padding: 2.33rem 1rem;
  }
`;

const SwapBox_Container_Title_Left = styled(FlexSCBox)`
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

const SwapBox_Container_Title_Right = styled(FlexCCBox)`
  > svg {
    width: 28px;
    @media (max-width: 1400px) {
      height: 5rem;
      width: 5rem;
    }
  }
`;

const SwapBox_Container_Devider = styled.div`
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
    > img {
      margin: 2.75rem auto;
      width: 5rem;
      height: 5rem;
      flex-shrink: 0;
      flex-shrink: 0;
    }
  }
  @media (max-width: 650px) {
    padding: 30px 1rem;
  }
`;

const SwapBox_Container_Content_Item = styled.div`
  width: 100%;
`;
const SwapBox_Container_Content_Item_Top = styled(FlexSBCBox)`
  width: 100%;
  margin-bottom: 2.25rem;
  border-radius: 3.33333rem;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: -5px -5px 7px 0px rgba(255, 255, 255, 0.2) inset,
    7px 7px 12px 0px #000 inset;
  backdrop-filter: blur(28.5px);
  padding: 2.25rem 2.5rem 2.33333rem 2.5rem;

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
    text-align: right;
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
    padding: 3.38rem 3.75rem;

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
    margin: 12px 0px;
  }
`;

const SwapBox_Container_Content_Tip1 = styled(SwapBox_Container_Content_Tip)`
  /* margin: 0px 0px 20px 0px; */
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

export const ContentModal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  color: #fefefe;
  font-family: "CKTKingkong";
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-top: 30px;
  /* .ant-modal-centered .ant-modal { */
  /* } */
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
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
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
  /* margin-top: 30px; */
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
  .Content {
    &:hover {
      > div {
        color: #95fa31;
      }
    }
  }
`;

const CoinList_Item = styled(FlexSBCBox)`
  > div {
    flex: 1;
    color: rgba(255, 255, 255, 0.8);
    font-family: CKTKingkong;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    &:first-child {
      justify-content: flex-start;
    }
    &:last-child {
      justify-content: flex-end;
    }
  }
`;

const CoinList_Item_Left = styled(FlexCCBox)`
  width: fit-content;
  > img {
    width: 30px;
    height: 30px;
    margin-right: 12px;
  }
`;

const CoinList_Item_Right = styled(CoinList_Item_Left)``;

const CoinListModal = styled(InfoModal)`
  min-height: auto;

  .close {
    top: 10px;
    right: 3%;
    @media (max-width: 650px) {
      top: 0%;
    }
  }
  .ant-modal-content .ant-modal-body {
    padding: 5% 5% 8%;
    @media (max-width: 650px) {
      /* padding: 10% 8%; */
      padding: 5% 5% 10%;
    }
  }
`;
const SelectCoinListModal = styled(CoinListModal)`
  .close {
    top: 10px;
    right: 3%;
    @media (max-width: 650px) {
      top: 0%;
    }
  }
  .ant-modal-content .ant-modal-body {
    padding: 42px 13% 60px;
    @media (max-width: 650px) {
      /* padding: 10% 8%; */
      padding: 5% 5% 10%;
    }
  }
`;

const SwapBox_Container_Content_Item_Bottom_Radio = styled(FlexSBCBox)`
  display: block;
  margin-top: 2.25rem;
  color: #fefefe;
  font-family: "CKTKingkong";
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  width: 100%;
  > div {
    margin-top: 12px;
  }
  @media (max-width: 1400px) {
    font-size: 2.5rem;
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

const Devider = styled.div`
  height: 100%;
  width: 1px;
  opacity: 0.6;
  background: linear-gradient(
    270deg,
    rgba(149, 250, 49, 0) 1.07%,
    #95fa31 53.32%,
    rgba(149, 250, 49, 0) 100.4%
  );
  margin: 0px 20px;
  height: 2.16rem;
`;

const CoinList_Item_Center = styled(FlexCCBox)`
  color: #fff;
  font-family: "CKTKingkong";
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const ContentModal_Tip = styled(FlexCCBox)`
  width: 100%;
  background: linear-gradient(91deg, #95fa31 0%, #f6f022 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: "CKTKingkong";
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  padding: 0px 20px;
  text-align: center;
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;
const ConfirmSwapBtn = styled(SwapBtn)`
  max-width: 124px;
  margin: 34px auto 20px;
`;

const RankBox_Left_Table_Content = styled(FlexBox)`
  width: 100%;
  flex-direction: column;
  align-items: center;
`;

const RecordTable = styled.div`
  width: 100%;
`;
const RecordTable_Title = styled(FlexSBCBox)`
  width: 100%;
  > div {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-family: "CKTKingkong";
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    padding: 2.67rem 0rem;
    text-transform: uppercase;

    &:first-child {
      justify-content: flex-start;
    }
    &:last-child {
      justify-content: flex-end;
    }
    @media (max-width: 768px) {
      font-size: 2rem;
    }
    @media (max-width: 425px) {
      font-size: 12px;
      padding: 3rem 0rem;
    }
  }
`;
const TransferRecordTable_Title = styled(RecordTable_Title)`
  width: 100%;
  padding: 0rem 3.33rem;

  > div {
    &:first-child {
      justify-content: flex-start;
      /* max-width: 100px; */
    }
    &:last-child {
      flex: auto;
      max-width: 30px;
    }
  }
  @media (max-width: 768px) {
    padding: 0rem 2rem;
  }
`;
const TransferRecordTable_Title_Point = styled(RecordTable_Title)`
  width: 100%;
  padding: 0rem 3.33rem;

  > div {
    &:first-child {
      justify-content: flex-start;
      flex: auto;
      max-width: 40px;
      width: 100%;
    }
    &:nth-child(2) {
      justify-content: center;
    }
    &:nth-child(3) {
      justify-content: center;
    }
    &:last-child {
      justify-content: flex-end;
      max-width: 60px;
      flex: auto;

      width: 100%;
    }
  }
  @media (max-width: 768px) {
    padding: 0rem 2rem;
  }
`;

const TransferRecordTable_Content_Item = styled(TransferRecordTable_Title)`
  width: 100%;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  > div {
    color: rgba(255, 255, 255, 0.8);
    font-family: CKTKingkong;
    font-size: 1.33333rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    padding: 2rem 0rem;
    @media (max-width: 768px) {
      font-size: 1.8rem;
      /* padding: 2rem 0rem; */
    }
  }
`;

const LongBox = styled.div`
  width: 100%;
  padding: 0rem 3.33rem;
  @media (max-width: 768px) {
    padding: 0rem 2rem;
  }
  > div {
    padding: 1rem 0px !important;
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
    padding: 2rem 0rem;
    > span {
      font-size: 1.33333rem;
    }
    @media (max-width: 768px) {
      font-size: 1.8rem;
      > span {
        font-size: 1.8rem;
      }
      /* padding: 2rem 0rem; */
    }
  }
`;

const TransferRecordTable_Content_Item_Point = styled(
  TransferRecordTable_Title_Point
)`
  width: 100%;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  > div {
    color: rgba(255, 255, 255, 0.8);
    font-family: CKTKingkong;
    font-size: 1.33333rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    padding: 2rem 0rem;
    @media (max-width: 768px) {
      font-size: 1.8rem;
      /* padding: 2rem 0rem; */
    }
  }
`;

const RecordTable_Devider = styled.div`
  width: 100%;
  height: 1px;
  opacity: 0.6;
  background: linear-gradient(
    90deg,
    rgba(149, 250, 49, 0) 1.07%,
    #95fa31 53.32%,
    rgba(149, 250, 49, 0) 100.4%
  );
`;

const RecordTable_Content = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  min-height: 47rem;
  padding-right: 5px;
  > div {
    &:last-child {
      border-bottom: none;
    }
  }

  &::-webkit-scrollbar {
    width: 0.3333rem;
    right: 25.9992px;
  }

  /* -*/
  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10.9992px;
  }

  /* -*/
  &::-webkit-scrollbar-thumb {
    background: #95fa31;
    border-radius: 2.8333rem;
  }
  @media (max-width: 768px) {
    max-height: 56rem;
  }
`;

export const PaginationContainer = styled(FlexCCBox)`
  width: 100%;
  margin-top: 47px;
  .ant-pagination {
    flex-wrap: wrap;
    display: flex;
    align-items: center;
    .ant-pagination-prev,
    .ant-pagination-next {
      display: flex;
      align-items: center;
      a {
        color: #fff;
        font-family: Inter;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: normal; /* 100% */
      }
    }
    .ant-pagination-disabled {
      a {
        opacity: 0.5;
      }
    }
    .ant-pagination-item,
    .ant-pagination-jump-next {
      background: transparent;
      display: flex;
      justify-content: center;
      align-items: center;
      /* border: none; */
      border-radius: 0.25rem;
      border: 1px solid rgba(255, 255, 255, 0.4);
      background: #1b1b1b;
      a {
        color: rgba(255, 255, 255, 0.6);
        text-align: center;
        font-family: "CKTKingkong";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        text-transform: uppercase;
      }
    }
    .ant-pagination-item-active {
      border-radius: 3px;
      background: #808080;
      a,
      span {
        color: #000;
        text-align: center;
        font-family: "CKTKingkong";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        text-transform: uppercase;
      }
    }
    .ant-pagination-jump-next
      .ant-pagination-item-container
      .ant-pagination-item-ellipsis,
    .ant-pagination-jump-prev
      .ant-pagination-item-container
      .ant-pagination-item-ellipsis {
      display: flex;
      justify-content: center;
      align-items: center;
      color: rgba(255, 255, 255, 0.6);
      text-align: center;
      font-family: "CKTKingkong";
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      text-transform: uppercase;
    }

    .ant-pagination-options-quick-jumper {
      color: rgba(255, 255, 255, 0.6);
      text-align: center;
      font-family: "CKTKingkong";
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;

      input {
        border-radius: 3px;
        border: 1px solid rgba(255, 255, 255, 0.4);
        background: #1b1b1b;
        color: rgba(255, 255, 255, 0.6);
      }
    }
  }
  .ant-select {
    display: none;
  }
  @media (max-width: 768px) {
    margin-top: 18px;
  }
`;

const RecordTable_Content_NoData = styled(FlexCCBox)`
  padding: 20px;
`;
const Rank_RecordTable_Content_NoData = styled(RecordTable_Content_NoData)`
  padding: 11rem 0px;
`;

const RecordModal = styled(CoinListModal)`
  .close {
    top: 10px;
    right: 2%;
    @media (max-width: 650px) {
      top: 0%;
    }
  }
  @media (max-width: 650px) {
    background-size: 100% 100% !important;
  }
`;

const MintTitleModal = styled(TitleModal)`
  font-size: 24px;
  @media (max-width: 650px) {
    font-size: 4.5rem;
  }
`;
const MintTitleModal_Record = styled(MintTitleModal)`
  @media (max-width: 650px) {
    margin-top: 20px;
  }
`;

let USDASymbol: any = "USDA";
let USDTSymbol: any = "USDT";
let BTIASymbol: any = "BTIA";

let timeRef: any;
const SwapBodyComponentBSC = () => {
  const token = useSelector<any>((state) => state.token);
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const { width } = useViewport();
  const navigate = useNavigate();

  const [pageSize, setPageSize] = useState(10);
  const [pageNum, setPageNum] = useState(1);
  const [SelectCoinModal, setSelectCoinModal] = useState(false);
  const [MintSwapInfo, setMintSwapInfo] = useState<any>({});
  const [RecordList, setRecordList] = useState<any>([]);
  const inputRef = useRef<any>();
  const [amount1, setAmount1] = useState<any>("");
  const [amount2, setAmount2] = useState<any>("0");
  const [Amount2Balance, setAmount2Balance] = useState<any>("0");
  const [CoinType1, setCoinType1] = useState("BTIA");
  const [CoinType2, setCoinType2] = useState("USDA");
  const [SwitchState1, setSwitchState1] = useState<any>(false);
  const [SwitchState2, setSwitchState2] = useState<any>(false);
  // -
  const [ConfirmSwapModal, setConfirmSwapModal] = useState<any>(false);
  const [SuccessSwapModal, setSuccessSwapModal] = useState<any>(false);
  const [RecordSwapModal, setRecordSwapModal] = useState<any>(false);
  const [ChainName, setChainName] = useState("Binance");
  const [dataLoding, setDataLoding] = useState(true);
  const [OpenList, setOpenList] = useState<any>([]);
  const { getBindStateFun } = useBindState();
  let langObj1 = [{ coinName: BTIASymbol, coinIcon: InsIcon }];
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
  function changeLanguage1(item: any) {
    setCoinType1(item);
    setSwitchState1(!SwitchState1);
  }
  function changeLanguage2(item: any) {
    setCoinType2(item);
    setSwitchState2(!SwitchState2);
  }

  const menu1 = (
    <Menu
      onClick={(item: any) => {
        changeLanguage1(item?.key);
      }}
      items={langObj1.map((item: any) => {
        return {
          label: (
            <span className="CoinItem">
              <img src={item.coinIcon} alt="" />
              {item.coinName}
            </span>
          ),
          key: item?.coinName,
        };
      })}
    />
  );

  const getPriceFun = async (num: any, type: any) => {
    if (!token || Number(num) < 10) return;
    let item: any = await getPrice({
      mintNum: num,
      type: String(type) === USDASymbol ? 0 : 1,
    });
    console.log(item?.data?.price, "item?.price");

    return item?.data?.price ?? 0;
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

  const swapToUSDAFun = async () => {
    if (!token && amount1) return;
    if (Number(amount1) > Number(MintSwapInfo?.mintNum))
      return addMessage(t("Insufficient balance"));

    try {
      showLoding(true);
      let item: any = await mintUserBoxBridge({
        num: amount1,
        accord: MintSwapInfo?.accord,
        inscription: CoinType1,
        link: ChainName,
      });
      if (!!item?.data?.mintJsonHex) {
        let res: any;
        try {
          res = await Contracts?.example?.sendTransaction(
            account as string,
            item?.data?.toAddress,
            item?.data?.mintJsonHex
          );
        } catch (error: any) {
          return showLoding(false);
        }
        if (!!res?.status) {
          // getInitData();
          // showLoding(false);
          // return addMessage("-);
          let res1: any;
          let num: number = 1;
          timeRef = setInterval(async () => {
            let dataed: any;
            if (num === 1 && !dataed?.data?.sign) {
              dataed = await bridgePay({
                accord: MintSwapInfo?.accord,
                inscription: CoinType1,
                link: ChainName,
              });
            }
            if (num === 1 && dataed?.data?.sign) {
              try {
                num = num + 1;
                res1 = await Contracts.example?.bridge(
                  account as string,
                  dataed?.data?.sign
                );
              } catch (error: any) {}
              showLoding(false);
              if (!!res1?.status) {
                getInitData();
                inputAmountFun(CoinType1, "");
                Contracts.example
                  ?.balanceOf(account as string, "BTIA")
                  .then((res: any) => {
                    setAmount2Balance(EtherFun(res ?? "0"));
                  });
                setConfirmSwapModal(false);
                setSuccessSwapModal(true);
              } else {
                addMessage(CoinType1 + " " + t("237"));
              }
            }
          }, 2000);
        } else {
          return addMessage(t("237"));
        }
      }
      // }, 2000);
    } catch (error: any) {
      return addMessage("error");
    }
  };

  // 1:USDT=>MBK 2:MBK=>USDT
  const SwapFun = () => {
    if (!account) return;
    if (Number(amount1) <= 0) return;
    return swapToUSDAFun();
  };

  const inputAmountFun = async (type: any, amount: any) => {
    let amounted = amount;
    if (account) {
      setAmount1(amounted);
      setAmount2(amounted);
    } else {
      setAmount1("");
      setAmount2("");
    }
  };

  const getInitData = () => {
    myMint({}).then((res: any) => {
      setMintSwapInfo(res?.data || {});
    });
    setDataLoding(true);
    bridgeRecordList({
      accord: MintSwapInfo?.accord,
      inscription: CoinType1,
      link: ChainName,
      pageNum: pageNum,
      pageSize: pageSize,
    }).then((res: any) => {
      setDataLoding(false);

      setRecordList(res?.data || {});
    });
  };

  useEffect(() => {
    if (token) {
      getInitData();
    }
    return () => {
      clearInterval(timeRef);
    };
  }, [token, pageNum, RecordSwapModal]);
  useEffect(() => {
    if (account) {
      Contracts.example?.balanceOf(account, "BTIA").then((res: any) => {
        setAmount2Balance(EtherFun(res ?? "0"));
      });
    }
  }, [account]);

  const BalanceBox1 = (name: string) => {
    if (String(name) === String(BTIASymbol))
      return (
        <SwapBox_Container_Content_Item_Bottom>
          {false ? <div>${!!amount1 ? amount1 : 0} </div> : <div></div>}{" "}
          <div>
            {t("238")} : {MintSwapInfo?.mintNum ?? 0}
          </div>
        </SwapBox_Container_Content_Item_Bottom>
      );
  };
  const BalanceBox2 = (name: string) => {
    if (String(name) === String(BTIASymbol))
      return (
        <SwapBox_Container_Content_Item_Bottom>
          {false ? <div>${!!amount1 ? amount1 : 0} </div> : <div></div>}{" "}
          <div>
            {t("201")} : {Amount2Balance ?? 0}
          </div>
        </SwapBox_Container_Content_Item_Bottom>
      );
  };

  return (
    <>
      <SwapBox_Container src={SwapBg}>
        <SwapBox_Container_Title>
          <SwapBox_Container_Title_Left>
            <img src={swapIcon} alt="" />
            {t("DenimBridge")}
          </SwapBox_Container_Title_Left>
          <SwapBox_Container_Title_Right>
            <WithdrawIcon
              onClick={() => {
                setRecordSwapModal(true);
              }}
            />
          </SwapBox_Container_Title_Right>
        </SwapBox_Container_Title>
        <SwapBox_Container_Devider />
        <SwapBox_Container_Content>
          {/* -*/}
          <SwapBox_Container_Content_Item>
            <SwapBox_Container_Content_Item_Top>
              <div>
                <DropContaienr>
                  <DropBox
                    onClick={() => {
                      setSelectCoinModal(true);
                    }}
                  >
                    <img
                      src={
                        langObj1.find(
                          (item: any) =>
                            String(item.coinName) === String(CoinType1)
                        )?.coinIcon
                      }
                      alt=""
                      className="langIcon"
                    />
                    <span>
                      {
                        langObj1.find(
                          (item: any) =>
                            String(item.coinName) === String(CoinType1)
                        )?.coinName
                      }
                    </span>
                    <DropIcon
                      className={SwitchState1 ? "rotetaOpen" : "rotetaClose"}
                    />
                  </DropBox>
                  {/* </Dropdown> */}
                </DropContaienr>
              </div>
              <Devider></Devider>
              <input
                type="number"
                placeholder={t("239")}
                min={0}
                value={!!amount1 ? amount1 : ""}
                onChange={(e: any) => inputAmountFun(CoinType1, e.target.value)}
              />
            </SwapBox_Container_Content_Item_Top>
            {BalanceBox1(CoinType1)}
          </SwapBox_Container_Content_Item>
          <img src={transferToDownIcon} alt="" />
          {/* -*/}

          <SwapBox_Container_Content_Item>
            <SwapBox_Container_Content_Item_Top>
              <div>
                {/* <div>MAX</div>{" "} */}
                <DropContaienr>
                  <DropBox>
                    <img src={BTIAToken} alt="" className="langIcon" />
                    <span>{CoinType2}</span>
                  </DropBox>
                </DropContaienr>
              </div>
              <Devider></Devider>

              <input
                type="number"
                placeholder="0"
                readOnly={true}
                value={NumSplic1(amount2 ?? 0, 6)}
              />
            </SwapBox_Container_Content_Item_Top>
            {BalanceBox2(CoinType2)}
          </SwapBox_Container_Content_Item>

          <SwapBox_Container_Content_Item_Bottom_Radio>
            {t("240")}
            <SwapBox_Container_Content_Item_Bottom_Item>
              <div>{t("241")} :</div>{" "}
              <div style={{ color: "#95FA31" }}>{0} BNB</div>
            </SwapBox_Container_Content_Item_Bottom_Item>
            <SwapBox_Container_Content_Item_Bottom_Item>
              {" "}
              <div>{t("242")} :</div> <div>{!!amount1 ? amount1 : 0} USDA</div>
            </SwapBox_Container_Content_Item_Bottom_Item>
          </SwapBox_Container_Content_Item_Bottom_Radio>

          <SwapBox_Container_Content_Tip1></SwapBox_Container_Content_Tip1>

          <SwapBtn
            active={true}
            onClick={() => {
              // SwapFun();
              setConfirmSwapModal(true);
            }}
          >
            {!!amount1 ? t("243") : t("244")}
          </SwapBtn>
        </SwapBox_Container_Content>
      </SwapBox_Container>

      <SelectCoinListModal
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
        <MintTitleModal>{t("245")}</MintTitleModal>
        <ContentModal>
          {/* <input type="text" placeholder="--- /> */}
          <CoinList>
            <CoinList_Item_Box>
              {[1].map((item: any) => (
                <CoinList_Item>
                  <CoinList_Item_Left>{t("246")}</CoinList_Item_Left>
                  <CoinList_Item_Center>{t("247")}</CoinList_Item_Center>
                  <CoinList_Item_Right>{t("248")}</CoinList_Item_Right>
                </CoinList_Item>
              ))}
            </CoinList_Item_Box>
            <CoinList_Item_Box>
              {[{ token: "BTIA" }].map((item: any) => (
                <CoinList_Item
                  className="Content"
                  onClick={() => {
                    setCoinType1(item?.token);
                    setSelectCoinModal(false);
                  }}
                >
                  <CoinList_Item_Left>
                    <img src={InsIcon} alt="" className="langIcon" />
                    {item?.token}
                  </CoinList_Item_Left>
                  <CoinList_Item_Center>BSC</CoinList_Item_Center>

                  <CoinList_Item_Right>
                    {MintSwapInfo?.mintNum ?? 0}
                  </CoinList_Item_Right>
                </CoinList_Item>
              ))}
            </CoinList_Item_Box>
          </CoinList>
        </ContentModal>
      </SelectCoinListModal>

      <CoinListModal
        visible={ConfirmSwapModal}
        className="Modal"
        centered
        width={510}
        closable={false}
        footer={null}
        onCancel={() => {
          setConfirmSwapModal(false);
        }}
        src={sbBack}
      >
        <div
          className="close"
          onClick={() => {
            setConfirmSwapModal(false);
          }}
        >
          <img src={closeIcon} alt="" />
        </div>
        <ContentModal>
          <ContentModal_Tip> {t("249")}</ContentModal_Tip>
          <ConfirmSwapBtn
            active={true}
            onClick={() => {
              return addMessage(t("Open soon"));
              // SwapFun();
              // getBindStateFun(SwapFun, () => {
              //   setConfirmSwapModal(false);
              // });
            }}
          >
            {t("Confirm")}
          </ConfirmSwapBtn>
        </ContentModal>
      </CoinListModal>
      <SelectCoinListModal
        visible={SuccessSwapModal}
        className="Modal"
        centered
        width={510}
        closable={false}
        footer={null}
        onCancel={() => {
          setSuccessSwapModal(false);
        }}
        src={sbBack}
      >
        <div
          className="close"
          onClick={() => {
            setSuccessSwapModal(false);
          }}
        >
          <img src={closeIcon} alt="" />
        </div>
        <MintTitleModal>{t("250")}</MintTitleModal>

        <ContentModal>
          <img src={successIcon} alt="" />
        </ContentModal>
      </SelectCoinListModal>

      <RecordModal
        visible={RecordSwapModal}
        className="Modal"
        centered
        width={768}
        closable={false}
        footer={null}
        onCancel={() => {
          setRecordSwapModal(false);
        }}
        src={BridgeModalBg}
      >
        <div
          className="close"
          onClick={() => {
            setRecordSwapModal(false);
          }}
        >
          <img src={closeIcon} alt="" />
        </div>
        <MintTitleModal_Record>{t("251")}</MintTitleModal_Record>

        <ContentModal style={{ marginTop: "0px" }}>
          <RankBox_Left_Table_Content>
            <RecordTable>
              <TransferRecordTable_Title>
                <div>{t("252")}</div>
                <div>{t("253")}</div>
                <div>{t("254")}</div>
                <div>{t("255")}</div>
                <div> </div>
              </TransferRecordTable_Title>
              <RecordTable_Devider></RecordTable_Devider>
              {!dataLoding ? (
                RecordList?.list?.length > 0 ? (
                  <RecordTable_Content>
                    {RecordList?.list?.map((item: any, index: any) => (
                      <>
                        <TransferRecordTable_Content_Item key={index}>
                          <div>{item?.createTime}</div>
                          <div>{item?.targetLink}</div>
                          <div>{item?.targetInscription}</div>
                          <div>{item?.targetNum}</div>
                          <div
                            onClick={() => {
                              openFun(item?.id);
                            }}
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
                        </TransferRecordTable_Content_Item>
                        {OpenList?.some(
                          (item1: any) => Number(item1) === Number(item?.id)
                        ) && (
                          <LongBox>
                            <div>
                              {t("358")}
                              <span>
                                {" "}
                                {AddrHandle(item?.transferHash, 6, 6)}
                              </span>
                            </div>
                            <div>
                              {t("359")}
                              <span>
                                {AddrHandle(item?.contractHash, 6, 6)}
                              </span>
                            </div>
                          </LongBox>
                        )}
                      </>
                    ))}
                  </RecordTable_Content>
                ) : (
                  <Rank_RecordTable_Content_NoData>
                    <NoData />
                  </Rank_RecordTable_Content_NoData>
                )
              ) : (
                <FlexCCBox style={{ minHeight: "300px" }}>
                  <PageLoding></PageLoding>
                </FlexCCBox>
              )}
            </RecordTable>

            <PaginationContainer>
              <Pagination
                current={pageNum}
                pageSize={10}
                onChange={onChange}
                total={RecordList?.total}
                showQuickJumper
                defaultCurrent={1}
                itemRender={itemRender}
              />
            </PaginationContainer>
          </RankBox_Left_Table_Content>
        </ContentModal>
      </RecordModal>
    </>
  );
};

export default SwapBodyComponentBSC;
