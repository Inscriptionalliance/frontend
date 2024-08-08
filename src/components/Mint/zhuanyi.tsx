import { Input, Modal } from "antd";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import logo from "../../assets/image/Mint/transfer.png";
import "./zhuanyi.scss";


interface RefType {
  showModal: () => void;
}

const WhiteName = forwardRef<RefType>((props, ref) => {
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
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      className="zhuanyi"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose={true}
    >
      
    </Modal>
  );
});

export default WhiteName;
