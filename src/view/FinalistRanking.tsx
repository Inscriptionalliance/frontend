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
import { useLocation, useNavigate } from "react-router-dom";
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
import SearchIcon from "../assets/image/Market/SearchIcon.svg";

import i18n from "../lang/i18n";
import {
  communityRank,
  lastReferee,
  mintRank,
  mintRankCommunity,
  mintRankCommunitySelectedRank,
  mintRankNode,
  mintRankNodeSelectedRank,
  mintRankPhase,
  teamRank,
} from "../API";
import PageLoding from "../components/PageLoding";
import { ReturnIcon } from "../assets/image/MarketBox";
import { throttle } from "lodash";

export const RankContainer = styled.div`
  /* padding: 5.67rem 0px; */
  width: 100%;
  max-width: 1200px;
  padding: 0px 50px;

  @media (max-width: 1400px) {
    padding: 20px;
  }
`;

const RankBox = styled.div`
  width: 100%;
`;
const RankBox_Left_Tab = styled(FlexSCBox)`
  width: 100%;
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  > div {
    color: #808080;
    font-family: "CKTKingkong";
    font-size: 2.5rem;
    font-style: normal;
    font-weight: 400;
    line-height: 2.5rem;
    text-transform: uppercase;
  }
  .activeTab {
    color: #fff;
    font-family: "CKTKingkong";
    font-size: 2.5rem;
    font-style: normal;
    font-weight: 400;
    line-height: 2.5rem;
  }
  @media (max-width: 768px) {
    margin-bottom: 16px;
    > div {
      font-size: 18px;
      line-height: 18px;
    }
    .activeTab {
      font-size: 18px;
      line-height: 18px;
    }
  }
  @media (max-width: 375px) {
    margin-bottom: 16px;
    > div {
      font-size: 14px;
    }
    .activeTab {
      font-size: 14px;
    }
  }
`;
const RankBox_Left_Tab_Item = styled(FlexCCBox)`
  margin-right: 5.67rem;
  @media (max-width: 768px) {
    margin-right: 3rem;
  }
`;

const RankBox_Left_Table_Content = styled(FlexBox)`
  width: 100%;
  flex-direction: column;
  align-items: center;
`;

export const RecordTable = styled.div`
  margin-top: 40px;
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
  @media (max-width: 768px) {
    margin-top: 5rem;
  }
`;
export const RecordTable1 = styled.div`
  margin-top: 40px;
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
  min-width: 340px;
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
      @media (max-width: 650px) {
        justify-content: flex-start;
        flex: auto;
        max-width: 80px;
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

const MyToolTip = styled(Tooltip)`
  margin-left: 8px;
  position: relative;

  @media (max-width: 768px) {
    width: 16px;
    margin-left: 3px;
  }
`;

export const Rank_RecordTable_Content_NoData = styled(
  RecordTable_Content_NoData
)`
  padding: 11rem 0px;
`;

const ReturnBox = styled(FlexBox)`
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  color: #fff;
  font-family: CKTKingkong;
  font-size: 30px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 50px;
  > svg {
    margin-right: 20px;
    width: 40px;
    height: 40px;
  }

  @media (max-width: 768px) {
    font-size: 18px;
    margin-bottom: 16px;
    line-height: 18px;
    > svg {
      width: 24px;
      height: 24px;
      margin-right: 4px;
    }
  }
`;
const SearchBox = styled(FlexBox)`
  width: 100%;
  /* max-width: 430px; */
