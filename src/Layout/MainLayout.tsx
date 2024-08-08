// @ts-nocheck
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Layout } from "antd";
import { MenuProps, Tooltip } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
// import { useConnectWallet, injected, ChainId } from "../web3";
import {
  addMessage,
  AddrHandle,
  GetQueryString,
  NumSplic1,
  showLoding,
  startWord,
  thousandsSeparator,
} from "../utils/tool";
import { bottomData, communityList, Login, teamInfo } from "../API/index";
import { useWeb3React } from "@web3-react/core";
import { useSelector, useDispatch } from "react-redux";
import { stateType } from "../store/reducer";
import { Contracts } from "../web3";
import Web3 from "web3";
import {
  createLoginSuccessAction,
  savePriceAction,
  setFreeCodeAction,
} from "../store/actions";
import BigNumber from "big.js";
import copy from "copy-to-clipboard";
import logo from "../assets/image/logo.svg";
import langIcon from "../assets/image/Layout/langIcon.svg";
import tgIcon_m from "../assets/image/Layout/tgIcon_m.svg";
import twIcon_m from "../assets/image/Layout/twIcon_m.svg";
import SwitchIcon from "../assets/image/Layout/SwitchIcon1.svg";
import avtorIcon from "../assets/image/Layout/avtorIcon.svg";
import avtor_m from "../assets/image/Layout/avtor_m.svg";
import mainContainer1 from "../assets/image/Layout/mainContainer1.png";
import mainContainer2 from "../assets/image/Layout/mainContainer2.png";
import mainContainer3 from "../assets/image/Layout/mainContainer3.png";
import mainContainer4 from "../assets/image/Layout/mainContainer4.png";
import tgIcon from "../assets/image/Layout/tgIcon.svg";
import twIcon from "../assets/image/Layout/twIcon.svg";
import ticket1 from "../assets/image/Layout/ticket1.svg";
import ticket2 from "../assets/image/Layout/ticket2.svg";
import ticket3 from "../assets/image/Layout/ticket3.svg";
import ticket1_en from "../assets/image/Layout/ticket1_en.svg";
import ticket2_en from "../assets/image/Layout/ticket2_en.svg";
import ticket3_en from "../assets/image/Layout/ticket3_en.svg";
import btnBg from "../assets/image/Layout/btnBg.png";
import mobileBg from "../assets/image/Layout/mobileBg.gif";
import ContantBg from "../assets/image/Layout/ContantBg.gif";

import "../assets/style/layout.scss";
import { Menu, Dropdown, Modal } from "antd";
import useConnectWallet from "../hooks/useConnectWallet";
import { isMain, LOCAL_KEY, tgLink, twitterLink } from "../config";
import { useViewport } from "../components/viewportContext";
import NoData from "../components/NoData";
import { group } from "console";
import styled from "styled-components";
import { FlexBox, FlexCCBox, FlexSBCBox } from "../components/FlexBox";
import { useSign } from "../hooks/useSign";
import LotteryBox from "../assets/image/LotteryBox";
// @ts-ignore
import tp from "tp-js-sdk";
const { Header, Content, Footer, Sider } = Layout;

let refereeUserAddress: any;
let langObj = [
  { value: "中文繁體", key: "zh" },
  { value: "EN", key: "en" },
  { value: "日本語", key: "ja" },
  { value: "한국어", key: "ko" },
  { value: "Français", key: "fr" },
];

