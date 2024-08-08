import { Input, Modal } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import sb from "../../assets/image/Person/WhiteModalBg.png";
import logo from "../../assets/image/Mint/nameLogo.png";
import "./white.scss";
import { useWeb3React } from "@web3-react/core";
import { Contracts } from "../../web3";
import { EtherFun, addMessage, showLoding } from "../../utils/tool";
import { contractAddress } from "../../config";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import closeIcon from "../../assets/image/Person/closeIcon.svg";
import { FlexBox, FlexCCBox, FlexSBCBox } from "../FlexBox";

interface RefType {
  showModal: () => void;
}

const WhitenameModal = styled(Modal)<{ src: any }>`
  position: relative;
  background: transparent;
  background-image: ${({ src }) => `url(${src})`};
  background-size: 100% 300% !important;
  background-repeat: no-repeat;
  /* min-height: 57.5rem; */

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
`;
const WhitenameModal_Title = styled.div`
  text-align: center;
  font-family: "CKTKingkong";
  font-size: 2rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  background: linear-gradient(91deg, #95fa31 0%, #f6f022 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const WhitenameModal_LOGO = styled(FlexCCBox)`
  width: 100%;
  img {
    width: 20.41667rem;
    height: 20.41667rem;
  }
`;

const WhitenameModal_Content = styled.div`
  width: 100%;
`;

const WhitenameModal_Content_Item = styled(FlexSBCBox)`
  width: 100%;
`;
const WhitenameModal_Content_Left = styled(FlexBox)``;
const WhitenameModal_Content_Right = styled(FlexBox)``;
const InputBox = styled(FlexBox)`
  padding: 1.66667rem 2rem 1.58333rem 2rem;
  border-radius: 3.33333rem;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: -3px -3px 5px 0px rgba(255, 255, 255, 0.2) inset,
    5px 5px 10px 0px #000 inset;
  backdrop-filter: blur(28.5px);
  color: #fff;
  text-align: right;
  font-family: "CKTKingkong";
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  > div {
    color: #fff;
    text-align: right;
    font-family: CKTKingkong;
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
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
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose={true}
      centered
      src={sb}
      closable={false}
      footer={null}
      width={510}
    >
      <div className="close" onClick={handleCancel}>
        <img src={closeIcon} alt="" />
      </div>
      <WhitenameModal_Title>{t("125")}</WhitenameModal_Title>
      <WhitenameModal_LOGO>
        <img src={logo} alt="" />
      </WhitenameModal_LOGO>
      <WhitenameModal_Content>
        <WhitenameModal_Content_Item>
          <WhitenameModal_Content_Left>
            {t("126")} :{" "}
          </WhitenameModal_Content_Left>
          <WhitenameModal_Content_Right>
            {EtherFun(InitDataObj?.unitPrice ?? "0")}USDT
          </WhitenameModal_Content_Right>
        </WhitenameModal_Content_Item>
        <WhitenameModal_Content_Item>
          <WhitenameModal_Content_Left>
            {t("127")} :{" "}
          </WhitenameModal_Content_Left>
          <WhitenameModal_Content_Right>
            {InitDataObj?.maxWhiteListNum}
          </WhitenameModal_Content_Right>
        </WhitenameModal_Content_Item>
        <WhitenameModal_Content_Item>
          <WhitenameModal_Content_Left>
            {t("128")} :
            <div>
              {t("129")} : {InitDataObj?.personalWhiteList}）
            </div>
          </WhitenameModal_Content_Left>
          <WhitenameModal_Content_Right>
            <InputBox>
              <Input
                value={buyNum}
                onChange={(e) => handleChange(e)}
                maxLength={3}
              />
              <div onClick={setMax}>{t("130")}</div>
            </InputBox>
          </WhitenameModal_Content_Right>
        </WhitenameModal_Content_Item>
      </WhitenameModal_Content>

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
        <div>{t("132")} : </div>
        <div>{t("133")}</div>
        <div>{t("134")}</div>
        <div>{t("135")}</div>
      </div>
    </WhitenameModal>
  );
});

export default WhiteName;
