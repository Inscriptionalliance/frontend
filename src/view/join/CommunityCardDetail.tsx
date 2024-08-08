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
  FlexSASBox,
  FlexSBCBox,
  FlexSCBox,
  FlexSECBox,
} from "../../components/FlexBox/index";
import { useViewport } from "../../components/viewportContext";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import closeIcon from "../../assets/image/closeIcon.svg";

import NoData from "../../components/NoData";
import { Dropdown, Menu, Modal, Pagination, PaginationProps } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  AddrHandle,
  addMessage,
  dateFormat,
  showLoding,
  thousandsSeparator,
} from "../../utils/tool";
import {
  btiaPledge,
  inviteRecord,
  mintRankPhase,
  pledgeIncomeList,
  pledgeInfo,
  pledgeStatus,
  receiveIncome,
  refereeList,
  transferAuth,
  vipUserCommunityList,
  vipUserInfo,
  withdraw,
} from "../../API";
import SvipImg from "../../assets/image/join/VipImg.gif";
import VipImg from "../../assets/image/join/vip.png";
import isNodeVip from "../../assets/image/join/isNodeVip.gif";
import isAdvancedVip from "../../assets/image/join/isAdvancedVip.gif";
import isStandardVip from "../../assets/image/join/isStandardVip.gif";
import goToIcon from "../../assets/image/join/goToIcon.svg";
import pledgeDividendsIcon from "../../assets/image/join/pledgeDividendsIcon.png";
import BridgeModalBg from "../../assets/image/Swap/BridgeModalBg.png";
import DataModalBg from "../../assets/image/Person/DataModalBg.png";
import rightIcon from "../../assets/image/Rank/rightIcon.svg";
import leftIcon from "../../assets/image/Rank/leftIcon.svg";
import { ReturnIcon } from "../../assets/image/MarketBox";
import { Contracts } from "../../web3";
import Web3 from "web3";
import i18n from "../../lang/i18n";
import { SuccessIcon, sbBack } from "../../assets/image/MintBox";
import { MintTitleModal_InfoModal } from "../Market/InscriptionDetail";
import { ContentModal } from "../../components/SwapBodyComponent_BSC";
import { DropIcon } from "../../assets/image/SwapBox";
import PageLoding from "../../components/PageLoding";
import { useBindState } from "../../hooks/useBindState";
const web3 = new Web3();

export const Btn = styled(FlexCCBox)`
  text-align: center;
  width: 100%;
  padding: 0.91667rem;
  color: #000;
  font-family: "CKTKingkong";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  border-radius: 14px;
  background: linear-gradient(0deg, #95fa31 0.01%, #f6f022 99.99%);
  box-shadow: 0.3333333333333333rem 0.6666666666666666rem 0rem 0rem #4a8e00;

  @media (max-width: 650px) {
    padding: 8px !important;
    border-radius: 8px !important;
    background: linear-gradient(0deg, #95fa31 0.01%, #f6f022 99.99%) !important;
    box-shadow: 2.855px 5.709px 0px 0px #4a8e00 !important;
    color: #000 !important;
    justify-content: center !important;
  }
`;

const ReturnBox = styled(FlexBox)`
  justify-content: flex-start;
  align-items: center;
  color: #fff;
  font-family: CKTKingkong;
  font-size: 30px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  > svg {
    margin-right: 20px;
    width: 40px;
    height: 40px;
  }

  @media (max-width: 650px) {
    font-size: 18px;
    > svg {
      width: 24px;
      height: 24px;
      margin-right: 4px;
    }
  }
`;

const CommunityContainer = styled.div`
  padding: 10rem 0px;
  width: 100%;
  max-width: 1400px;
  > div {
    margin-bottom: 25px;
  }
  /* overflow: auto; */
  /* height: 100%; */
  @media (min-width: 1920px) {
    max-width: 1650px;
  }
  @media (max-width: 1400px) {
    padding: 20px;
  }
`;

export const NoDataContainer = styled(FlexCCBox)`
  padding: 50px;
`;

const PurchaseModal = styled(Modal)<{ src: any }>`
  position: relative;
  background: transparent;
  background-image: ${({ src }) => `url(${src})`};
  background-size: 100% 100%;
  background-repeat: no-repeat;
  min-height: 57.5rem;
  background-position: center;
  .ant-modal-content {
    background: transparent !important;
    box-shadow: none;
    .ant-modal-body {
      padding: 42px 13% 60px;
    }
  }
  .close {
    width: 30px;
    height: 30px;
    position: absolute;
    right: 5%;
    top: 5%;
    > img {
      width: 100%;
    }
  }
  @media (max-width: 650px) {
    background-size: 106% 115%;

    .close {
      width: 30px;
      height: 30px;
      right: 3%;
      top: 0px;
    }
    .ant-modal-content {
      .ant-modal-body {
        padding: 20px 10%;
      }
    }
  }
`;
export const InfoModal = styled(PurchaseModal)`
  min-height: auto;
  @media (max-width: 650px) {
    min-height: 250px;
  }
`;

export const TitleModal = styled.div`
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

const PurchaseModal_Content = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0px auto;
  margin-top: 3.33rem;
`;