const ContainerBg1 = styled.div<{ src: any }>`
  position: absolute;
  top: 0px;
  left: 0px;
  /* transform: translateX(-50%); */
  height: 18.166666666666668rem;
  width: 14.666666666666666rem;
  background-image: ${({ src }) => `url(${src})`};
  background-position: center;
  background-size: 100% 100%; //-
  background-repeat: no-repeat;
  z-index: 2;
`;
const ContainerBg2 = styled.div<{ src: any }>`
  position: absolute;
  top: 0px;
  right: 0px;
  /* transform: translateX(-50%); */
  height: 38.333333333333336rem;
  width: 35rem;
  background-image: ${({ src }) => `url(${src})`};
  background-position: center;
  background-size: 100% 100%; //-
  background-repeat: no-repeat;
  z-index: 2;
`;
const ContainerBg3 = styled.div<{ src: any }>`
  position: absolute;
  bottom: 0px;
  left: 0px;
  /* transform: translateX(-50%); */
  height: 9.083333333333334rem;
  width: 30.166666666666668rem;
  background-image: ${({ src }) => `url(${src})`};
  background-position: center;
  background-size: 100% 100%; //-
  background-repeat: no-repeat;
  z-index: 2;
`;
const ContainerBg4 = styled.div<{ src: any }>`
  position: absolute;
  bottom: 0px;
  right: 0px;
  /* transform: translateX(-50%); */
  height: 17.833333333333332rem;
  width: 25.666666666666668rem;
  background-image: ${({ src }) => `url(${src})`};
  background-position: center;
  background-size: 100% 100%; //-
  background-repeat: no-repeat;
  z-index: 2;
`;
const ContainerBg5 = styled.div<{ src: any }>`
  position: absolute;
  bottom: 0px;
  right: 0px;
  /* transform: translateX(-50%); */
  height: 100%;
  width: 100%;
  background-image: ${({ src }) => `url(${src})`};
  background-position: center;
  background-size: 100% 100%; //-
  background-repeat: no-repeat;
  z-index: 1;
`;

const HeaderContainer = styled(Header)<{ active: any }>`
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 80px;
  background: transparent;

  .HeaderNav {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
    height: 100%;
    z-index: 99999;
    @media (max-width: 1440px) {
      background: #1b1b1b !important;
    }
    /* padding: 0px 12px; */
    // -
    .switchItem {
      padding: 5px 0px;
    }

    .HeadMenu {
      z-index: 99999;
      width: 200px;

      margin: 0px 23px 0px 0px;
      flex-shrink: 0;
      @media (max-width: 768px) {
        margin: 0px 12px 0px 0px;
        width: 129px;
      }
      @media (max-width: 375px) {
        margin: 0px 12px 0px 0px;
        width: 110px;
      }
    }

    .MenuList {
      /* flex: 1; */
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .MenuItem {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #fff;
        text-align: center;
        font-family: "CKTKingkong";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        padding: ${({ active }) => (active ? "0 6px" : "0 12px")};
        text-transform: uppercase;
        white-space: nowrap;
        @media (min-width: 1920px) {
          font-size: 16px;
        }
      }

      .active {
        display: flex;
        flex-direction: column;
        align-items: center;
        color: #95fa31;
        text-align: right;
        font-family: "CKTKingkong";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        text-align: center;
        @media (min-width: 1920px) {
          font-size: 16px;
        }
      }
    }

    .setBox {
      display: flex;
      align-items: center;
      /* border: 1px solid #fff; */
      border-radius: 33px;
      .priceBox {
        color: #0ae462;
        font-size: 16px;
        font-family: PingFang SC;
        font-style: normal;
        font-weight: 900;
        line-height: normal;
        display: flex;
        align-items: center;
        margin-right: 20px;
        white-space: nowrap;
      }

      .LangBox {
        padding: 8px;
        width: 100%;
        display: flex;
        align-items: center;
        > div {
          min-width: 30px;
          color: #fff;
          font-family: Inter;
          font-size: 14px;
          font-style: normal;
          font-weight: 600;
          line-height: normal;
          white-space: nowrap;
        }
        .langIcon {
          width: 20px;
          margin-right: 10px;
        }
        .switchIcon {
          margin-left: 10px;
        }
      }
    }

    .Mobile {
      display: none;

      .MBASPrice {
        margin-right: 10px;

        .priceBox {
          font-family: "PingFang SC";
          font-style: normal;
          font-weight: 700;
          font-size: 18px;
          line-height: 17px;
          color: #018d06;
        }
      }
    }

    @media (max-width: 1349px) {
      .Mobile {
        display: flex;
        align-items: center;
      }

      .HeadMenu {
        // display: none;
      }

      .MobileHeadMenu {
        display: block;
      }
    }

    .SBLMenu {
      text-align: center;
    }

    @media (max-width: 1440px) {
      .MenuList {
        .MenuItem {
          padding: ${({ active }) => (active ? "0 6px" : "0 12px")};
        }
      }
    }
  }
  @media (max-width: 1440px) {
    height: 80px;
    .HeaderNav {
      padding: 0px 12px;
    }
    /* background: rgba(255, 255, 255, 0.1); */
  }
  @media (max-width: 430px) {
    height: 60px;
    .HeaderNav {
      padding: 0px 12px;
    }
    /* background: rgba(255, 255, 255, 0.1); */
  }
`;

