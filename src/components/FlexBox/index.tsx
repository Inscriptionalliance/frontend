import styled from "styled-components";

export const FlexBox = styled.div`
  display: flex;
`;
export const FlexSSBox = styled(FlexBox)`
  justify-content: start;
  align-items: start;
`;

export const FlexSCBox = styled(FlexBox)`
  justify-content: start;
  align-items: center;
`;

export const FlexSASBox = styled(FlexBox)`
  justify-content: space-around;
  align-items: center;
`;

export const FlexSACBox = styled(FlexBox)`
  justify-content: space-around;
  align-items: center;
`;

export const FlexSBSBox = styled(FlexBox)`
  justify-content: space-between;
`;

export const FlexSBCBox = styled(FlexBox)`
  justify-content: space-between;
  align-items: center;
`;

export const FlexCCBox = styled(FlexBox)`
  justify-content: center;
  align-items: center;
`;

export const FlexSECBox = styled(FlexBox)`
  justify-content: space-evenly;
  align-items: center;
`;

// export const ClaimBtn = styled(FlexCCBox) <{ isClaim?: boolean }>`
//     padding: ${({ theme }) => theme.padding8_16};
//     font-size: ${({ theme }) => theme.size14};
//     cursor: ${({ isClaim }) => isClaim ? "pointer" : "default"};
//     opacity: ${({ isClaim }) => isClaim ? 1 : ".3"};
//     background-image: ${`url(${BtnPng})`};
//     background-size: 100% 100%;
//     background-repeat: no-repeat;
//     white-space: nowrap;
// `
// export const Btn = styled(FlexCCBox) <{ disable?: boolean }>`
// display: inline-flex;
// padding:  ${({ theme }) => theme.padding};
// max-width: ${({ theme }) => theme.maxWidth};
// width: 100%;
// justify-content: center;
// align-items: center;
// gap: 10px;
// border-radius: 14px;
// background: ${({ disable }) => disable ? "linear-gradient(92deg, #8E5E47 0%, #826A3B 100%)" : "linear-gradient(273deg, #FFD178 0%, #FFBE9F 100%) "};
// white-space: nowrap;
// color: ${({ disable }) => disable ? "#FFF" : "#000"};
// font-size: ${({ theme }) => theme.size};
// font-family: PingFang SC;
// font-style: normal;
// font-weight: 700;
// line-height: normal;
// user-select: none;
// cursor: ${({ disable }) => disable ? "not-allowed" : "pointer"};
// .approveBtn{
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     color: ${({ disable }) => disable ? "#FFF" : "#000"};
// font-size: ${({ theme }) => theme.size};
// font-family: PingFang SC;
// font-style: normal;
// font-weight: 700;
// line-height: normal;
// user-select: none;
// }
// @media (max-width:425px) {
//     font-size: 14px;
//     margin: 5px;
//     padding: 8px 10px;
//     max-width: 120px;
//     border-radius: 8px;
//     .approveBtn{
//         font-size: 12px;
//     margin: 5px;
//     padding: 0px;
//     max-width: 120px;
//     border-radius: 8px;

//     }

// }
// `
