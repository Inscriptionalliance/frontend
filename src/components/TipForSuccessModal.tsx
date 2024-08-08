import React from "react";
import { InfoModal } from "../view/Market/InscriptionDetail";
import { InfoModalBg } from "../assets/image/MarketBox";
import { closeIcon } from "../assets/image/LayoutBox";
import { SuccessIcon } from "../assets/image/MintBox";
import { SuccessfulModal_Content } from "../view/Market/Sale";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

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

const TipForSuccessModal = (props: any) => {
  const { t } = useTranslation();
  return (
    <InfoModal
      visible={props.show}
      className="Modal"
      centered
      width={440}
      closable={false}
      footer={null}
      onCancel={() => {
        props.close(false);
      }}
      src={InfoModalBg}
    >
      <div
        className="close"
        onClick={() => {
          props.close(false);
        }}
      >
        <img src={closeIcon} alt="" />
      </div>
      <MintTitleModal>{t(props.tip)}</MintTitleModal>

      <SuccessfulModal_Content>
        <SuccessIcon />
      </SuccessfulModal_Content>
    </InfoModal>
  );
};

export default TipForSuccessModal;
