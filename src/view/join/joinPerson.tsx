import "../../assets/style/join/person.scss";
import txt from "../../assets/image/logo.svg";
import mfen from "../../assets/image/Mint/mfEn.png";
import mfft from "../../assets/image/Mint/mfFt.png";
import jfen from "../../assets/image/Mint/jfEn.png";
import jfft from "../../assets/image/Mint/jfFt.png";
import minten from "../../assets/image/Mint/mintEn.png";
import mintft from "../../assets/image/Mint/mintFt.png";
import zhuanyi from "../../assets/image/Mint/zhuanyi.svg";
import on from "../../assets/image/join/on.png";
import after from "../../assets/image/join/after.png";
import IdBg from "../../assets/image/Person/IdBg.png";
import noVip from "../../assets/image/Mint/novip.svg";
import haveVip from "../../assets/image/Mint/vip.svg";
import noRight from "../../assets/image/Mint/noright.svg";
import vipRight from "../../assets/image/Mint/vipright.svg";
import infoIcon from "../../assets/image/Mint/infoIcon.svg";
import BridgeModalBg from "../../assets/image/Swap/BridgeModalBg.png";
import closeIcon from "../../assets/image/Person/closeIcon.svg";
import AllIcon from "../../assets/image/Market/AllIcon.svg";
import DropDownIcon from "../../assets/image/Market/DropDownIcon.svg";
import PersonIcon from "../../assets/image/Market/PersonIcon.svg";
import IdItemBg from "../../assets/image/Market/IdItemBg.png";
import SubTitleItemBg from "../../assets/image/Market/SubTitleItemBg.png";
import PersonalItemBg from "../../assets/image/Market/PersonalItemBg.png";

import { useEffect, useRef, useState } from "react";
import {
  bridgeBalanceList,
  canUseCode,
  checkFollowsTwitter,
  checkFulfil,
  communityLikeData,
  freeTransferList,
  hangSaleList,
  interestTwitterInfo,
  inviteRecord,
  mintUserBoxInfo,
  myMint,
  notCanUseCode,
  oauth2CallBack,
  oauth2Url,
  taskList,
  teamInfo,
  whichType,
  whitePayList,
} from "../../API";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import nocode from "../../assets/image/join/nocode.png";
import { useLocation, useNavigate } from "react-router-dom";
import { AddrHandle, addMessage, thousandsSeparator } from "../../utils/tool";
import copyFun from "copy-to-clipboard";
import { useTranslation } from "react-i18next";
import i18n from "../../lang/i18n";
import Box from "../../components/Mint/whitename";
import { useConnect } from "../../hooks/useConnect";
import {
  twitterFollow,
  twitterLike,
  twitterReply,
  twitterRetweet,
} from "../../config";
import ZhuanYiModal from "../../components/Mint";
import store from "../../store";
import {
  setCreditAction,
  setFreeCodeAction,
  setMintFeeAction,
} from "../../store/actions";
import GoToBind from "../../components/Mint/goToBind";
import styled from "styled-components";
import {
  Dropdown,
  Menu,
  Modal,
  Pagination,
  PaginationProps,
  Tooltip,
} from "antd";
import { throttle } from "lodash";
import {
  FlexBox,
  FlexCCBox,
  FlexSBCBox,
  FlexSCBox,
} from "../../components/FlexBox";
import NoData from "../../components/NoData";
import { useViewport } from "../../components/viewportContext";
import { INSBOX, INSBOXActive, sbBack } from "../../assets/image/MintBox";
import {
  ChainBox_Item_Box,
  ChainBox_Item_Box_Item,
  ChainBox_Item_Btn,
  ChainList,
  DetailBtn,
  FlterItem,
} from "../Market";
import { detailBtnBg } from "../../assets/image/MarketBox";
import {
  PaginationContainer,
  RankBox_Left_Table_Content,
  Rank_RecordTable_Content_NoData,
} from "../Rank";
import PageLoding from "../../components/PageLoding";
import { useBindState } from "../../hooks/useBindState";
import { InfoModal } from "./CommunityCardDetail";
import {
  Btn,
  InputModal_Content,
  MintTitleModal_InfoModal,
} from "../Market/InscriptionDetail";
import { CopyIcon } from "../../assets/image/PersonBox";
import TipForSuccessModal from "../../components/TipForSuccessModal";
import { DropIcon } from "../../assets/image/SwapBox";

interface NormalType {
  showModal: () => void;
}

const SuccessBox = styled.div`
  flex-shrink: 0;
`;

const TaskBox = styled.div`
  @media (max-width: 1024px) {
    display: block;

    > div {
      /* margin-bottom: 12px;
      &:last-child {
        margin-bottom: 0px;
      } */
    }
    .p_btn,
    .qwc {
      margin-top: 12px;

      padding: 8px !important;
    }
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
  @media (max-width: 1440px) {
    padding: 11px 12px;
    max-width: 100%;
    margin-bottom: 16px;
  }
`;
const WhiteNameBox = styled.div`
  div {
    color: #fff;
    font-family: "CKTKingkong";
    font-size: 1.5rem;
    line-height: 1.5rem;
    > img {
      width: 2.5rem;
      height: 2.5rem;
      cursor: pointer;
    }
    @media (max-width: 650px) {
      font-size: 3rem;
      line-height: 3rem;
      > img {
        width: 4rem;
        height: 4rem;
        cursor: pointer;
      }
    }
  }
`;

const PurchaseRecordModal = styled(Modal)<{ src: any }>`
  position: relative;
  background: transparent;
  background-image: ${({ src }) => `url(${src})`};
  background-size: 100% 100%;
  background-repeat: no-repeat;
  min-height: 57.5rem;

  .ant-modal-content {
    background: transparent !important;
    box-shadow: none;
    .ant-modal-body {
      padding: 2.7rem 5.2rem;
    }
  }
  .close {
    width: 2.5rem;
    height: 2.5rem;
    position: absolute;
    right: 2.0833333333333335rem;
    top: 2.0833333333333335rem;
    > img {
      width: 100%;
    }
  }
  @media (max-width: 430px) {
    .close {
      width: 21px;
      height: 21px;

      right: 8px;
      top: 0px;
    }
    .ant-modal-content {
      .ant-modal-body {
        padding: 2.7rem 3.2rem;
      }
    }
  }
`;

const TransferRecord_Modal = styled(PurchaseRecordModal)``;
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
    padding: 2.5rem 0rem;
    white-space: nowrap;

    &:first-child {
      justify-content: flex-start;
    }
    &:last-child {
      justify-content: flex-end;
    }
    @media (max-width: 430px) {
      font-size: 12px;
    }
  }
