import { Input, Modal } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import sb from "../../assets/image/Market/BuyModalBg.png";

import logo from "../../assets/image/Mint/nameLogo.png";
import "./white.scss";
import { useWeb3React } from "@web3-react/core";
import { Contracts } from "../../web3";
import { EtherFun, addMessage, showLoding } from "../../utils/tool";
import { contractAddress } from "../../config";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import i18n from "../../lang/i18n";
import closeIcon from "../../assets/image/Person/closeIcon.svg";

interface RefType {
  showModal: () => void;
}

// const WhitenameModal=styled(Modal)<{src:any}>`
//    background: transparent;
//   background-image: ${({ src }) => `url(${src})`};
//   background-size: 100% 100%;
//   background-repeat: no-repeat;

// `
const WhitenameModal = styled(Modal)`
  top: 80px;
`;

const CloseImg = styled.img`
  position: absolute;
  right: 4.5%;
  top: 2rem;
`;

const WhiteName = forwardRef<RefType>((props, ref) => {
  const { account } = useWeb3React();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [InitDataObj, setInitDataObj] = useState<any>({});
  const [USDTBalance, setUSDTBalance] = useState<any>("0");
  const [ApproveValue, setApproveValue] = useState<any>("0");
  const [buyNum, setBuyNum] = useState(1);

  useImperativeHandle(
    ref,
    () => ({
      showModal,
    }),
    []
  );

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setBuyNum(1);
  };

  //--
  const getInitData = () => {
    Contracts.example?.getWhiteListState(account as string).then((res: any) => {
      console.log(res);

      setInitDataObj(res || {});
    });
    Contracts.example?.balanceOf(account as string, "USDT").then((res: any) => {
      setUSDTBalance(EtherFun(res ?? "0"));
    });
    Contracts.example
      ?.Tokenapprove(account as string, contractAddress?.WhiteList, "USDT")
      .then((res: any) => {
        console.log(res, "shouquan");
        setApproveValue(EtherFun(res ?? "0"));
      });
  };

  //-
  const canBuy = async () => {
    let value: any;
    if (
      buyNum * Number(EtherFun(InitDataObj?.unitPrice ?? "0")) >
      Number(USDTBalance)
    )
      return addMessage(t("120"));
    if (buyNum <= 0) return addMessage(t("121"));

    try {
      showLoding(true);
      value = await Contracts.example.buyWhiteList(account as string, buyNum);
    } catch (error: any) {
      showLoding(false);
    }
    showLoding(false);
    if (value?.status) {
      addMessage(t("122"));
      getInitData();
      handleCancel();
    } else {
      addMessage(t("123"));
    }
  };

  //-
  async function ApproveFun() {
    console.log("hu12");
    if (buyNum <= 0) return addMessage(t("124"));
    if (!account) {
      return addMessage(t("Please link wallet"));
    }
    showLoding(true);
    let value: any;
    try {
      value = await Contracts.example.approve(
        account as string,
        contractAddress?.WhiteList,
        "USDT",
        buyNum * Number(EtherFun(InitDataObj?.unitPrice ?? "0")) + ""
      );
    } catch (error: any) {
      showLoding(false);
    }
    showLoding(false);
    if (value?.status) {
      Contracts.example
        ?.Tokenapprove(account as string, contractAddress?.WhiteList, "USDT")
        .then((res: any) => {
          // setApproveValue(EtherFun(res ?? "0"));
          canBuy();
        });
    } else {
    }
  }

  useEffect(() => {
    if (!account) return;
    getInitData();
  }, [isModalOpen, account]);

  const handleChange = (e: any) => {
    setBuyNum(e.target.value);
  };

  const setMax = () => {
    if (InitDataObj.currentWhiteListNum) {
      setBuyNum(200 - InitDataObj.currentWhiteListNum);
    } else {
      setBuyNum(200);
    }
  };

  return (
    <WhitenameModal
      className="whitename"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose={true}
      // centered
      // src={sb}
    >
      <img
        src={sb}
        alt=""
        style={{ aspectRatio: i18n.language === "zh" ? "114 / 194" : "" }}
      />
      <span>{t("125")}</span>
      <img src={logo} alt="" />
      <div>
        <div>
          <div style={{ color: "rgba(254, 254, 254, 0.80)" }}>{t("126")}</div>
          <div>{EtherFun(InitDataObj?.unitPrice ?? "0")}USDT</div>
        </div>

        <div>
          <div style={{ color: "rgba(254, 254, 254, 0.80)" }}>{t("127")}</div>
          <div>
            {/* <span>
              {InitDataObj?.maxWhiteListNum - InitDataObj?.currentWhiteListNum}
            </span>/ */}
            {InitDataObj?.maxWhiteListNum}
          </div>
        </div>

        <div>
          <div className="flexBox">
            <div>{t("128")}</div>
            <div>
              （{t("129")}
              {InitDataObj?.personalWhiteList}）
            </div>
          </div>
          <div className="selfInput">
            <Input
              value={buyNum}
              onChange={(e) => handleChange(e)}
              maxLength={3}
            />
            <div onClick={setMax}>{t("130")}</div>
          </div>
        </div>
      </div>

      {/* {Number(ApproveValue) > Number() ? ( */}
      <div onClick={() => ApproveFun()}>{t("131")}</div>
      {/* ) : (
        <div
          onClick={() => {
            ApproveFun();
          }}
        >
          {t("Approve")}
        </div>
      )} */}
      <div>
        <div>{t("132")}</div>
        <div>{t("133")}</div>
        <div>{t("134")}</div>
        <div>{t("135")}</div>
      </div>
      <CloseImg src={closeIcon} onClick={handleCancel} />
    </WhitenameModal>
  );
});

export default WhiteName;
