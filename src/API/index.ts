import axois from "../utils/axiosExport";
interface LoginData {
  password: string;
  refereeUserAddress: string;
  userAddress: string;
  userPower: number;
}

export function Login(data: LoginData) {
  return axois.request({
    url: "/user/loginByPass",
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function bottomData(data: any) {
  return axois.request({
    url: "/uUserBaseInfo/bottomData",
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function teamInfo(data: any) {
  return axois.request({
    url: "/uUserBaseInfo/teamInfo",
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}

//-
export function acceptInvite(data: string) {
  return axois.request({
    url: "/user/userRefereeNum",
    method: "post",
    data: {
      refereeNum: data,
    },
  });
}

//-
export function Xarticle() {
  return axois.request({
    url: "/uUserBaseInfo/forwardTwitter",
    method: "post",
  });
}

//-
export function guanzhu() {
  return axois.request({
    url: "/uUserBaseInfo/interestTwitter",
    method: "post",
  });
}

export function guanzhuDis() {
  return axois.request({
    url: "/uUserBaseInfo/joinDiscord",
    method: "post",
  });
}

//-
export function lastStep() {
  return axois.request({
    url: "/uUserBaseInfo/checkRequirement",
    method: "post",
  });
}

export function joinsys() {
  return axois.request({
    url: "/uUserBaseInfo/joinSystem",
    method: "post",
  });
}

export function canUseCode() {
  return axois.request({
    url: "/uUserRefereeNum/validRefereeNumList",
    method: "post",
  });
}

export function notCanUseCode() {
  return axois.request({
    url: "/uUserRefereeNum/invalidRefereeNumList",
    method: "post",
  });
}

export function inviteRecord() {
  return axois.request({
    url: "/uUserRefereeNum/refereeNumUserList",
    method: "post",
  });
}

//-
export function whichType() {
  return axois.request({
    url: "/user/userInfo",
    method: "post",
  });
}

//-
export function getTimes(type: number) {
  return axois.request({
    url: `/lotteryDraw/typeInfo`,
    method: "post",
    data: {
      type,
    },
  });
}

export function userInfo(data: any) {
  return axois.request({
    url: "/user/userInfo",
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function checkOauth2(data: any) {
  return axois.request({
    url: "/twitter/checkOauth2",
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function oauth2Url(data: any) {
  return axois.request({
    url: "/twitter/oauth2Url",
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function checkBindTwitter(data: any) {
  return axois.request({
    url: "/uUserBaseInfo/checkBindTwitter",
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function oauth2CallBack(state: any, code: any) {
  return axois.request({
    url: `/twitter/oauth2CallBack?state=${state}&code=${code}`,
    method: "get",
  });
}
export function checkFollowsTwitter(data: any) {
  return axois.request({
    url: `/uUserBaseInfo/checkFollowsTwitter`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function interestTwitterInfo(data: any) {
  return axois.request({
    url: `/uUserBaseInfo/interestTwitterInfo`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function taskList(data: any) {
  return axois.request({
    url: `/task/taskList`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function checkFulfil(data: any) {
  return axois.request({
    url: `/task/checkFulfil`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function loginIncome(data: any) {
  return axois.request({
    url: `/uUserBaseInfo/loginIncome`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}

//-
export function PostMF(freeNum: number, toAddress: string) {
  return axois.request({
    url: "/freeTransfer/transfer",
    method: "post",
    data: {
      freeNum,
      toAddress,
    },
  });
}

export function whitePayList(data: any) {
  return axois.request({
    url: `/whitePay/whitePayList`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}

export function freeTransferList(data: any) {
  return axois.request({
    url: `/freeTransfer/freeTransferList`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}

export function communityList(data: any) {
  return axois.request({
    url: `/community/communityList`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function communityLike(data: any) {
  return axois.request({
    url: `/community/like`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function typeInfo(data: any) {
  return axois.request({
    url: `/lotteryDraw/typeInfo`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function mintRank(data: any) {
  return axois.request({
    url: `/mintRank/mintRank`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function teamRank(data: any) {
  return axois.request({
    url: `/teamRank/teamRank`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function communityRank(data: any) {
  return axois.request({
    url: `/communityRank/communityRank`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function lastReferee(data: any) {
  return axois.request({
    url: `/uUserReferee/lastReferee`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function lotteryDrawTypeInfo(data: any) {
  return axois.request({
    url: `/lotteryDraw/typeInfo`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function lotteryDraw(data: any) {
  return axois.request({
    url: `/lotteryDraw/lotteryDraw`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function communityLikeData(data: any) {
  return axois.request({
    url: `/task/communityLikeData`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function mintDeployInfo(data: any) {
  return axois.request({
    url: `/mintDeploy/info`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function mintUserMintList(data: any) {
  return axois.request({
    url: `/mintUser/mintList`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function mintUserMintRankList(data: any) {
  return axois.request({
    url: `/mintUser/mintRankList`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function mint(data: any) {
  return axois.request({
    url: `/mintUser/mint`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function myMint(data: any) {
  return axois.request({
    url: `/mintHangSale/myMint`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function hangSaleList(data: any) {
  return axois.request({
    url: `/mintHangSale/hangSaleList`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function hangSale(data: any) {
  return axois.request({
    url: `/mintHangSale/hangSale`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function withdraw(data: any) {
  return axois.request({
    url: `/mintHangSale/withdraw`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function pay(data: any) {
  return axois.request({
    url: `/mintHangSale/pay`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function transfer(data: any) {
  return axois.request({
    url: `/mintTransfer/transfer`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function mintSwap(data: any) {
  return axois.request({
    url: `/mintSwap/swap`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function mintSwapInfo(data: any) {
  return axois.request({
    url: `/mintSwap/info`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function getPrice(data: any) {
  return axois.request({
    url: `/mintSwap/getPrice`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function drawSwapUsda(data: any) {
  return axois.request({
    url: `/mintSwap/drawSwapUsda`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function payBox(data: any) {
  return axois.request({
    url: `/mintUser/payBox`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function mintUserBox(data: any) {
  return axois.request({
    url: `/mintUserBox/info`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function mintUserBoxBridge(data: any) {
  return axois.request({
    url: `/mintUserBox/bridge`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function bridgePay(data: any) {
  return axois.request({
    url: `/mintUserBox/bridgePay`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
// /mintUserBox/bridgeRecordList
export function bridgeRecordList(data: any) {
  return axois.request({
    url: `/mintUserBox/bridgeRecordList`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}

export function mintUserBoxInfo(data: any) {
  return axois.request({
    url: `/mintUserBox/info`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function bridgeBalanceList(data: any) {
  return axois.request({
    url: `/mintUserBox/bridgeBalanceList`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function vipUserInfo(data: any) {
  return axois.request({
    url: `/vipUser/info`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function communityListPassToken(data: any) {
  return axois.request({
    url: `/community/communityList/passToken`,
    method: "post",
    data: {
      ...data,
      // Encrypt: true
    },
  });
}
export function pledgeStatus(data: any) {
  return axois.request({
    url: `/btiaPledge/pledgeStatus`,
    method: "post",
    data: {
      ...data,
    },
  });
}
export function pledgeInfo(data: any) {
  return axois.request({
    url: `/btiaPledge/pledgeInfo`,
    method: "post",
    data: {
      ...data,
    },
  });
}
export function btiaPledge(data: any) {
  return axois.request({
    url: `/btiaPledge/pledge`,
    method: "post",
    data: {
      ...data,
    },
  });
}

export function pledgeIncomeList(data: any) {
  return axois.request({
    url: `/btiaIncome/pledgeIncomeList`,
    method: "post",
    data: {
      ...data,
    },
  });
}

export function mintAuth(data: any) {
  return axois.request({
    url: `/mintUser/mintAuth`,
    method: "post",
    data: {
      ...data,
    },
  });
}
export function payBoxAuth(data: any) {
  return axois.request({
    url: `/mintUser/payBoxAuth`,
    method: "post",
    data: {
      ...data,
    },
  });
}
export function receiveIncome(data: any) {
  return axois.request({
    url: `/btiaIncome/receiveIncome`,
    method: "post",
    data: {
      ...data,
    },
  });
}
export function mintRankCommunity(data: any) {
  return axois.request({
    url: `/mintRank/mintRankCommunity`,
    method: "post",
    data: {
      ...data,
    },
  });
}
export function mintRankNode(data: any) {
  return axois.request({
    url: `/mintRank/mintRankUser`,
    method: "post",
    data: {
      ...data,
    },
  });
}
export function transferAuth(data: any) {
  return axois.request({
    url: `/mintTransfer/transferAuth`,
    method: "post",
    data: {
      ...data,
    },
  });
}
export function mintStatus(data: any) {
  return axois.request({
    url: `/mintUser/mintStatus`,
    method: "post",
    data: {
      ...data,
    },
  });
}
export function mintRankPhase(data: any) {
  return axois.request({
    url: `/mintRank/mintRankPhase`,
    method: "post",
    data: {
      ...data,
    },
  });
}
export function mintRankCommunitySelectedRank(data: any) {
  return axois.request({
    url: `/mintRank/mintRankCommunitySelectedRank`,
    method: "post",
    data: {
      ...data,
    },
  });
}
export function mintRankNodeSelectedRank(data: any) {
  return axois.request({
    url: `/mintRank/mintRankUserSelectedRank`,
    method: "post",
    data: {
      ...data,
    },
  });
}
// -
export function authStatusList(data: any) {
  return axois.request({
    url: `/uUserAuthNum/authStatusList`,
    method: "post",
    data: {
      ...data,
    },
  });
}
export function mintAuthError(data: any) {
  return axois.request({
    url: `/mintUser/mintAuthError`,
    method: "post",
    data: {
      ...data,
    },
  });
}
export function payBoxAuthError(data: any) {
  return axois.request({
    url: `/mintUser/payBoxAuthError`,
    method: "post",
    data: {
      ...data,
    },
  });
}
export function mintListUser(data: any) {
  return axois.request({
    url: `/mintUser/mintListUser`,
    method: "post",
    data: {
      ...data,
    },
  });
}
export function refereeList(data: any) {
  return axois.request({
    url: `/vipUser/refereeList`,
    method: "post",
    data: {
      ...data,
    },
  });
}
export function vipUserCommunityList(data: any) {
  return axois.request({
    url: `/vipUser/communityList`,
    method: "post",
    data: {
      ...data,
    },
  });
}
