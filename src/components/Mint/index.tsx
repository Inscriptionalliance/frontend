import { Input, Modal } from "antd";
import {
  ChangeEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import "./modal.scss";
import close from "../../assets/image/Mint/close.png";
import backgrounds from "../../assets/image/Mint/modalBack.png";
import { useWeb3React } from "@web3-react/core";
import downn from "../../assets/image/Mint/down.png";
import outLinkIcon from "../../assets/image/Mint/outLinkIcon.svg";
import { PostMF, myMint, transfer } from "../../API";
import { AddrHandle, addMessage, showLoding } from "../../utils/tool";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { FlexCCBox, FlexSECBox } from "../FlexBox";
import { useViewport } from "../viewportContext";
import { Contracts } from "../../web3";
import { useSelector } from "react-redux";
import Web3 from "web3";
import { useBindState } from "../../hooks/useBindState";
const web3 = new Web3();
interface RefType {
  showModal: () => void;
}

//-rops--
interface PropsType {
  modalType: string;
  mfCode?: number;
  callback?: () => void;
}

const BtnBox = styled(FlexCCBox)`
  @media (max-width: 650px) {
    display: block;
  }
`;
const TransferRecordBtn = styled(FlexSECBox)`
  color: rgba(255, 255, 255, 0.8);
  font-family: "CKTKingkong";
  font-size: 1.16667rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin: 0px 0px 0rem 2.58rem;
  img {
    width: 1.83333rem;
    height: 1.83333rem;
  }
  @media (max-width: 650px) {
    margin-top: 12px;
    justify-content: center;
    img {
      width: 18px;
      height: 18px;
    }
  }
`;

const ZhuanYiModal = forwardRef<any, any>((props, ref) => {
  const { t } = useTranslation();
  const web3React = useWeb3React();
  const token = useSelector<any>((state) => state.token);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [num, setNum] = useState<number>();
  const [address, setAddress] = useState<string>();
  const { width } = useViewport();
  const { i18n } = useTranslation();
  const [InputTransferInfo, setInputTransferInfo] = useState<any>({});
  const [MyListAmount, setMyListAmount] = useState(0);
  const { getBindStateFun } = useBindState();
  useImperativeHandle(
    ref,
    () => ({
      showModal,
    }),
    []
  );

  const transferInfo = (type: string, value: any) => {
    setInputTransferInfo({ ...InputTransferInfo, [type]: value });
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setInputTransferInfo({});
  };

  const zhuanyi = () => {
    if (props.modalType === "joinperson") {
      if ((InputTransferInfo?.mintNum as number) > (props.mfCode as number))
        return addMessage(t("103"));
      // if ((num as number) < 10) return addMessage(t("104"));
      if (!InputTransferInfo?.toAddress) return addMessage(t("105"));

      PostMF(
        InputTransferInfo?.mintNum as number,
        InputTransferInfo?.toAddress as string
      ).then((res: any) => {
        if (res.code === 200) {
          handleCancel();
          addMessage(t("169"));
          if (props.callback) {
            props.callback();
          }
        } else {
          addMessage(res.msg);
        }
      });
    } else {
      return addMessage(t("Open soon"));
      transferFun();
    }
  };

  const transferFun = async () => {
    if (!token && InputTransferInfo?.mintNum) return;
    let tag = await web3.utils.isAddress(InputTransferInfo?.toAddress);
    if (!tag) return addMessage(t("234"));
    let item: any;
    try {
      item = await transfer(InputTransferInfo);
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
        handleCancel();
        getMyInitData();
        props.callback();
        return addMessage(t("235"));
      } else {
        return addMessage(t("236"));
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
    <Modal
      className="modalbox"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose
    >
      <img
        id="back"
        src={backgrounds}
        alt=""
        style={{ aspectRatio: width < 370 ? "313 / 527" : "" }}
      />
      <img onClick={handleCancel} id="close" src={close} alt={t("106")} />
      <span style={{ left: i18n.language === "en" ? "6rem" : "5.8333rem" }}>
        {t("107")}
      </span>
      <div>
        <div style={{ alignItems: "center" }}>
          <div style={{ width: "fit-content" }}>{t("108")} : </div>
          <div style={{ textAlign: "right", width: "fit-content" }}>
            {AddrHandle(web3React.account as string, 10, 10)}
          </div>
        </div>
        <div>
          <div style={{ display: "none" }}>{t("109")}</div>
          <div>
            {props.modalType === "joinperson" ? (
              <div>
                {t("110")} : {props.mfCode}
              </div>
            ) : (
              <div>{t("111", { num: MyListAmount })}</div>
            )}
          </div>
        </div>
      </div>
      <div />
      <div>
        <div>{t("112")}</div>
        <div className="includeInput">
          <Input
            value={
              !!InputTransferInfo?.mintNum ? InputTransferInfo?.mintNum : ""
            }
            type="number"
            onChange={(e) => transferInfo("mintNum", e.target.value)}
            // placeholder={props.modalType === "joinperson" ? t("190") : "0"}
          />
          <div
            onClick={() => {
              transferInfo("mintNum", MyListAmount);
            }}
          >
            {t("114")}
          </div>
        </div>
        <img src={downn} alt="" />
        <div>{t("115")}</div>
        <div className="includeInput">
          <Input
            value={
              !!InputTransferInfo?.toAddress ? InputTransferInfo?.toAddress : ""
            }
            onChange={(e) => transferInfo("toAddress", e.target.value)}
            placeholder={t("116")}
          />
        </div>
        <BtnBox>
          <div
            className="transferBtn"
            onClick={() => {
              // return addMessage(t("Open soon"));
              getBindStateFun(zhuanyi, handleCancel);
              // zhuanyi();
            }}
          >
            {t("117")}
          </div>
          {props.modalType === "joinperson" && (
            <TransferRecordBtn
              onClick={() => {
                // return addMessage(t("Open soon"));
                handleCancel();
                props?.fun();
              }}
            >
              {t("179")} <img src={outLinkIcon} alt="" />
            </TransferRecordBtn>
          )}
        </BtnBox>
      </div>
    </Modal>
  );
});

export default ZhuanYiModal;