const HeaderContainer_Big = styled.div<{ active: any }>`
  max-height: 80px;
  width: fit-content;
  padding: ${({ active }) =>
    active
      ? "1.1666666666666667rem 1.166666666666667rem"
      : "1.1666666666666667rem 3.166666666666667rem"};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 104px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);

  @media (max-width: 1440px) {
    padding: 14px 20px;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ConnectContainer = styled(FlexCCBox)<{ src: any }>`
  max-width: 200px;
  margin-left: 12px;
  padding: 0rem 2.3333333333333335rem;
  min-height: 40px;
  white-space: nowrap;
  text-align: center;
  color: #000;
  font-family: "CKTKingkong";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  background-image: ${({ src }) => `url(${src})`};
  background-position: center;
  background-size: 100% 100%; //-
  background-repeat: no-repeat;
  @media (max-width: 1024px) {
    margin-left: 10px;

    /* padding: 0rem 12px; */
  }
  @media (max-width: 768px) {
    font-size: 12px;

    /* padding: 0rem 12px; */
  }
`;

const Radio = styled.div<{ type: any }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 5px;
  background: ${(type) => (Number(type) === 1 ? "#18EECF" : "#FF3729")};
`;

const ContentContainer = styled(Layout)<{ tag: any }>`
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: flex-start;
  /* overflow-y: auto; */
  z-index: 2;
  background: transparent;
  padding: ${({ tag }) => (!!tag ? "0px !important" : "80px 0px")};
  min-height: calc(100vh - 110px);
  position: relative;
  height: 100%;
  /* overflow: hidden; */
  > div {
    height: 100%;
    width: 100%;
    overflow: auto;
    padding-top: 5.67rem;
    padding-bottom: 5.67rem;
    &::-webkit-scrollbar {
      width: 0px;
    }
  }
  @media (max-width: 1440px) {
    > div {
      padding-bottom: 80px;
    }
  }
  @media (max-width: 430px) {
    padding: 60px 0px;
  }
`;

const FooterContainer = styled(FlexCCBox)`
  /* position: absolute;
  bottom: 0; */
  height: 110px;
  width: 100%;
  z-index: 3;
  @media (max-width: 768px) {
    /* margin-bottom: 26px; */
    padding: 32px 0px 0px;
  }
`;

const RightSider = styled(FlexBox)`
  width: fit-content;
  align-items: center;
  justify-content: flex-end;
`;

const SiderSwitchBox_Container = styled(FlexBox)`
  align-items: center;
`;

const SiderSwitchBox = styled(FlexCCBox)`
  margin-left: 14px;
  > img {
    width: 34px;
    height: 34px;
  }
  @media (max-width: 430px) {
    > img {
      width: 24px;
      height: 24px;
    }
  }
`;

const SiderContainer = styled(FlexBox)`
  width: 100%;
  flex-direction: column;
  align-items: center;
  padding: 25px 20px;
  > img {
  }
`;
const MenuContainer = styled(FlexBox)`
  /* margin-top: 15px; */
  flex-direction: column;
  align-items: center;
  margin-bottom: 180px;
  .MenuItem {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #fff;
    text-align: right;
    font-family: "CKTKingkong";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    padding: 0px 6px;
    text-transform: uppercase;
    margin-top: 27px;
    .setBox {
      /* border: 1px solid #fff;
      border-radius: 33px;
      padding: 8px 12px; */

      .LangBox {
        display: flex;
        align-items: center;
        font-size: 16px;
        img {
          width: 24px;
          margin: 0px 12px;
        }
      }
    }
  }

  .active {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #95fa31;
  }

  .Manage_Item {
    margin: 27px auto 0px;
    width: 100%;
    max-width: 200px;
    > div {
      width: 100%;
    }
  }
`;
const PersonContainer = styled(FlexCCBox)`
  > img {
    margin-left: 20px;
    @media (max-width: 768px) {
      margin-left: 6px;
    }
  }
`;
const PersonContainer_M = styled(PersonContainer)`
  color: #95fa31;
  font-family: "CKTKingkong";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const FooterContainer_Item1 = styled(FlexCCBox)`
  position: absolute;
  bottom: 0px;
  height: 80px;
  width: 100%;
  max-width: 1100px;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(25px);
  z-index: 5;
  color: #fff;
  font-family: "CKTKingkong";
  font-size: 1.6666666666666667rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  img {
    margin-right: 2.25rem;
  }
  @media (max-width: 650px) {
    font-size: 2rem;
    img {
      display: none;
    }
  }
  @media (max-width: 430px) {
    height: 50px;
    img {
      width: 24px;
    }
  }
