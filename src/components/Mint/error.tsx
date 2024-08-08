import { Modal } from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";
import sb from "../../assets/image/Mint/sbBack.png";
import closer from "../../assets/image/Mint/close.png";
import "./error.scss";
import { useTranslation } from "react-i18next";
import i18n from "../../lang/i18n";
import { useNavigate } from "react-router-dom";

interface RefType {
  showModal: () => void;
}

const ErrorModal = forwardRef<RefType>((props, ref) => {
  const { t } = useTranslation();
  const Navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const langArr = {
    zh: { c1: "您不能抽獎了，", c2: "請完成一些任務以獲得更多機會。" },
    en: {
      c1: "You have no more draws,",
      c2: "please complete some tasks to get more chances.",
    },
    ja: {
      c1: "宝くじを引くことはできませんが、",
      c2: "より多くのチャンスを得るには、いくつかのタスクを完了してください。",
    },
    fr: {
      c1: "Vous ne pouvez pas tirer à la loterie,",
      c2: "Veuillez effectuer certaines tâches pour obtenir plus d'opportunités.",
    },
    ko: {
      c1: "로또를 뽑을 수는 없잖아요.",
      c2: "더 많은 기회를 얻으려면 몇 가지 작업을 완료하세요.",
    },
  };

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
  };
  return (
    <Modal
      className="errorModal "
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose={true}
    >
      <img src={sb} alt="" />
      <img src={closer} alt="" onClick={handleCancel} />
      <span>{t("100")}</span>
      {i18n.language === "zh" ? (
        <div>
          您不能抽獎了，
          <br /> 請完成一些任務以獲得更多機會。
        </div>
      ) : (
        <div style={{ marginBottom: "20px", fontSize: "14px" }}>
          {langArr[i18n.language]?.c1}
          <br /> {langArr[i18n.language]?.c2}
        </div>
      )}
      <div
        onClick={() => {
          handleCancel();
          Navigate("/View/join/person");
        }}
      >
        {t("102")}
      </div>
    </Modal>
  );
});

export default ErrorModal;
