import {
  LOGINSUCCESS,
  reducerParameterType,
  message,
  ADDMESSAGE,
  DELMESSAGE,
  SETLODING,
  SAVEPRICE,
  SETFREECODE,
  SETCREDITNUM,
  SETMINTFEE,
  SETADDINFO,
  ADDCOMMUNITYLIST,
} from "./actions";
//-
export interface stateType {
  address: string;
  message: Array<message>;
  token: string;
  price: string;
  showLoding: Boolean;
  freeCode: number;
  mintFee: number;
  creditNum: number;
  userInfo: any;
  communityList: Array<any>;
}
//-
const initialState: stateType = {
  address: "",
  message: [],
  token: "",
  showLoding: false,
  price: "",
  freeCode: 0,
  mintFee: 0,
  creditNum: 0,
  userInfo: { isBindReferee: false },
  communityList: [],
};
let reducer = (state = initialState, action: reducerParameterType) => {
  switch (action.type) {
    //-oken
    case LOGINSUCCESS:
      return { ...state, ...action.value };
    case SAVEPRICE:
      return { ...state, price: action.value };
    case ADDMESSAGE:
      return { ...state, message: [...state.message, action.value] };
    case DELMESSAGE:
      return {
        ...state,
        message: state.message.filter((item) => {
          return item.index !== action.value;
        }),
      };
    case SETLODING:
      return { ...state, showLoding: action.value };
    case SETFREECODE:
      return { ...state, freeCode: action.value };
    case SETMINTFEE:
      return { ...state, mintFee: action.value };
    case SETCREDITNUM:
      return { ...state, creditNum: action.value };
    case SETADDINFO:
      return { ...state, userInfo: action.value };
    case ADDCOMMUNITYLIST:
      return {
        ...state,
        communityList: [...state.communityList, action.value],
      };
    default:
      return state;
  }
};

export default reducer;
