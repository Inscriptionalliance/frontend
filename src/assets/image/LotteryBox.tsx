import React, { useEffect, useState, useRef, useCallback } from "react";

import styled from "styled-components";
import { FlexBox } from "../../components/FlexBox";

export default (props: any) => {
  const lottieRef = useRef(null);
  const CanvasBox = styled.div`
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
  `;

  useEffect(() => {
    // lottie.loadAnimation({
    //   container: lottieRef.current!!,
    //   renderer: "svg",
    //   loop: true,
    //   autoplay: true,
    //   animationData: mainData,
    // });

    return () => {
      lottieRef.current = null;
    };
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: "0px",
        left: "0px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "1920px",
        height: "1080px",
      }}
      ref={lottieRef}
    ></div>
    // <div
    //   style={{
    //     width: "100vw",
    //     height: "100vh",
    //     position: "absolute",
    //     top: 0,
    //   }}
    //   ref={lottieRef}
    // >
    // <Lottie
    //     ref={lottieRef}
    //     // path="http://120.79.67.226:8102/data.json"
    //     animationData={Number(props?.type) === 1 ? windata : noWindata}
    //     rendererSettings={{
    //       className: "lf20_a3emlnqk",
    //       width: 500,
    //       height: 500,
    //     }}
    //   />
    // </div>
  );
};
