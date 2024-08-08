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
  FlexSBCBox,
  FlexSCBox,
  FlexSECBox,
} from "../components/FlexBox/index";
import { useViewport } from "../components/viewportContext";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import infoIcon from "../assets/image/Mint/infoIcon.svg";

import NoData from "../components/NoData";
import { Modal, Pagination, PaginationProps, Tooltip } from "antd";
import { useSelector } from "react-redux";
import {
  AddrHandle,
  addMessage,
  showLoding,
  thousandsSeparator,
} from "../utils/tool";
import { RecordTable_Content_NoData } from "./join/joinPerson";
import rightIcon from "../assets/image/Rank/rightIcon.svg";
import leftIcon from "../assets/image/Rank/leftIcon.svg";
import rankBg from "../assets/image/Rank/rankBg.png";
import intrenceBg from "../assets/image/Rank/intrenceBg.png";
import goToIcon from "../assets/image/join/goToIcon.svg";

import i18n from "../lang/i18n";
import {
  communityRank,
  lastReferee,
  mintRank,
  mintRankCommunity,
  mintRankNode,
  mintRankPhase,
  teamRank,
} from "../API";
import PageLoding from "../components/PageLoding";

export const RankContainer = styled.div`
  /* padding: 5.67rem 0px; */
  width: 100%;
  max-width: 1240px;
  padding: 0px 20px;

  /* @media (min-width: 1920px) {
    max-width: 1750px;
  } */
  @media (max-width: 1400px) {
    padding: 20px;
  }
`;

const RankBox = styled(FlexBox)`
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  > div {
    &:first-child {
      flex: 1;
      margin-right: 40px;
    }
    &:last-child {
      width: 100%;
      max-width: 30%;
    }
  }

  @media (max-width: 768px) {
    display: block;
    > div {
      &:first-child {
        flex: 1;
        margin: 0px 0px 5.83rem 0px;
      }
      &:last-child {
        width: 100%;
        max-width: 100%;
      }
    }
  }
`;

const RankBox_Left = styled.div``;
const RankBox_Left_Tab = styled(FlexSCBox)`
  width: 100%;
  overflow: auto;

  &::-webkit-scrollbar-thumb {
    background: rgba(149, 250, 49, 1);
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
    font-size: 2.5rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    /* text-transform: uppercase; */
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

export const RankBox_Left_Table_Content = styled(FlexBox)`
  width: 100%;
  flex-direction: column;
  align-items: center;
`;

export const RecordTable = styled.div`
  margin-top: 30px;
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
    margin-top: 5rem;
  }
`;
export const RecordTable1 = styled.div`
  margin-top: 30px;
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
  overflow: auto;

  &::-webkit-scrollbar-thumb {
    background: rgba(149, 250, 49, 1);
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

  @media (max-width: 768px) {
    margin-top: 5rem;
  }
`;
export const RecordTable_Auto = styled.div`
  min-width: 375px;
`;
export const RecordTable_Title = styled(FlexSBCBox)`
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
      line-height: 12px;
    }
  }
`;
export const TransferRecordTable_Title = styled(RecordTable_Title)`
  width: 100%;
  padding: 0rem 3.33rem;

  > div {
    &:first-child {
      justify-content: flex-start;
    }
    &:last-child {
      justify-content: flex-end;
      /* max-width: 100px; */
    }
  }
  @media (max-width: 768px) {
    padding: 0rem 2rem;
  }
`;
export const TransferRecordTable_Title3 = styled(RecordTable_Title)`
  width: 100%;
  padding: 0rem 3.33rem;

  > div {
    white-space: nowrap;
    /* text-align: center; */
    &:first-child {
      justify-content: flex-start;
      flex: auto;
      max-width: 100px;
      @media (max-width: 768px) {
        max-width: 50px;
      }
    }
    &:last-child {
      justify-content: flex-end;
      flex: auto;
      max-width: 100px;
      /* max-width: 100px; */
      @media (max-width: 768px) {
        max-width: 50px;
      }
    }
  }
  @media (max-width: 768px) {
    padding: 0rem 2rem;
  }
