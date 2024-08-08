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
import { AddrHandle, addMessage, showLoding } from "../../utils/tool";
import {
  communityLike,
  communityList,
  myMint,
  teamInfo,
  transfer,
  withdraw,
} from "../../API";
import { throttle } from "lodash";
import {
  setCreditAction,
  setFreeCodeAction,
  setMintFeeAction,
} from "../../store/actions";
import ItemBg from "../../assets/image/Market/ItemBg.gif";
import { BNBIcon, SuccessIcon, sbBack } from "../../assets/image/MintBox";
import { ReturnIcon } from "../../assets/image/MarketBox";
import BTIAToken from "../../assets/image/Swap/BTIAToken.svg";

import { Contracts } from "../../web3";
import Web3 from "web3";
import { JsonBox_Left, JsonBox_Right } from "../Market";
import i18n from "../../lang/i18n";
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
  cursor: pointer;
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
  max-width: 1200px;
  > div {
    margin-bottom: 25px;
  }
  /* overflow: auto; */
  /* height: 100%; */
  /* @media (min-width: 1920px) {
    max-width: 1200px;
  } */
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

const BuyBtn = styled(Btn)`
  text-align: center;
  width: 100%;
  /* border-radius: 1.16667rem;
  background: linear-gradient(0deg, #95fa31 0.01%, #f6f022 99.99%);
  box-shadow: 6px 10px 0px 0px #4a8e00; */
  @media (max-width: 650px) {
    padding: 8px;
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 7rem;
    }
    > span {
      font-size: 20px;
      > img {
        width: 24px;
      }
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

const BtnContainer = styled(FlexSBCBox)`
  width: 100%;
  > div {
    width: 45%;
  }
  @media (max-width: 650px) {
    color: #000;
    font-family: "Gen Shin Gothic P";
    font-size: 14px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
  }
`;

const BtnContainer_BTC = styled(BtnContainer)`
  > div {
    width: 28%;
  }
`;

const CancelContainer = styled.div`
  display: block !important;
  padding: 24px 30px;
  width: 100%;
  border-radius: 40px;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 5px 5px 10px 0px #000 inset,
    -3px -3px 5px 0px rgba(255, 255, 255, 0.2) inset;
  backdrop-filter: blur(28.5px);
  @media (max-width: 650px) {
    padding: 12px;
    border-radius: 18px;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 2.359px 2.359px 4.719px 0px #000 inset,
      -1.416px -1.416px 2.359px 0px rgba(255, 255, 255, 0.2) inset;
    backdrop-filter: blur(13.212646484375px);
  }
