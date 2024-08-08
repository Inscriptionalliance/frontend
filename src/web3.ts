import { useCallback, useMemo } from "react";
// import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { Contract } from "web3-eth-contract";
import { provider } from "web3-core";
import Web3 from "web3";
import { abiObj, contractAddress, isMain } from "./config";
import BigNumber from "big.js";
declare let window: any;
interface contractType {
  [propName: string]: Contract;
}
export const ChainId = {
  // BSC: "0x61",
  BSC: isMain ? "0x38" : "0x61",
};
//-
const SCAN_ADDRESS = {
  [ChainId.BSC]: "https://bscscan.com",
};
//-
export const networkConf = {
  [ChainId.BSC]: {
    // chainId: '0x61',
    chainId: isMain ? "0x38" : "0x61",
    chainName: "BSC",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: isMain
      ? ["https://bsc-dataseed.binance.org/"]
      : ["https://bsc-testnet.public.blastapi.io"],
    blockExplorerUrls: [SCAN_ADDRESS[ChainId.BSC]],
  },
};

//-
export const changeNetwork = (chainId: number) => {
  return new Promise<void>((reslove) => {
    const { ethereum } = window;
    if (ethereum && ethereum.isMetaMask && networkConf[chainId]) {
      ethereum
        .request({
          method: "wallet_addEthereumChain",
          params: [
            {
              ...networkConf[chainId],
            },
          ],
        })
        .then(() => {
          setTimeout(reslove, 500);
        });
    } else {
      reslove();
    }
  });
};

export class Contracts {
  //-
  static example: Contracts;
  web3: Web3;
  contract: contractType = {};
  constructor(library: provider) {
    this.web3 = new Web3(library);
    //-
    Contracts.example = this;
  }
  //-
  verification(contractName: string) {
    if (!this.contract[contractName]) {
      try {
        this.contract[contractName] = new this.web3.eth.Contract(
          abiObj[contractName],
          contractAddress[contractName]
        );
      } catch (e) {}
    }
  }
  //-

  //-NB-
  getBalance(addr: string) {
    return this.web3.eth.getBalance(addr);
  }
  totalSupply(addr: string) {
    this.verification("BKBK");
    return this.contract.BKBK?.methods.totalSupply().call({ from: addr });
  }
  //-
  balanceOf(addr: string, contractName: string) {
    try {
      this.verification(contractName);
      let obj = new this.web3.eth.Contract(
        abiObj[contractName],
        contractAddress[contractName]
      );
      return obj?.methods.balanceOf(addr).call({ from: addr });
    } catch (e) {}
  }
  symbol(addr: string, contractName: string) {
    try {
      this.verification(contractName);
      let obj = new this.web3.eth.Contract(
        abiObj[contractName],
        contractAddress[contractName]
      );
      return obj?.methods.symbol().call({ from: addr });
    } catch (e) {}
  }
  //-
  Tokenapprove(addr: string, toaddr: string, contractName: string) {
    try {
      this.verification(contractName);
      let obj = new this.web3.eth.Contract(
        abiObj[contractName],
        contractAddress[contractName]
      );
      return obj?.methods.allowance(addr, toaddr).call({ from: addr });
    } catch (e) {}
  }
  //-
  approve(addr: string, toaddr: string, contractName: string, amount: string) {
    try {
      this.verification(contractName);
      let obj = new this.web3.eth.Contract(
        abiObj[contractName],
        contractAddress[contractName]
      );
      // var amount = Web3.utils.toBN("99999999999999999999999999999999")
      var amounted = Web3.utils.toWei(amount + "", "ether");
      return obj?.methods
        .approve(toaddr, amounted)
        .send({ from: addr, gasPrice: "2000000000" });
    } catch (e) {}
  }

  //-
  Sign(addr: string, msg: string) {
    return this.web3.eth.personal.sign(
      this.web3.utils.utf8ToHex(msg) as string,
      addr,
      "123"
    );
  }

  getWhiteListState(addr: string) {
    this.verification("WhiteList");
    return this.contract.WhiteList?.methods
      .getWhiteListState()
      .call({ from: addr });
  }