`;
export const TransferRecordTable_Title_Point = styled(RecordTable_Title)`
  width: 100%;
  padding: 0rem 3.33rem;

  > div {
    /* text-align: center; */
    &:first-child {
      justify-content: flex-start;
      flex: auto;
      max-width: 60px;
      white-space: nowrap;
      width: 100%;
      @media (max-width: 768px) {
        max-width: 40px;
      }
    }
    &:nth-child(2) {
      justify-content: center;
    }
    &:nth-child(3) {
      justify-content: center;
    }
    &:last-child {
      justify-content: flex-end;
      max-width: 100px;
      flex: auto;

      width: 100%;
      @media (max-width: 768px) {
        max-width: 60px;
      }
    }
  }
  @media (max-width: 768px) {
    padding: 0rem 2rem;
  }
`;
const PersonRankContent = styled(RecordTable_Title)`
  width: 100%;
  padding: 0rem 3.33rem;

  > div {
    /* text-align: center; */
    &:first-child {
      justify-content: flex-start;
      flex: auto;
      max-width: 60px;
      white-space: nowrap;
      width: 100%;
      @media (max-width: 768px) {
        max-width: 40px;
      }
    }
    &:nth-child(2) {
      justify-content: center;
    }
    &:nth-child(3) {
      justify-content: center;
    }
    &:last-child {
      justify-content: flex-end;
    }
  }
  @media (max-width: 768px) {
    padding: 0rem 2rem;
  }
`;
const PersonRank = styled(RecordTable_Title)`
  width: 100%;
  padding: 0rem 3.33rem;

  > div {
    /* text-align: center; */
    &:first-child {
      justify-content: flex-start;
      flex: auto;
      max-width: 60px;
      white-space: nowrap;
      width: 100%;
      @media (max-width: 768px) {
        max-width: 40px;
      }
    }
    &:nth-child(2) {
      justify-content: center;
    }
    &:nth-child(3) {
      justify-content: center;
    }
    &:last-child {
      justify-content: flex-end;
    }
  }
  @media (max-width: 768px) {
    padding: 0rem 2rem;
  }
`;

export const TransferRecordTable_Content_Item = styled(
  TransferRecordTable_Title
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
    text-align: center;
    @media (max-width: 768px) {
      font-size: 2.5rem;
      /* padding: 2rem 0rem; */
    }
  }
`;
export const TransferRecordTable_Content_Item3 = styled(
  TransferRecordTable_Title3
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
      font-size: 2.5rem;
      /* padding: 2rem 0rem; */
    }
  }
`;

export const TransferRecordTable_Content_Item_Point = styled(
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
      font-size: 2.5rem;
      /* padding: 2rem 0rem; */
    }
  }
`;

export const RecordTable_Devider = styled.div`
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

export const RecordTable_Content = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  max-height: 47rem;
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

export const NoDataContainer = styled(FlexCCBox)`
  padding: 50px;
`;

export const PaginationContainer = styled(FlexBox)`
  flex-direction: column;
  align-items: center;
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
    .ant-pagination-item,
    .ant-pagination-total-text {
      height: 26px;
      a {
        padding: 0px 4px;
      }
    }
    .ant-pagination-jump-next,
    .ant-pagination-jump-prev,
    .ant-pagination-next,
    .ant-pagination-prev {
      height: 26px;
    }
  }
`;

export const PaginationContainerTip = styled(FlexCCBox)`
  margin-top: 12px;
  color: rgba(255, 255, 255, 0.3);
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-transform: uppercase;
  @media (max-width: 768px) {
    margin-top: 8px;

    font-size: 2rem;
  }
`;

const RankBox_Right = styled.div<{ src: any }>`
  background: transparent;
  background-image: ${({ src }) => `url(${src})`};
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding: 1.33rem 25px 1.33rem 30px;
  @media (max-width: 768px) {
    padding: 1.6rem 8px 1.6rem 4.67rem;
  }
`;

const RankBox_Right_Title = styled.div`
  color: #fff;
  text-align: left;
  font-family: "CKTKingkong";
  font-size: 2rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 3.33rem;
  text-transform: uppercase;
  @media (max-width: 768px) {
    margin-bottom: 3rem;
    font-size: 4rem;
  }
