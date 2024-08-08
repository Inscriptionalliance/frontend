import React from "react";
import SwapBodyComponent_BSC from "./SwapBodyComponent_BSC";
import SwapBodyComponent_BTC from "./SwapBodyComponent_BTC";

const SwapBodyComponent = ({ type }: any) => {
  console.log(type, "type");

  const Box = () => {
    if (type === "Binance") {
      return <SwapBodyComponent_BSC></SwapBodyComponent_BSC>;
    } else if (type === "Bitcoin") {
      return <SwapBodyComponent_BTC></SwapBodyComponent_BTC>;
    } else {
      return <SwapBodyComponent_BSC></SwapBodyComponent_BSC>;
    }
  };
  return <Box></Box>;
};

export default SwapBodyComponent;
