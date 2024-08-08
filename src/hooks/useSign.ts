import { useWeb3React } from "@web3-react/core";
import { t } from "i18next";
import { addMessage, showLoding } from "../utils/tool";
import { Contracts } from "../web3";
import useConnectWallet from "./useConnectWallet";
import { useEffect } from "react";
export const useSign = () => {
  const { account } = useWeb3React();
  const { connectWallet } = useConnectWallet();
  useEffect(()=>{
    connectWallet&& connectWallet()
  },[connectWallet])
  async function signFun(callback: any, msg: string) {
    // connectWallet && (await connectWallet());
    // connectWallet()
    if (!account) return addMessage(t("Please link wallet"));
    let time = new Date().valueOf();
    showLoding(true);
    Contracts.example
      .Sign(account as string, `${msg}&time=${time}`)
      .then((res: string) => {
        callback({ sign: res, msg: `${msg}&time=${time}` });
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
  return { signFun };
};