`;

const RankBox_Right_Content = styled.div`
  max-height: 500px;
  overflow: auto;
  padding-right: 5px;
  ::-webkit-scrollbar {
    width: 0.3333rem;
    right: 25.9992px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10.9992px;
  }

  ::-webkit-scrollbar-thumb {
    background: #95fa31;
    border-radius: 2.8333rem;
  }
  > div {
    &:last-child {
      margin-bottom: 5px;
    }
  }
  @media (max-width: 768px) {
    max-height: 210px;
    padding-right: 15px;
  }
`;

const RankBox_Right_Content_Item = styled(FlexSBCBox)`
  margin-bottom: 2.5rem;
  width: 100%;
  @media (max-width: 768px) {
    margin-bottom: 3rem;
  }
`;

const RankBox_Right_Content_Item_Left = styled(FlexSCBox)`
  img {
    margin-right: 1.17rem;
    width: 5rem;
    height: 5rem;
    flex-shrink: 0;
  }
  > div {
    color: #fff;
    font-family: "CKTKingkong";
    font-size: 1.66667rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;

    > div {
      color: rgba(255, 255, 255, 0.6);
      font-family: "CKTKingkong";
      font-size: 1.33333rem;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      margin-top: 1.17rem;
    }
  }
  @media (max-width: 768px) {
    img {
      margin-right: 1.4rem;
      width: 6rem;
      height: 6rem;
      flex-shrink: 0;
    }

    > div {
      font-size: 2.5rem;

      > div {
        font-size: 2rem;
      }
    }
  }
`;
const RankBox_Right_Content_Item_Right = styled(FlexSECBox)`
  color: #fff;
  text-align: right;
  font-family: "CKTKingkong";
  font-size: 1.33333rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const MyToolTip = styled(Tooltip)`
  margin-left: 8px;
  position: relative;

  @media (max-width: 768px) {
    margin-left: 3px;
    width: 16px;
  }
`;

export const Rank_RecordTable_Content_NoData = styled(
  RecordTable_Content_NoData
)`
  padding: 11rem 0px;
`;
const Rank_Invite_RecordTable_Content_NoData = styled(
  RecordTable_Content_NoData
)`
  padding: 15rem 0px;
`;
const Refresh_Invite_RecordTable_Content_NoData = styled(
  RecordTable_Content_NoData
)`
  padding: 15rem 0px;
  @media (max-width: 768px) {
    padding: 7rem 0px;
  }
`;

const SubtabBox = styled(FlexBox)`
  align-items: center;
  justify-content: flex-start;
  margin-top: 30px;
  width: 100%;
  padding: 23px;
  border-radius: 55px;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 7px 7px 12px 0px #000 inset,
    -5px -5px 7px 0px rgba(255, 255, 255, 0.2) inset;
  backdrop-filter: blur(28.5px);
  .activeTab {
    color: #fff;
  }
  @media (max-width: 1440px) {
    padding: 11px 12px;
    font-size: 1.5rem;
  }
  @media (max-width: 768px) {
    margin-top: 2.17rem;
    font-size: 2.5rem;
  }
`;
const SubtabBox_Item = styled(FlexCCBox)`
  margin-right: 40px;
  color: #808080;
  font-family: "CKTKingkong";
  font-size: 22px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  @media (max-width: 1440px) {
    font-size: 1.5rem;
  }
  @media (max-width: 768px) {
    font-size: 2.5rem;
    margin-right: 3rem;
    line-height: 2.5rem;
    text-align: center;
  }
`;