const PurchaseModal_Content_Left = styled.div`
  border-radius: 1.5rem;
  /* padding: 1.04rem; */
  /* border: 1px solid #f6f022; */
  .svip {
    width: 100%;
    height: 332px;
    /* background: ${`url(https://inscriptionalliance.com/download/inscription/image/web/VipImg.gif)`}; */
    background: ${`url(${SvipImg})`};
    background-position: center;
    background-size: 100% 110%;

    @media (max-width: 650px) {
      aspect-ratio: 251 / 153;
      height: auto;
    }
  }

  .vip {
    width: 100%;
    height: 332px;
    /* background: ${`url(https://inscriptionalliance.com/download/inscription/image/web/VipImg.gif)`}; */
    background: ${`url(${VipImg})`};
    background-size: 100% 100%;

    @media (max-width: 650px) {
      height: 47rem;
    }
  }
  .isNodeVip {
    width: 100%;
    height: 332px;
    /* background: ${`url(https://inscriptionalliance.com/download/inscription/image/web/isNodeVip.gif)`}; */
    background: ${`url(${isNodeVip})`};
    background-position: center;
    background-size: 100% 110%;

    @media (max-width: 650px) {
      aspect-ratio: 251 / 153;
      height: auto;
    }
  }
  .isAdvancedVip {
    width: 100%;
    height: 332px;
    /* background: ${`url(https://inscriptionalliance.com/download/inscription/image/web/isAdvancedVip.gif)`}; */
    background: ${`url(${isAdvancedVip})`};
    background-position: center;
    background-size: 100% 110%;

    @media (max-width: 650px) {
      aspect-ratio: 251 / 153;
      height: auto;
    }
  }
  .isStandardVip {
    width: 100%;
    height: 332px;
    /* background: ${`url(https://inscriptionalliance.com/download/inscription/image/web/isAdvancedVip.gif)`}; */
    background: ${`url(${isStandardVip})`};
    background-position: center;
    background-size: 100% 110%;

    @media (max-width: 650px) {
      aspect-ratio: 251 / 153;
      height: auto;
    }
  }

  @media (max-width: 650px) {
    /* padding: 11px; */
    margin-bottom: 20px;
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
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    /* line-height: normal; */
    margin-bottom: 1.5rem;
    > span {
      font-size: 20px;
      display: flex;
      justify-content: flex-end;
      text-align: right;
      max-width: 60%;
    }
  }

  @media (max-width: 650px) {
    > div {
      font-size: 14px;
      > span {
        font-size: 14px;
        /* > img {
          width: 16px;
        } */
      }
    }
  }
`;

export const SuccessfulModal_Content = styled(FlexBox)`
  flex-direction: column;
  align-items: center;
  > svg {
    margin: 3.33rem 0px 2.33rem;
  }

  > div {
    color: #fff;
    font-family: "CKTKingkong";
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    > span {
      background: linear-gradient(92deg, #95fa31 24.25%, #f6f022 52.05%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-family: CKTKingkong;
      font-size: 18px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
  }
  @media (max-width: 430px) {
    > div {
      font-size: 2.91666rem;
      > span {
        font-size: 2.91666rem;
      }
    }
  }
`;

const InputModal_Content = styled(SuccessfulModal_Content)`
  margin-top: 30px;

  > div {
    margin-bottom: 30px;
  }
`;

const SuccessfulModal_Content_Item = styled.div`
  width: 100%;
  color: #fff;
  font-family: "CKTKingkong";
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;

  > input {
    margin-left: 4px;
    flex: 1;
    padding: 18px 28px;
    border-radius: 40px;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 5px 5px 10px 0px #000 inset,
      -3px -3px 5px 0px rgba(255, 255, 255, 0.2) inset;
    backdrop-filter: blur(28.5px);
  }

  @media (max-width: 650px) {
    font-size: 12px;
    > input {
      padding: 12px;
      font-size: 12px;
    }
    > div {
      &:first-child {
        margin-top: 0px;
      }
    }
  }
`;

const ConfirmBtn = styled(Btn)`
  max-width: 200px;
  padding: 12px;
  color: #000 !important;
  font-family: "CKTKingkong";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  box-shadow: 4px 8px 0px 0px #4a8e00;
  @media (max-width: 650px) {
    font-size: 2.91666rem !important;
  }
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

const PurchaseModal_Content_Box1 = styled(FlexSBCBox)`
  width: 100%;
  align-items: flex-start;
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

const PurchaseModal_Content_Right_Title = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  color: #fff;
  margin: 60px 0px 32px;
  font-family: "CKTKingkong";
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  > span {
    color: #a4f92f;
    font-size: 20px;
    display: flex;
    justify-content: flex-end;
    text-align: right;
    max-width: 60%;
  }
  @media (max-width: 650px) {
    margin: 20px 0px 18px;
    font-size: 18px;
    > span {
      font-size: 14px;
    }
  }
`;
const PledgeDividends = styled.div`
  width: 100%;
`;

const PledgeDividends_Item = styled.div``;
const PledgeDividends_Title = styled.div`
  color: #fff;
  font-family: "CKTKingkong";
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin: 40px 0px 20px;
  @media (max-width: 650px) {
    margin: 20px 0px;

    font-size: 18px;
  }
`;
const PledgeDividends_Box = styled(FlexSBCBox)`
  padding: 15px 36px;
  border-radius: 40px;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 7px 7px 12px 0px #000 inset,
    -7px -7px 12px 0px rgba(255, 255, 255, 0.2) inset;
  backdrop-filter: blur(28.5px);
  > div {
    width: 45%;
  }
  @media (max-width: 768px) {
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 2.464px 2.464px 4.224px 0px #000 inset,
      -1.76px -1.76px 2.464px 0px rgba(255, 255, 255, 0.2) inset;
    backdrop-filter: blur(10.033162117004395px);
  }
`;

const PledgeDividends_Box_Left = styled.div`
  > img {
    width: 100%;
  }
`;
const PledgeDividends_Box_Right = styled(FlexBox)`
  flex-direction: column;
  align-items: center;
`;
const PledgeBtn = styled(Btn)<{ active: boolean }>`
  max-width: 140px;
  padding: 14px 0px;
  background: ${({ active }) =>
    active
      ? "linear-gradient(0deg, #95FA31 0.01%, #F6F022 99.99%)"
      : "linear-gradient(0deg, #95FA31 0.01%, #F6F022 99.99%)"};
  opacity: ${({ active }) => (active ? "1" : "0.5")};
  box-shadow: 6px 10px 0px 0px #4a8e00;

  @media (max-width: 768px) {
    padding: 6px;
    border-radius: 8px;
    box-shadow: 3.643px 6.071px 0px 0px #4a8e00;
  }
`;
const PledgeRecord = styled(FlexCCBox)`
  margin-top: 18px;
  color: #a4f92f;
  text-align: center;
  font-family: "CKTKingkong";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  @media (max-width: 768px) {
    font-size: 14px;
    img {
      width: 16px;
    }
  }
`;
const PledgeDividends_Item_Box = styled.div`
  > div {
    color: rgba(255, 255, 255, 0.8);
    font-family: "CKTKingkong";
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  @media (max-width: 650px) {
    > div {
      font-size: 14px;
    }
  }
`;
const SuccessfulModal_Content_Item_Div = styled(FlexCCBox)`
  margin-top: 24px;
  color: #fff;
  text-align: center;
  font-family: "CKTKingkong";
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  @media (max-width: 650px) {
    font-size: 2.91666rem;
  }
`;

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
      font-size: 2.5rem;
    }
    @media (max-width: 425px) {
      font-size: 12px;
      padding: 3rem 0rem;
    }
  }
