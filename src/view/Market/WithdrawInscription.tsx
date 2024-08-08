import React, { useState, useEffect, useRef } from "react";
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
} from "../../components/FlexBox/index";
import { useViewport } from "../../components/viewportContext";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import closeIcon from "../../assets/image/closeIcon.svg";

import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AddrHandle, addMessage, showLoding } from "../../utils/tool";
import { myMint, transfer } from "../../API";
import ItemBg from "../../assets/image/Market/ItemBg.gif";
import { SuccessIcon, sbBack } from "../../assets/image/MintBox";
import backgrounds from "../../assets/image/Mint/modalBack.png";

import { ReturnIcon } from "../../assets/image/MarketBox";
import { Contracts } from "../../web3";
import Web3 from "web3";
import i18n from "../../lang/i18n";
import { SwapBox_Container_Devider } from "../Swap";
import {
  Rank_RecordTable_Content_NoData,
  RecordTable_Content,
  RecordTable_Devider,
  TransferRecordTable_Content_Item3,
  TransferRecordTable_Title3,
} from "../Rank";
import NoData from "../../components/NoData";
import PageLoding from "../../components/PageLoding";
import TipForSuccessModal from "../../components/TipForSuccessModal";
const web3 = new Web3();

export const Btn = styled(FlexCCBox)`
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
export const TransferInfoModal = styled(PurchaseModal)`
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

const PurchaseModal_Content = styled(FlexSBCBox)`
  width: 100%;
  max-width: 1200px;
  margin: 0px auto;
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
const PurchaseModal_Content1 = styled(PurchaseModal_Content)`
  display: block;
  margin-top: 3.33rem;

  > div {
    width: 100%;
  }
`;
const RecordTable1_Title = styled.div`
  width: 100%;
  color: #fff;
  font-family: "CKTKingkong";
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 23px;
`;

const PurchaseModal_Content_Left = styled(FlexCCBox)`
  position: relative;
  border-radius: 1.5rem;
  padding: 1.04rem;
  border: 1px solid #f6f022;
  > img {
    width: 100%;
  }

  @media (max-width: 650px) {
    padding: 11px;
    margin-bottom: 20px;
  }
`;

const PurchaseModal_Content_Right = styled(FlexBox)`
  width: 100%;
  flex-direction: column;
  align-items: center;
`;

const SuccessfulModal_Content = styled(FlexBox)`
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
`;

export const InputModal_Content = styled(SuccessfulModal_Content)`
  margin-top: 30px;

  > div {
    margin-bottom: 30px;
  }
`;

export const SuccessfulModal_Content_Item = styled(FlexSBCBox)`
  width: 100%;
  color: #fff;
  font-family: "CKTKingkong";
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  white-space: nowrap;
  > input {
    margin-left: 4px;
    flex: 1;
    padding: 18px 28px;
    border-radius: 40px;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 5px 5px 10px 0px #000 inset,
      -3px -3px 5px 0px rgba(255, 255, 255, 0.2) inset;
    backdrop-filter: blur(28.5px);
    border: none;
  }

  @media (max-width: 650px) {
    font-size: 12px;
    > input {
      padding: 12px;
      font-size: 12px;
    }
  }
`;

export const ConfirmBtn = styled(Btn)`
  max-width: 124px;
  color: #000 !important;
  font-family: "CKTKingkong";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
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

const MintTitleModal = styled(TitleModal)`
  font-size: 24px;

  @media (max-width: 650px) {
    font-size: 4.5rem;
  }
`;

export const MintTitleModal_InfoModal = styled(MintTitleModal)`
  margin-top: 18px;
`;

const ChainTag = styled(FlexCCBox)<{ color: string }>`
  position: absolute;
  top: 1.04rem;
  left: 1.04rem;
  border-radius: 40px;
  background: #1b1b1b;
  color: ${({ color }) => color};
  text-align: center;
  font-family: "CKTKingkong";
  font-size: 24.5px;
  font-weight: 400;
  line-height: 1;
  z-index: 2;
  @media (max-width: 650px) {
    top: 11px;
    left: 11px;
  }
`;

const WithDrawBox_Container = styled(FlexBox)<{ src: any }>`
  width: 100%;
  flex-direction: column;
  align-items: center;
  background: transparent;
  background-image: ${({ src }) => `url(${src})`};
  background-size: 100% 100%;
  background-repeat: no-repeat;
`;

const WithDrawBox_Title = styled.div`
  padding: 40px 70px;
  width: 100%;
  font-family: "CKTKingkong";
  font-size: 30px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  background: linear-gradient(111deg, #f6f022 0%, #95fa31 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const WithDrawBox_Content = styled(FlexBox)`
  padding: 40px 60px;
  width: 100%;
  flex-direction: column;
  align-items: center;
  background: transparent;
  > div {
    &:nth-child(1) {
      margin-bottom: 30px;
    }
    &:nth-child(2) {
      margin-bottom: 20px;
    }
  }
`;

const WithDrawBox_Input_Item = styled.div`
  width: 100%;
  color: #fefefe;
  font-family: "CKTKingkong";
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const Input_Item = styled(FlexSBCBox)`
  margin-top: 8px;
  color: #fff;
  text-align: right;
  font-family: "CKTKingkong";
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  padding: 28px 30px;
  border-radius: 40px;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 5px 5px 10px 0px #000 inset,
    -3px -3px 5px 0px rgba(255, 255, 255, 0.2) inset;
  backdrop-filter: blur(28.5px);
  > div {
    color: #fff;
    text-align: right;
    font-family: "CKTKingkong";
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  > input {
    color: #fefefe;
    font-family: "CKTKingkong";
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    background: transparent;
    border: none;
  }
`;