`;

const InputBox = styled(FlexSBCBox)`
  width: 100%;
  padding: 11px 27px;
  color: rgba(255, 255, 255, 0.6);
  font-family: "CKTKingkong";
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 5px 5px 10px 0px #000 inset,
    -3px -3px 5px 0px rgba(255, 255, 255, 0.2) inset;
  backdrop-filter: blur(28px);

  > input {
    width: 100%;
    color: rgba(255, 255, 255, 0.6);
    font-family: "CKTKingkong";
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
  img {
    width: 30px;
    height: 30px;
  }
  @media (max-width: 1440px) {
    > input {
      font-size: 2.5rem;
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    margin-right: 0px;
    display: inline-flex;
    height: 40px;
    padding: 11px 20px;
    justify-content: center;
    align-items: flex-start;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 2.359px 2.359px 4.719px 0px #000 inset,
      -1.416px -1.416px 2.359px 0px rgba(255, 255, 255, 0.2) inset;
    backdrop-filter: blur(13.212646484375px);

    > input {
      font-size: 12px;
    }
    > img {
      width: 18px;
      height: 18px;
    }
  }
`;

const ManageContent = styled(FlexSBCBox)`
  width: 100%;
  @media (max-width: 768px) {
    display: block;
  }
`;

const TipStyle = styled.div`
  font-size: 12px;
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

let intervalRecordItem: any;
export default function Rank() {
  const token = useSelector<any>((state) => state.token);
  const { t } = useTranslation();
  const web3React = useWeb3React();
  const { width } = useViewport();
  const Navigate = useNavigate();

  const [pageSize, setPageSize] = useState(10);
  const [pageNum, setPageNum] = useState(1);
  const [RecordList, setRecordList] = useState<any>({});
  const [dataLoding, setDataLoding] = useState(true);
  const [MintRankPhase, setMintRankPhase] = useState<any>("");
  const [ChartString, setChartString] = useState<any>("");

  const [ActiveTab, setActiveTab] = useState(1);
  const inputRef = useRef<any>(null);

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

  const getInitData = async (value: any = "") => {
    let obj: any;
    setDataLoding(true);
    if (Number(ActiveTab) === 1) {
      obj = await mintRankCommunitySelectedRank({
        pageNum,
        pageSize,
        name: value,
      });
    } else if (Number(ActiveTab) === 2) {
      obj = await mintRankNodeSelectedRank({
        pageNum,
        pageSize,
        userAddress: value,
      });
    }
    if (obj?.code === 200) {
      setDataLoding(false);
      setRecordList(obj?.data);
    } else {
      setRecordList({});
    }
  };

  // -int-
  const getMintRecord = async () => {
    intervalRecordItem = setInterval(async () => {
      try {
        getInitData(ChartString);
      } catch (error: any) {}
    }, 60000);
  };

  const getData = () => {
    mintRankPhase({}).then((res: any) => {
      if (res.code === 200) {
        setMintRankPhase(res?.data?.mintIncomePhase || "");
      }
    });
  };

  const searchFun = throttle((chart: any) => {
    setChartString(chart);
  }, 2000);

  useEffect(() => {
    if (token) {
      getInitData(ChartString);
      getMintRecord();
    } else {
      setDataLoding(false);
    }
    return () => {
      clearInterval(intervalRecordItem);
    };
  }, [token, pageNum, ActiveTab, ChartString]);

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
      <ReturnBox
        onClick={() => {
          Navigate(-1);
        }}
      >
        <ReturnIcon />
        {t("531", { num: MintRankPhase ?? " " })}
        {/* {t("-, { num: step ?? 0 })} */}
      </ReturnBox>
      <RankBox>
        <ManageContent>
          <RankBox_Left_Tab>
            <RankBox_Left_Tab_Item
              className={Number(ActiveTab) === 1 ? "activeTab" : ""}
              onClick={() => {
                setPageNum(1);
                setActiveTab(1);
                setChartString("");
              }}
            >
              {t("532")}
            </RankBox_Left_Tab_Item>
            <RankBox_Left_Tab_Item
              className={Number(ActiveTab) === 2 ? "activeTab" : ""}
              onClick={() => {
                setPageNum(1);
                setActiveTab(2);
                setChartString("");
              }}
            >
              {t("533")}
            </RankBox_Left_Tab_Item>
          </RankBox_Left_Tab>
          <SearchBox>
            <InputBox>
              <input
                type="text"
                placeholder={Number(ActiveTab) === 1 ? t("534") : t("535")}
                value={ChartString}
                onChange={(e: any) => searchFun(e?.target?.value)}
              />
              <img src={SearchIcon} alt="" />
            </InputBox>
          </SearchBox>
        </ManageContent>

        {Number(ActiveTab) === 1 && (
          <>
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
                          <div>{thousandsSeparator(item?.mintNum ?? "0")}</div>
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
              </PaginationContainer>
            </RankBox_Left_Table_Content>
          </>
        )}

        {Number(ActiveTab) === 2 && (
          <RankBox_Left_Table_Content>
            <RecordTable1>
              {/* <RecordTable_Auto> */}
              <TransferRecordTable_Title3>
                <div>{t("209")}</div>
                <div>{t("451")}</div>
                <div>
                  {t("585")}{" "}
                  <MyToolTip
                    showArrow={width >= 650 ? true : false}
                    title={t("450")}
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
                        <div>{thousandsSeparator(item?.mintNum ?? "0")}</div>
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
              {/* </RecordTable_Auto> */}
            </RecordTable1>

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
        )}
      </RankBox>
    </RankContainer>
  );
}