`;

const RecordTable_Title1 = styled(FlexSBCBox)`
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
      &:first-child {
        flex: auto;
        max-width: 70px;
      }
    }
    &:last-child {
      justify-content: flex-end;
    }
    @media (max-width: 768px) {
      font-size: 2.5rem;
      /* &:first-child {
        flex: auto;
        max-width: 90px;
      } */
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
const ReferRecordTable_Title = styled(RecordTable_Title)`
  width: 100%;
  padding: 0rem 3.33rem;

  > div {
    white-space: nowrap;
    &:first-child {
      justify-content: flex-start;
      flex: auto;
      max-width: 60px;
    }
  }
  @media (max-width: 768px) {
    padding: 0rem 2rem;
    > div {
      &:first-child {
        justify-content: flex-start;
        flex: auto;
        max-width: 40px;
      }
      &:nth-child(2) {
        flex: auto;
        max-width: 80px;
      }
      &:last-child {
        flex: auto;
        max-width: 80px;
      }
    }
  }
`;
const TeamDataTable_Title = styled(RecordTable_Title1)`
  width: 100%;
  padding: 0rem 3.33rem;

  @media (max-width: 768px) {
    padding: 0rem;
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
const ReferRecordTable_Content_Item = styled(ReferRecordTable_Title)`
  width: 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
  > div {
    color: rgba(255, 255, 255, 0.8);
    font-family: CKTKingkong;
    font-size: 1.33333rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    padding: 2rem 0rem;
    @media (max-width: 768px) {
      font-size: 2.5rem;
      /* padding: 2rem 0rem; */
    }
  }
  .dropBox {
    flex: auto !important;
    max-width: 20px !important;
    > svg {
      margin-left: 5px;
    }
  }
`;
const TeamDataTable_Content_Item = styled(TeamDataTable_Title)`
  width: 100%;
  border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
  > div {
    color: rgba(255, 255, 255, 0.8);
    font-family: CKTKingkong;
    font-size: 1.33333rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    padding: 2rem 0rem;
    white-space: nowrap;
    &:first-child {
      border-top: none !important;
    }
    @media (max-width: 768px) {
      font-size: 2.5rem;
      /* padding: 2rem 0rem; */
    }
  }
  .dropBox {
    flex: auto;
    max-width: 20px;
    > svg {
      margin-left: 5px;
    }
  }
`;

const LongBox = styled.div`
  width: 100%;
  > div {
    padding: 1rem 0px !important;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: rgba(255, 255, 255, 0.8);
    font-family: "CKTKingkong";
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    padding: 2rem 0rem;
    > span {
      font-size: 1.33333rem;
    }
    @media (max-width: 768px) {
      font-size: 2.5rem;
      > span {
        font-size: 2.5rem;
      }
    }
  }
`;
// -
const LongBox1 = styled.div`
  width: 100%;
  padding: 0rem 3.33rem;
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
  @media (max-width: 768px) {
    padding: 0rem 2rem;
  }
`;
// -
const LongBox2 = styled.div`
  width: 100%;
  padding: 0rem 3.33rem;
  > div {
    text-transform: uppercase;
    padding: 0rem 0px 2rem !important;
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
    > span {
      font-size: 1.33333rem;
    }
    @media (max-width: 768px) {
      font-size: 2.5rem;
      > span {
        font-size: 2.5rem;
      }
    }
  }
  @media (max-width: 768px) {
    padding: 0rem 2rem;
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
  max-height: 47rem;
  /* padding-right: 5px; */
  > div {
    &:last-child {
      border-bottom: none;
    }
  }

  &::-webkit-scrollbar {
    width: 0.3333rem;
    right: 25.9992px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10.9992px;
  }

  &::-webkit-scrollbar-thumb {
    background: #95fa31;
    border-radius: 2.8333rem;
  }
  @media (max-width: 768px) {
    max-height: 56rem;
  }
`;
const ReferRecordTable_Content = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  max-height: 40rem;
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

  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10.9992px;
  }

  &::-webkit-scrollbar-thumb {
    background: #95fa31;
    border-radius: 2.8333rem;
  }
  @media (max-width: 768px) {
    max-height: 56rem;
  }
`;
const TeamRecordTable_Content = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  max-height: 30rem;
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

  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10.9992px;
  }

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
  padding: 30px 20px;

  @media (max-width: 650px) {
    padding: 20px;
  }
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
    font-size: 3.75rem;
  }