`;
const FooterContainer_Item2 = styled(FooterContainer_Item1)`
  transform: scale(0.94);
  bottom: 20px;
  z-index: 4;
  @media (max-width: 430px) {
    bottom: 12px;
  }
`;
const FooterContainer_Item3 = styled(FooterContainer_Item1)`
  transform: scale(0.88);
  bottom: 40px;

  z-index: 3;
  @media (max-width: 430px) {
    bottom: 24px;
  }
`;

const TicketContainer_Item = styled(FlexBox)`
  align-items: center;
  color: #fff;
  font-family: "CKTKingkong";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-right: 10px;

  > img {
    max-width: 36px;
    margin-right: 12px;
  }
`;

const TicketContainer = styled(FlexBox)<{ active: any }>`
  align-items: center;
  margin: 0 12px;
  @media (max-width: 1440px) {
    margin: 0 20px;
  }
`;
const RootBox = styled.div`
  height: 100%;
  position: relative;
`;

const MainLayout: React.FC = () => {
  const token = useSelector<any>((state) => state.token);
  const address = useSelector<any>((state) => state.address);
  const freeTicket = useSelector<any>((state) => state.freeCode);
  const mintFee = useSelector<any>((state) => state.mintFee);
  const creditNum = useSelector<any>((state) => state.creditNum);

  let dispatch = useDispatch();
  let { t, i18n } = useTranslation();
  const web3React = useWeb3React();
  let [ItemActive, setItemActive] = useState("/");
  let [SwitchState, setSwitchState] = useState(false);
  const { signFun } = useSign();

  const { connectWallet } = useConnectWallet();
  const { width } = useViewport();
  const [BNBBalanceAmount, setBNBBalanceAmount] = useState<any>("0");
  const [infoCollapsed, setInfoCollapsed] = useState(true);
  const [UserInfoData, setUserInfoData] = useState<any>({});
  const [TeamInfoData, setTeamInfoData] = useState<any>({});
  const location = useLocation();
  const navigate = useNavigate();
  const web3 = new Web3();
  const pathname = startWord(location.pathname);

  const [PageNum, setPageNum] = useState(1); // -
  const [items, setItems] = useState([]); // -

  function changeLanguage(lang: any) {
    window.localStorage.setItem(LOCAL_KEY, lang.key);
    i18n.changeLanguage(lang.key);
    // setInfoCollapsed(!infoCollapsed);
  }

  const menu = (
    <Menu
      onClick={changeLanguage}
      items={langObj.map((item: any) => {
        return {
          label: <span className="LangItem">{item.value}</span>,
          key: item?.key,
        };
      })}
    />
  );

  const headerIconObj: any = {
    "/": {
      menu: "MenuItem pointer",
      menuActive: "MenuItem pointer active",
    },
    "/invite": {
      menu: "MenuItem pointer",
      menuActive: "MenuItem pointer active",
    },

    "/Game": {
      menu: "MenuItem pointer",
      menuActive: "MenuItem pointer active",
    },
    "/Lottery": {
      menu: "MenuItem pointer",
      menuActive: "MenuItem pointer active",
    },
    "/Rank": {
      menu: "MenuItem pointer",
      menuActive: "MenuItem pointer active",
    },
    "/NFT": {
      menu: "MenuItem pointer",
      menuActive: "MenuItem pointer active",
    },
    "/mint/1": {
      menu: "MenuItem pointer",
      menuActive: "MenuItem pointer active",
    },
    "/mint/2": {
      menu: "MenuItem pointer",
      menuActive: "MenuItem pointer active",
    },
    "/Market": {
      menu: "MenuItem pointer",
      menuActive: "MenuItem pointer active",
    },
    "/Swap": {
      menu: "MenuItem pointer",
      menuActive: "MenuItem pointer active",
    },
    "/Bridge": {
      menu: "MenuItem pointer",
      menuActive: "MenuItem pointer active",
    },
    "/Community": {
      menu: "MenuItem pointer",
      menuActive: "MenuItem pointer active",
    },
    "/Ecology": {
      menu: "MenuItem pointer",
      menuActive: "MenuItem pointer active",
    },
    "/join/person": {
      menu: "MenuItem pointer",
      menuActive: "MenuItem pointer active",
    },
  };

  function menuActive(path: string) {
    if (
      ItemActive === path ||
      (path === "/Lottery" && /^\/Lottery.*/.test(ItemActive)) ||
      (path === "/mint" && /^\/mint.*/.test(ItemActive)) ||
      (path === "/Market" && /^\/Market.*/.test(ItemActive))
    ) {
      return headerIconObj[path]?.menuActive;
    } else {
      return headerIconObj[path]?.menu;
    }
  }

  // -
  const navigateFun = (path: string) => {
    setInfoCollapsed(true);
    // if (path === "/NFT") {
    //   return window.open(`https://www.bitdexnft.com/sale`);
    // }
    if (path === "/Soon") {
      return addMessage(t("Open soon"));
    }
    navigate("/View" + path);
  };

  const ConnectBox = (account: any) => {
    if (account) {
      if (width >= 1440) {
        return (
          <PersonContainer>
            <ConnectContainer
              src={btnBg}
              onClick={() => {
                navigate("/View/join/step");
              }}
            >
              {" "}
              <img src={avtorIcon} alt="" />
              {AddrHandle(account as string)}
            </ConnectContainer>
            <ConnectContainer
              src={btnBg}
              onClick={() => {
                // web3React?.deactivate();
                // navigate("/View/join/home");
                navigate("/View/join/home");
                web3React?.deactivate();
                dispatch(createLoginSuccessAction("", ""));
              }}
            >
              {t("1")}
            </ConnectContainer>
          </PersonContainer>
        );
      } else {
        return (
          <PersonContainer_M>
            {/* <ConnectContainer
              src={btnBg}
              onClick={() => {
                navigate("/View/join/step");
              }}
            >
              {" "}
              <img src={avtorIcon} alt="" />
              {AddrHandle(account as string)}
            </ConnectContainer> */}
            {AddrHandle(account as string, 6, 6)}
            <img
              src={avtor_m}
              alt=""
              onClick={() => {
                navigateFun("/join/person");
              }}
            />
          </PersonContainer_M>
        );
      }
    } else if (false) {
      return (
        <ConnectContainer src={btnBg}>
          <Radio type={1}></Radio>Network error
        </ConnectContainer>
      );
    } else {
      return (
        <ConnectContainer
          onClick={async () => {
            connectWallet && (await connectWallet());
            // navigate("/View/join/home");
            navigateFun("/");
          }}
          className="pointer"
          src={btnBg}
        >
          {t("2")}
        </ConnectContainer>
      );
    }
  };

  const getInitData = async () => {
    let value: any;
    try {
      value = await bottomData({});
      if (value?.code === 200) {
        setUserInfoData(value?.data || {});
      }
    } catch (error: any) {}
  };

  const LoginFun = useCallback(async () => {
    if (web3React.account) {
      const value = sessionStorage.getItem(web3React.account);

      if (!value) {
        let tag = await web3.utils.isAddress(window.location.pathname.slice(1));
        if (tag) {
          refereeUserAddress = window.location.pathname.slice(1);
        } else {
          refereeUserAddress = "";
        }
        await signFun((res: any) => {
          Login({
            ...res,
            userAddress: web3React.account as string,
            userPower: 0,
            password: "123",
            ethAddress: "",
            refereeUserAddress,
          }).then((res: any) => {
            if (res.code === 200) {
              showLoding(false);
              dispatch(
                createLoginSuccessAction(
                  res.data.token,
                  web3React.account as string
                )
              );
              sessionStorage.setItem(web3React.account + "", res.data.token);
            } else {
              showLoding(false);
              addMessage(res.msg);
            }
          });
        }, `userAddress=${web3React.account as string}&refereeUserAddress=${refereeUserAddress}`);
      } else {
        // dispatch(
        //   createLoginSuccessAction(
        //     "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIyNjI3Iiwic3ViIjoie1wiaXNTeXN0ZW1cIjowLFwidXNlckFkZHJlc3NcIjpcIjB4NjFlODJiYjNhMDU1MzFiYTQ0YjY2YzljMTcxNmRiYzYzMGU4MjkxOVwiLFwiY3JlYXRlVGltZVwiOlwiMjAyNC0wMy0yNlQxODowOToxMlwiLFwiaXNBY3RpdmF0aW9uXCI6MCxcImlzQmluZFwiOjEsXCJ1cGRhdGVUaW1lXCI6XCIyMDI0LTAzLTI2VDE4OjA5OjEyXCIsXCJpZFwiOjI2MjcsXCJzdGF0dXNcIjowfSIsImlzcyI6ImFkbWluIiwiaWF0IjoxNzIxODA1NzY3LCJleHAiOjE3MjQzOTc3Njd9.m90wzfCNV4UqEjalsDmBTx_119Z-EmlRL_gyVB-Ugzk",
        //     web3React.account as string
        //   )
        // );
        dispatch(createLoginSuccessAction(value, web3React.account as string));
      }
    }
  }, [web3React.account, refereeUserAddress]);

  useEffect(() => {
    connectWallet && connectWallet();
  }, [connectWallet]);

  useEffect(() => {
    getInitData();
    LoginFun();
  }, [web3React.account]);

  useEffect(() => {
    if (token) {
      teamInfo({}).then((res: any) => {
        if (res.code === 200) {
          setTeamInfoData(res?.data);
        }
      });
    }
  }, [token, web3React.account, freeTicket, mintFee, creditNum]);

  useEffect(() => {
    if (web3React.account) {
      Contracts.example.getBalance(web3React.account).then((res: any) => {
        let amounted = Web3.utils.fromWei(res);
        setBNBBalanceAmount(amounted);
      });
    }
  }, [web3React.account]);

  useEffect(() => {
    if (pathname) {
      setItemActive(pathname);
    }
  }, [pathname]);

  useEffect(() => {
    if (isMain) {
      window.console = {
        ...window?.console,
        log: () => {},
      };
    }
    window?.ethereum?.on("accountsChanged", (accounts: string[]) => {
      sessionStorage.clear();
      navigate("/View/");
    });
    window?.ethereum?.on("networkChanged", (accounts: string[]) => {
      sessionStorage.clear();
      navigate("/View/");
    });
  }, [web3React.account]);

  return (
    <RootBox>
      <div className="UUContainer">
        {/* <ContainerBg1 src={mainContainer1}></ContainerBg1>
        <ContainerBg2 src={mainContainer2}></ContainerBg2> */}
        {/* <ContainerBg3 src={mainContainer3}></ContainerBg3> */}
        {/* <ContainerBg4 src={mainContainer4}></ContainerBg4> */}
        {width > 430 ? (
          <ContainerBg5 src={ContantBg}></ContainerBg5>
        ) : (
          <ContainerBg5 src={mobileBg}></ContainerBg5>
        )}
        {String(pathname) !== "/BTCEnvironment" && (
          <HeaderContainer
            active={i18n.language === "fr" || (!!address && width < 1920)}
          >
            <div className="Header-Edition-Center HeaderNav">
              <div className="switchItem">
                <img
                  className="HeadMenu"
                  src={logo}
                  onClick={() => {
                    navigate("/View/");
                    setInfoCollapsed(true);
                  }}
                  alt=""
                />
              </div>
              {/* -*/}
              {width >= 1440 ? (
                <HeaderContainer_Big active={i18n.language === "fr"}>
                  <div className="MenuList">
                    <div
                      className={menuActive("/join/person")}
                      onClick={() => {
                        navigateFun("/join/person");
                      }}
                    >
                      {t("54")}
                    </div>
                    <div
                      className={menuActive("/Community")}
                      onClick={() => {
                        navigateFun("/Community");
                      }}
                    >
                      {t("3")}
                    </div>
                    <div
                      className={menuActive("/mint/2")}
                      onClick={() => {
                        navigateFun("/mint/2");
                      }}
                    >
                      {t("8")}
                    </div>
                    <div
                      className={menuActive("/mint/1")}
                      onClick={() => {
                        navigateFun("/mint/1");
                      }}
                    >
                      Mint
                    </div>
                    <div
                      className={menuActive("/Rank")}
                      onClick={() => {
                        navigateFun("/Rank");
                      }}
                    >
                      {t("4")}
                    </div>

                    <div
                      className={menuActive("/Market")}
                      onClick={() => {
                        navigateFun("/Market/1");
                      }}
                    >
                      {t("5")}
                    </div>
                    <div
                      className={menuActive("/Swap")}
                      onClick={() => {
                        navigateFun("/Swap");
                      }}
                    >
                      Denim{t("SWAP")}
                    </div>

                    <div
                      className={menuActive("/Bridge")}
                      onClick={() => {
                        // return addMessage(t("172"));

                        navigateFun("/Bridge");
                      }}
                    >
                      {t("DenimBridge")}
                    </div>
                    <div
                      className={menuActive("/Ecology")}
                      onClick={() => {
                        navigateFun("/Ecology");
                      }}
                    >
                      {t("404")}
                    </div>
                  </div>

                  <TicketContainer active={i18n.language === "en" || address}>
                    <TicketContainer_Item>
                      <img
                        src={i18n.language === "zh" ? ticket1 : ticket1_en}
                        alt=""
                      />
                      {freeTicket && token ? freeTicket : 0}
                    </TicketContainer_Item>
                    <TicketContainer_Item>
                      <img
                        src={i18n.language === "zh" ? ticket2 : ticket2_en}
                        alt=""
                      />
                      {TeamInfoData?.mintTicket && token
                        ? TeamInfoData?.mintTicket
                        : 0}
                    </TicketContainer_Item>
                    <TicketContainer_Item>
                      <img
                        src={i18n.language === "zh" ? ticket3 : ticket3_en}
                        alt=""
                      />
                      {TeamInfoData?.credit && token ? TeamInfoData?.credit : 0}
                    </TicketContainer_Item>
                  </TicketContainer>

                  <RightSider>
                    {width > 1024 && (
                      <div className="setBox">
                        <Dropdown
                          overlay={menu}
                          placement="bottom"
                          overlayClassName="LangDropDown"
                          trigger={["click"]}
                          arrow={false}
                          getPopupContainer={(triggerNode) => triggerNode}
                          onOpenChange={(value) => {
                            setSwitchState(value);
                          }}
                        >
                          <div>
                            <img src={langIcon} alt="" className="langIcon" />
                          </div>
                        </Dropdown>
                      </div>
                    )}
                    {ConnectBox(address)}
                  </RightSider>
                </HeaderContainer_Big>
              ) : (
                <SiderSwitchBox_Container>
                  {ConnectBox(address)}
                  <SiderSwitchBox>
                    <img
                      src={SwitchIcon}
                      alt=""
                      onClick={() => {
                        setInfoCollapsed(!infoCollapsed);
                      }}
                    />
                  </SiderSwitchBox>
                </SiderSwitchBox_Container>
              )}
            </div>
          </HeaderContainer>
        )}

        <ContentContainer
          className="MainContent"
          tag={String(pathname) === "/BTCEnvironment"}
        >
          <Sider
            width={width > 425 ? 425 : "100%"}
            className="rightSider"
            collapsedWidth="0"
            trigger={null}
            collapsible
            collapsed={infoCollapsed}
            style={{
              background: "rgba(27, 27, 27, 0.80)",
              overflow: "auto",
              height: "100%",
              position: "fixed",
              right: 0,
              top: width > 430 ? 80 : 60,
              bottom: 0,
              paddingTop: 0,
              zIndex: 999,
              // display:width>425?'none':''
            }}
          >
            <SiderContainer>
              <MenuContainer>
                <div className="MenuList">
                  <div
                    className={menuActive("/join/person")}
                    onClick={() => {
                      navigateFun("/join/person");
                    }}
                  >
                    {t("54")}
                  </div>
                  <div
                    className={menuActive("/Community")}
                    onClick={() => {
                      // return addMessage(t("172"));
                      navigateFun("/Community");
                    }}
                  >
                    {t("3")}
                  </div>
                  <div
                    className={menuActive("/mint/2")}
                    onClick={() => {
                      navigateFun("/mint/2");
                    }}
                  >
                    {t("8")}
                  </div>
                  <div
                    className={menuActive("/mint/1")}
                    onClick={() => {
                      // navigateFun("/Lottery/1");
                      navigateFun("/mint/1");
                    }}
                  >
                    Mint
                  </div>
                  <div
                    className={menuActive("/Rank")}
                    onClick={() => {
                      // return addMessage(t("172"));
                      navigateFun("/Rank");
                    }}
                  >
                    {t("4")}
                  </div>

                  <div
                    className={menuActive("/Market")}
                    onClick={() => {
                      navigateFun("/Market/1");
                    }}
                  >
                    {t("5")}
                  </div>
                  <div
                    className={menuActive("/Swap")}
                    onClick={() => {
                      navigateFun("/Swap");
                    }}
                  >
                    Denim{t("SWAP")}
                  </div>

                  <div
                    className={menuActive("/Bridge")}
                    onClick={() => {
                      // return addMessage(t("172"));

                      navigateFun("/Bridge");
                    }}
                  >
                    {t("DenimBridge")}
                  </div>
                  <div
                    className={menuActive("/Ecology")}
                    onClick={() => {
                      navigateFun("/Ecology");
                    }}
                  >
                    {t("404")}
                  </div>
                </div>

                <div className="MenuItem Manage_Item">
                  <div className="setBox">
                    <Dropdown
                      overlay={menu}
                      placement="bottom"
                      overlayClassName="LangDropDown"
                      trigger={["click"]}
                      arrow={false}
                      getPopupContainer={(triggerNode) => triggerNode}
                      onOpenChange={(value) => {
                        setSwitchState(value);
                      }}
                    >
                      <div className="LangBox">
                        <img src={langIcon} alt="" className="langIcon" />
                        {
                          langObj.find(
                            (item: any) =>
                              String(item.key) === String(i18n.language)
                          )?.value
                        }
                      </div>
                    </Dropdown>
                  </div>
                </div>
                <div className="MenuItem Manage_Item">
                  <div className="setBox">
                    <div
                      className="LangBox"
                      onClick={() => {
                        window.open(twitterLink);
                      }}
                    >
                      <img src={twIcon_m} alt="" className="langIcon" />
                      Twitter
                    </div>
                  </div>
                </div>
                <div className="MenuItem Manage_Item">
                  <div className="setBox">
                    <div
                      className="LangBox"
                      onClick={() => {
                        window.open(tgLink);
                      }}
                    >
                      <img src={tgIcon_m} alt="" className="langIcon" />
                      Telegram
                    </div>
                  </div>
                </div>
              </MenuContainer>
            </SiderContainer>
          </Sider>

          <Outlet />

          {/* <div
          className="mask"
          onClick={() => {
            setInfoCollapsed(true);
          }}
        >
          {t("194")}
        </div> */}
          {!infoCollapsed && (
            <div
              className="mask"
              onClick={() => {
                setInfoCollapsed(true);
              }}
            ></div>
          )}
        </ContentContainer>

        {String(pathname) !== "/BTCEnvironment" && (
          <FooterContainer>
            <FooterContainer_Item1>
              <img
                src={twIcon}
                alt=""
                onClick={() => {
                  window.open(twitterLink);
                }}
              />
              <img
                src={tgIcon}
                alt=""
                onClick={() => {
                  window.open(tgLink);
                }}
              />
              {t("11")} {thousandsSeparator(UserInfoData?.userNum ?? "0") ?? 0}{" "}
              / {t("12")}{" "}
              {thousandsSeparator(UserInfoData?.totalCirculation ?? "0") ?? 0} /
              Mint {UserInfoData?.mintRatio ?? 0}%
            </FooterContainer_Item1>
            <FooterContainer_Item2></FooterContainer_Item2>
            <FooterContainer_Item3></FooterContainer_Item3>
          </FooterContainer>
        )}
      </div>
    </RootBox>
  );
};
export default MainLayout;
