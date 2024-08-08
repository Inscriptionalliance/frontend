import { useWeb3React } from "@web3-react/core";
import { t } from "i18next";
import { addMessage, showLoding } from "../utils/tool";
import { Contracts } from "../web3";
import useConnectWallet from "./useConnectWallet";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userInfo } from "../API";
import { setAddInfoAction } from "../store/actions";
export const useBindState = () => {
  const dispatch = useDispatch();

  const [BindState, setBindState] = useState<any>(false);
  const state = useSelector((state: any) => state);
  useEffect(() => {
    if (!state?.token) return;
    userInfo({}).then((res: any) => {
      setBindState(!!res?.data?.isBindReferee);
    });
  }, [state?.token]);
  async function getBindStateFun(call1: any, call2: any) {
    if (BindState) {
      return call1();
    } else {
      call2()
      return dispatch(
        setAddInfoAction({ ...state?.userInfo, isBindReferee: true })
      );
    }
  }
  return { getBindStateFun };
};