`;

const MintTitleModal_Record = styled(MintTitleModal)`
  margin-top: 20px;
`;

const BannerModalBg = styled(FlexBox)<{ src: string }>`
  margin: 20px 0px 10px;

  padding: 63px 87px;
  background-image: ${({ src }) => `url(${src})`};
  background-size: 100% 100%;
  background-repeat: no-repeat;
  border-radius: 3.33333rem;
  box-shadow: 7px 7px 12px 0px #000 inset,
    -7px -7px 12px 0px rgba(255, 255, 255, 0.2) inset;
  backdrop-filter: blur(28.5px);
  @media (max-width: 650px) {
    padding: 30px 40px;
  }
`;

const DataBox = styled(FlexBox)`
  flex-direction: column;
  align-items: center;
  > div {
    color: #95fa31;
    text-align: center;
    font-family: "CKTKingkong";
    font-size: 26px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  color: #fff;
  text-align: center;
  font-family: "CKTKingkong";
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  @media (max-width: 650px) {
    > div {
      font-size: 3.75rem;
    }
    font-size: 2.5rem;
  }
`;

const SubTitleBox = styled.div`
  padding: 14px 0px;
  color: #fff;
  font-family: "CKTKingkong";
  font-size: 22px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  border-bottom: 1px solid rgba(149, 250, 49, 0.5);
  @media (max-width: 650px) {
    font-size: 3.75rem;
  }
`;

// -
export default function Community() {
  const token = useSelector<any>((state) => state.token);
  const { t } = useTranslation();
  const { account } = useWeb3React();
  const { width } = useViewport();
  const Navigate = useNavigate();
  const scrollContainerRef = useRef<any>(null);
  const [ConfirmPledgeModal, setConfirmPledgeModal] = useState<any>(false);
  const [PledgeSuccessModal, setPledgeSuccessModal] = useState<any>(false);
  // -
  const [IsPledgeState, setIsPledgeState] = useState<any>(0);
  const [ReceiveSuccessModal, setReceiveSuccessModal] = useState<any>(false);
  const [RecordFreedModal, setRecordFreedModal] = useState<any>(false);
  const [ReferRecordModal, setReferRecordModal] = useState<any>(false);
  const [TeamRecordModal, setTeamRecordModal] = useState<any>(false);
  const [dataLoding, setDataLoding] = useState(true);
  const [OpenList, setOpenList] = useState<any>([]);
  const [PledgeIncomeList, setPledgeIncomeList] = useState<any>({});
  const [pageSize, setPageSize] = useState(10);
  const [pageNum, setPageNum] = useState(1);
  const { state: stateObj } = useLocation();
  const [tbody, setBody] = useState<any>([]);
  const [CommunityListTbody, setCommunityListBody] = useState<any>([]);

  const [VipUserInfo, setVipUserInfo] = useState<any>({
    type: stateObj?.level,
  });
  const [MintRankPhase, setMintRankPhase] = useState<any>("");

  const onChange: PaginationProps["onChange"] = (page) => {
    console.log(page);
    setPageNum(page);
  };
  const { getBindStateFun } = useBindState();

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
  let vipType = {
    1: "380",
    2: "381",
    3: "402",
    4: "579",
  };
  // 0：-1：-2:-
  let receiveType = {
    0: "452",
    1: "453",
    2: "454",
  };

  const langArr = {
    zh: { c1: "您可以在", c2: "釋放記錄", c3: "頁面領取收益" },
    en: {
      c1: "You can claim your earnings on ",
      c2: "the release records page.",
      c3: "",
    },
    ja: {
      c1: "ページで収益を受け取ることができます ",
      c2: "リリース記録。",
      c3: "",
    },
    fr: {
      c1: "Vous pouvez réclamer vos gains sur la ",
      c2: "page des enregistrements de libération.",
      c3: "",
    },
    ko: {
      c1: "수익을 받을 수 있습니다 ",
      c2: "릴리스 기록 페이지에서",
      c3: "",
    },
  };
  //-
  const langArr1 = {
    zh: { c1: "您可以在", c2: "資產", c3: "頁面查看" },
    en: {
      c1: "You can view it on ",
      c2: "the assets page.",
      c3: "",
    },
    ja: {
      c1: "ページで確認できます",
      c2: "資産。",
      c3: "",
    },
    fr: {
      c1: "Vous pouvez le consulter sur la",
      c2: "page des actifs.",
      c3: "",
    },
    ko: {
      c1: "페이지에서 확인할 수 있습니다 ",
      c2: "자산.",
      c3: "",
    },
  };

  const getMyInitData = async () => {
    let VipUserInfoItem = await vipUserInfo({});
    let item = await pledgeStatus({});
    //-
    let item1: any = null;
    try {
      item1 = await pledgeInfo({});
    } catch (error: any) {}

    if (!!VipUserInfoItem?.data) {
      setIsPledgeState(item?.data?.isPledge || 0);
      setVipUserInfo(
        {
          ...VipUserInfoItem?.data,
          ...(item?.data ?? {}),
          ...(item1?.data ?? {}),
        } || {}
      );
    }
    mintRankPhase({}).then((res: any) => {
      if (res.code === 200) {
        setMintRankPhase(res?.data?.mintIncomePhase || "");
      }
    });
  };

  const getRecordList = async () => {
    //-
    setDataLoding(true);
    let record = await pledgeIncomeList({
      pageNum,
      pageSize,
    });
    setDataLoding(false);
    setPledgeIncomeList(record?.data ?? {});
  };
  //-
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

  const btiaPledgeFun = async () => {
    if (!token) return;
    showLoding(true);
    let pledgeItem: any = await btiaPledge({});
    console.log(pledgeItem, "pledgeItem");
    if (!!pledgeItem?.data?.mintJsonHex) {
      let res: any;
      try {
        res = await Contracts?.example?.sendTransaction(
          account as string,
          pledgeItem?.data?.toAddress,
          pledgeItem?.data?.mintJsonHex,
          async (error: any) => {
            if (error?.code === 4001) return;
            setIsPledgeState(1);
            await transferAuth({ authNum: pledgeItem?.data?.authNum });
          }
        );
      } catch (error: any) {
        showLoding(false);
        setIsPledgeState(0);
        return addMessage(t("455"));
      }
      showLoding(false);
      if (!!res?.status) {
        // getMyInitData();
        setConfirmPledgeModal(false);
        return setPledgeSuccessModal(true);
      } else {
        setIsPledgeState(0);
        return addMessage(t("455"));
      }
    } else {
      showLoding(false);
      return addMessage(pledgeItem?.msg);
    }
  };

  const receiveIncomeFun = async (id: any) => {
    if (!token) return;
    showLoding(true);
    let item: any = await receiveIncome({ id });
    console.log(item, "item");
    if (item?.code === 200) {
      showLoding(false);
      getRecordList();
      setTimeout(() => {
        getRecordList();
      }, 3000);
      return addMessage(t("454"));
    } else {
      return addMessage(t("456"));
    }
  };

  const getInviteRecord = () => {
    refereeList({}).then((res: any) => {
      setBody(res.data?.refereeUserRespList || []);
    });
    vipUserCommunityList({}).then((res: any) => {
      setCommunityListBody(res.data?.minMintAreaList || []);
    });
  };

  useEffect(() => {
    if (token) {
      getMyInitData();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      getInviteRecord();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      getRecordList();
    }
  }, [token, pageNum, PledgeSuccessModal]);

  useEffect(() => {
    setOpenList([]);
  }, [TeamRecordModal, ReferRecordModal, RecordFreedModal]);

  const CardLevel = () => {
    //-（1-，2- 3-）
    if (Number((VipUserInfo as any)?.type) === 3)
      return <div className="isAdvancedVip"></div>;
    if (Number((VipUserInfo as any)?.type) === 1)
      return <div className="svip"></div>;
    if (Number((VipUserInfo as any)?.type) === 2)
      return <div className="isNodeVip"></div>;
    if (Number((VipUserInfo as any)?.type) === 4)
      return <div className="isStandardVip"></div>;
    if (
      Number((VipUserInfo as any)?.type) === 0 ||
      Number((VipUserInfo as any)?.isHave) === 0
    )
      return <div className="vip"></div>;
  };

  return (
    <CommunityContainer ref={scrollContainerRef}>
      <ReturnBox
        onClick={() => {
          Navigate(-1);
          // Navigate("/View/Market/1", { state: { tabIndex: 2 } });
        }}
      >
        <ReturnIcon />
        {t("362")}
      </ReturnBox>

      <PurchaseModal_Content>
        <PurchaseModal_Content_Box1>
          <PurchaseModal_Content_Left>
            {CardLevel()}
            <PledgeDividends>
              <PledgeDividends_Item>
                <PledgeDividends_Title>{t("457")}</PledgeDividends_Title>
                <PledgeDividends_Box>
                  <PledgeDividends_Box_Left>
                    <img src={pledgeDividendsIcon} alt="" />
                  </PledgeDividends_Box_Left>
                  <PledgeDividends_Box_Right>
                    {Number(IsPledgeState) === 0 ? (
                      <PledgeBtn
                        active={true}
                        onClick={() => {
                          setConfirmPledgeModal(true);
                        }}
                      >
                        {t("458")}
                      </PledgeBtn>
                    ) : (
                      <PledgeBtn active={false}>{t("459")}</PledgeBtn>
                    )}
                    <PledgeRecord
                      onClick={() => {
                        setRecordFreedModal(true);
                      }}
                    >
                      {t("460")} &nbsp;
                      <img src={goToIcon} alt="" />
                    </PledgeRecord>
                  </PledgeDividends_Box_Right>
                </PledgeDividends_Box>
              </PledgeDividends_Item>
              <PledgeDividends_Item>
                <PledgeDividends_Title>{t("461")}</PledgeDividends_Title>
                <PledgeDividends_Item_Box>
                  <div>{t("462")}</div>
                  <div>{t("463")}</div>
                  <div>{t("464")}</div>
                  <div>{t("465")}</div>
                </PledgeDividends_Item_Box>
              </PledgeDividends_Item>
            </PledgeDividends>
          </PurchaseModal_Content_Left>
          <PurchaseModal_Content_Right>
            <div>
              {t("363")}
              <span>
                {Number(VipUserInfo?.type) === 0
                  ? String(VipUserInfo?.userAddress)?.length > 15
                    ? AddrHandle(VipUserInfo?.userAddress, 6, 6)
                    : "-"
                  : t(vipType[VipUserInfo?.type] ?? "-")}
              </span>{" "}
              {/* <span>{t(vipType[VipUserInfo?.type] ?? "-")}</span>{" "} */}
            </div>
            <div>
              {t("364")} <span>{VipUserInfo?.num ?? "-"}</span>{" "}
            </div>
            <div>
              {t("365")}{" "}
              <span>
                {String(VipUserInfo?.userAddress)?.length > 15
                  ? AddrHandle(VipUserInfo?.userAddress, 6, 6)
                  : "-"}
              </span>{" "}
            </div>

            <div>
              {t("366")}{" "}
              <span>{VipUserInfo?.createTime ?? "----/--/-- --/--/--"}</span>{" "}
            </div>
            <div>
              {t("390")}: <span>SBT</span>{" "}
            </div>
            <div>
              {t("391")}: <span>{t("393", { num: 100 })}</span>{" "}
            </div>
            <div>
              {t("392")}: <span>{t("394")}</span>{" "}
            </div>
            <PurchaseModal_Content_Right_Title>
              {t("382")}
            </PurchaseModal_Content_Right_Title>
            <div>
              {t("383")}{" "}
              <span>
                {VipUserInfo?.hash?.length > 16
                  ? AddrHandle(VipUserInfo?.hash, 10, 6)
                  : "-"}
              </span>{" "}
            </div>
            <div>
              {t("384")} <span>{VipUserInfo?.divvyAmount ?? "-"} USDT</span>{" "}
            </div>
            <PurchaseModal_Content_Right_Title>
              {t("385")}
            </PurchaseModal_Content_Right_Title>
            {(Number((VipUserInfo as any)?.type) === 1 ||
              Number((VipUserInfo as any)?.type) === 3) && (
              <div>
                {t("386")} <span>{VipUserInfo?.communityName ?? "-"}</span>{" "}
              </div>
            )}
            <div>
              {t("387")}{" "}
              <span>{t("378", { num: VipUserInfo?.teamNum ?? "-" })}</span>{" "}
            </div>
            <div>
              {t("388")}{" "}
              <span>
                {t("389", { num: VipUserInfo?.teamMint ?? "-" })} {t("355")}
              </span>{" "}
            </div>
            <div>
              {t("567")}:{" "}
              <span>
                {t("389", { num: VipUserInfo?.freeMintNum ?? "-" })} {t("355")}
              </span>{" "}
            </div>
            <div>
              {t("568")}:{" "}
              <span>
                {t("389", { num: VipUserInfo?.paidMintNum ?? "-" })} {t("355")}
              </span>{" "}
            </div>
            <div>
              {t("社区数据昨日mint数量")}:{" "}
              <span>
                {t("389", {
                  num: VipUserInfo?.communityMintNumYesterday ?? "-",
                })}{" "}
                BTIA
              </span>{" "}
            </div>

            <PurchaseModal_Content_Right_Title>
              {t("559", { num: MintRankPhase })}
              <span
                onClick={() => {
                  setTeamRecordModal(true);
                }}
              >
                {t("362")}&nbsp; <img src={goToIcon} alt="" />
              </span>
            </PurchaseModal_Content_Right_Title>
            {/*-- */}
            {/* {(Number((VipUserInfo as any)?.type) === 3 ||
              Number((VipUserInfo as any)?.type) === 1) && (
              <> */}
            <div>
              {t("560")}:{" "}
              <span>
                {VipUserInfo?.communityMintNum ?? "-"} {t("355")}
              </span>{" "}
            </div>
            <div>
              {t("569")}:{" "}
              <span>
                {t("566", {
                  num: VipUserInfo?.communityPartAddress ?? "-",
                })}
              </span>{" "}
            </div>
            <div>
              {t("582")}:{" "}
              <span>
                {VipUserInfo?.communityMintNumYesterday ?? "-"} {t("355")}
              </span>{" "}
            </div>
            {/* </>
            )} */}

            <div>
              {t("561")}:{" "}
              <span>
                {VipUserInfo?.refereeMintNum ?? "-"} {t("355")}
              </span>{" "}
            </div>
            <div>
              {t("562")}:{" "}
              <span
                style={{ color: "#95fa31", textDecoration: "underline" }}
                onClick={() => {
                  setReferRecordModal(true);
                }}
              >
                {t("566", { num: VipUserInfo?.refereeAddressNum ?? "-" })}
                {/* {t("566", { num: tbody?.length ?? "-" })} */}
              </span>{" "}
            </div>
            <div>
              {t("583")}:{" "}
              <span>
                {VipUserInfo?.refereeMintNumYesterday ?? "-"} {t("355")}
              </span>{" "}
            </div>

            <PurchaseModal_Content_Right_Title>
              {t("395")}
            </PurchaseModal_Content_Right_Title>
            <div>{t("396")}</div>
            <div>{t("397")}</div>
            <div>{t("398")}</div>
          </PurchaseModal_Content_Right>
        </PurchaseModal_Content_Box1>
      </PurchaseModal_Content>

      {/*- */}
      <InfoModal
        visible={ConfirmPledgeModal}
        className="Modal"
        centered
        width={510}
        closable={false}
        footer={null}
        onCancel={() => {
          setConfirmPledgeModal(false);
        }}
        src={sbBack}
      >
        <div
          className="close"
          onClick={() => {
            setConfirmPledgeModal(false);
          }}
        >
          <img src={closeIcon} alt="" />
        </div>
        <MintTitleModal_InfoModal>{t("458")}</MintTitleModal_InfoModal>

        <InputModal_Content>
          <SuccessfulModal_Content_Item>
            <SuccessfulModal_Content_Item_Div>
              {t("466")} ： {t(vipType[VipUserInfo?.identity] ?? "-")}
            </SuccessfulModal_Content_Item_Div>
            <SuccessfulModal_Content_Item_Div>
              {t("467")} ： {VipUserInfo?.pledgeAmount ?? "-"} {t("355")}
            </SuccessfulModal_Content_Item_Div>
          </SuccessfulModal_Content_Item>

          <ConfirmBtn
            onClick={() => {
              // return addMessage(t("Open soon"));
              getBindStateFun(btiaPledgeFun, () => {
                setConfirmPledgeModal(false);
              });
            }}
          >
            {t("458")}
          </ConfirmBtn>
        </InputModal_Content>
      </InfoModal>
      {/*- */}
      <InfoModal
        visible={PledgeSuccessModal}
        className="Modal"
        centered
        width={440}
        closable={false}
        footer={null}
        onCancel={() => {
          setPledgeSuccessModal(false);
        }}
        src={sbBack}
      >
        <div
          className="close"
          onClick={() => {
            setPledgeSuccessModal(false);
          }}
        >
          <img src={closeIcon} alt="" />
        </div>
        <MintTitleModal>{t("468")}</MintTitleModal>

        <SuccessfulModal_Content>
          <SuccessIcon />
          <div>
            {langArr[i18n.language].c1}{" "}
            <span
              onClick={() => {
                setPledgeSuccessModal(false);
                setRecordFreedModal(true);
              }}
            >
              {langArr[i18n.language].c2}
            </span>{" "}
            {langArr[i18n.language].c3}
          </div>
        </SuccessfulModal_Content>
      </InfoModal>
      {/*- */}
      <RecordModal
        visible={RecordFreedModal}
        className="Modal"
        centered
        width={768}
        closable={false}
        footer={null}
        onCancel={() => {
          setRecordFreedModal(false);
        }}
        src={BridgeModalBg}
      >
        <div
          className="close"
          onClick={() => {
            setRecordFreedModal(false);
          }}
        >
          <img src={closeIcon} alt="" />
        </div>
        <MintTitleModal_Record>{t("469")}</MintTitleModal_Record>

        <ContentModal style={{ marginTop: "0px" }}>
          <RankBox_Left_Table_Content>
            <RecordTable>
              <TransferRecordTable_Title>
                <div>{t("252")}</div>
                <div>{t("470")}</div>
                <div>{t("471")}</div>
                <div>{t("472")}</div>
                <div> </div>
              </TransferRecordTable_Title>
              <RecordTable_Devider></RecordTable_Devider>
              {/* {true ? ( */}
              {!dataLoding ? (
                PledgeIncomeList?.list?.length > 0 ? (
                  <RecordTable_Content>
                    {PledgeIncomeList?.list?.map((item: any, index: any) => (
                      <>
                        <TransferRecordTable_Content_Item key={index}>
                          <div>
                            {dateFormat(
                              "YYYY.mm.dd",
                              new Date(item?.createTime)
                            )}
                          </div>
                          <div>
                            {item?.amountResidue}
                            {t("355")}
                          </div>
                          <div>
                            {item?.amountRelease}
                            {t("355")}
                          </div>
                          <div>{t(receiveType[Number(item?.status)])}</div>
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
                          <LongBox1>
                            <div>
                              {t("473")} :
                              {Number(item?.status) === 0 ? (
                                <span
                                  style={{ color: "#95FA31" }}
                                  onClick={() => {
                                    receiveIncomeFun(item?.id);
                                  }}
                                >
                                  {t("474")}
                                </span>
                              ) : (
                                <span>{t("475")}</span>
                              )}
                            </div>
                          </LongBox1>
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
                total={PledgeIncomeList?.total}
                showQuickJumper
                defaultCurrent={1}
                itemRender={itemRender}
              />
            </PaginationContainer>
          </RankBox_Left_Table_Content>
        </ContentModal>
      </RecordModal>
      {/*- */}
      <RecordModal
        visible={ReferRecordModal}
        className="Modal"
        centered
        width={700}
        closable={false}
        footer={null}
        onCancel={() => {
          setReferRecordModal(false);
        }}
        src={BridgeModalBg}
      >
        <div
          className="close"
          onClick={() => {
            setReferRecordModal(false);
          }}
        >
          <img src={closeIcon} alt="" />
        </div>
        <MintTitleModal_Record>{t("563")}</MintTitleModal_Record>

        <ContentModal style={{ marginTop: "0px" }}>
          <RankBox_Left_Table_Content>
            <RecordTable>
              <ReferRecordTable_Title>
                <div>{t("564")}</div>
                <div>{t("252")}</div>
                <div>{t("565")}</div>
                <div>{t("昨日Mint数量")}</div>
                <div>{t("575")}</div>
              </ReferRecordTable_Title>
              <RecordTable_Devider></RecordTable_Devider>
              {/* {true ? ( */}
              {!dataLoding ? (
                // tbody
                tbody?.length > 0 ? (
                  <ReferRecordTable_Content>
                    {tbody?.map((item: any, index: any) => (
                      <>
                        <ReferRecordTable_Content_Item key={index}>
                          <div>{index + 1}</div>
                          <div>{item?.createTime}</div>
                          <div>{AddrHandle(item?.userAddress, 4, 4)}</div>
                          <div style={{ justifyContent: "flex-end" }}>
                            {thousandsSeparator(item?.mintNum ?? "0")}{" "}
                            {t("355")}
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
                        </ReferRecordTable_Content_Item>
                        {OpenList?.some(
                          (item1: any) => Number(item1) === Number(item?.id)
                        ) && (
                          <LongBox2>
                            <div>
                              {t("584")} :
                              <span>
                                {thousandsSeparator(
                                  item?.mintNumYesterday ?? "0"
                                ) ?? "--"}{" "}
                                {t("355")}
                              </span>
                            </div>
                          </LongBox2>
                        )}
                      </>
                    ))}
                  </ReferRecordTable_Content>
                ) : (
                  <RecordTable_Content_NoData>
                    <NoData />
                  </RecordTable_Content_NoData>
                )
              ) : (
                <FlexCCBox style={{ minHeight: "300px" }}>
                  <PageLoding></PageLoding>
                </FlexCCBox>
              )}
            </RecordTable>

            {/* <PaginationContainer>
              <Pagination
                current={pageNum}
                pageSize={10}
                onChange={onChange}
                total={PledgeIncomeList?.total}
                showQuickJumper
                defaultCurrent={1}
                itemRender={itemRender}
              />
            </PaginationContainer> */}
          </RankBox_Left_Table_Content>
        </ContentModal>
      </RecordModal>

      {/*- */}
      <RecordModal
        visible={TeamRecordModal}
        className="Modal"
        centered
        width={700}
        closable={false}
        footer={null}
        onCancel={() => {
          setTeamRecordModal(false);
        }}
        src={BridgeModalBg}
      >
        <div
          className="close"
          onClick={() => {
            setTeamRecordModal(false);
          }}
        >
          <img src={closeIcon} alt="" />
        </div>
        <MintTitleModal_Record>{t("570")}</MintTitleModal_Record>

        <BannerModalBg src={DataModalBg}>
          <DataBox>
            <div>
              {VipUserInfo?.bigAreaMintNum ?? "-"} {t("355")}
            </div>
            {t("571")}
          </DataBox>
        </BannerModalBg>

        <SubTitleBox>{t("572")}</SubTitleBox>

        <ContentModal style={{ marginTop: "0px" }}>
          <RankBox_Left_Table_Content>
            {width > 650 ? (
              <RecordTable>
                <TeamDataTable_Title>
                  <div>{t("573")}</div>
                  <div>{t("574")}</div>
                  <div>{t("584")}</div>
                  <div>{t("575")}</div>
                </TeamDataTable_Title>
                <RecordTable_Devider></RecordTable_Devider>
                {/* {true ? ( */}
                {!dataLoding ? (
                  CommunityListTbody?.length > 0 ? (
                    <TeamRecordTable_Content>
                      {CommunityListTbody?.map((item: any, index: any) => (
                        <>
                          <TeamDataTable_Content_Item key={index}>
                            <div>{index + 1}</div>
                            <div>{AddrHandle(item?.userAddress, 6, 6)}</div>
                            <div>
                              {thousandsSeparator(
                                item?.mintNumYesterday ?? "0"
                              )}{" "}
                              {t("355")}
                            </div>
                            <div>
                              {thousandsSeparator(item?.mintNum ?? "0")}{" "}
                              {t("355")}
                            </div>
                          </TeamDataTable_Content_Item>
                        </>
                      ))}
                    </TeamRecordTable_Content>
                  ) : (
                    <RecordTable_Content_NoData>
                      <NoData />
                    </RecordTable_Content_NoData>
                  )
                ) : (
                  <FlexCCBox style={{ minHeight: "300px" }}>
                    <PageLoding></PageLoding>
                  </FlexCCBox>
                )}
              </RecordTable>
            ) : (
              <RecordTable>
                <TeamDataTable_Title>
                  <div>{t("573")}</div>
                  <div>{t("574")}</div>
                  <div>{t("575")}</div>
                </TeamDataTable_Title>
                <RecordTable_Devider></RecordTable_Devider>
                {/* {true ? ( */}
                {!dataLoding ? (
                  // CommunityListTbody
                  CommunityListTbody?.length > 0 ? (
                    <TeamRecordTable_Content>
                      {CommunityListTbody?.map((item: any, index: any) => (
                        <>
                          <TeamDataTable_Content_Item key={index}>
                            <div>{index + 1}</div>
                            <div>{AddrHandle(item?.userAddress, 6, 6)}</div>
                            <div style={{ justifyContent: "flex-end" }}>
                              {thousandsSeparator(item?.mintNum ?? "0")}{" "}
                              {t("355")}
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
                          </TeamDataTable_Content_Item>
                          {OpenList?.some(
                            (item1: any) => Number(item1) === Number(item?.id)
                          ) && (
                            <LongBox>
                              <div>
                                {t("584")} :
                                <span>
                                  {thousandsSeparator(
                                    item?.mintNumYesterday ?? "0"
                                  ) ?? "--"}{" "}
                                  {t("355")}
                                </span>
                              </div>
                            </LongBox>
                          )}
                        </>
                      ))}
                    </TeamRecordTable_Content>
                  ) : (
                    <RecordTable_Content_NoData>
                      <NoData />
                    </RecordTable_Content_NoData>
                  )
                ) : (
                  <FlexCCBox style={{ minHeight: "300px" }}>
                    <PageLoding></PageLoding>
                  </FlexCCBox>
                )}
              </RecordTable>
            )}
          </RankBox_Left_Table_Content>
        </ContentModal>
      </RecordModal>

      {/*- */}
      <InfoModal
        visible={ReceiveSuccessModal}
        className="Modal"
        centered
        width={440}
        closable={false}
        footer={null}
        onCancel={() => {
          setReceiveSuccessModal(false);
        }}
        src={sbBack}
      >
        <div
          className="close"
          onClick={() => {
            setReceiveSuccessModal(false);
          }}
        >
          <img src={closeIcon} alt="" />
        </div>
        <MintTitleModal>{t("476")}</MintTitleModal>

        <SuccessfulModal_Content>
          <SuccessIcon />

          <div>
            {langArr1[i18n.language].c1}{" "}
            <span
              onClick={() => {
                return addMessage(t("Open soon"));
                Navigate("/View/Market/1", { state: { tabIndex: 2 } });
              }}
            >
              {langArr1[i18n.language].c2}
            </span>{" "}
            {langArr1[i18n.language].c3}
          </div>
        </SuccessfulModal_Content>
      </InfoModal>
    </CommunityContainer>
  );
}
