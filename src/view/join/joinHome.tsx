import "../../assets/style/join/home.scss";
import black from "../../assets/image/join/black.png";
import green from "../../assets/image/join/green.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../../lang/i18n";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { FlexCCBox } from "../../components/FlexBox";

const BannerDiv = styled(FlexCCBox)<{ src: any }>`
  background-image: ${({ src }) => `url(${src})`};
  background-position: center;
  background-size: 100% 100%; //-
  background-repeat: no-repeat;
`;

const JoinHome = () => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const location = useLocation();

  const [isEn, setIsEn] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("coder");
    if (code) {
      setCode(code);
    }
  }, []);

  useEffect(() => {
    if (i18n.language === "zh") {
      setIsEn(false);
    } else {
      setIsEn(true);
    }
  }, [i18n.language]);

  const jump = () => {
    if (code) {
      nav(`/View/join/step?code=${code}`);
    } else {
      nav("/View/join/step");
    }
  };

  return (
    <div className="j_home">
      <div>
        <div className={`left ${isEn ? "En" : "Zh"}`}></div>

        <div className="right">
          <div>{t("39")}</div>
          <div>{t("40")}</div>

          {/* <div style={{ fontSize: isEn ? "1.455rem" : "" }}> */}
          <BannerDiv src={black}>
            {/* <img src={black} alt="" /> */}
            {t("41")}
          </BannerDiv>
          <BannerDiv src={black}>
            {/* <img src={black} alt="" /> */}
            {t("99")}
          </BannerDiv>

          <div onClick={jump}>
            <img src={green} alt="" />
            {t("42")}
          </div>
          <div>{t("43")}</div>
        </div>
      </div>
    </div>
  );
};

export default JoinHome;
