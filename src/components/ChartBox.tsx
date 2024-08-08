// TradingViewWidget.jsx
// @ts-nocheck

import React, { useEffect, useRef, memo } from "react";
import { useViewport } from "./viewportContext";
import styled from "styled-components";
import "../assets/style/chart.css";
import { useTranslation } from "react-i18next";
const TradingviewContainer = styled.div`
  .chart-controls-bar {
    background-color: "#333";
  }
`;

function TradingViewWidget() {
  const container = useRef();
  const { width } = useViewport();
  const { i18n } = useTranslation();

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
        {
          "width": "100%",
          "height": ${width > 1024 ? "860" : "500"},
          "symbol": "BINANCE:BTCUSD",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale":  "en",
          "enable_publishing": false,
          "backgroundColor": "rgb(27, 27, 27)",
          "topColor": "rgba(51, 51, 51, 1)",
          "toolbar_bg": "rgba(51, 51, 51, 1)",
          "gridColor": "rgba(255, 255, 255, 0.10)",
          "hide_top_toolbar": true,
          "hide_legend": false,
          "withdateranges": false,
          "allow_symbol_change": false,
          "save_image": false,
          "calendar": false,
          "support_host": "https://www.tradingview.com"
        }`;
    container.current.appendChild(script);
  }, []);
  return (
    <TradingviewContainer
      className="tradingview-widget-container"
      ref={container}
      style={{ height: "100%", width: "100%" }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ height: "calc(100% - 32px)", width: "100%" }}
      ></div>
    </TradingviewContainer>
  );
}

export default memo(TradingViewWidget);
