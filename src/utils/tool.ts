import dayjs from "dayjs";
import store from "../store";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import {
  createAddMessageAction,
  createSetLodingAction,
  setAddInfoAction,
} from "../store/actions";
import relativeTime from "dayjs/plugin/relativeTime";
import BigNumber from "big.js";
import Web3 from "web3";
export function toThousands(num: string) {
  let numArr = num.split(".");
  if (numArr.length > 1) {
    return parseFloat(numArr[0]).toLocaleString() + "." + numArr[1];
  } else {
    return parseFloat(numArr[0]).toLocaleString();
  }
}
//-
export function AddrHandle(
  addr: string,
  start = 4,
  end = 4,
  replace = "..."
): string | undefined {
  if (!addr) {
    return;
  }
  let r = new RegExp("(.{" + start + "}).*(.{" + end + "})");
  let addrArr: RegExpMatchArray | null = addr.match(r);
  return addrArr![1] + replace + addrArr![2];
}
export function HowLongAgo(time: number) {
  dayjs.extend(relativeTime);
  var a = dayjs();
  return a.to(new Date(time));
}

export function GetQueryString(name: string) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  // console.log(window.location)
  var r = window.location.search.slice(1).match(reg);
  if (r != null) return decodeURI(r[2]);
  return null;
}

export function JudgmentNumber(number: string) {
  let numArr = number.split(".");
  if (numArr.length > 1) {
    return numArr[1].length > 18;
  }
  return false;
}
// -
export function NumSplic(val: any, len: number = 6) {
  var f = parseFloat(val);
  if (isNaN(f)) {
    return false;
  }
  var s = val.toString();
  if (s.indexOf(".") > 0) {
    let f = s.split(".")[1].substring(0, len);
    s = s.split(".")[0] + "." + f;
  }
  var rs = s.indexOf(".");
  if (rs < 0) {
    rs = s.length;
    s += ".";
  }
  while (s.length <= rs + len) {
    s += "0";
  }
  return s;
}
// -
export function NumSplic1(val: any, len: number = 6) {
  var f = parseFloat(val);
  if (isNaN(f)) {
    return false;
  }
  var s = val.toString();
  if (s.indexOf(".") > 0) {
    let f = s.split(".")[1].substring(0, len);
    s = s.split(".")[0] + "." + f;
  }
  return s;
}
// --
export function getBit(value: number, bit = 5) {
  let str = value.toString();
  let strIndex = str.indexOf(".");
  if (strIndex === -1) return str;
  str = str.substring(0, strIndex + bit);
  // console.log(str, bit);
  // console.log(typeof str,'getBit-)
  return str;
}

export function numberDivision() {}

export function showLoding(isShow: boolean) {
  store.dispatch(createSetLodingAction(isShow));
}
export function showNoBindReferee(obj: Object) {
  store.dispatch(setAddInfoAction(obj));
}

export function addMessage(msg: string) {
  store.dispatch(
    createAddMessageAction({
      message: msg,
      index: store.getState().message.length,
    })
  );
}
export function isApprove(price: number | string, Approve: string) {
  return new BigNumber(Approve).gte(price);
}
export function dateFormat(fmt: string, date: Date) {
  let ret;
  const opt: { [key: string]: string } = {
    "Y+": date.getFullYear().toString(), //-
    "m+": (date.getMonth() + 1).toString(), //-
    "d+": date.getDate().toString(), //-
    "H+": date.getHours().toString(), //-
    "M+": date.getMinutes().toString(), //-
    "S+": date.getSeconds().toString(), //-
    // --
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
      );
    }
  }
  return fmt;
}
export function getFullNum(num: any) {
  //-
  if (isNaN(num)) {
    return num;
  }
  //-
  var str = "" + num;
  if (!/e/i.test(str)) {
    return num;
  }
  return num.toFixed(18).replace(/\.?0+$/, "");
}

//-end-
export function initWebSocket(
  url: string,
  subscribe: string,
  sendUrl: string,
  data: any,
  callback: any
) {
  let socket = new SockJS(url);
  const obj: any = {};
  obj.stompClient = Stomp.over(socket);
  obj.stompClient.connect(
    {},
    () => {
      obj.subscription = obj.stompClient.subscribe(subscribe, (data: any) => {
        var resdata = JSON.parse(data.body);
        callback(resdata);
      });
      obj.sendTimer = setInterval(() => {
        obj.stompClient.send(
          sendUrl,
          { "Content-Type": "application/json;charset=UTF-8" },
          JSON.stringify({ ...data })
        );
        console.log(data, sendUrl, "-2");
      }, 2000);
    },
    function () {}
  );
  obj.stompClient.ws.onclose = function () {};
  return obj;
}
export function getWebsocketData(
  url: string,
  subscribe: string,
  callback: any
) {
  console.log(url, subscribe);
  var stompClient: any;
  var socket = new SockJS(url);
  stompClient = Stomp.over(socket);
  stompClient.connect(
    {},
    function () {
      stompClient.subscribe(subscribe, function (data: any) {
        console.log(data.body);
        callback(JSON.parse(data.body));
      });
    },
    function () {}
  );
  stompClient.ws.onclose = function () {};
  return stompClient;
}

export function startWord(name: string) {
  if (name.startsWith("/View")) return name.slice(5);
  return "";
  return "";
}

//-
export function timestampToDateString(timestamp: any) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const dateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return dateString;
}

export function EtherFun(amount: string) {
  let web3 = new Web3();
  let amounted = web3.utils.fromWei(amount);
  return amounted;
}
// -
export function thousandsSeparator(n: number): string {
  const strSplit = n?.toString().split(".");
  const integer = strSplit[0].split("");
  integer.reverse();
  const decimal = strSplit[1];
  const newInteger = [];
  for (let i = 0; i < integer.length; i++) {
    if (i % 3 === 0 && i !== 0) {
      newInteger.push(",");
    }
    newInteger.push(integer[i]);
  }
  newInteger.reverse();
  let s = newInteger.join("");
  if (decimal) {
    s += `.${decimal}`;
  }
  return s;
}
