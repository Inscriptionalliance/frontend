import React, { useState } from "react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { FlexBox, FlexCCBox } from "../components/FlexBox/index";
import styled from "styled-components";
import { MintChainBox, MintChainBox_Item_Box_Item } from "./Mint/Mint";
import { ChainBox_Item_Box, ChainList } from "./Market";
import SwapBodyComponent from "../components/SwapBodyComponent";
export const SwapBox = styled.div`
  /* padding: 5.67rem 0px; */
  width: 100%;
  max-width: 1400px;
  @media (min-width: 1920px) {
    max-width: 1650px;
  }
  @media (max-width: 1400px) {
    padding: 0px 12px;
  }
`;

const SwapContainer = styled(FlexBox)`
  flex-direction: column;
  align-items: center;
  width: 100%;
  /* max-width: 1400px; */
`;
export const NoDataContainer = styled(FlexCCBox)`
  padding: 50px;
`;

const BridgeChainBox = styled(MintChainBox)`
  margin: 0px auto;
  max-width: 600px;
`;

export default function Swap() {
  const [ChainName, setChainName] = useState("Binance");

  return (
    <SwapContainer>
      <SwapBox>
        <BridgeChainBox>
          <ChainBox_Item_Box>
            {ChainList?.map((item: any, index: any) => (
              <MintChainBox_Item_Box_Item key={index}>
                <img
                  src={
                    String(item?.name) === String(ChainName)
                      ? item?.activeIcon
                      : item?.icon
                  }
                  alt=""
                  onClick={() => {
                    setChainName(item?.name);
                  }}
                />
              </MintChainBox_Item_Box_Item>
            ))}
          </ChainBox_Item_Box>
        </BridgeChainBox>
        {/* bridge-*/}
        <SwapBodyComponent type={ChainName}></SwapBodyComponent>
      </SwapBox>
    </SwapContainer>
  );
}
