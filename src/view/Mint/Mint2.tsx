import "../../assets/style/mint2.scss";
import backImg from "../../assets/image/back.png";
import { useEffect, useRef, useState } from "react";
import SuccessModal from "../../components/Mint/success";
import ErrorModal from "../../components/Mint/error";
import { useNavigate } from "react-router-dom";
import { getTimes, lotteryDraw, lotteryDrawTypeInfo } from "../../API";
import { compileString } from "sass";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useViewport } from "../../components/viewportContext";
import styled from "styled-components";
import { FlexBox, FlexCCBox, FlexSBCBox } from "../../components/FlexBox";
import btnBg from "../../assets/image/Mint/btnBg.png";
import jpbox from "../../assets/image/Mint/jpbox.png";
import { addMessage } from "../../utils/tool";
import ticket1 from "../../assets/image/Layout/ticket1.svg";
import ticket2 from "../../assets/image/Layout/ticket2.svg";
import ticket3 from "../../assets/image/Layout/ticket3.svg";
import ticket4 from "../../assets/image/Layout/ticket4.svg";
import ticket5 from "../../assets/image/Layout/ticket5.svg";
import ticket1_en from "../../assets/image/Layout/ticket1_en.svg";
import ticket2_en from "../../assets/image/Layout/ticket2_en.svg";
import ticket3_en from "../../assets/image/Layout/ticket3_en.svg";
import ticket4_en from "../../assets/image/Layout/ticket4_en.svg";
import ticket5_en from "../../assets/image/Layout/ticket5_en.svg";
import infoIcon from "../../assets/image/Mint/infoIcon.svg";

import {
  setCreditAction,
  setFreeCodeAction,
  setMintFeeAction,
} from "../../store/actions";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import SwiperCore, { Navigation, Pagination, Autoplay } from "swiper";
import { Tooltip } from "antd";
import { useBindState } from "../../hooks/useBindState";

// install Swiper modules
SwiperCore.use([Navigation, Pagination, Autoplay]);

interface successType {
  showModal: () => void;
}

const TabContainer = styled(FlexSBCBox)`
  width: 100%;
  > div {
    width: 33.33%;
  }
  .tab {
    opacity: 0.5;
  }
  .activeTab {
    opacity: 1;
    transform: scale(1.1);
    animation: 0.1s;
  }
`;
const TabContainer_Item = styled(FlexCCBox)<{ src: any }>`
  background: transparent;
  background-image: ${({ src }) => `url(${src})`};
  background-size: 100% 100%;
  background-repeat: no-repeat;
  color: #000;
  text-align: center;
  font-family: "Gen Shin Gothic P";
  font-size: 14px;
  font-style: normal;
  font-weight: 900;
  line-height: normal;
  padding: 8px 30px;
  white-space: nowrap;
`;

const BoxContainer = styled(FlexBox)`
  width: 100%;
  flex-direction: column;
  align-items: center;
  margin: 48px 0px;
`;

const BigBoxContainer = styled(BoxContainer)`
  margin: 48px 0px 0px;
`;

const BoxContainer_Devider = styled.div`
  width: 100%;
  height: 0.3333rem;
  opacity: 0.6;
  background: linear-gradient(
    90deg,
    rgba(149, 250, 49, 0) 1.07%,
    #95fa31 53.32%,
    rgba(149, 250, 49, 0) 100.4%
  );
`;
const BoxContainer_Content = styled.div`
  position: relative;
  overflow: hidden;
`;

const BoxContainer_Content_Box = styled.div`
  width: 100%;
  white-space: nowrap;
  @keyframes scrollHorizontally {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }
  animation: scrollHorizontally 3s linear infinite;
`;

