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
import { FlexBox, FlexCCBox, FlexSBCBox } from "../components/FlexBox/index";
import { useViewport } from "../components/viewportContext";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import closeIcon from "../assets/image/closeIcon.svg";
import { Modal, Pagination, PaginationProps } from "antd";
import { useSelector } from "react-redux";
import { AddrHandle, addMessage, showLoding } from "../utils/tool";
import LotteryBox from "../assets/image/LotteryBox";
import { stubArray } from "lodash";

export const ActivityBox = styled.div`
  padding: 10rem 0px;
  width: 100%;
  max-width: 1400px;
  @media (max-width: 1440px) {
    padding: 20px;
  }
`;

const ActivityContainer = styled(FlexBox)`
  flex-direction: column;
  align-items: center;
  width: 100%;
  /* max-width: 1400px; */
`;

const ActivityBox_Container_Top = styled(FlexBox)`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ActivityBox_Left = styled(FlexBox)`
  width: 48%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  @media (max-width: 768px) {
    width: 100%;
  }
`;


const Btn = styled(FlexCCBox)<{ active: any }>`
  width: 100%;
  padding: 15px;
  color: #000;
  font-family: "PingFang SC";
  font-size: 2.33333rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  border-radius: 1.16667rem;
  background: ${({ active }) =>
    active
      ? `linear-gradient(270deg, #9ed2ac 0.16%, #21d2ac 99.76%)`
      : "linear-gradient(270deg, rgba(158, 210, 172, 0.50) 0.16%, rgba(33, 210, 172, 0.50) 99.76%)"};

  @media (max-width: 768px) {
    padding: 11px;
  }
`;

const ActivityBox_Right = styled(FlexBox)`
  width: 48%;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  > div {
    width: 100%;
  }
  @media (max-width: 768px) {
    margin-top: 24px;
    width: 100%;
  }
`;

export const NoDataContainer = styled(FlexCCBox)`
  padding: 50px;
`;


const AllModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 30px;
    background: linear-gradient(311deg, #144344 0.76%, #272245 93%);
    .ant-modal-body {
      padding: 0px;
    }
  }
`;

const ModalContainer = styled(FlexBox)`
  width: 100%;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const ModalClose = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
  width: 30px;
  height: 30px;
  > div {
    width: 100%;
  }
`;
const ModalTitle = styled(FlexCCBox)`
  width: 100%;
  padding: 30px 0px 18px;
  color: #fff;
  text-align: center;
  font-family: "PingFang SC";
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
const ModalDevider = styled(FlexCCBox)`
  height: 1px;
  width: 100%;
  opacity: 0.6;
  background: linear-gradient(
    90deg,
    rgba(165, 242, 0, 0) 1.07%,
    #00ffc8 53.32%,
    rgba(165, 242, 0, 0) 100.4%
  );
`;

const ModalContent = styled(FlexBox)`
  width: 100%;
  padding: 28px;
  flex-direction: column;
  align-items: center;
`;

const Tip = styled(FlexCCBox)`
  margin: 28px 0px;
  width: 100%;
  color: #fff;
  text-align: center;
  font-family: "PingFang SC";
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const ConfirmBtn = styled(Btn)`
  width: fit-content;
  padding: 15px 50px;
  color: #000;
  font-family: "PingFang SC";
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  @media (max-width: 768px) {
  }
`;

const InputContainer = styled(FlexBox)`
  width: 100%;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.1);
  margin-bottom: 40px;
  padding: 20px 30px;

  > input {
    flex: auto;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.5);
    font-family: "PingFang SC";
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
`;


export default function Activity() {
  const token = useSelector<any>((state) => state.token);
  const { t } = useTranslation();
  const web3React = useWeb3React();
  const { width } = useViewport();
  const navigate = useNavigate();
  const [PageSize, setPageSize] = useState(10);
  const [PageNum, setPageNum] = useState(1);
  const [GoToBindWallet, setGoToBindWallet] = useState(false);
  const [OpenList, setOpenList] = useState<any>([1]);
  const inputRef = useRef<any>();
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
      return <a>{t("Previous")}</a>;
    }
    if (type === "next") {
      return <a>{t("Next")}</a>;
    }
    return originalElement;
  };

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

  const getInitData = useCallback(() => {}, [PageNum, PageSize]);

  useEffect(() => {
    if (token) {
      getInitData();
    }
  }, [token, PageNum]);

  return (
    <ActivityContainer>
      <ActivityBox>
        <ActivityBox_Container_Top>
          <ActivityBox_Left>
          </ActivityBox_Left>
          <ActivityBox_Right>

          </ActivityBox_Right>
        </ActivityBox_Container_Top>
      </ActivityBox>

      <AllModal
        visible={GoToBindWallet}
        centered
        width={"518px"}
        closable={false}
        footer={null}
        onCancel={() => {}}
      >
        <ModalContainer>
          <ModalClose>
            <img
              src={closeIcon}
              alt=""
              onClick={() => {
                setGoToBindWallet(false);
              }}
            />
          </ModalClose>
          <ModalTitle>{t("13")}</ModalTitle>
          <ModalDevider></ModalDevider>
          <ModalContent>
            <InputContainer>
              <input type="text" ref={inputRef} placeholder={t("14")} />
            </InputContainer>
            <ConfirmBtn
              active={true}
              onClick={() => {
                // BindWalletFun();
              }}
            >
              {t("Confirm")}
            </ConfirmBtn>
          </ModalContent>
        </ModalContainer>
      </AllModal>
    </ActivityContainer>
  );
}