const WithDrawBox_Balance = styled.div`
  width: 100%;
  color: rgba(254, 254, 254, 0.8);
  font-family: "CKTKingkong";
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const WithdrawBtn = styled(Btn)`
  width: 100%;
  max-width: 362px;
  margin: 40px 0px;
`;

const RecordTable1 = styled.div`
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

  /* -*/
  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10.9992px;
  }

  @media (max-width: 768px) {
    margin-top: 5rem;
  }
`;

const RecordTable_Auto = styled.div``;

export default function Community() {
  const token = useSelector<any>((state) => state.token);
  const { t } = useTranslation();
  const web3React = useWeb3React();
  const { width } = useViewport();
  const Navigate = useNavigate();
  const [TransferItemModal, setTransferItemModal] = useState(false);
  const [TransferSuccessModal, setTransferSuccessModal] = useState(false);
  const [InputTransferInfo, setInputTransferInfo] = useState<any>({});
  const scrollContainerRef = useRef<any>(null);
  const [MyListAmount, setMyListAmount] = useState(0);
  const [dataLoding, setDataLoding] = useState(true);

  // const {
  //   state: { currentItem },
  // } = useLocation();

  let textType = {
    1: { name: "306" },
    2: { name: "306" },
  };

  const transferInfo = (type: string, value: any) => {
    setInputTransferInfo({ ...InputTransferInfo, [type]: value });
  };

  const transferFun = async () => {
    if (!token && InputTransferInfo?.mintNum) return;
    let tag = await web3.utils.isAddress(InputTransferInfo?.toAddress);
    if (!tag) return addMessage(t("310"));
    let item: any;
    try {
      item = await transfer(InputTransferInfo);
      console.log(item, "transfer");
    } catch (error: any) {
      return addMessage("error");
    }
    if (item?.code === 200) {
      showLoding(true);
      let res: any;
      try {
        res = await Contracts?.example?.sendTransaction(
          web3React?.account as string,
          item?.data?.toAddress,
          item?.data?.mintJsonHex
        );
      } catch (error: any) {}

      showLoding(false);
      if (!!res?.status) {
        setTransferItemModal(false);
        getMyInitData();
        return setTransferSuccessModal(true);
      } else {
        return addMessage(t("311"));
      }
    } else {
      showLoding(false);
      return addMessage(item?.msg);
    }
  };

  const getMyInitData = async () => {
    let myList = await myMint({});

    if (!!myList?.data) {
      setMyListAmount(myList?.data?.mintNum || 0);
    }
  };

  useEffect(() => {
    if (token) {
      getMyInitData();
    }
  }, [token]);

  return (
    <CommunityContainer ref={scrollContainerRef}>
      <ReturnBox
        onClick={() => {
          Navigate(-1);
        }}
      >
        <ReturnIcon />
        {t("314")}
      </ReturnBox>

      <PurchaseModal_Content>
        <PurchaseModal_Content_Left>
          <ChainTag color={"#F7931A"}>BTC</ChainTag>
          <img
            src={
              "https://inscriptionalliance.com/download/inscription/image/web/ItemBg.gif"
            }
            alt=""
          />
        </PurchaseModal_Content_Left>

        <PurchaseModal_Content_Right>
          <WithDrawBox_Container src={backgrounds}>
            <WithDrawBox_Title>{t("509")}</WithDrawBox_Title>
            <SwapBox_Container_Devider />
            <WithDrawBox_Content>
              <WithDrawBox_Input_Item>
                {t("510")}
                <Input_Item>
                  <input type="number" value={0} />
                  <div>{t("511")}</div>
                </Input_Item>
              </WithDrawBox_Input_Item>
              <WithDrawBox_Input_Item>
                {t("512")}
                <Input_Item>
                  <input type="text" placeholder={t("513")} />
                </Input_Item>
              </WithDrawBox_Input_Item>
              <WithDrawBox_Balance>{t("514")}：100STAS</WithDrawBox_Balance>
              <WithdrawBtn>{t("509")}</WithdrawBtn>
            </WithDrawBox_Content>
          </WithDrawBox_Container>
        </PurchaseModal_Content_Right>
      </PurchaseModal_Content>

      <PurchaseModal_Content1>
        <RecordTable1_Title>{t("515")}</RecordTable1_Title>
        <RecordTable1>
          <RecordTable_Auto>
            <TransferRecordTable_Title3>
              <div>{t("516")}</div>
              <div>{t("480")}</div>
              <div>{t("517")}</div>
              <div>{t("518")}</div>
              <div>{t("519")}</div>
              <div>{t("520")}</div>
            </TransferRecordTable_Title3>
            <RecordTable_Devider></RecordTable_Devider>
            {!false ? (
              // {!dataLoding ? (
              [1, 2, 3]?.length > 0 ? (
                <RecordTable_Content>
                  {[1, 2, 3]?.map((item: any, index: any) => (
                    <TransferRecordTable_Content_Item3 key={index}>
                      <div>{"2023.01.05"}</div>
                      <div>{"HDSAJs.....15ad1s"}</div>
                      <div>{"HDSAJs.....15ad1s"}</div>
                      <div>SATS</div>
                      <div>1000</div>
                      <div>{t("521")}</div>
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
      </PurchaseModal_Content1>

      {/* -*/}
      <TipForSuccessModal
        show={false}
        close={() => {}}
        tip={t("521")}
      ></TipForSuccessModal>
    </CommunityContainer>
  );
}