  buyWhiteList(addr: string, amount: any) {
    this.verification("WhiteList");

    // var amounted = Web3.utils.toWei(Number.MAX_SAFE_INTEGER + "", "ether");
    return this.contract?.WhiteList.methods
      ?.buyWhiteList(amount)
      .send({ from: addr, gasPrice: "2000000000" });
  }
  mint(addr: string, data: any, price: string) {
    this.verification("InscriptionBox");

    var amounted = Web3.utils.toWei(price + "", "ether");
    return this.contract?.InscriptionBox.methods
      ?.mint(data)
      .send({ from: addr, gasPrice: "2000000000", value: amounted });
  }
  queryWethByUsdt(addr: string, amount: string) {
    this.verification("InscriptionBox");
    var amounted = Web3.utils.toWei(amount + "", "ether");
    return this.contract?.InscriptionBox.methods
      ?.queryWethByUsdt(amounted)
      .call({ from: addr });
  }

  sendTransaction(
    addr: string,
    toaddr: string,
    data: any,
    callFun: any = () => {}
  ) {
    return this.web3.eth.sendTransaction(
      {
        from: addr,
        to: toaddr,
        gasPrice: "2000000000",
        value: 0,
        data: data,
      },
      callFun
    );
  }

  cancle(addr: string, data: any, price: string) {
    this.verification("InsMarket");

    var amounted = Web3.utils.toWei(price + "", "ether");
    return this.contract?.InsMarket.methods
      ?.cancle(data)
      .send({ from: addr, gasPrice: "2000000000", value: amounted });
  }
  buy(addr: string, data: any, price: string) {
    this.verification("InsMarket");

    var amounted = Web3.utils.toWei(price + "", "ether");
    console.log(amounted, "amounted12");

    return this.contract?.InsMarket.methods
      ?.buy(data)
      .send({ from: addr, gasPrice: "2000000000", value: amounted });
  }

  // USDA
  swap(addr: string, tokenIn: string, tokenOut: string, tokenInAmount: string) {
    this.verification("USDA");

    var amounted = Web3.utils.toWei(tokenInAmount + "", "ether");
    console.log(tokenIn, tokenOut, amounted);

    return this.contract?.USDA.methods
      ?.swap(tokenIn, tokenOut, amounted)
      .send({ from: addr, gasPrice: "2000000000" });
  }

  swapToBIIA(addr: string, data: any, price: string) {
    this.verification("InsSwap");

    var amounted = Web3.utils.toWei(price + "", "ether");
    console.log(data, amounted, "lunxun");

    return this.contract?.InsSwap.methods
      ?.swap(data)
      .send({ from: addr, gasPrice: "2000000000", value: amounted });
  }

  mintBox(addr: string, data: any, price: any, callFun: any = () => {}) {
    this.verification("InscriptionBox");
    var amounted = Web3.utils.toWei(price + "", "ether");
    console.log(data, amounted);
    return this.contract?.InscriptionBox.methods
      ?.bindBox(data)
      .send({ from: addr, gasPrice: "2000000000", value: amounted }, callFun);
  }
  bridge(addr: string, data: any) {
    this.verification("BTIA");
    return this.contract?.BTIA.methods
      ?.bridge(data)
      .send({ from: addr, gasPrice: "2000000000" });
  }

  token0(addr: string, address: any) {
    try {
      this.verification("PancakePair");
      let obj = new this.web3.eth.Contract(abiObj["PancakePair"], address);

      // console.log(this.contract.PancakePair);
      return obj?.methods.token0().call({ from: addr });
    } catch (e) {}
  }

  getReserves(addr: string, address: any) {
    try {
      this.verification("PancakePair");
      let obj = new this.web3.eth.Contract(abiObj["PancakePair"], address);

      // console.log(this.contract.PancakePair);
      return obj?.methods.getReserves().call({ from: addr });
    } catch (e) {}
  }
  getAmountsOut(addr: string, address: any, amount: string) {
    this.verification("BTIARouter");
    var amounted = Web3.utils.toWei(amount + "", "ether");
    console.log(amounted, "amounted");

    return this.contract?.BTIARouter?.methods
      .getAmountsOut(amounted, address)
      .call({ from: addr });
  }

  swapExactTokensForTokensSupportingFeeOnTransferTokens(
    addr: string,
    amount1: string,
    arr: any
  ) {
    this.verification("BTIARouter");
    var amounted = Web3.utils.toWei(amount1 + "", "ether");

    let time = +new Date() + 300;
    console.log(amounted, arr, addr, time, "amounted");
    return this.contract.BTIARouter?.methods
      .swapExactTokensForTokensSupportingFeeOnTransferTokens(
        amounted,
        0,
        arr,
        addr,
        time
      )
      .send({ from: addr, gasPrice: "2000000000" });
  }
}