const EcologyBanner_Container = styled(FlexCCBox)<{ src: any }>`
  width: 100%;
  padding: 3.75rem 8.33rem;
  background-image: ${({ src }) => `url(${src})`};
  background-position: center;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  border-radius: 3.33333rem;
  box-shadow: 7px 7px 12px 0px #000 inset,
    -7px -7px 12px 0px rgba(255, 255, 255, 0.2) inset;
  backdrop-filter: blur(28.5px);
  z-index: 1;
  margin-bottom: 30px;
  @media (max-width: 768px) {
    padding: 22px 19px;
    border-radius: 18px;
    box-shadow: 2.464px 2.464px 4.224px 0px #000 inset,
      -1.76px -1.76px 2.464px 0px rgba(255, 255, 255, 0.2) inset;
    backdrop-filter: blur(10.033162117004395px);
    margin: 22px 0px;
  }
`;
const EcologyBanner_Box = styled.div`
  width: 100%;
  > div {
    &:first-child {
      color: #fff;
      font-family: "CKTKingkong";
      font-size: 30px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      margin-bottom: 0.83;
      @media (max-width: 1440px) {
        font-size: 3.75rem;
      }
      @media (max-width: 430px) {
        font-weight: 900;
        font-size: 18px;
      }
    }
    &:nth-child(2) {
      display: flex;
      align-items: center;
      color: #95fa31;
      font-family: "CKTKingkong";
      font-size: 2.5rem;
      font-style: normal;
      font-weight: 400;
      line-height: normal;

      > img {
        margin-left: 8px;
        width: 2.5rem;
        height: 2.5rem;
      }
      @media (max-width: 430px) {
        font-weight: 900;
        font-size: 14px;
        > img {
          width: 14px;
          height: 14px;
        }
      }
    }
  }
  @media (max-width: 650px) {
    > div {
      color: #fff;
      font-family: "Gen Shin Gothic P";
      font-size: 18px;
      font-style: normal;
      font-weight: 900;
      line-height: normal;
      &:first-child {
        margin-bottom: 5px;
      }
      span {
        color: #95fa31;
        font-family: "Gen Shin Gothic P";
        font-size: 18px;
        font-style: normal;
        font-weight: 900;
        line-height: normal;
      }
    }
  }
`;

const TipStyle = styled.div`
  font-size: 12px;
`;

