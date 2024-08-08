import { log } from "console";
import { useState, useRef, useEffect } from "react";

const useWebsocket = ({ url, verify }: any) => {
  const ws = useRef<WebSocket | null>(null);
  // socket -
  const [wsData, setMessage] = useState<any>({});
  const [OpenState, setOpenState] = useState<any>(0);
  //  socket -
  const [readyState, setReadyState] = useState<any>({
    key: 0,
    value: "Connecting",
  });

  const creatWebSocket = () => {
    const stateArr = [
      { key: 0, value: "Connecting" },
      { key: 1, value: "Already connected and can communicate" },
      { key: 2, value: "Connection is closing" },
      {
        key: 3,
        value:
          "The connection has been closed or the connection was not successful",
      },
    ];
    try {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        setOpenState(1);
        setReadyState(stateArr[ws.current?.readyState ?? 0]);
      };
      ws.current.onclose = () => {
        setReadyState(stateArr[ws.current?.readyState ?? 0]);
      };
      ws.current.onerror = () => {
        setReadyState(stateArr[ws.current?.readyState ?? 0]);
      };
      ws.current.onmessage = (e) => {
        setMessage({ ...JSON.parse(e.data) });
      };
    } catch (error) {
      console.log(error);
    }
  };

  const webSocketInit = () => {
    if (!ws.current || ws.current.readyState === 3) {
      creatWebSocket();
    }
  };

  const closeWebSocket = () => {
    ws.current?.close();
  };

  // -
  const sendMessage = (str: any) => {
    if (!ws.current) return;

    try {
      ws.current?.send(str);
      console.log(str, "str");
    } catch (error) {
      console.log(error);
    }
  };

  //-
  const reconnect = () => {
    try {
      closeWebSocket();
      ws.current = null;
      console.log("-");
      creatWebSocket();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    verify && webSocketInit();
    return () => {
      ws.current?.close();
    };
  }, [ws, verify]);

  return {
    wsData,
    readyState,
    closeWebSocket,
    reconnect,
    sendMessage,
    OpenState,
    webSocketInit,
    setOpenState,
  };
};
export default useWebsocket;
