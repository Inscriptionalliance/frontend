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
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import closeIcon from "../../assets/image/closeIcon.svg";

import NoData from "../../components/NoData";
import { Dropdown, Menu, Modal, Pagination, PaginationProps } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AddrHandle, EtherFun, addMessage, showLoding } from "../../utils/tool";
import { communityLike, communityList, hangSale, teamInfo } from "../../API";
import { throttle } from "lodash";
import {
  setCreditAction,
  setFreeCodeAction,
  setMintFeeAction,
} from "../../store/actions";
import ItemBg from "../../assets/image/Market/ItemBg.gif";
import { SuccessIcon, sbBack } from "../../assets/image/MintBox";
import { InfoModalBg, ReturnIcon } from "../../assets/image/MarketBox";
import { Btn, InfoModal } from "./InscriptionDetail";
import { Contracts } from "../../web3";
import i18n from "../../lang/i18n";

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
const ReturnBox = styled(FlexBox)`
  justify-content: flex-start;
  align-items: center;
  color: #fff;
  font-family: "CKTKingkong";
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

const BuyBtn = styled(Btn)`
  width: 100%;
  padding: 15px;
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
    width: 100%;

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
`;

const BtnContainer = styled(FlexSBCBox)`
  width: 100%;
  @media (max-width: 650px) {
    max-width: 260px;
  }
`;
const InputItem = styled.div`
  > div {
    width: 100%;
    color: #fff;
    font-family: CKTKingkong;
    font-size: 26px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  input {
    color: rgba(255, 255, 255, 0.8);
    font-family: CKTKingkong;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    /* line-height: normal; */
    margin-top: 12px;
    width: 100%;
    border-radius: 55px;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 5px 5px 10px 0px #000 inset,
      -3px -3px 5px 0px rgba(255, 255, 255, 0.2) inset;
    backdrop-filter: blur(28.5px);
    border: none;
    padding: 24px 30px;
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
    > div {
      color: #fff;
      font-family: "Gen Shin Gothic P";
      font-size: 18px;
      font-style: normal;
      font-weight: 900;
      line-height: normal;
    }
    input {
      width: 100%;
      border-radius: 34px;
      padding: 12px;
      background: rgba(255, 255, 255, 0.1);
      box-shadow: 2.359px 2.359px 4.719px 0px #000 inset,
        -1.416px -1.416px 2.359px 0px rgba(255, 255, 255, 0.2) inset;
      backdrop-filter: blur(13.212646484375px);
      color: rgba(255, 255, 255, 0.6);
      font-family: "Gen Shin Gothic P";
      font-size: 10px;
      font-style: normal;
      font-weight: 900;
      line-height: normal;
    }
  }
`;

export default function Community() {
  const token = useSelector<any>((state) => state.token);
  const { t } = useTranslation();
  const web3React = useWeb3React();
  const { width } = useViewport();
  const Navigate = useNavigate();
  const [InputObj, setInputObj] = useState<any>({
    totalPrice: 0,
    accord: "bsc-20",
    mintNum: 0,
  });
  const [PageNum, setPageNum] = useState(1);
  const [SaleItemModal, setSaleItemModal] = useState(false);
  const scrollContainerRef = useRef<any>(null);
  const [ActiveFlterItem, setActiveFlterItem] = useState(1);

  const inputObjFun = (name: string, value: any) => {
    let obj = { ...InputObj, [name]: value };
    console.log(obj, "obj");

    setInputObj(obj);
  };

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

  const getInitData = async () => {};

  const SaleFun = async () => {
    if (!token) return;
    if (Number(InputObj?.mintNum) <= 0) return addMessage(t("334"));
    let item: any;
    try {
      item = await hangSale(InputObj);
      console.log(item, "item");
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
        getInitData();
        return setSaleItemModal(true);
      } else {
        return addMessage(t("335"));
      }
    } else {
      showLoding(false);
      return addMessage(item?.msg);
    }
  };

  useEffect(() => {
    if (!token) return;
    getInitData(); // -
  }, [token]);

  return (
    <CommunityContainer ref={scrollContainerRef}>
      <ReturnBox
        onClick={() => {
          Navigate(-1);
        }}
      >
        <ReturnIcon />
        {t("336")}
      </ReturnBox>

      <PurchaseModal_Content>
        <PurchaseModal_Content_Left>
          <img
            src={
              "https://inscriptionalliance.com/download/inscription/image/web/ItemBg.gif"
            }
            alt=""
          />
        </PurchaseModal_Content_Left>
        <PurchaseModal_Content_Right>
          <InputItem>
            <div> {t("337")}</div>
            <input
              type="number"
              min={0}
              value={!!InputObj?.totalPrice ? InputObj?.totalPrice : ""}
              onChange={(e: any) => inputObjFun("totalPrice", e.target.value)}
            />
          </InputItem>
          <InputItem>
            <div> {t("338")}</div>
            <input
              type="text"
              value={InputObj?.accord}
              readOnly={true}
              onChange={(e: any) => inputObjFun("accord", e.target.value)}
            />
          </InputItem>
          <InputItem>
            <div> {t("339")}</div>
            <input
              type="number"
              min={0}
              value={!!InputObj?.mintNum ? InputObj?.mintNum : ""}
              onChange={(e: any) => inputObjFun("mintNum", e.target.value)}
            />
          </InputItem>

          <BtnContainer>
            <BuyBtn onClick={SaleFun}>{t("340")}</BuyBtn>
          </BtnContainer>
        </PurchaseModal_Content_Right>
      </PurchaseModal_Content>

      <InfoModal
        visible={SaleItemModal}
        className="Modal"
        centered
        width={440}
        closable={false}
        footer={null}
        onCancel={() => {
          setSaleItemModal(false);
        }}
        src={InfoModalBg}
      >
        <div
          className="close"
          onClick={() => {
            setSaleItemModal(false);
          }}
        >
          <img src={closeIcon} alt="" />
        </div>
        <MintTitleModal>{t("341")}</MintTitleModal>

        <SuccessfulModal_Content>
          <SuccessIcon />

          {i18n.language === "zh" ? (
            <div>
              您可以在{" "}
              <span
                onClick={() => {
                  Navigate("/View/Market/1", { state: { tabIndex: 2 } });
                }}
              >
                {" "}
                我的銘文
              </span>
              頁面查看上架情況
            </div>
          ) : (
            <div>
              You can view the inscription status on
              <span
                onClick={() => {
                  Navigate("/View/Market/1", { state: { tabIndex: 2 } });
                }}
              >
                {" "}
                my inscription page
              </span>
            </div>
          )}
        </SuccessfulModal_Content>
      </InfoModal>
    </CommunityContainer>
  );
}
