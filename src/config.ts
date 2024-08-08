import Token from "./ABI/ERC20Token.json";
import Stake from "./ABI/Stake.json";
import PassNft from "./ABI/PassNft.json";
import WhiteList from "./ABI/WhiteList.json";
import Inscription from "./ABI/Inscription.json";
import InsMarket from "./ABI/InsMarket.json";
import USDA from "./ABI/USDA.json";
import InsSwap from "./ABI/InsSwap.json";
import InscriptionBox from "./ABI/InscriptionBox.json";
import BTIA from "./ABI/BTIA.json";
import BTIARouter from "./ABI/BTIARouter.json";
import PancakePair from "./ABI/PancakePair.json";

// -
export const LOCAL_KEY = "MBAS_LANG";
export const isMain = true;
// -
export let baseUrl: string = isMain
  ? "https://www.inscriptionalliance.com" + "/user/"
  : "-/";
// "https://inscriptionalliance.com" + "/user/";
// -
export let webSocketUrl: string = isMain
  ? "wss://inscriptionalliance.com/inscriptionLink/inscriptionLink/"
  : "-/";

export let BlockUrl: string = isMain
  ? "https://bscscan.com/tx/"
  : "https://testnet.bscscan.com/tx/";

export let twitterFollow =
  "https://twitter.com/intent/follow?original_referer=https%3A%2F%2Fdeveloper.twitter.com%2F&ref_src=twsrc%5Etfw%7Ctwcamp%5Ebuttonembed%7Ctwterm%5Efollow%7Ctwgr%5ETwitterDev&screen_name=";
export let twitterReply = "https://twitter.com/intent/tweet?in_reply_to=";
export let twitterRetweet = `https://twitter.com/`;
export let twitterLike = "https://twitter.com/";
export let twitterLink = "https://twitter.com/InscripAlliance";
export let tgLink = "https://t.me/InscriptionAlliancecn";
// https://twitter.com/intent/retweet?tweet_id=463440424141459456
interface abiObjType {
  [propName: string]: any;
}
interface contractAddressType {
  [propName: string]: string;
}

export const abiObj: abiObjType = {
  USDT: Token,
  TOKEN: Token,
  Stake: Stake,
  PassNft: PassNft,
  WhiteList: WhiteList,
  Inscription: Inscription,
  InsMarket: InsMarket,
  USDA: USDA,
  InsSwap: InsSwap,
  InscriptionBox: InscriptionBox,
  BTIA: BTIA,
  BTIARouter: BTIARouter,
  PancakePair: PancakePair,
};

export const Main: contractAddressType = {
  USDT: "0x55d398326f99059fF775485246999027B3197955",
  TOKEN: "0xfAF18E53F52122085a8743e2bfb324c0577b98B5",
  Stake: "0xfAF18E53F52122085a8743e2bfb324c0577b98B5",
  PassNft: "0xfAF18E53F52122085a8743e2bfb324c0577b98B5",
  WhiteList: "0x543d7bB5EcC27906999114adE42EeF448869D9A9",
  // -
  Inscription: "0x1a1f8a37b68E96694530E9d5161adc5B5A3aC260",
  InsMarket: "0xa96221f4B9D8bB2228f8968ab606f86A641da636",
  USDA: "0x43d1DD6bF1b005D533aD3a648CdbB949D9a5dE91",
  InsSwap: "0x4EC737cc816533F1faA38fF4793294418317526C",
  InscriptionBox: "0x46D98733Dc3C4e63709a10a0045b4A8402a11e63",
  BTIA: "0x21c404509925a3E14A37D8e737706A15276C8EA5",
  BTIARouter: "0xcde0A9123B5a6375B648488d5F3cD103B3b03B22",
  PancakePair: "0x65d47d638fC68E85be8338328686bbb584606a92",
};

const Test = {
  USDT: "0x2b11640f31b84dc727841FE6B5a905D366A00e78",
  TOKEN: "0xEec2f5a9c17C70081Fed402B04b73B55e291e014",
  Stake: "0x71085fb90ADDF878F936589cF12B8772212e58c4",
  PassNft: "0xb6E7b0249becEc75D44843B7Ab62EFaA1E1D403D",
  WhiteList: "0xB1f1947dBC895479dCABBb0862549489B7223dFD",
  // -
  Inscription: "0x1a1f8a37b68E96694530E9d5161adc5B5A3aC260",
  InsMarket: "0xa96221f4B9D8bB2228f8968ab606f86A641da636",
  USDA: "0x43d1DD6bF1b005D533aD3a648CdbB949D9a5dE91",
  InsSwap: "0x4EC737cc816533F1faA38fF4793294418317526C",
  InscriptionBox: "0xa687138c4c2C19eb6Db1dBeCCBA69D4dCE052200",
  BTIA: "0x21c404509925a3E14A37D8e737706A15276C8EA5",
  BTIARouter: "0xcde0A9123B5a6375B648488d5F3cD103B3b03B22",
  PancakePair: "0x65d47d638fC68E85be8338328686bbb584606a92",
};

export const contractAddress: contractAddressType = isMain ? Main : Test;
// Test
