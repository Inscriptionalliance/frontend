export const SETADDRESS = "SETADDRESS";
export const SAVEPRICE = "SAVEPRICE";

export const LOGINSUCCESS = "LOGINSUCCESS";
//-
export interface loginSuccess {
  type: typeof LOGINSUCCESS;
  value: {
    address: string;
    token: string;
  };
}
//-ction
export const createLoginSuccessAction = (
  token: string,
  address: string
): loginSuccess => ({
  type: LOGINSUCCESS,
  value: {
    address,
    token,
  },
});
//-rice Action
export const savePriceAction = (price: string): savePrice => ({
  type: SAVEPRICE,
  value: price,
});

//-
export const ADDMESSAGE = "ADDMESSAGE";
export const BEFOREADDMESSAGE = "BEFOREADDMESSAGE";
export interface message {
  message: string;
  index: number;
}
export interface beforeAddMessage {
  type: typeof BEFOREADDMESSAGE;
  value: message;
}
export interface addMessage {
  type: typeof ADDMESSAGE;
  value: message;
}
export interface savePrice {
  type: typeof SAVEPRICE;
  value: string;
}
//-ction
export const createAddMessageAction = (message: message): beforeAddMessage => ({
  type: BEFOREADDMESSAGE,
  value: message,
});

//-
export const DELMESSAGE = "DELMESSAGE";
export interface delMessage {
  type: typeof DELMESSAGE;
  value: number;
}
//-ction
export const createDelMessageAction = (index: number): delMessage => ({
  type: DELMESSAGE,
  value: index,
});
//-ODING
export const SETLODING = "SETLODING";
export interface setLodingAction {
  type: typeof SETLODING;
  value: Boolean;
}
//-ction
export const createSetLodingAction = (
  showLoding: Boolean
): setLodingAction => ({
  type: SETLODING,
  value: showLoding,
});

//-
export const SETFREECODE = "SETFREECODE";
export interface setFreeCode {
  type: typeof SETFREECODE;
  value: number;
}
export const setFreeCodeAction = (number: number): setFreeCode => ({
  type: SETFREECODE,
  value: number,
});
//Mint-
export const SETMINTFEE = "SETMINTFEE";
export interface setMintFee {
  type: typeof SETMINTFEE;
  value: number;
}
export const setMintFeeAction = (number: number): setMintFee => ({
  type: SETMINTFEE,
  value: number,
});
//Mint-
export const SETCREDITNUM = "SETCREDITNUM";
export interface setCreditNum {
  type: typeof SETCREDITNUM;
  value: number;
}
export const setCreditAction = (number: number): setCreditNum => ({
  type: SETCREDITNUM,
  value: number,
});
export const SETADDINFO = "SETADDINFO";
export interface setAddInfo {
  type: typeof SETADDINFO;
  value: Object;
}
export const setAddInfoAction = (obj: Object): setAddInfo => ({
  type: SETADDINFO,
  value: obj,
});
export const ADDCOMMUNITYLIST = "ADDCOMMUNITYLIST";
export interface setAddCommunityList {
  type: typeof ADDCOMMUNITYLIST;
  value: Array<any>;
}
//-ction
export const createAddCommunityListAction = (
  list: Array<any>
): setAddCommunityList => ({
  type: ADDCOMMUNITYLIST,
  value: list,
});

//reducer-
export type reducerParameterType =
  | loginSuccess
  | beforeAddMessage
  | addMessage
  | delMessage
  | setLodingAction
  | savePrice
  | setFreeCode
  | setMintFee
  | setCreditNum
  | setAddInfo
  | setAddCommunityList;