`;
const TransferRecordTable_Title = styled(RecordTable_Title)`
  width: 100%;
  > div {
    &:first-child {
      justify-content: flex-start;
      max-width: 100px;
    }
    &:last-child {
      justify-content: flex-end;
      max-width: 100px;
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
  overflow-y: auto;
  max-height: 40rem;
  padding-right: 5px;
  > div {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
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
`;
const RecordTable_Content_Item = styled(RecordTable_Title)`
  width: 100%;
  > div {
    color: rgba(255, 255, 255, 0.8);
    font-family: CKTKingkong;
    font-size: 1.33333rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    padding: 1.6666666666666667rem 0rem;
  }
`;

export const RecordTable_Content_NoData = styled(FlexCCBox)`
  padding: 20px;
`;

const MyToolTip = styled(Tooltip)`
  img {
    position: relative;
  }
`;

const PurchaseModal_Content = styled(FlexSBCBox)`
  width: 100%;
  /* max-width: 1200px; */
  margin: 0px auto;
  align-items: stretch;
  /* margin-top: 3.33rem; */
  > div {
    width: 47%;
  }

  @media (max-width: 1024px) {
    display: block;
    > div {
      width: 100%;
    }
  }
`;

const PurchaseModal_Content_Left = styled(FlexBox)`
  flex-direction: column;
  align-items: center;
  /* padding: 1.04rem; */
  /* border: 1px solid #f6f022; */
  > img {
    border-radius: 40px;
    width: 100%;
  }

  @media (max-width: 1024px) {
    padding: 11px;
    margin-bottom: 20px;
    > img {
      border-radius: 2.5rem;
    }
  }
  @media (max-width: 650px) {
    padding: 0;
    margin-bottom: 4rem;
  }
`;

const PurchaseModal_Content_Right = styled(FlexBox)`
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
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
    &:last-child {
      margin-bottom: 0px;
    }

    > span {
      font-size: 20px;
      > img {
        width: 24px;
      }
    }
  }

  @media (max-width: 1440px) {
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

const PurchaseModal_Content_Left_Id = styled(FlexCCBox)<{ src: any }>`
  width: 100%;
  padding: 18px;
  color: #fff;
  font-family: "CKTKingkong";
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  background: transparent;
  background-image: ${({ src }) => `url(${src})`};
  background-size: 100% 100%;
  background-repeat: no-repeat;
  @media (max-width: 1440px) {
    margin-top: 25px;
    font-size: 14px;
    padding: 12px;
  }
  @media (max-width: 650px) {
    margin-top: 4rem;
  }
`;

const AssetBox = styled(FlexSBCBox)`
  width: 100%;
  margin-bottom: 3.3333rem;
  @media (max-width: 1440px) {
    /* display: block; */
    margin-bottom: 0px;
  }
  @media (max-width: 425px) {
    display: block;
    /* margin-bottom: 0px; */
  }
`;

const RankBox_Left_Tab = styled(FlexSCBox)`
  width: 100%;
  margin: 3.3333rem 0px 20px;
  overflow: auto;

  &::-webkit-scrollbar-thumb {
    background: rgba(149, 250, 49, 0.6);
    border-radius: 2.8333rem;
    opacity: 0.1;
  }
  &::-webkit-scrollbar {
    height: 1px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10.9992px;
  }
  > div {
    color: #808080;
    font-family: "CKTKingkong";
    font-size: 2rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    /* text-transform: uppercase; */
  }
  .activeTab {
    color: #fff;
    font-family: "CKTKingkong";
    font-size: 2rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  @media (max-width: 1440px) {
    margin: 20px 0px 20px;
  }
  @media (max-width: 768px) {
    margin: 20px 0px 20px;

    > div {
      font-size: 4rem;
    }
    .activeTab {
      font-size: 4rem;
    }
  }
  @media (max-width: 650px) {
    margin: 4rem 0px 3.3333rem;
  }
`;
const RankBox_Left_Tab_Item = styled(FlexCCBox)`
  margin-right: 5.67rem;
  white-space: nowrap;
  @media (max-width: 768px) {
    margin-right: 3rem;
  }
`;
const ManageBox = styled(FlexSBCBox)`
  justify-content: flex-start;
  @media (max-width: 1440px) {
    margin-bottom: 20px;
  }
`;

const ChainBox_AssetBox = styled(ChainBox)`
  flex: 1;
  margin-right: 30px;
  margin-bottom: 0;
  @media (max-width: 1440px) {
    margin-right: 12px;
    margin-bottom: 20px;
  }
  /* @media (max-width: 430px) {
    margin-right: 0px;
    margin-bottom: 0px;
  } */
`;

const CommunityBox = styled(FlexBox)`
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-between;

  > div {
    width: 32%;
  }
  @media (max-width: 1024px) {
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

  @media (max-width: 1024px) {
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
  background-size: 100% 100%; //-
  background-repeat: no-repeat;
  font-family: CKTKingkong;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  padding: 12px;
  width: fit-content;
  @media (max-width: 1920px) {
    font-size: 1rem;
  }
  @media (max-width: 1024px) {
    font-size: 1.33333rem;
  }
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
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  > img {
    margin-right: 5px;
  }
  @media (max-width: 1920px) {
    font-size: 1rem;
  }
  @media (max-width: 1024px) {
    font-size: 1.33333rem;
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
    font-family: CKTKingkong;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    > img {
      margin-left: 2px;
      width: 1.5rem;
      height: 1.5rem;
      flex-shrink: 0;
    }
  }
  @media (max-width: 1920px) {
    > div {
      font-size: 1rem;
    }
  }
  @media (max-width: 1024px) {
    > div {
      font-size: 1.33333rem;
    }
  }
  @media (max-width: 375px) {
    width: 40%;

    > div {
      > img {
        width: 2rem;
        height: 2rem;
      }
    }
  }
  @media (max-width: 375px) {
    > div {
      font-size: 2.32rem;
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

const RankBox_RecordTable = styled.div`
  /* margin-top: 4.17rem; */
  width: 100%;
  border-radius: 3.33333rem;
  background: linear-gradient(
    108deg,
    rgba(27, 27, 27, 0.2) 0%,
    rgba(51, 51, 51, 0.2) 100%
  );
  box-shadow: -10px -10px 20px 0px rgba(255, 255, 255, 0.2),
    15px 17px 20px 0px #000;
  backdrop-filter: blur(28.5px);
  @media (max-width: 768px) {
    /* margin-top: 5rem; */
  }
`;
const TransferRecordTable_Title1 = styled(RecordTable_Title)`
  width: 100%;
  padding: 0rem 3.33rem;

  > div {
    &:first-child {
      justify-content: flex-start;
      flex: auto;
      max-width: 100px;
    }
    &:nth-child(2) {
      flex: 2;
    }
    &:nth-child(3) {
      flex: 2;
    }
    &:last-child {
      justify-content: flex-end;
      flex: auto;
      max-width: 100px;
    }
  }
  @media (max-width: 768px) {
    padding: 0rem 2rem;
  }
`;

const TransferRecordTable_Content_Item = styled(TransferRecordTable_Title1)`
  width: 100%;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  > div {
    color: rgba(255, 255, 255, 0.8);
    font-family: "CKTKingkong";
    font-size: 1.33333rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    padding: 1.6666666666666667rem 0rem;
    @media (max-width: 430px) {
      font-size: 2.5rem;
      line-height: 3.75rem;
    }
  }
`;

const BtnBox = styled(FlexBox)`
  justify-content: space-around;
  width: 100%;
  > div {
    width: 40%;
  }
`;

const DenimTab = styled.div``;

const DenimTab_Table = styled.div`
  margin-top: 3.3333rem;

  @media (max-width: 430px) {
    margin-top: 4rem;
  }

  .table {
    min-width: 83rem;
    display: flex;
    flex-direction: column;
    height: 24.25rem;
    border-radius: 3.3333rem;
    background: linear-gradient(95deg, #1b1b1b 0%, #333 100%);
    box-shadow: 0.8333rem 0.8333rem 1.6667rem 0rem #000,
      -0.8333rem -0.8333rem 1.6667rem 0rem rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(2.375rem);

    @media (max-width: 430px) {
      height: 58.3333rem;
      min-width: 100%;
    }

    .thead {
      display: flex;
      padding: 2.5rem 3.3333rem;

      div {
        flex: 1;
        color: #fff;
        font-size: 1.5rem;
        line-height: 1.5rem;

        @media (max-width: 430px) {
          font-size: 2.9rem;
          line-height: 2.9rem;
        }
      }

      > div:nth-child(2) {
        text-align: center;
      }

      > div:nth-child(3) {
        text-align: center;
      }
    }

    .t_color {
      height: 1px;
      opacity: 0.6;
      background: linear-gradient(
        90deg,
        rgba(149, 250, 49, 0) 1.07%,
        #95fa31 53.32%,
        rgba(149, 250, 49, 0) 100.4%
      );
    }

    .td_box {
      flex: 1;
      margin-bottom: 1.8333rem;
      overflow: auto;

      @media (max-width: 430px) {
        margin-bottom: 4rem;
      }

      .td {
        display: flex;
        padding: 1.6667rem 3.3333rem;
        border-bottom: 0.0833rem solid rgba(255, 255, 255, 0.1);

        @media (max-width: 430px) {
          padding: 2.4rem 3.3333rem;
        }

        > div {
          flex: 1;
          flex-shrink: 0;
          color: rgba(255, 255, 255, 0.8);
          font-size: 1.3333rem;
          line-height: 1.6667rem;

          @media (max-width: 430px) {
            font-size: 2.5rem;
            line-height: 3.75rem;
          }

          @media (max-width: 375px) {
            font-size: 2.4rem;
            line-height: 3.75rem;
          }

          @media (max-width: 320px) {
            font-size: 2.1rem;
            line-height: 3.75rem;
          }
        }

        > div:nth-child(2) {
          text-align: center;
        }

        > div:nth-child(3) {
          text-align: center;
        }
      }

      > .zwsj {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
`;

const Manage_Btn = styled(FlexCCBox)<{ active: boolean }>`
  max-width: 220px;
  width: 100%;
  display: inline-flex;
  padding: 15px;
  justify-content: center;
  align-items: center;
  border-radius: 14px;
  background: ${({ active }) =>
    active
      ? `linear-gradient(0deg, #95fa31 0.01%, #f6f022 99.99%)`
      : "linear-gradient(0deg, rgba(149, 250, 49, 0.50) 0.01%, rgba(246, 240, 34, 0.50) 99.99%)"};
  box-shadow: 6px 10px 0px 0px #4a8e00;
  justify-content: center;
  align-items: center;
  gap: 0.8333rem;
  background: linear-gradient(0deg, #95fa31 0.01%, #f6f022 99.99%);
  color: #000;
  font-size: 1.3333rem;
  line-height: 1.6667rem;
  @media (max-width: 1440px) {
    box-shadow: 0.3333rem 0.6667rem 0rem 0rem #4a8e00;
    border-radius: 1.1667rem;
    padding: 12px;
  }
  @media (max-width: 430px) {
    border-radius: 8px;
    /* padding: 16px; */
    font-size: 14px;
    box-shadow: 3.643px 6.071px 0px 0px #4a8e00;
  }
`;

const DenimBindAddress_Box = styled(FlexSBCBox)`
  padding: 54px;
  width: 100%;
  border-radius: 40px;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 7px 7px 12px 0px #000 inset,
    -7px -7px 12px 0px rgba(255, 255, 255, 0.2) inset;
  backdrop-filter: blur(28.5px);
  @media (max-width: 430px) {
    display: block;
    padding: 30px 16px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 2.464px 2.464px 4.224px 0px #000 inset,
      -1.76px -1.76px 2.464px 0px rgba(255, 255, 255, 0.2) inset;
    backdrop-filter: blur(10.033162117004395px);
  }
`;

const DenimBindAddress_Box_Left = styled(FlexBox)`
  flex: 1;
  margin-right: 20px;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const DenimBindAddress_Box_Left_Top = styled(FlexBox)`
  width: 100%;
  flex-direction: column;
  align-items: center;
`;

const DenimBindAddress_Box_Left_Top_Balance = styled.div`
  margin: 11px auto 24px;
  color: #a4f92f;
  text-align: center;
  font-family: "CKTKingkong";
  font-size: 1.6667rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  @media (max-width: 1440px) {
    margin: 11px auto 18px;
  }
  @media (max-width: 430px) {
    font-size: 2.5rem;
  }
`;

const DenimBindAddress_Box_Right = styled.div`
  width: 60%;
  @media (max-width: 430px) {
    width: 100%;
    margin-top: 30px;
  }
`;
const DenimBindAddress_Box_Right_Title = styled.div`
  color: #fff;
  font-family: "CKTKingkong";
  font-style: normal;
  font-weight: 400;
  margin-bottom: 16px;
  font-size: 2rem;
  line-height: 2rem;
  @media (max-width: 430px) {
    font-size: 3.3333rem;
    line-height: 3.3333rem;
  }
`;

const DenimBindAddress_Box_Right_Content = styled.div`
  > div {
    color: rgba(255, 255, 255, 0.8);
    font-family: "CKTKingkong";
    font-style: normal;
    font-weight: 400;
    font-size: 1.6667rem;
    line-height: normal;
    @media (max-width: 430px) {
      font-size: 2.5rem;
      line-height: normal;
    }
  }
`;

const DenimBindAddress_Des = styled.div`
  margin-top: 3.3333rem;

  @media (max-width: 430px) {
    margin-top: 4rem;
  }
`;
const DenimBindAddress_Des_Title = styled.div`
  color: #fff;
  font-size: 2rem;
  line-height: 2rem;
  margin-bottom: 1.6667rem;

  @media (max-width: 430px) {
    margin-bottom: 3.3333rem;
    font-size: 3.3333rem;
    line-height: 3.3333rem;
  }
`;
const DenimBindAddress_Des_Content = styled.div`
  > div {
    color: rgba(255, 255, 255, 0.8);
    font-family: "CKTKingkong";
    font-size: 1.6667rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    @media (max-width: 430px) {
      font-size: 2.5rem;
    }
  }
`;

const BindBTCAddressBtn = styled(Btn)`
  width: fit-content;
  padding-left: 46px;
  padding-right: 46px;
  color: #000 !important;
  font-family: "CKTKingkong";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
const ConfirmBtn = styled(Btn)`
  width: 100%;
  max-width: 124px;

  color: #000 !important;
  font-family: "CKTKingkong";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const SuccessfulModal_Content_Item = styled.div`
  width: 100%;
  > div {
    &:first-child {
      color: #fff;
      font-family: "CKTKingkong";
      font-size: 18px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
  }

  @media (max-width: 650px) {
    div {
      font-size: 12px;
    }
    > input {
      padding: 12px;
      font-size: 12px;
    }
  }
`;

const SuccessfulModal_Content_Item_Value = styled(FlexSBCBox)`
  margin-top: 12px;
  width: 100%;
  padding: 18px 28px;
  border-radius: 40px;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 5px 5px 10px 0px #000 inset,
    -3px -3px 5px 0px rgba(255, 255, 255, 0.2) inset;
  backdrop-filter: blur(28.5px);
  border: none;
  color: #a4f92f;
  font-family: "CKTKingkong";
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  @media (max-width: 650px) {
    padding: 12px;
    font-size: 12px;
  }
`;

const SuccessfulModal_Content_Item_Des = styled.div`
  color: #d3d3d3;
  font-family: "CKTKingkong";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-top: 20px;
`;

const ManageBtn = styled(FlexCCBox)<{ color: string }>`
  color: ${({ color }) => color};
  text-align: right;
  font-family: "CKTKingkong";
  font-size: 1.33333rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
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

const ScrollDiv = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  width: 100%;
  overflow-y: hidden;
  overflow-x: auto;
  padding-bottom: 5px;
  &::-webkit-scrollbar-thumb {
    background: rgba(149, 250, 49, 0.6);
    border-radius: 2.8333rem;
    opacity: 0.1;
  }
  &::-webkit-scrollbar {
    height: 1px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10.9992px;
  }
`;

const CommunityDivBox = styled.div`
  margin-top: 4rem;

  @media (max-width: 650px) {
    margin-top: 4rem;
  }
`;

const JoinPerson = () => {
  const whitenameRef = useRef<NormalType>(null);
  const zhuanyiRef = useRef<NormalType>(null);

  const { t } = useTranslation();
  const web3React = useWeb3React();
  const nav = useNavigate();
  const token = useSelector<any>((state) => state.token);
  const { state: stateObj } = useLocation();
  const [type, setType] = useState(stateObj?.activeTab ?? "team");
  const [usefulCode, setuseful] = useState<any>([]);
  const [uselessCode, setuseless] = useState<any>([]);
  const [thead, setHead] = useState(["44", "45", "46"]);
  const [tbody, setBody] = useState<any>([]);
  const [tootalInfo, setInfo] = useState<any>({});
  const [TaskList, setTaskList] = useState<any>([]);
  const [WhitePayList, setWhitePayList] = useState<any>([]);
  const [FreeTransferListList, setFreeTransferListList] = useState<any>([]);
  const [useShow, setUseShow] = useState("block");
  const [uselessShow, setUselessShow] = useState("block");
  const [en, setEn] = useState(false);
  const [RecordModal, setRecordModal] = useState(false);
  const [TransferRecordModal, setTransferRecordModal] = useState(false);
  const { connectFun } = useConnect();
  const [TwitterInfo, setTwitterInfo] = useState<any>({});
  const [ContinuousLikeNum, setContinuousLikeNum] = useState<any>({});
  const [btnType, setBtnType] = useState<any>({});
  const [MintUserBoxInfo, setMintUserBoxInfo] = useState<any>({});
  const [ChainName, setChainName] = useState("Binance");
  let [SwitchState, setSwitchState] = useState(false);
  const [PageNum, setPageNum] = useState(1);
  const [ActiveTab, setActiveTab] = useState(1);
  const errorref = useRef<any>(null);
  let dispatch = useDispatch();
  const { width } = useViewport();
  let [MyMint, setMyMint] = useState<any>([]);
  const [PageSize, setPageSize] = useState(10);
  const [SubType, setSubType] = useState(0);
  const [RecordList, setRecordList] = useState<any>({});
  const [dataLoding, setDataLoding] = useState(true);
  const [OpenList, setOpenList] = useState<any>([]);

  const { getBindStateFun } = useBindState();
  const Navigate = useNavigate();
  const [BindAddressModal, setBindAddressModal] = useState(false);

  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  const state = queryParams.get("state");
  const twApproveCode = queryParams.get("code");

  let flterObj = [
    { name: "265", key: 0 },
    { name: "266", key: 1 },
    { name: "267", key: 2 },
  ];

  function changeFlterFun(item: any) {
    setSubType(item?.key);
  }
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

  const menu = (
    <Menu
      onClick={changeFlterFun}
      items={flterObj.map((item: any) => {
        return {
          label: (
            <span
              className={
                Number(SubType) === Number(item?.key)
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

  const twType = {
    1: "153",
    2: "161",
    3: "162",
    4: "232",
    5: "226",
  };

  const CardLevel = () => {
    if (Number(tootalInfo?.isAdvancedVip) === 1)
      return (
        <div
          className="isAdvancedVip"
          onClick={() => {
            Navigate("/View/join/CommunityCardDetail", { state: { level: 3 } });
          }}
        ></div>
      );
    if (Number(tootalInfo?.isVip) === 1)
      return (
        <div
          className="svip"
          onClick={() => {
            Navigate("/View/join/CommunityCardDetail", { state: { level: 1 } });
          }}
        ></div>
      );
    if (Number(tootalInfo?.isNodeVip) === 1)
      return (
        <div
          className="isNodeVip"
          onClick={() => {
            Navigate("/View/join/CommunityCardDetail", { state: { level: 2 } });
          }}
        ></div>
      );
    if (Number(tootalInfo?.isStandardVip) === 1)
      return (
        <div
          className="isStandardVip"
          onClick={() => {
            Navigate("/View/join/CommunityCardDetail", { state: { level: 4 } });
          }}
        ></div>
      );

    return (
      <div
        // className="svip"
        className="vip"
        onClick={() => {
          Navigate("/View/join/CommunityCardDetail", { state: { level: 0 } });
        }}
      ></div>
    );
  };

  const getWhichType = () => {
    whichType().then((res: any) => {
      if (res.code === 200) {
        setBtnType(res.data);

        if (res.data?.currentPage === 0) {
          nav("/View/join/home");
        } else if (res.data?.currentPage === 7) {
          return;
        }
        // else {
        //   nav("/View/join/step");
        // }
      }
    });
    if (String(type) === "task") {
      setDataLoding(true);
      taskList({}).then((res: any) => {
        if (res.code === 200) {
          setDataLoding(false);
          setTaskList(res.data);
        }
      });
    }
  };

  const getMyInitData = async (id: any) => {
    let myList = await myMint({});
    let myListed = await hangSaleList({
      id: id ?? 0,
      isMe: 1,
      order: SubType ?? 0,
      pageNum: PageNum,
      pageSize: PageSize,
      chain: ChainName,
    });

    if (!!myList?.data || myListed?.data?.list?.length > 0) {
      myList.data = { ...myList.data, myId: "myList" + myList.data?.id };
      myListed.data.list = myListed?.data?.list?.map((item: any) => {
        return { ...item, myId: "myListed" + item?.id };
      });
      let Arr1: any = [myList?.data, ...myListed?.data?.list];
      let Arr2: any = [...myListed?.data?.list];
      let Arr3: any = [myList?.data];

      Arr1 =
        width > 1024 && Arr1?.length % 2 !== 0
          ? fillArrayToMultipleOfFour(Arr1, 2)
          : Arr1;
      Arr1 =
        width > 650 && Arr1?.length % 3 !== 0
          ? fillArrayToMultipleOfFour(Arr1, 3)
          : Arr1;
      Arr2 =
        width > 1024 && Arr2?.length % 2 !== 0
          ? fillArrayToMultipleOfFour(Arr2, 2)
          : Arr2;
      Arr2 =
        width > 650 && Arr2?.length % 3 !== 0
          ? fillArrayToMultipleOfFour(Arr2, 3)
          : Arr2;
      Arr3 =
        width > 1024 && Arr3?.length % 2 !== 0
          ? fillArrayToMultipleOfFour(Arr3, 2)
          : Arr3;
      Arr3 =
        width > 650 && Arr3?.length % 3 !== 0
          ? fillArrayToMultipleOfFour(Arr3, 3)
          : Arr3;

      setMyMint([Arr1, Arr2, Arr3] ?? []);
    } else {
      setMyMint([]);
    }
  };

  function fillArrayToMultipleOfFour(arr: any, num: number) {
    // -
    const fillCount = (4 - (arr.length % num)) % num; // - 4--
    // --
    const newArr = new Array(arr.length + fillCount).fill({});
    // -
    for (let i = 0; i < arr.length; i++) {
      newArr[i] = arr[i];
    }
    return newArr;
  }

  useEffect(() => {
    if (i18n.language === "zh") {
      setEn(false);
    } else {
      setEn(true);
    }
  }, [i18n.language]);

  useEffect(() => {
    if (token) {
      getWhichType();
    }
  }, [token, web3React.account, type]);

  const getCanUseCode = () => {
    canUseCode().then((res: any) => {
      setuseful(res.data);
    });
  };

  const getNotCanUseCode = () => {
    notCanUseCode().then((res: any) => {
      setuseless(res.data);
    });
  };

  const getInviteRecord = () => {
    inviteRecord().then((res: any) => {
      setBody(res.data);
    });
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

  useEffect(() => {
    if (!token) return;
    getTeamInfo();
    if (token && type === "team") {
      getCanUseCode();
      getNotCanUseCode();
      getInviteRecord();
    }
  }, [type, token]);

  const close = (type: number) => {
    if (type === 1) {
      useShow === "block" ? setUseShow("none") : setUseShow("block");
    } else {
      uselessShow === "block"
        ? setUselessShow("none")
        : setUselessShow("block");
    }
  };

  const yqlj = (code: number) => {
    if (!web3React.account) {
      return addMessage(t("Please link wallet"));
    } else {
      copyFun(window.location.origin + `/View/join/step?invite=${code}`);
      addMessage(t("Copied successfully"));
    }
  };

  // 1：-2：-3：-
  const ManageFun = (obj: any) => {
    if (!btnType.isBindTwitter) return errorref.current?.showModal();
    if (!obj) return;
    connectFun(
      () => {
        oauth2Url({}).then(async (res: any) => {
          if (res.code === 200) {
            //  window.open("https://www.example.com", "_blank");
            await window.open(res.data, "_blank");
          } else {
            addMessage(res.msg);
          }
        });
      },
      () => {
        let link: any;
        if (Number(obj?.twitterType) === 1) {
          link =
            twitterRetweet + obj?.twitterUsername + "/status/" + obj?.tweetId;
          // link = twitterRetweet + obj?.tweetId;
        } else if (Number(obj?.twitterType) === 2) {
          link = twitterReply + obj?.tweetId;
        } else if (Number(obj?.twitterType) === 3) {
          link = twitterLike + obj?.twitterUsername + "/status/" + obj?.tweetId;
        }
        window.open(link, "_blank");
      }
    );
  };

  const getVilifyState = throttle((obj: any) => {
    let { taskId, taskType, twitterType } = obj;
    if (!token) return;
    checkFulfil({
      taskId,
      taskType,
      twitterType,
    }).then((res: any) => {
      if (res.code === 200) {
        if (Number(twitterType) === 1) {
          addMessage(t("143"));
        } else if (Number(twitterType) === 2) {
          addMessage(t("144"));
        } else if (Number(twitterType) === 3) {
          addMessage(t("145"));
        }
        taskList({}).then((res: any) => {
          if (res.code === 200) {
            setTaskList(res.data);
          }
        });
      } else {
        addMessage("failed");
      }
    });
  }, 3000);

  const getInitData = () => {
    if (!token) return;
    interestTwitterInfo({}).then((res: any) => {
      if (res.code === 200) {
        setTwitterInfo(res.data);
      }
    });
    communityLikeData({}).then((res: any) => {
      if (res.code === 200) {
        setContinuousLikeNum(res.data);
      }
    });
    mintUserBoxInfo({}).then((res: any) => {
      if (res.code === 200) {
        setMintUserBoxInfo(res.data);
      }
    });
    bridgeBalanceList({
      link: ChainName,
      pageNum: 1,
      pageSize: 10,
    }).then((res: any) => {
      if (res.code === 200) {
        setRecordList(res.data);
      }
    });
  };

  const gz = () => {
    if (!btnType.isBindTwitter) return errorref.current?.showModal();
    if (!TwitterInfo?.twitterUsername) return;
    connectFun(
      () => {
        oauth2Url({}).then(async (res: any) => {
          if (res.code === 200) {
            await window.open(res.data, "_blank");
          } else {
            addMessage(res.msg);
          }
        });
      },
      () => {
        window.open(twitterFollow + TwitterInfo?.twitterUsername, "_blank");
      }
    );
  };

  const getCheckFollowsTwitter = () => {
    if (!token) return;
    checkFollowsTwitter({}).then((res: any) => {
      if (res.code === 200) {
        addMessage(t("137"));
        getWhichType();
      } else {
        addMessage(res.msg);
      }
    });
  };

  useEffect(() => {
    if (!!twApproveCode && state) {
      oauth2CallBack(state, twApproveCode).then((res: any) => {
        if (res.code === 200) {
          // -
        } else {
          addMessage(res.msg);
        }
      });
    }
  }, [twApproveCode, state]);
  useEffect(() => {
    if (token) {
      getInitData();
    }
  }, [token, ActiveTab]);

  useEffect(() => {
    if (!token || !RecordModal) return;
    whitePayList({ pageNum: 1, pageSize: 1000 }).then((res: any) => {
      if (res.code === 200) {
        setWhitePayList(res?.data?.list || []);
      }
    });
  }, [token, RecordModal]);
  useEffect(() => {
    if (!token || !TransferRecordModal) return;
    freeTransferList({ pageNum: 1, pageSize: 1000 }).then((res: any) => {
      if (res.code === 200) {
        setFreeTransferListList(res?.data?.list || []);
      }
    });
  }, [token, TransferRecordModal]);

  useEffect(() => {
    if (Number(ActiveTab) === 1 && token) {
      getMyInitData(0);
    } else if (Number(ActiveTab) === 2 && token) {
    }
  }, [token, ActiveTab, PageSize, SubType]);

  return (
    <div className="j_person">
      <div>
        <div className="le">
          {CardLevel()}
          <div></div>
          <div>
            <img src={txt} alt="" />
            <WhiteNameBox>
              {t("170")} :&nbsp;
              <img
                src={tootalInfo?.isWhite === 1 ? haveVip : noVip}
                alt=""
                // onClick={() => whitenameRef.current?.showModal()}
              />
              <img
                src={tootalInfo?.isWhite === 1 ? vipRight : noRight}
                alt=""
                // onClick={() => whitenameRef.current?.showModal()}
              />
              <div
                onClick={() => {
                  setRecordModal(true);
                }}
              >
                {t("171")} <img src={noRight} alt="" />
              </div>
            </WhiteNameBox>
            <div>
              <div>
                {t("147")} :{" "}
                {web3React.account?.replace(/^(.{7}).+(.{6})$/, "$1...$2")}
              </div>
            </div>
            {!!tootalInfo?.twitterUsername ? (
              <div>Twitter : @{tootalInfo?.twitterUsername}</div>
            ) : (
              <div
                onClick={() => {
                  return errorref.current?.showModal();
                }}
              >
                Twitter ： <span>{t("166")}</span>
              </div>
            )}
            <div>
              {t("48")} :{" "}
              {tootalInfo?.freeTicket
                ? thousandsSeparator(tootalInfo?.freeTicket ?? "0")
                : 0}
              <img src={en ? mfen : mfft} alt="" />
              <img
                src={zhuanyi}
                alt=""
                onClick={() => zhuanyiRef.current?.showModal()}
              />
            </div>
            <div>
              {t("49")} :{" "}
              {tootalInfo?.mintTicket
                ? thousandsSeparator(tootalInfo?.mintTicket ?? "0")
                : 0}
              <img src={en ? minten : mintft} alt="" />
              <div style={{ width: "3.3333rem" }}></div>
            </div>
            <div>
              {t("50")} :{" "}
              {tootalInfo?.credit
                ? thousandsSeparator(tootalInfo?.credit ?? "0")
                : 0}
              <img src={en ? jfen : jfft} alt="" />
              <div style={{ width: "3.3333rem" }}></div>
            </div>

            <div>#{tootalInfo?.rank ? tootalInfo?.rank : t("51")}</div>
            <div>{t("52")}</div>
          </div>
        </div>
        <div className="ri">
          <ScrollDiv>
            <span
              onClick={() => setType("team")}
              className={type === "team" ? "active" : ""}
            >
              {t("53")}
            </span>
            <span
              onClick={() => setType("task")}
              className={type === "task" ? "active" : ""}
            >
              {t("54")}
            </span>
            <span
              onClick={() => setType("asset")}
              className={type === "asset" ? "active" : ""}
            >
              {t("Denim BOX")}
            </span>
            <span
              onClick={() => setType("denim")}
              className={type === "denim" ? "active" : ""}
            >
              {t("477")}
            </span>
          </ScrollDiv>

          {type === "team" && (
            <div className="team">
              <div>
                <div className="title">
                  {t("55")} : {tootalInfo?.refereeNum}
                </div>
                <div>
                  {t("56", { num: tootalInfo?.validRefereeNum ?? "-" })}
                </div>
              </div>
              <div>
                <div>
                  <div className="title">
                    {t("57")} <span>( {t("416")} )</span>
                  </div>
                  <img
                    // className={
                    //   useShow === "none" ? "rotetaClose" : "rotetaOpen"
                    // }
                    onClick={() => close(1)}
                    src={useShow === "block" ? on : after}
                    alt=""
                  />
                </div>
                <div
                  style={{ display: useShow }}
                  className={usefulCode.length <= 0 ? "nodata" : ""}
                >
                  {usefulCode.length > 0 ? (
                    usefulCode.map((item: any, index: number) => {
                      return (
                        <div key={index} className="useCoderr">
                          <div className="codeNum">
                            {t("61")} {item.refereeNum}
                          </div>
                          <div
                            onClick={() => yqlj(item.refereeNum)}
                            className="p_btn"
                          >
                            {t("58")}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="zwsj">
                      <img src={nocode} alt="" />
                      <div>{t("59")}</div>
                    </div>
                  )}
                </div>
              </div>
              {uselessCode.length > 0 ? (
                <div>
                  <div>
                    <div className="title">{t("60")}</div>
                    <img
                      onClick={() => close(2)}
                      src={uselessShow === "block" ? on : after}
                      alt=""
                    />
                  </div>
                  <div
                    style={{ display: uselessShow }}
                    className={uselessCode.length <= 0 ? "nodata" : ""}
                  >
                    {uselessCode.length > 0 ? (
                      uselessCode.map((item: any, index: number) => {
                        return (
                          <div key={index} className="uselessCode">
                            <div className="codeNum">
                              {t("61")} {item.refereeNum}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="zwsj">
                        <img src={nocode} alt="" />
                        <div>{t("62")}</div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div></div>
              )}
              <div>
                <div className="title">{t("63")}</div>
                <div className="table">
                  <div className="thead">
                    {thead.map((item: any, index: number) => {
                      return <div key={index}>{t(item)}</div>;
                    })}
                  </div>
                  <div className="t_color" />
                  <div className="td_box">
                    {tbody.length > 0 ? (
                      tbody.map((item: any, index: number) => {
                        return (
                          <div key={index} className="td">
                            <div>{item.refereeTime}</div>
                            <div>
                              {item?.refereeAddress?.replace(
                                /^(.{7}).+(.{6})$/,
                                "$1...$2"
                              )}
                            </div>
                            <div>
                              {item.incomeStatus === 0 ? t("65") : t("66")}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="zwsj">
                        <img src={nocode} alt="" />
                        <div>{t("62")}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {type === "task" && (
            <div className="task">
              <div>
                <div className="title">{t("148")}</div>
                <div>{t("149")}</div>
              </div>
              <div>
                <div className="title">{t("150")}</div>
                <div
                  className={`taskBox ${type === "task" ? "successBox" : ""}`}
                >
                  <div className="taskinfo">
                    {t("151")}
                    <MyToolTip
                      showArrow={width >= 650 ? true : false}
                      title={t("191")}
                    >
                      <img src={infoIcon} alt="" />
                    </MyToolTip>
                  </div>
                  {/* <div className="success" /> */}
                  <SuccessBox className="success"></SuccessBox>
                </div>
              </div>

              <div>
                <div className="title">{t("163")}</div>
                <TaskBox
                  className={`taskBox ${
                    Number(btnType.isInterestTwitter) === 1 ? "successBox" : ""
                  }`}
                >
                  <div className="taskinfo">
                    {t("24")} @{TwitterInfo?.twitterUsername ?? "--"}
                    <MyToolTip
                      showArrow={width >= 650 ? true : false}
                      title={t("193")}
                    >
                      <img src={infoIcon} alt="" />
                    </MyToolTip>
                  </div>

                  <div style={{ display: "none" }}>
                    {/* {t("154", { name: item?.income })} */}
                  </div>
                  {Number(btnType.isInterestTwitter) === 1 ? (
                    <div className="success" />
                  ) : width <= 430 ? (
                    <BtnBox>
                      <div
                        className="p_btn qwc"
                        onClick={() => {
                          getBindStateFun(gz, () => {});
                        }}
                      >
                        {t("155")}
                      </div>
                      <div
                        className="p_btn"
                        onClick={() => {
                          getBindStateFun(getCheckFollowsTwitter, () => {});
                        }}
                      >
                        {t("156")}
                      </div>
                    </BtnBox>
                  ) : (
                    <>
                      <div
                        className="p_btn qwc"
                        onClick={() => {
                          getBindStateFun(gz, () => {});
                        }}
                      >
                        {t("155")}
                      </div>
                      <div
                        className="p_btn"
                        onClick={() => {
                          getBindStateFun(getCheckFollowsTwitter, () => {});
                        }}
                      >
                        {t("156")}
                      </div>
                    </>
                  )}
                </TaskBox>
              </div>
              <div>
                <div>
                  <div className="title">{t("152")}</div>
                </div>
                {!dataLoding ? (
                  TaskList?.map((item: any) => (
                    <TaskBox
                      className={
                        Number(item?.fulfil) === 1
                          ? "taskBox successBox"
                          : "taskBox"
                      }
                    >
                      <div className="taskinfo">
                        {t(twType[Number(item?.twitterType)], {
                          name: item?.twitterUsername,
                        })}
                        <MyToolTip
                          showArrow={width >= 650 ? true : false}
                          title={t("193")}
                        >
                          <img src={infoIcon} alt="" />
                        </MyToolTip>
                      </div>
                      <div style={{ display: "none" }}>
                        {t("154", { name: item?.income })}
                      </div>
                      {Number(item?.fulfil) === 1 ? (
                        <div className="success" />
                      ) : width <= 430 ? (
                        <BtnBox>
                          <div
                            className="p_btn qwc"
                            onClick={() => {
                              // ManageFun(item);
                              getBindStateFun(
                                () => {
                                  ManageFun(item);
                                },
                                () => {}
                              );
                            }}
                          >
                            {t("155")}
                          </div>
                          <div
                            className="p_btn"
                            onClick={() => {
                              // getVilifyState(item);
                              getBindStateFun(
                                () => {
                                  getVilifyState(item);
                                },
                                () => {}
                              );
                            }}
                          >
                            {t("156")}
                          </div>
                        </BtnBox>
                      ) : (
                        <>
                          <div
                            className="p_btn qwc"
                            onClick={() => {
                              // ManageFun(item);
                              getBindStateFun(
                                () => {
                                  ManageFun(item);
                                },
                                () => {}
                              );
                            }}
                          >
                            {t("155")}
                          </div>
                          <div
                            className="p_btn"
                            onClick={() => {
                              // getVilifyState(item);
                              getBindStateFun(
                                () => {
                                  getVilifyState(item);
                                },
                                () => {}
                              );
                            }}
                          >
                            {t("156")}
                          </div>
                        </>
                      )}
                    </TaskBox>
                  ))
                ) : (
                  <PageLoding></PageLoding>
                )}
              </div>

              {/* -*/}
              <CommunityDivBox>
                <div>
                  <div className="title">{t("225")}</div>
                </div>
                {[
                  { twitterType: 4, tip: t("230"), fulfil: 0 },
                  {
                    twitterType: 5,
                    tip: t("231"),
                    fulfil: Number(ContinuousLikeNum?.continuousLikeNum) >= 5,
                  },
                ]?.map((item: any) => (
                  <TaskBox
                    className={
                      Number(item?.fulfil) === 1
                        ? "taskBox successBox"
                        : "taskBox"
                    }
                  >
                    <div className="taskinfo">
                      {/* -@{item?.twitterUsername} --*/}
                      {t(twType[Number(item?.twitterType)], {
                        value: ContinuousLikeNum?.continuousLikeNum,
                      })}
                      <MyToolTip
                        showArrow={width >= 650 ? true : false}
                        title={t(item?.tip)}
                      >
                        <img src={infoIcon} alt="" />
                      </MyToolTip>
                    </div>
                    <div style={{ display: "none" }}>
                      {/* -item?.income}-*/}
                      {t("154", { name: item?.income })}
                    </div>

                    {Number(item?.fulfil) === 1 ? (
                      <div className="success" />
                    ) : width <= 430 ? (
                      <BtnBox>
                        <div
                          className="p_btn qwc"
                          onClick={() => {
                            nav("/View/Community");
                          }}
                        >
                          {t("155")}
                        </div>
                      </BtnBox>
                    ) : (
                      <div
                        className="p_btn qwc"
                        onClick={() => {
                          nav("/View/Community");
                        }}
                      >
                        {t("155")}
                      </div>
                    )}
                  </TaskBox>
                ))}
              </CommunityDivBox>
            </div>
            // <div className="jqqd">{t("67")}</div>
          )}
          {type === "asset" && (
            <>
              <PurchaseModal_Content>
                <PurchaseModal_Content_Left>
                  <img
                    src={!!MintUserBoxInfo?.isMintBox ? INSBOXActive : INSBOX}
                    alt=""
                  />

                  {!(width > 1024) && (
                    <PurchaseModal_Content_Left_Id src={IdBg}>
                      Denim Box ID : {MintUserBoxInfo?.num ?? "-"}
                    </PurchaseModal_Content_Left_Id>
                  )}
                </PurchaseModal_Content_Left>
                <PurchaseModal_Content_Right>
                  {width > 1024 && (
                    <PurchaseModal_Content_Left_Id src={IdBg}>
                      Denim Box ID : {MintUserBoxInfo?.num ?? "-"}
                    </PurchaseModal_Content_Left_Id>
                  )}
                  <div>
                    {t("303")} : <span>BTIA</span>{" "}
                    {/* {t("303")} : <span>{t("361")}</span>{" "} */}
                  </div>
                  <div>
                    {t("297")} : <span>{MintUserBoxInfo?.accord ?? "-"}</span>{" "}
                  </div>
                  <div>
                    {t("298")} :
                    <span>
                      {AddrHandle(MintUserBoxInfo?.userAddress, 6, 6) ?? "-"}
                    </span>{" "}
                  </div>
                  <div>
                    {t("299")} :
                    <span>
                      {AddrHandle(MintUserBoxInfo?.createHash, 6, 6) ?? "-"}
                    </span>{" "}
                  </div>

                  <div>
                    {t("300")} :
                    <span>{MintUserBoxInfo?.createTime ?? "-"}</span>{" "}
                  </div>
                  <div>
                    {t("301")} : <span>{MintUserBoxInfo?.blockNum ?? "-"}</span>{" "}
                  </div>
                </PurchaseModal_Content_Right>
              </PurchaseModal_Content>
              <RankBox_Left_Tab>
                <RankBox_Left_Tab_Item
                  className={Number(ActiveTab) === 1 ? "activeTab" : ""}
                  onClick={() => {
                    setPageNum(1);
                    setActiveTab(1);
                  }}
                >
                  {t("302")}
                </RankBox_Left_Tab_Item>
                <RankBox_Left_Tab_Item
                  className={Number(ActiveTab) === 2 ? "activeTab" : ""}
                  onClick={() => {
                    setPageNum(1);
                    setActiveTab(2);
                  }}
                >
                  {t("Bridge")}
                </RankBox_Left_Tab_Item>
              </RankBox_Left_Tab>

              <AssetBox>
                <ChainBox_AssetBox>
                  {/* 
                  <ChainBox_Item_Btn>
                    <img src={AllIcon} alt="" />
                    {t("293")}
                  </ChainBox_Item_Btn>
                   */}
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
                        {String(item?.name) === String(ChainName) && (
                          <div>{ChainName}</div>
                        )}
                      </ChainBox_Item_Box_Item>
                    ))}
                  </ChainBox_Item_Box>
                </ChainBox_AssetBox>
                {Number(ActiveTab) === 1 && (
                  <ManageBox>
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
                            (item: any) => Number(item?.key) === Number(SubType)
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
                  </ManageBox>
                )}
              </AssetBox>
              {/* -sc */}
              {Number(ActiveTab) === 1 &&
                (String(ChainName) === "Binance" &&
                MyMint[SubType]?.length > 0 ? (
                  <>
                    <CommunityBox>
                      {MyMint[SubType]?.map((item: any, index: any) =>
                        !!item?.id ? (
                          <CommunityBox_Item
                            key={index}
                            onClick={() => {
                              getBindStateFun(
                                () => {
                                  return Navigate("/View/Market/2", {
                                    state: { currentItem: item },
                                  });
                                },
                                () => {}
                              );
                            }}
                          >
                            <CommunityBox_Item_Content_Box>
                              {false && (
                                <ChainTag color={"#F7931A"}>BTC</ChainTag>
                              )}
                              {true && (
                                <ChainTag color={"#F3BA2F"}>BNB</ChainTag>
                              )}
                              <CommunityBox_Item_Id src={IdItemBg}>
                                ID : {item?.id}
                              </CommunityBox_Item_Id>

                              <CommunityBox_Item_SubTitle src={SubTitleItemBg}>
                                INSCRIPTION ALLIANCE
                              </CommunityBox_Item_SubTitle>
                              <Detail_CommunityBox_Item_Bottom>
                                <CommunityBox_Item_Bottom_Left
                                  src={PersonalItemBg}
                                >
                                  <img src={PersonIcon} alt="" />{" "}
                                  {AddrHandle(item?.userAddress, 6, 6)}
                                </CommunityBox_Item_Bottom_Left>
                                <Detail_CommunityBox_Item_Bottom_Right>
                                  {!!item?.totalPrice ? (
                                    <DetailBtn src={detailBtnBg}>
                                      {t("294")}
                                    </DetailBtn>
                                  ) : (
                                    <DetailBtn src={detailBtnBg}>
                                      {t("268")}
                                    </DetailBtn>
                                  )}
                                </Detail_CommunityBox_Item_Bottom_Right>
                              </Detail_CommunityBox_Item_Bottom>

                              <CommunityBox_Item_Content
                                src={
                                  "https://inscriptionalliance.com/download/inscription/image/web/ItemBg.gif"
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

              {Number(ActiveTab) === 2 &&
                (String(ChainName) === "Binance" ? (
                  <RankBox_Left_Table_Content>
                    <RankBox_RecordTable>
                      <TransferRecordTable_Title1>
                        <div>{t("478")}</div>
                        <div>{t("479")}</div>
                        {/* <div>{t("428")}</div> */}
                        <div>{t("481")}</div>
                        <div>{t("427")}</div>
                        <div></div>
                      </TransferRecordTable_Title1>
                      <RecordTable_Devider></RecordTable_Devider>
                      {[]?.length > 0 ? (
                        <RecordTable_Content>
                          {[]?.map((item: any, index: any) => (
                            <>
                              <TransferRecordTable_Content_Item key={index}>
                                <div>2024.01.20</div>
                                <div>BRECFS...2211DS</div>
                                {/* <div>HFAS....45GVDFD</div> */}
                                <div>STAS</div>
                                <div>1000</div>

                                <div
                                  onClick={() => {
                                    openFun(item);
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
                                {/* <div>
                              {true ? (
                                <ManageBtn color={"#95FA31"}>
                                  {t("474")}
                                </ManageBtn>
                              ) : (
                                <ManageBtn color={"#FFF"}>{t("476")}</ManageBtn>
                              )}
                            </div> */}
                              </TransferRecordTable_Content_Item>
                              {OpenList?.some(
                                (item1: any) =>
                                  Number(item1) === Number(item?.id)
                              ) && (
                                <LongBox>
                                  <div>
                                    {t("428")}
                                    <span>
                                      {" "}
                                      {AddrHandle(item?.transferHash, 6, 6)}
                                    </span>
                                  </div>
                                  <div>
                                    {t("473")}
                                    <span>
                                      {true ? (
                                        <ManageBtn color={"#95FA31"}>
                                          {t("474")}
                                        </ManageBtn>
                                      ) : (
                                        <ManageBtn color={"#FFF"}>
                                          {t("476")}
                                        </ManageBtn>
                                      )}
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
                      )}
                    </RankBox_RecordTable>
                  </RankBox_Left_Table_Content>
                ) : (
                  <NoData />
                ))}
            </>
          )}

          {type === "denim" && (
            <DenimTab>
              <DenimBindAddress_Box>
                <DenimBindAddress_Box_Left>
                  <DenimBindAddress_Box_Left_Top>
                    <Manage_Btn active={true}>{t("482")}</Manage_Btn>
                    <DenimBindAddress_Box_Left_Top_Balance>
                      {t("483")} : 10
                    </DenimBindAddress_Box_Left_Top_Balance>
                  </DenimBindAddress_Box_Left_Top>
                  <Manage_Btn active={false}>{t("484")}</Manage_Btn>
                </DenimBindAddress_Box_Left>
                <DenimBindAddress_Box_Right>
                  <DenimBindAddress_Box_Right_Title>
                    {t("485")}
                  </DenimBindAddress_Box_Right_Title>
                  <DenimBindAddress_Box_Right_Content>
                    <div>{t("486")}</div>
                    <div>{t("487")}</div>
                    <div>{t("488")}</div>
                    <div>{t("489")}</div>
                  </DenimBindAddress_Box_Right_Content>
                </DenimBindAddress_Box_Right>
              </DenimBindAddress_Box>

              <DenimBindAddress_Des>
                <DenimBindAddress_Des_Title>
                  {t("490")}
                </DenimBindAddress_Des_Title>
                <DenimBindAddress_Des_Content>
                  <div>{t("491")}</div>
                  <div>{t("492")}</div>
                  <div>{t("493")}</div>
                </DenimBindAddress_Des_Content>
              </DenimBindAddress_Des>

              <DenimTab_Table>
                <div className="title">{t("494")}</div>
                {/* <div className="table">
                  <div className="thead">
                    {["478", "495", "496", "473"].map(
                      (item: any, index: number) => {
                        return <div key={index}>{t(item)}</div>;
                      }
                    )}
                  </div>
                  <div className="t_color" />
                  <div className="td_box">
                    {[].length > 0 ? (
                      [].map((item: any, index: number) => {
                        return (
                          <div key={index} className="td">
                            <div>{item.refereeTime}</div>
                            <div>
                              {item?.refereeAddress?.replace(
                                /^(.{7}).+(.{6})$/,
                                "$1...$2"
                              )}
                            </div>
                            <div>
                              {item.incomeStatus === 0 ? t("65") : t("66")}
                            </div>
                            <ManageItems>
                              <ManageItem>{t("497")}</ManageItem>
                              <ManageItem>{t("498")}</ManageItem>
                            </ManageItems>
                          </div>
                        );
                      })
                    ) : (
                      <div className="zwsj">
                        <img src={nocode} alt="" />
                      </div>
                    )}
                  </div>
                </div> */}

                <RankBox_Left_Table_Content>
                  <RankBox_RecordTable>
                    <TransferRecordTable_Title1>
                      <div>{t("478")}</div>
                      <div>{t("495")}</div>
                      {/* <div>{t("428")}</div> */}
                      <div>{t("496")}</div>
                      <div>{t("473")}</div>
                      <div></div>
                    </TransferRecordTable_Title1>
                    <RecordTable_Devider></RecordTable_Devider>
                    {[]?.length > 0 ? (
                      <RecordTable_Content>
                        {[]?.map((item: any, index: any) => (
                          <>
                            <TransferRecordTable_Content_Item key={index}>
                              <div>2024.01.20</div>
                              <div>BRECFS...2211DS</div>
                              {/* <div>HFAS....45GVDFD</div> */}
                              <div>STAS</div>
                              <div>1000</div>

                              <div
                                onClick={() => {
                                  openFun(item);
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
                              {/* <div>
                              {true ? (
                                <ManageBtn color={"#95FA31"}>
                                  {t("474")}
                                </ManageBtn>
                              ) : (
                                <ManageBtn color={"#FFF"}>{t("476")}</ManageBtn>
                              )}
                            </div> */}
                            </TransferRecordTable_Content_Item>
                            {OpenList?.some(
                              (item1: any) => Number(item1) === Number(item?.id)
                            ) && (
                              <LongBox>
                                <div>
                                  {t("428")}
                                  <span>
                                    {" "}
                                    {AddrHandle(item?.transferHash, 6, 6)}
                                  </span>
                                </div>
                                <div>
                                  {t("473")}
                                  <span>
                                    {true ? (
                                      <ManageBtn color={"#95FA31"}>
                                        {t("474")}
                                      </ManageBtn>
                                    ) : (
                                      <ManageBtn color={"#FFF"}>
                                        {t("476")}
                                      </ManageBtn>
                                    )}
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
                    )}
                  </RankBox_RecordTable>
                </RankBox_Left_Table_Content>
              </DenimTab_Table>
            </DenimTab>
          )}
        </div>
        <Box ref={whitenameRef} />
        <ZhuanYiModal
          ref={zhuanyiRef}
          modalType="joinperson"
          mfCode={tootalInfo.freeTicket ?? 0}
          callback={getTeamInfo}
          fun={() => {
            setTransferRecordModal(true);
          }}
        />
        <GoToBind ref={errorref} fun={getTeamInfo} />
        <PurchaseRecordModal
          visible={RecordModal}
          className="Modal"
          centered
          width={"98.83375rem"}
          closable={false}
          footer={null}
          onCancel={() => {
            setRecordModal(false);
          }}
          src={BridgeModalBg}
        >
          <div
            className="close"
            onClick={() => {
              setRecordModal(false);
            }}
          >
            <img src={closeIcon} alt="" />
          </div>
          <TitleModal>{t("173")}</TitleModal>
          <RecordTable>
            <RecordTable_Title>
              <div>{t("174")}</div>
              <div>{t("175")}</div>
              <div>{t("176")}</div>
              <div>{t("177")}</div>
            </RecordTable_Title>
            <RecordTable_Devider></RecordTable_Devider>
            {WhitePayList?.length > 0 ? (
              <RecordTable_Content>
                {WhitePayList?.map((item: any, index: any) => (
                  <RecordTable_Content_Item key={index}>
                    <div>{item?.time}</div>
                    <div>{item?.whiteNum}</div>
                    <div>{item?.amount}</div>
                    <div>{t("178")}</div>
                  </RecordTable_Content_Item>
                ))}
              </RecordTable_Content>
            ) : (
              <RecordTable_Content_NoData>
                <NoData />
              </RecordTable_Content_NoData>
            )}
          </RecordTable>
        </PurchaseRecordModal>
        <TransferRecord_Modal
          visible={TransferRecordModal}
          className="Modal"
          centered
          width={"98.83375rem"}
          closable={false}
          footer={null}
          onCancel={() => {
            setTransferRecordModal(false);
          }}
          src={BridgeModalBg}
        >
          <div
            className="close"
            onClick={() => {
              setTransferRecordModal(false);
            }}
          >
            <img src={closeIcon} alt="" />
          </div>
          <TitleModal>{t("179")}</TitleModal>
          <RecordTable>
            <TransferRecordTable_Title>
              <div>{t("174")}</div>
              <div>{t("180")}</div>
              <div>{t("181")}</div>
              <div>{t("175")}</div>
              <div>{t("177")}</div>
            </TransferRecordTable_Title>
            <RecordTable_Devider></RecordTable_Devider>
            {FreeTransferListList?.length > 0 ? (
              <RecordTable_Content>
                {FreeTransferListList?.map((item: any, index: any) => (
                  <TransferRecordTable_Content_Item key={index}>
                    <div>{item?.time}</div>
                    <div>{AddrHandle(item?.fromAddress, 4, 4)}</div>
                    <div>{AddrHandle(item?.toAddress, 4, 4)}</div>
                    <div>{item?.freeNum}</div>
                    <div>{item?.type === 1 ? t("182") : t("183")}</div>
                  </TransferRecordTable_Content_Item>
                ))}
              </RecordTable_Content>
            ) : (
              <RecordTable_Content_NoData>
                <NoData />
              </RecordTable_Content_NoData>
            )}
          </RecordTable>
        </TransferRecord_Modal>
        {/* -IN-*/}
        <InfoModal
          visible={false}
          className="Modal"
          centered
          width={510}
          closable={false}
          footer={null}
          onCancel={() => {
            setBindAddressModal(false);
          }}
          src={sbBack}
        >
          <div
            className="close"
            onClick={() => {
              setBindAddressModal(false);
            }}
          >
            <img src={closeIcon} alt="" />
          </div>
          <MintTitleModal_InfoModal>{t("499")}</MintTitleModal_InfoModal>

          <InputModal_Content>
            <SuccessfulModal_Content_Item>
              <div>{t("500")}： </div>

              <SuccessfulModal_Content_Item_Value>
                852001
                <CopyIcon></CopyIcon>
              </SuccessfulModal_Content_Item_Value>
              <SuccessfulModal_Content_Item_Des>
                {t("501")}
              </SuccessfulModal_Content_Item_Des>
            </SuccessfulModal_Content_Item>

            <BindBTCAddressBtn
              onClick={() => {
                return addMessage(t("Open soon"));
              }}
            >
              {t("502")}
            </BindBTCAddressBtn>
          </InputModal_Content>
        </InfoModal>
        {/* -*/}
        <InfoModal
          visible={false}
          className="Modal"
          centered
          width={510}
          closable={false}
          footer={null}
          onCancel={() => {
            setBindAddressModal(false);
          }}
          src={sbBack}
        >
          <div
            className="close"
            onClick={() => {
              setBindAddressModal(false);
            }}
          >
            <img src={closeIcon} alt="" />
          </div>
          <MintTitleModal_InfoModal>{t("504")}</MintTitleModal_InfoModal>

          <InputModal_Content>
            <SuccessfulModal_Content_Item>
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  margin: "30px 0px",
                }}
              >
                {t("505")}
              </div>
            </SuccessfulModal_Content_Item>

            <ConfirmBtn
              onClick={() => {
                return addMessage(t("Open soon"));
              }}
            >
              {t("506")}
            </ConfirmBtn>
          </InputModal_Content>
        </InfoModal>
        {/* -*/}
        <TipForSuccessModal
          show={false}
          close={() => {}}
          tip={t("503")}
        ></TipForSuccessModal>
        {/* -*/}
        <TipForSuccessModal
          show={false}
          close={() => {}}
          tip={t("476")}
        ></TipForSuccessModal>
      </div>
    </div>
  );
};

export default JoinPerson;
