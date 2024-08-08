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
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { AddrHandle, addMessage, showLoding } from "../utils/tool";
import { vipUserInfo, withdraw } from "../API";
import EcologyBanner from "../assets/image/Ecology/EcologyBanner.png";
import EcologyImg1 from "../assets/image/Ecology/EcologyImg1.png";
import EcologyImg2 from "../assets/image/Ecology/EcologyImg2.png";
import EcologyImg3 from "../assets/image/Ecology/EcologyImg3.png";
import EcologyImg4 from "../assets/image/Ecology/EcologyImg4.png";
import EcologyImg5 from "../assets/image/Ecology/EcologyImg5.png";
import EcologyImg6 from "../assets/image/Ecology/EcologyImg6.png";
import EcologyImg7 from "../assets/image/Ecology/EcologyImg7.png";
import EcologyImg8 from "../assets/image/Ecology/EcologyImg8.png";
import GoToIcon from "../assets/image/Ecology/GoToIcon.svg";
import Web3 from "web3";
import i18n from "../lang/i18n";
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

const CommunityContainer = styled.div`
  padding: 10rem 0px;
  width: 100%;
  > div {
    margin-bottom: 25px;
  }

  @media (max-width: 1400px) {
    padding: 20px;
  }
`;
const CommunityContainer_Box = styled.div`
  max-width: 1200px;
  margin: auto;
`;

export const NoDataContainer = styled(FlexCCBox)`
  padding: 50px;
`;

const EcologyBanner_Container = styled(FlexCCBox)<{ src: any }>`
  width: 100%;
  padding: 80px 118px;
  background-image: ${({ src }) => `url(${src})`};
  background-position: center;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  border-radius: 40px;
  box-shadow: 7px 7px 12px 0px #000 inset,
    -7px -7px 12px 0px rgba(255, 255, 255, 0.2) inset;
  backdrop-filter: blur(28.5px);
  z-index: 1;
  margin-bottom: 50px;
  @media (max-width: 650px) {
    padding: 50px 12px;
    border-radius: 18px;
    box-shadow: 2.464px 2.464px 4.224px 0px #000 inset,
      -1.76px -1.76px 2.464px 0px rgba(255, 255, 255, 0.2) inset;
    backdrop-filter: blur(10.033162117004395px);
    margin-bottom: 3.3333rem;
  }
`;
const EcologyBanner_Box = styled.div`
  width: 100%;
  > div {
    color: #fff;
    font-family: "CKTKingkong";
    font-size: 30px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    &:first-child {
      margin-bottom: 25px;
    }
    span {
      color: #95fa31;
      font-family: "CKTKingkong";
      font-size: 30px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
    }
  }
  @media (max-width: 650px) {
    > div {
      color: #fff;
      font-family: "Gen Shin Gothic P";
      font-size: 18px;
      font-style: normal;
      font-weight: 900;
      line-height: normal;
      &:first-child {
        margin-bottom: 5px;
      }
      span {
        color: #95fa31;
        font-family: "Gen Shin Gothic P";
        font-size: 18px;
        font-style: normal;
        font-weight: 900;
        line-height: normal;
      }
    }
  }
`;

const Ecology_Content = styled.div`
  width: 100%;
`;

const Ecology_Content_Title = styled.div`
  color: #fff;
  font-family: "CKTKingkong";
  font-size: 26px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 20px;
  @media (max-width: 650px) {
    color: #fff;
    font-family: "Gen Shin Gothic P";
    font-size: 18px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
    margin-bottom: 12px;
  }
`;

const Devider_Line = styled.div`
  width: 100%;
  height: 2px;
  opacity: 0.6;
  background: linear-gradient(
    90deg,
    #95fa31 1.07%,
    rgba(149, 250, 49, 0) 100.4%
  );
  @media (max-width: 650px) {
    height: 1px;
  }
`;
const Ecology_Content_Items = styled(FlexBox)`
  justify-content: space-between;
  width: 100%;
  padding: 50px 0px;
  > div {
    width: 30%;
  }

  @media (max-width: 650px) {
    display: block;
    padding: 20px 0px 3.3333rem;
    > div {
      width: 100%;
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0px;
      }
    }
  }
`;
const Ecology_Content_Items1 = styled(FlexBox)`
  justify-content: space-between;
  width: 100%;
  padding: 50px 0px;
  > div {
    width: 30%;
  }

  @media (max-width: 650px) {
    display: block;
    padding: 20px 0px 0rem;
    > div {
      width: 100%;
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0px;
      }
    }
  }
`;
const Ecology_Content_Item = styled.div`
  width: 100%;
  padding: 14px 22px;
  border-radius: 40px;
  background: linear-gradient(113deg, #1b1b1b 0%, #333 100%);
  box-shadow: -10px -10px 20px 0px rgba(255, 255, 255, 0.2),
    15px 17px 20px 0px #000;
  backdrop-filter: blur(28.5px);
  > img {
    width: 100%;
  }
  @media (max-width: 650px) {
    padding: 18px 20px;
    border-radius: 18px;
    background: linear-gradient(95deg, #1b1b1b 0%, #333 100%);
    box-shadow: -4px -4px 8px 0px rgba(255, 255, 255, 0.2), 4px 4px 8px 0px #000;
    backdrop-filter: blur(9.72891616821289px);
  }
`;
const Ecology_Content_Item_Title = styled(FlexSBCBox)`
  color: #fff;
  font-family: "CKTKingkong";
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin: 30px 0px 12px;
  @media (max-width: 650px) {
    color: #fff;
    font-family: "Gen Shin Gothic P";
    font-size: 16px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
    margin: 14px 0px 7px;

    > img {
      width: 20px;
    }
  }
`;

