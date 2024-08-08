import { Modal } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import sb from "../../assets/image/Mint/sbBack.png";
import closer from "../../assets/image/Mint/close.png";
import "./error.scss";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useConnect } from "../../hooks/useConnect";
import { oauth2CallBack, oauth2Url } from "../../API";
import { addMessage } from "../../utils/tool";
import { useBindState } from "../../hooks/useBindState";

interface RefType {
  showModal: () => void;
}

const GoToBind = forwardRef<any, any>((props: any, ref) => {
  const { t } = useTranslation();
  const location = useLocation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { connectFun } = useConnect();
  const queryParams = new URLSearchParams(location.search);
  const state = queryParams.get("state");
  const twApproveCode = queryParams.get("code");
  const { getBindStateFun } = useBindState();

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
  const zftw = () => {
    connectFun(
      () => {
        oauth2Url({}).then(async (res: any) => {
          if (res.code === 200) {
            await window.open(res.data);
          } else {
            return addMessage(res.msg);
          }
        });
      },
      () => {}
    );
  };
  const handleCancel = () => {
    // navigate("/View/join/step");
    zftw();
  };

  useEffect(() => {
    if (!!twApproveCode && state) {
      oauth2CallBack(state, twApproveCode).then((res: any) => {
        if (res.code === 200) {
          // -
          props.fun();
        } else {
          addMessage(res.msg);
        }
      });
    }
  }, [twApproveCode, state]);

  return (
    <Modal
      className="errorModal "
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose={true}
    >
      <img src={sb} alt="" className="goushi" />
      <img src={closer} alt="" onClick={handleOk} />
      <span>{t("164")}</span>
      <div>{t("165")}</div>
      <div
        onClick={
          // handleCancel
          () => {
            getBindStateFun(handleCancel, handleOk);
          }
        }
      >
        {t("166")}
      </div>
    </Modal>
  );
});

export default GoToBind;