export default function Rank() {
  const token = useSelector<any>((state) => state.token);
  const { t } = useTranslation();
  const web3React = useWeb3React();
  const { width } = useViewport();
  const Navigate = useNavigate();
  const [pageSize, setPageSize] = useState(10);
  const [pageNum, setPageNum] = useState(1);
  const [RecordList, setRecordList] = useState<any>({});
  const [MintRankPhase, setMintRankPhase] = useState<any>("");
  const [ReferRecordList, setReferRecordList] = useState<any>({});
  const [dataLoding, setDataLoding] = useState(true);

  const [ActiveTab, setActiveTab] = useState(1);
  const [SubActiveTab, setSubActiveTab] = useState(1);
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

  const getInitData = useCallback(async () => {
    let obj: any;
    // setRecordList({});
    setDataLoding(true);
    if (Number(ActiveTab) === 1) {
      if (Number(SubActiveTab) === 1) {
        obj = await mintRank({ pageNum, pageSize });
      } else if (Number(SubActiveTab) === 2) {
        obj = await mintRankCommunity({ pageNum: 1, pageSize: 10 });
      } else if (Number(SubActiveTab) === 3) {
        obj = await mintRankNode({ pageNum: 1, pageSize: 10 });
      }
    } else if (Number(ActiveTab) === 2) {
      obj = await teamRank({ pageNum, pageSize });
    } else if (Number(ActiveTab) === 3) {
      obj = await communityRank({ pageNum, pageSize });
    }
    if (obj?.code === 200) {
      setDataLoding(false);
      setRecordList(obj?.data);
    } else {
      setRecordList({});
    }
  }, [token, pageNum, pageSize, ActiveTab, SubActiveTab]);

  const getData = () => {
    lastReferee({ pageNum: 1, pageSize: 10 }).then((res: any) => {
      if (res.code === 200) {
        setReferRecordList(res.data || []);
      }
    });
    mintRankPhase({}).then((res: any) => {
      if (res.code === 200) {
        setMintRankPhase(res?.data?.mintIncomePhase || "");
      }
    });
  };

  useEffect(() => {
    if (token) {
      getInitData();
    } else {
      setDataLoding(false);
    }
  }, [token, pageNum, ActiveTab, SubActiveTab]);

  useEffect(() => {
    if (token) {
      getData();
    }
  }, [token]);

  useEffect(() => {
    if (
      i18n.language === "zh" &&
      document.getElementsByClassName("ant-pagination-options-quick-jumper")[0]
    ) {
      document.getElementsByClassName(
        "ant-pagination-options-quick-jumper"
      )[0].childNodes[0].nodeValue = "前往";
      document.getElementsByClassName(
        "ant-pagination-options-quick-jumper"
      )[0].childNodes[2].nodeValue = "頁";
    }
  }, [i18n.language]);

  return (
    <RankContainer>
      <RankBox>
        {width <= 768 && (
          <RankBox_Right src={rankBg}>
            <RankBox_Right_Title>{t("204")}</RankBox_Right_Title>
            <RankBox_Right_Content>
              {ReferRecordList?.list?.length > 0 ? (
                ReferRecordList?.list?.map((item: any, index: any) => (
                  <RankBox_Right_Content_Item key={index}>
                    <RankBox_Right_Content_Item_Left>
                      {/* <img src={avtorIcon} alt="" /> */}
                      <div>
                        {item?.userAddress}
                        <div>
                          {item?.refereeAddress} &nbsp;
                          {t("205")}
                        </div>
                      </div>
                    </RankBox_Right_Content_Item_Left>
                    <RankBox_Right_Content_Item_Right>
                      {/* {t("206", { num: 1 })} */}
                      {item?.refereeTime ?? "-"}
                    </RankBox_Right_Content_Item_Right>
                  </RankBox_Right_Content_Item>
                ))
              ) : (
                <Refresh_Invite_RecordTable_Content_NoData>
                  <NoData />
                </Refresh_Invite_RecordTable_Content_NoData>
              )}
            </RankBox_Right_Content>
          </RankBox_Right>
        )}
        <RankBox_Left>
          <EcologyBanner_Container src={intrenceBg}>
            <EcologyBanner_Box
              onClick={() => {
                Navigate("/View/FinalistRanking", {
                  state: { step: MintRankPhase ?? "" },
                });
              }}
            >
              <div>{t("531", { num: MintRankPhase ?? "" })}</div>
              <div>
                {t("536")} <img src={goToIcon} alt="" />
              </div>
            </EcologyBanner_Box>
          </EcologyBanner_Container>

          <RankBox_Left_Tab>
            <RankBox_Left_Tab_Item
              className={Number(ActiveTab) === 1 ? "activeTab" : ""}
              onClick={() => {
                setPageNum(1);
                setActiveTab(1);
              }}
            >
              {t("207")}
            </RankBox_Left_Tab_Item>
            <RankBox_Left_Tab_Item
              className={Number(ActiveTab) === 2 ? "activeTab" : ""}
              onClick={() => {
                setPageNum(1);
                setActiveTab(2);
              }}
            >
              {t("443")}
            </RankBox_Left_Tab_Item>
            <RankBox_Left_Tab_Item
              className={Number(ActiveTab) === 3 ? "activeTab" : ""}
              onClick={() => {
                setPageNum(1);
                setActiveTab(3);
              }}
            >
              {t("444")}
            </RankBox_Left_Tab_Item>
          </RankBox_Left_Tab>

          {Number(ActiveTab) === 1 && (
            <>
              <SubtabBox>
                <SubtabBox_Item
                  className={Number(SubActiveTab) === 1 ? "activeTab" : ""}
                  onClick={() => {
                    setPageNum(1);
                    setSubActiveTab(1);
                  }}
                >
                  {t("445")}
                </SubtabBox_Item>
                <SubtabBox_Item
                  className={Number(SubActiveTab) === 2 ? "activeTab" : ""}
                  onClick={() => {
                    setSubActiveTab(2);
                  }}
                >
                  {t("446")}
                </SubtabBox_Item>
                {/* <SubtabBox_Item
                  className={Number(SubActiveTab) === 3 ? "activeTab" : ""}
                  onClick={() => {
                    setSubActiveTab(3);
                  }}
                >
                  {t("447")}
                </SubtabBox_Item> */}
              </SubtabBox>
              {/* -*/}
              {Number(SubActiveTab) === 1 && (
                <RankBox_Left_Table_Content>
                  <RecordTable>
                    <PersonRank>
                      <div>{t("209")}</div>
                      <div>{t("210")}</div>
                      <div>{t("211")}</div>
                      <div>{t("585")}</div>
                    </PersonRank>
                    <RecordTable_Devider></RecordTable_Devider>
                    {!dataLoding ? (
                      RecordList?.list?.length > 0 ? (
                        <RecordTable_Content>
                          {RecordList?.list?.map((item: any, index: any) => (
                            <PersonRankContent key={index}>
                              <div>{item?.rank}</div>
                              <div>{item?.userAddress}</div>
                              <div>{item?.refereeAddress}</div>
                              <div>
                                {thousandsSeparator(item?.mintNum ?? "0")}
                              </div>
                            </PersonRankContent>
                          ))}
                        </RecordTable_Content>
                      ) : (
                        <Rank_RecordTable_Content_NoData>
                          <NoData />
                        </Rank_RecordTable_Content_NoData>
                      )
                    ) : (
                      <Rank_RecordTable_Content_NoData>
                        <PageLoding></PageLoding>
                      </Rank_RecordTable_Content_NoData>
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
                    <PaginationContainerTip>
                      ( {t("558")} )
                    </PaginationContainerTip>
                  </PaginationContainer>
                </RankBox_Left_Table_Content>
              )}
              {/* -*/}
              {Number(SubActiveTab) === 2 && (
                <RankBox_Left_Table_Content>
                  <RecordTable>
                    <PersonRank>
                      <div>{t("209")}</div>
                      <div>{t("448")}</div>
                      <div>{t("449")} </div>
                      <div>
                        {t("585")}
                        <MyToolTip
                          showArrow={width >= 650 ? true : false}
                          title={<TipStyle>{t("450")}</TipStyle>}
                        >
                          <img src={infoIcon} alt="" />
                        </MyToolTip>
                      </div>
                    </PersonRank>
                    <RecordTable_Devider></RecordTable_Devider>
                    {!dataLoding ? (
                      RecordList?.list?.length > 0 ? (
                        <RecordTable_Content>
                          {RecordList?.list?.map((item: any, index: any) => (
                            <PersonRankContent key={index}>
                              <div>{item?.rank}</div>
                              <div>{item?.name}</div>
                              <div>{item?.userAddress}</div>
                              <div>
                                &nbsp;{thousandsSeparator(item?.mintNum ?? "0")}
                              </div>
                            </PersonRankContent>
                          ))}
                        </RecordTable_Content>
                      ) : (
                        <Rank_RecordTable_Content_NoData>
                          <NoData />
                        </Rank_RecordTable_Content_NoData>
                      )
                    ) : (
                      <Rank_RecordTable_Content_NoData>
                        <PageLoding></PageLoding>
                      </Rank_RecordTable_Content_NoData>
                    )}
                  </RecordTable>
                </RankBox_Left_Table_Content>
              )}
              {/* -*/}
              {Number(SubActiveTab) === 3 && (
                <RankBox_Left_Table_Content>
                  <RecordTable1>
                    <RecordTable_Auto>
                      <TransferRecordTable_Title3>
                        <div>{t("209")}</div>
                        <div>{t("451")}</div>
                        <div>
                          {t("427")}{" "}
                          <MyToolTip
                            showArrow={width >= 650 ? true : false}
                            title={<TipStyle>{t("450")} </TipStyle>}
                          >
                            <img src={infoIcon} alt="" />
                          </MyToolTip>
                        </div>
                      </TransferRecordTable_Title3>
                      <RecordTable_Devider></RecordTable_Devider>
                      {!dataLoding ? (
                        RecordList?.list?.length > 0 ? (
                          <RecordTable_Content>
                            {RecordList?.list?.map((item: any, index: any) => (
                              <TransferRecordTable_Content_Item3 key={index}>
                                <div>{item?.rank}</div>
                                <div>{item?.userAddress}</div>
                                <div>
                                  {thousandsSeparator(item?.mintNum ?? "0")}
                                </div>
                              </TransferRecordTable_Content_Item3>
                            ))}
                          </RecordTable_Content>
                        ) : (
                          <Rank_RecordTable_Content_NoData>
                            <NoData />
                          </Rank_RecordTable_Content_NoData>
                        )
                      ) : (
                        <Rank_RecordTable_Content_NoData>
                          <PageLoding></PageLoding>
                        </Rank_RecordTable_Content_NoData>
                      )}
                    </RecordTable_Auto>
                  </RecordTable1>
                </RankBox_Left_Table_Content>
              )}
            </>
          )}

          {Number(ActiveTab) === 2 && (
            <RankBox_Left_Table_Content>
              <RecordTable>
                <TransferRecordTable_Title_Point>
                  <div>{t("209")}</div>
                  <div>{t("210")}</div>
                  <div>{t("211")}</div>
                  <div>{t("213")}</div>
                </TransferRecordTable_Title_Point>
                <RecordTable_Devider></RecordTable_Devider>
                {!dataLoding ? (
                  RecordList?.list?.length > 0 ? (
                    <RecordTable_Content>
                      {RecordList?.list?.map((item: any, index: any) => (
                        <TransferRecordTable_Content_Item_Point key={index}>
                          <div>{item?.rank}</div>
                          <div>{item?.userAddress}</div>
                          <div>{item?.refereeAddress}</div>
                          <div>
                            {thousandsSeparator(item?.creditNum ?? "0")}
                          </div>
                        </TransferRecordTable_Content_Item_Point>
                      ))}
                    </RecordTable_Content>
                  ) : (
                    <Rank_RecordTable_Content_NoData>
                      <NoData />
                    </Rank_RecordTable_Content_NoData>
                  )
                ) : (
                  <Rank_RecordTable_Content_NoData>
                    <PageLoding></PageLoding>
                  </Rank_RecordTable_Content_NoData>
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
                <PaginationContainerTip>( {t("558")} )</PaginationContainerTip>
              </PaginationContainer>
            </RankBox_Left_Table_Content>
          )}
          {Number(ActiveTab) === 3 && (
            <RankBox_Left_Table_Content>
              <RecordTable>
                <TransferRecordTable_Title>
                  <div>{t("195")}</div>
                  <div>{t("196")}</div>
                  <div>{t("217")}</div>
                </TransferRecordTable_Title>
                <RecordTable_Devider></RecordTable_Devider>
                {!dataLoding ? (
                  RecordList?.list?.length > 0 ? (
                    <RecordTable_Content>
                      {RecordList?.list?.map((item: any, index: any) => (
                        <TransferRecordTable_Content_Item key={index}>
                          <div>{item?.rank}</div>
                          <div>{item?.communityName}</div>
                          <div>{thousandsSeparator(item?.likeNum ?? "0")}</div>
                        </TransferRecordTable_Content_Item>
                      ))}
                    </RecordTable_Content>
                  ) : (
                    <Rank_RecordTable_Content_NoData>
                      <NoData />
                    </Rank_RecordTable_Content_NoData>
                  )
                ) : (
                  <Rank_RecordTable_Content_NoData>
                    <PageLoding></PageLoding>
                  </Rank_RecordTable_Content_NoData>
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
                <PaginationContainerTip>( {t("558")} )</PaginationContainerTip>
              </PaginationContainer>
            </RankBox_Left_Table_Content>
          )}
        </RankBox_Left>

        {width > 768 && (
          <RankBox_Right src={rankBg}>
            <RankBox_Right_Title>{t("204")}</RankBox_Right_Title>
            <RankBox_Right_Content>
              {ReferRecordList?.list?.length > 0 ? (
                ReferRecordList?.list?.map((item: any, index: any) => (
                  <RankBox_Right_Content_Item key={index}>
                    <RankBox_Right_Content_Item_Left>
                      {/* <img src={avtorIcon} alt="" /> */}
                      <div>
                        {item?.userAddress}
                        <div>
                          {item?.refereeAddress}
                          &nbsp; {t("205")}
                        </div>
                      </div>
                    </RankBox_Right_Content_Item_Left>
                    <RankBox_Right_Content_Item_Right>
                      {/* {t("206", {
                        num: parseInt(
                          (Number(item?.refereeTime) % (1000 * 60 * 60)) /
                            (1000 * 60) +
                            ""
                        ),
                      })} */}
                      {item?.refereeTime ?? "-"}
                    </RankBox_Right_Content_Item_Right>
                  </RankBox_Right_Content_Item>
                ))
              ) : (
                <Rank_Invite_RecordTable_Content_NoData>
                  <NoData />
                </Rank_Invite_RecordTable_Content_NoData>
              )}
            </RankBox_Right_Content>
          </RankBox_Right>
        )}
      </RankBox>
    </RankContainer>
  );
}