const Ecology_Content_Item_Content = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-family: "CKTKingkong";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  @media (max-width: 650px) {
    color: rgba(255, 255, 255, 0.8);
    font-family: "Gen Shin Gothic P";
    font-size: 12px;
    font-style: normal;
    font-weight: 900;
    line-height: normal;
  }
`;

export default function Community() {
  const token = useSelector<any>((state) => state.token);
  const { t } = useTranslation();
  const web3React = useWeb3React();
  const { width } = useViewport();
  const Navigate = useNavigate();
  const scrollContainerRef = useRef<any>(null);

  const EcologyList = {
    RWA: [
      {
        img: EcologyImg1,
        title: "Ekta",
        content: "408",
      },
      {
        img: EcologyImg2,
        title: "Crafting Finance",
        content: "409",
      },
      {
        img: EcologyImg3,
        title: "AssetMantle",
        content: "410",
      },
    ],
    DePIN: [
      {
        img: EcologyImg4,
        title: "Cudos",
        content: "411",
      },
      {
        img: EcologyImg5,
        title: "Dimitra",
        content: "412",
      },
    ],
    GameFi: [
      // {
      //   img: EcologyImg6,
      //   title: "Free Birds",
      //   content: "413",
      // },
      {
        img: EcologyImg7,
        title: "Catizen",
        content: "414",
      },
      {
        img: EcologyImg8,
        title: "RFOX",
        content: "415",
      },
    ],
  };

  useEffect(() => {
    if (token) {
    }
  }, [token]);

  return (
    <CommunityContainer>
      <CommunityContainer_Box>
        <EcologyBanner_Container src={EcologyBanner}>
          <EcologyBanner_Box>
            <div>
              {t("405")}
              <span> Inscription Alliance </span>
              {t("406")}
            </div>
            <div>{t("407")}</div>
          </EcologyBanner_Box>
        </EcologyBanner_Container>

        <Ecology_Content>
          <Ecology_Content_Title>RWA</Ecology_Content_Title>
          <Devider_Line></Devider_Line>
          <Ecology_Content_Items>
            {EcologyList["RWA"].map((item: any, index: any) => (
              <Ecology_Content_Item key={index}>
                <img src={item.img} alt="" />
                <Ecology_Content_Item_Title>
                  {item.title} <img src={GoToIcon} alt="" />
                </Ecology_Content_Item_Title>
                <Ecology_Content_Item_Content>
                  {t(item.content)}
                </Ecology_Content_Item_Content>
              </Ecology_Content_Item>
            ))}
          </Ecology_Content_Items>
        </Ecology_Content>
        <Ecology_Content>
          <Ecology_Content_Title>DePIN</Ecology_Content_Title>
          <Devider_Line></Devider_Line>
          <Ecology_Content_Items1>
            {EcologyList["DePIN"].map((item: any, index: any) => (
              <Ecology_Content_Item key={index}>
                <img src={item.img} alt="" />
                <Ecology_Content_Item_Title>
                  {item.title} <img src={GoToIcon} alt="" />
                </Ecology_Content_Item_Title>
                <Ecology_Content_Item_Content>
                  {t(item.content)}
                </Ecology_Content_Item_Content>
              </Ecology_Content_Item>
            ))}
            <div></div>
          </Ecology_Content_Items1>
        </Ecology_Content>

        <Ecology_Content>
          <Ecology_Content_Title>GameFi</Ecology_Content_Title>
          <Devider_Line></Devider_Line>
          <Ecology_Content_Items>
            {EcologyList["GameFi"].map((item: any, index: any) => (
              <Ecology_Content_Item key={index}>
                <img src={item.img} alt="" />
                <Ecology_Content_Item_Title>
                  {item.title} <img src={GoToIcon} alt="" />
                </Ecology_Content_Item_Title>
                <Ecology_Content_Item_Content>
                  {t(item.content)}
                </Ecology_Content_Item_Content>
              </Ecology_Content_Item>
            ))}
            <div></div>
          </Ecology_Content_Items>
        </Ecology_Content>
      </CommunityContainer_Box>
    </CommunityContainer>
  );
}
