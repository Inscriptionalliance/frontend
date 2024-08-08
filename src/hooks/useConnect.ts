import { useWeb3React } from "@web3-react/core";
import { t } from "i18next";
import { addMessage, showLoding } from "../utils/tool";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { checkOauth2 } from "../API";
export const useConnect = () => {
  const { account } = useWeb3React();
  const token = useSelector<any>((state) => state.token);

  async function connectFun(callback0: any, callback1: any) {
    // connectWallet && (await connectWallet());
    // connectWallet()
    if (!token) return addMessage(t("failed"));
    checkOauth2({})
      .then((res: any) => {
        if (res.code === 200) {
          // showLoding(true);
          callback1();
        } else {
          callback0();
        }
      })
      .catch((res: any) => {
        if (res.code === 4001) {
          addMessage(t("failed"));
          showLoding(false);
        }
      })
      .finally(() => {
        showLoding(false);
      });
  }
  return { connectFun };
};