`;

const CancelContainer_Title = styled(FlexSBCBox)`
  width: 100%;
  > div {
    color: rgba(255, 255, 255, 0.6);
    font-family: CKTKingkong;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  @media (max-width: 650px) {
    > div {
      font-size: 12px;
    }
  }
`;

const CancelContainer_Content = styled(CancelContainer_Title)`
  margin: 20px 0px 30px;
  > div {
    color: #fff;
    font-family: CKTKingkong;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    > img {
      width: 26px;
      margin-right: 10px;
    }
  }
  @media (max-width: 650px) {
    margin: 8px 0px 24px;
    > div {
      font-size: 14px;
    }
    > img {
      width: 16px;
    }
  }
`;

const CancelBtn = styled(Btn)`
  margin: 0px auto;
  max-width: 362px;
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
    font-size: 3.75rem;
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
  const {
    state: { currentItem },
  } = useLocation();

  let textType = {
    1: { name: "306" },
    2: { name: "306" },
  };

  const langArr = {
    zh: { c1: "您可以在", c2: "我的銘文", c3: "頁面查看銘文情況。" },
    en: {
      c1: "You can view the inscription status on ",
      c2: "my inscription page.",
      c3: "",
    },
    ja: {
      c1: "ページで銘文の状況を確認できます ",
      c2: "マイ銘文。",
      c3: "",
    },
    fr: {
      c1: "Vous pouvez consulter l'état",
      c2: "des inscriptions ",
      c3: "sur la page de mes inscriptions. ",
    },
    ko: {
      c1: "페이지에서 명문 상태를 확인할 수 있습니다",
      c2: "내 명문.",
      c3: "",
    },
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

  const cancelFun = async () => {
    if (!token) return;
    let item: any;
    try {
      item = await withdraw({ id: currentItem?.id });
      console.log(item, "item");
    } catch (error: any) {
      return addMessage("error");
    }
    if (item?.code === 200) {
      showLoding(true);

      let res: any = await Contracts?.example?.cancle(
        web3React?.account as string,
        item?.data?.sign,
        item?.data?.amount
      );
      showLoding(false);
      if (!!res?.status) {
        return addMessage(t("312"));
      } else {
        return addMessage(t("313"));
      }
    } else {
      showLoding(false);
      return addMessage(item?.msg);
    }
  };

  const InscriptionDetail = () => {
    // bsc
    if (true)
      return (
        <PurchaseModal_Content_Right>
          <div>
            {t("539")} <span> {currentItem?.id ?? "-"}</span>{" "}
          </div>
          <div>
            {t("315")} <span>BTIA</span>{" "}
          </div>
          <div>
            {t("316")} <span>{AddrHandle(currentItem?.userAddress, 6, 6)}</span>{" "}
          </div>
          <div>
            {t("317")}{" "}
            <span>{t(textType[currentItem?.fileType ?? 1]?.name ?? "1")}</span>{" "}
          </div>

          <div>
            {t("318")} <span>{currentItem?.accord ?? "-"}</span>{" "}
          </div>
          <div>
            {t("319")}{" "}
            <span>
              {MyListAmount ?? 0} <img src={BTIAToken} alt="" />
            </span>{" "}
          </div>
          <div>
            {t("540")} <span>{currentItem?.createTime ?? "-"}</span>{" "}
          </div>
          <div>
            {t("541")}{" "}
            <span>{AddrHandle(currentItem?.hash, 6, 10) ?? "-"}</span>{" "}
          </div>
          <div>
            {t("542")} <span>{currentItem?.blockNum ?? 0}</span>{" "}
          </div>
          <div>
            {t("543")}{" "}
            <span>{AddrHandle(currentItem?.deployAddress, 6, 6) ?? "-"}</span>{" "}
          </div>
          <BtnContainer>
            <BuyBtn
              onClick={() => {
                return addMessage(t("Open soon"));
                Navigate("/View/Market/3");
              }}
            >
              {t("320")}
            </BuyBtn>
            <BuyBtn
              onClick={() => {
                setTransferItemModal(true);
              }}
            >
              {t("321")}
            </BuyBtn>
          </BtnContainer>
        </PurchaseModal_Content_Right>
      );
    // btc
    if (false)
      return (
        <PurchaseModal_Content_Right>
          <div>
            {t("315")} <span>ID:{currentItem?.id ?? "-"}</span>{" "}
          </div>
          <div>
            {t("316")} <span>{AddrHandle(currentItem?.userAddress, 6, 6)}</span>{" "}
          </div>
          <div>
            {t("317")}{" "}
            <span>{t(textType[currentItem?.fileType ?? 1]?.name ?? "1")}</span>{" "}
          </div>

          <div>
            {t("318")} <span>{currentItem?.accord ?? "-"}</span>{" "}
          </div>
          <div>
            {t("319")}{" "}
            <span>
              {MyListAmount ?? 0} <img src={BNBIcon} alt="" />
            </span>{" "}
          </div>
          <BtnContainer_BTC>
            <BuyBtn
              onClick={() => {
                return addMessage(t("Open soon"));
                Navigate("/View/Market/3");
              }}
            >
              {t("507")}
            </BuyBtn>
            <BuyBtn
              onClick={() => {
                setTransferItemModal(true);
              }}
            >
              {t("508")}
            </BuyBtn>
            <BuyBtn
              onClick={() => {
                setTransferItemModal(true);
              }}
            >
              {t("509")}
            </BuyBtn>
          </BtnContainer_BTC>
        </PurchaseModal_Content_Right>
      );
  };

  useEffect(() => {
    if (token) {
      getMyInitData();
    }
  }, [token]);

  const SplitJsonFun = (jsonData: any) => {
    return Object?.keys(jsonData).map((key, index) => (
      <JsonDiv key={index}>
        "{key}": "{jsonData[key]}"
        {Number(Object?.keys(jsonData)?.length) - 1 !== Number(index) && ","}
      </JsonDiv>
    ));
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
        {t("314")}
      </ReturnBox>

      <PurchaseModal_Content>
        <PurchaseModal_Content_Left>
          {false && <ChainTag color={"#F7931A"}>BTC</ChainTag>}
          {true && <ChainTag color={"#F3BA2F"}>BNB</ChainTag>}
          <img
            src={
              "https://inscriptionalliance.com/download/inscription/image/web/ItemBg.gif"
            }
            alt=""
          />
        </PurchaseModal_Content_Left>
        {!currentItem?.hangSaleHash ? (
          // bsc/btc-

          InscriptionDetail()
        ) : (
          <PurchaseModal_Content_Right>
            <div>
              {t("315")} <span>ID:{currentItem?.id ?? "-"}</span>{" "}
            </div>
            <div>
              {t("316")}{" "}
              <span>{AddrHandle(currentItem?.userAddress, 6, 6) ?? "-"}</span>{" "}
            </div>
            <div>
              {t("317")}{" "}
              <span>{textType[currentItem?.fileType ?? 1]?.name ?? "-"}</span>{" "}
            </div>
            <div>
              {t("322")} <span>{currentItem?.mintNum ?? 0}</span>{" "}
            </div>

            <div>
              {t("323")}{" "}
              <span>{AddrHandle(currentItem?.hangSaleHash, 6, 6) ?? "-"}</span>{" "}
            </div>
            <div>
              {t("324")}{" "}
              <span>
                {currentItem?.unitPrice ?? 0} <img src={BNBIcon} alt="" />
              </span>{" "}
            </div>

            <CancelContainer>
              <CancelContainer_Title>
                <div>{t("325")}</div>
                <div>{t("326")}</div>
              </CancelContainer_Title>

              <CancelContainer_Content>
                <div>
                  <img src={BNBIcon} alt="" />
                  {currentItem?.totalPrice ?? 0}BNB
                </div>
                <div>{currentItem?.createTime ?? "-"}</div>
              </CancelContainer_Content>
              <CancelBtn
                onClick={() => {
                  cancelFun();
                }}
              >
                {t("327")}
              </CancelBtn>
            </CancelContainer>
          </PurchaseModal_Content_Right>
        )}
      </PurchaseModal_Content>

      <InfoModal
        visible={TransferSuccessModal}
        className="Modal"
        centered
        width={440}
        closable={false}
        footer={null}
        onCancel={() => {
          setTransferSuccessModal(false);
        }}
        src={sbBack}
      >
        <div
          className="close"
          onClick={() => {
            setTransferSuccessModal(false);
          }}
        >
          <img src={closeIcon} alt="" />
        </div>
        <MintTitleModal>{t("328")}</MintTitleModal>

        <SuccessfulModal_Content>
          <SuccessIcon />

          <div>
            {langArr[i18n.language].c1}{" "}
            <span
              onClick={() => {
                Navigate("/View/Market/1", { state: { tabIndex: 2 } });
              }}
            >
              {langArr[i18n.language].c2}
            </span>{" "}
            {langArr[i18n.language].c3}
          </div>
        </SuccessfulModal_Content>
      </InfoModal>

      <InfoModal
        visible={TransferItemModal}
        className="Modal"
        centered
        width={510}
        closable={false}
        footer={null}
        onCancel={() => {
          setTransferItemModal(false);
        }}
        src={sbBack}
      >
        <div
          className="close"
          onClick={() => {
            setTransferItemModal(false);
          }}
        >
          <img src={closeIcon} alt="" />
        </div>
        <MintTitleModal_InfoModal>{t("321")}</MintTitleModal_InfoModal>

        <InputModal_Content>
          <div>{t("329")}</div>
          <SuccessfulModal_Content_Item>
            {t("330")}{" "}
            <input
              type="text"
              placeholder={t("331")}
              onChange={(e: any) => {
                transferInfo("toAddress", e.target.value);
              }}
            />
          </SuccessfulModal_Content_Item>
          <SuccessfulModal_Content_Item>
            {t("332")}{" "}
            <input
              type="number"
              min={0}
              placeholder={t("333")}
              onChange={(e: any) => {
                transferInfo("mintNum", e.target.value);
              }}
            />
          </SuccessfulModal_Content_Item>

          <ConfirmBtn
            onClick={() => {
              return addMessage(t("Open soon"));
              transferFun();
            }}
          >
            {t("Confirm")}
          </ConfirmBtn>
        </InputModal_Content>
      </InfoModal>
    </CommunityContainer>
  );
}
