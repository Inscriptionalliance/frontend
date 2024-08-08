import { Modal } from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";
import cjcg from "../../assets/image/Mint/cjcg.png";
import jfFt from "../../assets/image/Mint/jfFt2.png";
import "./success.scss";
import { useTranslation } from "react-i18next";
import { resultObj } from "../../view/Mint/Mint2";

interface RefType {
  showModal: () => void;
}

const SuccessModal = forwardRef<any, any>((props, ref) => {
  const { t, i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    props.fun();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    props.fun();
  };
  return (
    <Modal
      className="successModal mysuccessModal"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose={true}
      centered
      // width={100}
    >
      <img src={cjcg} alt="" />
      <img
        src={
          i18n.language === "zh"
            ? resultObj[props?.data?.prizeUnit]?.icon
            : resultObj[props?.data?.prizeUnit]?.iconEn
        }
        alt=""
      />
      <span>
        {props?.data?.prizeNum}
        {t(resultObj[props?.data?.prizeUnit]?.name)}
      </span>
      <span></span>
      <div onClick={handleCancel}>{t("119")}</div>
    </Modal>
  );
});

export default SuccessModal;