const NoBoxContainer_Content_Box = styled(FlexSBCBox)``;
const BoxContainer_Content_Item = styled(FlexCCBox)`
  display: inline-flex;
  width: 20%;
  padding: 20px 0px;

  > img {
    width: 100%;
  }
`;
const BoxContainer_Content_Item_Mobile = styled(BoxContainer_Content_Item)`
  width: 33%;
`;
const BoxContainer_Content_Item1 = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 42%;
  height: 100%;
  z-index: 100;

  background: linear-gradient(90deg, #1b1b1b 0%, rgba(27, 27, 27, 0) 100%);
`;

const BoxContainer_Content_Item2 = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 42%;
  z-index: 100;
  height: 100%;

  background: linear-gradient(270deg, #1b1b1b 0%, rgba(27, 27, 27, 0) 100%);
`;

const JoinInBtn = styled(FlexCCBox)`
  width: fit-content;
  color: #000;
  font-family: "Gen Shin Gothic P";
  font-size: 14px;
  font-style: normal;
  font-weight: 900;
  line-height: normal;
  padding: 7px 56px;
  border-radius: 8px;
  background: linear-gradient(0deg, #95fa31 0.01%, #f6f022 99.99%);
  box-shadow: 3px 6px 0px 0px #4a8e00;
  margin-right: 12px;
`;

const TipContainer = styled(FlexCCBox)`
  color: #a4f92f;
  text-align: center;
  font-family: "Gen Shin Gothic P";
  font-size: 16px;
  font-style: normal;
  font-weight: 900;
  line-height: normal;
`;
const BalanceTip = styled(FlexCCBox)`
  color: #a4f92f;
  text-align: center;
  font-family: CKTKingkong;
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-top: 1.5rem;
`;

const MyToolTip = styled(Tooltip)`
  /* .ant-tooltip-inner {
    font-size: 1.5rem;
  } */
`;

const BtnBox = styled(FlexCCBox)`
  margin-top: 70px;

  > div {
    &:first-child {
      width: 100%;
      /* height: 0.3333rem; */
      flex-shrink: 0;
      background: linear-gradient(
        90deg,
        rgba(149, 250, 49, 0) 1.07%,
        #95fa31 53.32%,
        rgba(149, 250, 49, 0) 100.4%
      );
      display: inline-flex;
      padding: 15px 81px;
      justify-content: center;
      align-items: center;
      border-radius: 14px;
      background: linear-gradient(0deg, #95fa31 0.01%, #f6f022 99.99%);
      box-shadow: 6px 10px 0px 0px #4a8e00;
      color: #000;
      font-size: 20px;
      line-height: 20px;
      cursor: pointer;
      margin-right: 20px;
    }
  }
`;

const JoinInBtnBox = styled(FlexCCBox)`
  margin: 0px auto 24px;
`;

const MyToolTip_Title = styled(FlexCCBox)`
  text-align: center;
  font-family: "Gen Shin Gothic P";
  font-size: 14px;
  font-style: normal;
  font-weight: 900;
  line-height: normal;
`;

export const resultObj = {
  0: "",
  1: { name: "213", icon: ticket3, iconEn: ticket3_en },
  2: { name: "220", icon: ticket2, iconEn: ticket2_en },
  3: { name: "221", icon: ticket1, iconEn: ticket1_en },
  4: { name: "222", icon: ticket5, iconEn: ticket5_en },
  5: { name: "223", icon: ticket4, iconEn: ticket4_en },
};

const Shop = () => {
  const { t } = useTranslation();
  const token = useSelector<any>((state) => state.token);
  const nav = useNavigate();

  const [cjType] = useState(["187", "188", "189"]);
  // const [cjType] = useState(["157"]);
  // const [curType, setCur] = useState(2);
  const [InfoObj, setInfoObj] = useState<any>({});
  const [activeTab, setActiveTab] = useState(2);

  const successref = useRef<successType>(null);
  const errorref = useRef<successType>(null);
  const { width } = useViewport();
  const [WinLottery, setWinLottery] = useState<any>({});
  let dispatch = useDispatch();

  const [isScrolle, setIsScrolle] = useState(false);
  const [context, setContext] = useState([]);
  const speed = 25;
  const warper: any = useRef();
  const childDomInit: any = useRef();
  const childDomCopy: any = useRef();
  const { getBindStateFun } = useBindState();

  const getInitData = () => {
    lotteryDrawTypeInfo({ type: activeTab }).then((res: any) => {
      if (res.code === 200) {
        setInfoObj(res.data || {});
        return dispatch(setCreditAction(res?.data?.userHoldNum));
        // dispatch(setCreditAction(res?.data?.userHoldNum));
        // dispatch(setCreditAction(res?.data?.userHoldNum));

        // if (Number(res.data?.depleteUnit) === 1)
        //   return dispatch(setCreditAction(res?.data?.userHoldNum));
        // if (Number(res.data?.depleteUnit) === 2)
        //   return dispatch(setMintFeeAction(res?.data?.userHoldNum));
        // if (Number(res.data?.depleteUnit) === 3)
        //   return dispatch(setFreeCodeAction(res?.data?.userHoldNum));
      }
    });
  };

  useEffect(() => {
    if (token) {
      getInitData();
    }
  }, [token, activeTab]);

  const cj = async () => {
    if (!token) return;
    if (Number(InfoObj?.depleteNum) > Number(InfoObj?.userHoldNum))
      return errorref.current?.showModal();
    setIsScrolle(true);
    await setTimeout(() => {
      lotteryDraw({ type: activeTab }).then(async (res: any) => {
        if (res.code === 200 && res.data?.winLottery) {
          setWinLottery(res.data);
          await getInitData();
          await successref.current?.showModal();
        }
      });
    }, 2000);
  };

  const changeType = (type: number) => {
    if (type === activeTab) return;
    setActiveTab(type);
  };

  useEffect(() => {}, []);

  const content = (
    <BoxContainer_Content_Box>
      {[1, 2, 3, 4, 5].map((item: any, index: any) => (
        <BoxContainer_Content_Item key={index}>
          <img src={jpbox} alt="" />
        </BoxContainer_Content_Item>
      ))}
    </BoxContainer_Content_Box>
  );

  return (
    <>
      {width > 768 ? (
        <div className="lottery">
          <div>
            <img onClick={() => nav(-1)} src={backImg} alt="" />
            <div>
              {cjType.map((item: string, index: number) => {
                return (
                  <div
                    key={index}
                    className={`cjBox ${
                      activeTab === index + 1 ? "active" : ""
                    }`}
                    style={{
                      marginRight: index + 1 === cjType.length ? 0 : 40,
                    }}
                    onClick={() => changeType(index + 1)}
                  >
                    {t(item)}
                  </div>
                );
              })}
            </div>
          </div>

          {/* <div>
            <div />
            <div>
              <div />
              <div />
            </div>
            <div />
          </div> */}
          <BigBoxContainer>
            <BoxContainer_Devider />

            <BoxContainer_Content ref={warper}>
              <BoxContainer_Content_Item1 />
              {isScrolle ? (
                <BoxContainer_Content_Box data-duplicate={content}>
                  {[
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9,
                    10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8,
                    9, 10,
                  ].map((item: any, index: any) => (
                    <BoxContainer_Content_Item key={index}>
                      <img src={jpbox} alt="" />
                    </BoxContainer_Content_Item>
                  ))}
                </BoxContainer_Content_Box>
              ) : (
                <NoBoxContainer_Content_Box data-duplicate={content}>
                  {[1, 2, 3, 4, 5].map((item: any, index: any) => (
                    <BoxContainer_Content_Item key={index}>
                      <img src={jpbox} alt="" />
                    </BoxContainer_Content_Item>
                  ))}
                </NoBoxContainer_Content_Box>
              )}
              <BoxContainer_Content_Item2 />
            </BoxContainer_Content>

            <BoxContainer_Devider />
          </BigBoxContainer>
          <BtnBox>
            <div
              onClick={
                // cj
                () => {
                  getBindStateFun(cj, () => {});
                }
              }
            >
              {t("158")}{" "}
            </div>
            <MyToolTip
              title={
                <div>
                  <MyToolTip_Title style={{ marginBottom: "5px" }}>
                    {t("233")}
                  </MyToolTip_Title>
                  <div>{t("227")}</div>
                  <div>{t("228")}</div>
                  <div>{t("229")}</div>
                </div>
              }
            >
              {" "}
              <div>
                <img src={infoIcon} alt="" />
              </div>
            </MyToolTip>
          </BtnBox>

          <span>
            {t("218")}：{InfoObj?.depleteNum || "--"}
            {t(resultObj[InfoObj?.depleteUnit ?? 0]?.name)}/{t("160")}
          </span>
          <BalanceTip>
            {t("219")}：{InfoObj?.userHoldNum || 0}
            {t(resultObj[InfoObj?.depleteUnit ?? 0]?.name)}
          </BalanceTip>
        </div>
      ) : (
        <div className="lottery">
          <div>
            <img onClick={() => nav(-1)} src={backImg} alt="" />
            <TabContainer>
              <TabContainer_Item
                src={btnBg}
                className={Number(activeTab) === 1 ? "activeTab tab" : "tab"}
                onClick={() => {
                  setActiveTab(1);
                }}
              >
                {t("187")}
              </TabContainer_Item>
              <TabContainer_Item
                src={btnBg}
                className={Number(activeTab) === 2 ? "activeTab tab" : "tab"}
                onClick={() => {
                  setActiveTab(2);
                }}
              >
                {t("188")}
              </TabContainer_Item>
              <TabContainer_Item
                src={btnBg}
                className={Number(activeTab) === 3 ? "activeTab tab" : "tab"}
                onClick={() => {
                  setActiveTab(3);
                }}
              >
                {t("189")}
              </TabContainer_Item>
            </TabContainer>
            <BoxContainer>
              <BoxContainer_Devider />
              <BoxContainer_Content>
                <BoxContainer_Content_Item1 />

                {isScrolle ? (
                  <BoxContainer_Content_Box data-duplicate={content}>
                    {[
                      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8, 9,
                      10, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 1, 2, 3, 4, 5, 6, 7, 8,
                      9, 10,
                    ].map((item: any, index: any) => (
                      <BoxContainer_Content_Item_Mobile key={index}>
                        <img src={jpbox} alt="" />
                      </BoxContainer_Content_Item_Mobile>
                    ))}
                  </BoxContainer_Content_Box>
                ) : (
                  <NoBoxContainer_Content_Box data-duplicate={content}>
                    {[1, 2, 3].map((item: any, index: any) => (
                      <BoxContainer_Content_Item_Mobile key={index}>
                        <img src={jpbox} alt="" />
                      </BoxContainer_Content_Item_Mobile>
                    ))}
                  </NoBoxContainer_Content_Box>
                )}
                <BoxContainer_Content_Item2 />
              </BoxContainer_Content>
              <BoxContainer_Devider />
            </BoxContainer>
            <JoinInBtnBox>
              <JoinInBtn
                onClick={() => {
                  getBindStateFun(cj, () => {});
                }}
              >
                {t("8")}
              </JoinInBtn>{" "}
              <MyToolTip
                title={
                  <div>
                    <MyToolTip_Title style={{ marginBottom: "5px" }}>
                      {t("233")}
                    </MyToolTip_Title>
                    <div>{t("227")}</div>
                    <div>{t("228")}</div>
                    <div>{t("229")}</div>
                  </div>
                }
                showArrow={width >= 650 ? true : false}
              >
                {" "}
                <div>
                  <img src={infoIcon} alt="" />
                </div>
              </MyToolTip>
            </JoinInBtnBox>

            <TipContainer>
              {t("218")} : {InfoObj?.depleteNum || "--"}
              {t(resultObj[InfoObj?.depleteUnit ?? 0]?.name)}/{t("160")}
            </TipContainer>
            <TipContainer>
              {t("219")} : {InfoObj?.userHoldNum || 0}
              {t(resultObj[InfoObj?.depleteUnit ?? 0]?.name)}
            </TipContainer>
          </div>
        </div>
      )}
      <SuccessModal
        ref={successref}
        data={WinLottery}
        fun={() => {
          setIsScrolle(false);
        }}
      />
      <ErrorModal ref={errorref} />
    </>
  );
};

export default Shop;
