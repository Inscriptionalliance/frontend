import React, {
  useState,
  useEffect,
  Fragment,
  useRef,
  useCallback,
} from "react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { useWeb3React } from "@web3-react/core";
import { useTranslation } from "react-i18next";
import {
  FlexBox,
  FlexCCBox,
  FlexSACBox,
  FlexSBCBox,
} from "../components/FlexBox/index";
import { useViewport } from "../components/viewportContext";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import closeIcon from "../assets/image/closeIcon.svg";

import NoData from "../components/NoData";
import { Modal, Pagination, PaginationProps } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AddrHandle, addMessage, showLoding } from "../utils/tool";
import LotteryBox from "../assets/image/LotteryBox";
import CommunityBg from "../assets/image/Community/CommunityBg.png";
import CommunityBg1 from "../assets/image/Community/CommunityBg1.gif";
import CommunityBg2 from "../assets/image/Community/CommunityBg2.gif";
import CommunityBg3 from "../assets/image/Community/CommunityBg3.gif";
import CommunityBg4 from "../assets/image/Community/CommunityBg4.gif";
import CommunityBg5 from "../assets/image/Community/CommunityBg5.gif";
import CommunityBg6 from "../assets/image/Community/CommunityBg6.gif";
import CommunityBg7 from "../assets/image/Community/CommunityBg7.gif";
import CommunityBg8 from "../assets/image/Community/CommunityBg8.gif";
import preLoading from "../assets/image/Community/preLoading.gif";
import SearchIcon from "../assets/image/Market/SearchIcon.svg";

import loveIcon from "../assets/image/Community/loveIcon.svg";
import noLoveIcon from "../assets/image/Community/noLoveIcon.svg";
import {
  communityLike,
  communityList,
  communityListPassToken,
  teamInfo,
} from "../API";
import { throttle } from "lodash";
import {
  setCreditAction,
  setFreeCodeAction,
  setMintFeeAction,
} from "../store/actions";
import { useObjectFitCover } from "../hooks/useObjectFitCover";
import DataPageLoding from "../components/DataPageLoding";
import { useBindState } from "../hooks/useBindState";
import {
  NoDataContentModal,
  RankBox_Left_Tab,
  RankBox_Left_Tab_Item,
  SoonOpenModal,
} from "./Swap";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { sbBack } from "../assets/image/MintBox";
import { LodingMode } from "../components/loding";
const Btn = styled(FlexCCBox)`
  width: 100%;
  padding: 0.91667rem;
  color: #000;
  font-family: "CKTKingkong";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  border-radius: 14px;
  background: linear-gradient(0deg, #95fa31 0.01%, #f6f022 99.99%);
  box-shadow: 0.3333333333333333rem 0.6666666666666666rem 0rem 0rem #4a8e00;
  @media (max-width: 375px) {
    padding: 1.83333rem;
    box-shadow: 0.6666666666666666rem 1.27rem 0rem 0rem #4a8e00;
  }
`;
export const CommunityContainer = styled.div`
  width: 100%;
  max-width: 1240px;
  overflow: hidden !important;

  /* @media (min-width: 1920px) {
    max-width: 1650px;
  } */

  @media (max-width: 1440px) {
    padding-right: 20px;
    padding-left: 20px;
    padding-bottom: 80px !important;
  }
`;

const CommunityBox = styled(FlexBox)<{ active: boolean }>`
  min-height: ${({ active }) => (active ? `calc(100% + 20px)` : "auto")};
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: start;

  > div {
    width: 32%;
    height: fit-content;
  }
  @media (max-width: 768px) {
    > div {
      width: 32%;
    }
  }
  @media (max-width: 650px) {
    > div {
      width: 48%;
    }
  }
  @media (max-width: 375px) {
    > div {
      width: 100%;
    }
  }
`;

const CommunityBox_Item = styled(FlexBox)`
  width: 100%;
  padding: 1.33rem 1.67rem;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  background: #222222;
  border-radius: 2.5rem;
  box-shadow: 5px 5px 10px 0px #000, -3px -3px 10px 0px rgba(255, 255, 255, 0.1);
  margin-bottom: 3.75rem;

  @media (max-width: 768px) {
    margin-bottom: 2.75rem;
  }

  @media (max-width: 650px) {
    margin-bottom: 3.6575rem;
  }

  @media (max-width: 375px) {
    padding: 2.67rem 3.33rem;
    border-radius: 5rem;
  }
`;

const CommunityBox_Item_Title = styled(FlexCCBox)`
  color: #fff;

  font-family: "CKTKingkong";
  font-size: 2rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 1.33rem;
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  @media (max-width: 375px) {
    font-size: 4rem;
    margin-bottom: 2.66rem;
  }
`;
const CommunityBox_Item_Content_Box = styled(FlexCCBox)`
  width: 100%;
  position: relative;
  border-radius: 0.91667rem;

  border: 1px solid #f6f022;
  background: #000;
  > div {
    position: absolute;
    color: #fff;
    top: 0.5rem;
    right: 0.5rem;
    font-family: "CKTKingkong";
    font-size: 2rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-bottom: 1.33rem;
    z-index: 1;
  }
  > img {
    width: 100%;
    height: 100%;
    &:first-child {
      position: absolute;
      top: 0.5rem;
      left: 0.5rem;
      width: 2.5rem;
      height: 2.5rem;
      flex-shrink: 0;
      z-index: 1;
    }
    &:nth-child(2) {
      border-radius: 0.91667rem;

      @media (max-width: 430px) {
        min-height: 120px;
      }
    }
  }
  @media (max-width: 430px) {
    font-size: 2rem;
  }
  @media (max-width: 375px) {
    border-radius: 1.83333rem;
    > img {
      &:first-child {
        position: absolute;
        top: 1rem;
        left: 1rem;
        width: 7rem;
        height: 7rem;
        flex-shrink: 0;
      }
    }
  }
`;

const CommunityBox_Item_Bottom = styled(FlexSBCBox)`
  margin-top: 1.5rem;
  width: 100%;
`;

const CommunityBox_Item_Bottom_Left = styled.div`
  flex: 1;
  color: #fff;
  font-family: "CKTKingkong";
  font-size: 1.16667rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  > div {
    width: 100%;
    color: #fff;
    font-family: "CKTKingkong";
    font-size: 1.16667rem;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
  @media (max-width: 768px) {
    font-size: 1.4583375rem;
    > div {
      font-size: 1.4583375rem;
    }
  }
  @media (max-width: 430px) {
    font-size: 2rem;
    > div {
      font-size: 2rem;
    }
  }
  @media (max-width: 375px) {
    font-size: 2.33333rem;
    > div {
      font-size: 2.33333rem;
    }
  }
`;
const CommunityBox_Item_Bottom_Btn = styled(Btn)`
  /* margin-top: 1.17rem; */
  width: 100%;
  max-width: 13.08333rem;
  color: #000;
  font-family: "CKTKingkong";
  font-size: 1.33333rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  @media (max-width: 2560px) {
    /* font-size: 1.6666625rem; */
    max-width: 11.08333rem;
  }
  @media (max-width: 768px) {
    font-size: 1.6666625rem;
  }
  @media (max-width: 430px) {
    font-size: 2rem;
  }
  @media (max-width: 375px) {
    max-width: 26.16667rem;

    font-size: 2.66666rem;
  }
`;

export const NoDataContainer = styled(FlexCCBox)`
  padding: 50px;
`;

const CommunityContainer_Content = styled.div`
  height: calc(100% - 80px);
  overflow: auto;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 5px;

  @media (max-width: 425px) {
    height: calc(100% - 42px);
  }
  ::-webkit-scrollbar-thumb {
    background: rgb(149, 250, 49);
    border-radius: 2.8333rem;
    opacity: 0.1;
  }
  ::-webkit-scrollbar {
    width: 2px !important;
    right: 25.9992px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10.9992px;
  }
`;

const DataPageLoding_Box = styled(FlexCCBox)`
  width: 100% !important;
  min-height: 320px;
  color: rgba(255, 255, 255, 0.6);
  font-family: CKTKingkong;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  img {
    width: 50px;
  }
`;

const CommunityBox_Left_Tab = styled(RankBox_Left_Tab)`
  margin-bottom: 20px;
  @media (max-width: 768px) {
    /* > div {
      font-size: 3rem;
    }
    .activeTab {
      font-size: 3rem;
    } */
  }
`;
const NoDataBox = styled(FlexCCBox)`
  width: 100% !important;
`;

const InputBox = styled(FlexSBCBox)`
  max-width: 375px;
  width: 100%;
  padding: 11px 27px;
  color: rgba(255, 255, 255, 0.6);
  font-family: "CKTKingkong";
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 5px 5px 10px 0px #000 inset,
    -3px -3px 5px 0px rgba(255, 255, 255, 0.2) inset;
  backdrop-filter: blur(28px);
  margin-right: 24px;
  > input {
    width: 100%;
    color: rgba(255, 255, 255, 0.6);
    font-family: "CKTKingkong";
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    background: transparent;
    border: none;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none !important;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
  img {
    width: 30px;
    height: 30px;
  }

  @media (max-width: 650px) {
    width: 100%;
    margin-right: 0px;
    padding: 5px 8px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 2.359px 2.359px 4.719px 0px #000 inset,
      -1.416px -1.416px 2.359px 0px rgba(255, 255, 255, 0.2) inset;
    backdrop-filter: blur(13.212646484375px);
    > input {
      font-size: 12px;
    }
    > img {
      width: 22px;
    }
  }
`;
const SearchBox = styled(FlexBox)`
  width: 100%;
  margin-bottom: 20px;
`;

export default function Community() {
  const imgRef = useRef(null);
  // useObjectFitCover(imgRef);
  const token = useSelector<any>((state) => state.token);
  const { t } = useTranslation();
  const web3React = useWeb3React();
  const { width } = useViewport();
  const navigate = useNavigate();
  const [PageSize, setPageSize] = useState(8);
  const [PageNum, setPageNum] = useState(1);
  const [dataLoding, setDataLoding] = useState(true);
  const [NoLoginModal, setNoLoginModal] = useState(false);
  const [ScrollTop, setScrollTop] = useState<any>(0);
  const [CommunityList, setCommunityList] = useState<any>([]);
  const [ActiveTab, setActiveTab] = useState(1);
  const [hasMore, setHasMore] = useState(true); // -
  const [hash, setHash] = useState(0);

  const loaderRef = useRef(null); // -

  let dispatch = useDispatch();
  const { getBindStateFun } = useBindState();

  const [imageHeight, setImageHeight] = useState(0);
  const imageRef = useRef<any>(null);
  const inputRef = useRef<any>(null);

  const onChange: PaginationProps["onChange"] = (page) => {
    console.log(page);
    setPageNum(page);
  };
  const itemRender: PaginationProps["itemRender"] = (
    _,
    type,
    originalElement
  ) => {
    if (type === "prev") {
      return <a>{t("Previous")}</a>;
    }
    if (type === "next") {
      return <a>{t("Next")}</a>;
    }
    return originalElement;
  };

  const getTeamInfo = () => {
    teamInfo({}).then((res: any) => {
      if (res.code === 200) {
        dispatch(setFreeCodeAction(res?.data?.freeTicket));
        dispatch(setCreditAction(res?.data?.credit));
        dispatch(setMintFeeAction(res?.data?.mintTicket));
      }
    });
  };

  const getVilifyState = throttle((id: any) => {
    if (!token) return;
    communityLike({
      id,
    }).then((res: any) => {
      if (res.code === 200) {
        getInitData(PageNum, ActiveTab);
        addMessage(t("224"));
        getTeamInfo();
      } else {
        addMessage(res.msg);
      }
    });
  }, 3000);

  const selectTabFun = (tab: number) => {
    setDataLoding(true);
    setActiveTab(tab);
  };

  const getInitData = async (
    num: number,
    tab: number,
    nullArr: any = false,
    time: number = 0
  ) => {
    const container: any = loaderRef.current;
    setDataLoding(true);
    if (!!nullArr) {
      setCommunityList([]);
    }
    if (!!token) {
      setTimeout(async () => {
        await communityList({
          pageNum: num,
          pageSize: PageSize,
          area: Number(tab),
        }).then((res: any) => {
          if (res?.code === 200) {
            let Arr: any = [];
            let Arr1: any = [];
            if (
              Math.floor(Number(res?.data?.total ?? 0) / Number(PageSize)) >=
              Number(PageNum)
            ) {
              setHasMore(true);
            } else {
              setHasMore(false);
            }
            Arr1 = nullArr
              ? [...res?.data?.list]
              : [...CommunityList, ...res?.data?.list];
            console.log(Arr1, "----", !!nullArr, "----", "Arr1");

            Arr =
              width > 650 && Arr1?.length % 3 !== 0
                ? fillArrayToMultipleOfFour(Arr1, 4)
                : Arr1;
            Arr =
              width > 768 && Arr1?.length % 4 !== 0
                ? fillArrayToMultipleOfFour(Arr1, 4)
                : Arr1;
            setDataLoding(false);
            setCommunityList(Arr || []);
            // setIsFirstLoading(false);
          }
        });
      }, time);
    } else {
      setTimeout(async () => {
        await communityListPassToken({
          pageNum: num,
          pageSize: PageSize,
          area: Number(tab),
        }).then((res: any) => {
          if (res?.code === 200) {
            let Arr: any = [];
            let Arr1: any = [];
            if (
              Math.floor(Number(res?.data?.total ?? 0) / Number(PageSize)) >=
              Number(PageNum)
            ) {
              setHasMore(true);
            } else {
              setHasMore(false);
            }
            Arr1 = nullArr
              ? [...res?.data?.list]
              : [...CommunityList, ...res?.data?.list];
            console.log(Arr1, "----", !!nullArr, "----", "Arr1");
            Arr =
              width > 650 && Arr1?.length % 3 !== 0
                ? fillArrayToMultipleOfFour(Arr1, 4)
                : Arr1;
            Arr =
              width > 768 && Arr1?.length % 4 !== 0
                ? fillArrayToMultipleOfFour(Arr1, 4)
                : Arr1;
            setDataLoding(false);
            setCommunityList(Arr || []);
            // setIsFirstLoading(false);
          }
        });
      }, time);
    }
    container.scrollTop = ScrollTop;
  };

  function fillArrayToMultipleOfFour(arr: any, num: number) {
    // -
    const fillCount = (4 - (arr.length % num)) % num; // - 4--
    // --
    const newArr = new Array(arr.length + fillCount).fill({});
    // -
    for (let i = 0; i < arr.length; i++) {
      newArr[i] = arr[i];
    }
    return newArr;
  }

  const getMyInitData = async (id: number) => {
    showLoding(true);
    setCommunityList([]);
    if (!!token) {
      await communityList({
        pageNum: 1,
        pageSize: 999,
        area: Number(ActiveTab),
        num: id,
      }).then((res: any) => {
        if (res?.code === 200) {
          setCommunityList(res?.data?.list || []);
          showLoding(false);
        }
      });
    } else {
      await communityListPassToken({
        pageNum: 1,
        pageSize: 999,
        area: Number(ActiveTab),
        num: id,
      }).then((res: any) => {
        if (res?.code === 200) {
          setCommunityList(res?.data?.list || []);
          showLoding(false);
        }
      });
    }
  };

  const getMoreItems = useCallback(async () => {
    if (dataLoding || !hasMore) return;
    setPageNum(PageNum + 1);
  }, [dataLoding, hasMore]);

  const handleScroll = useCallback(() => {
    const container: any = loaderRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    setScrollTop(scrollTop);
    if (scrollHeight - scrollTop <= clientHeight * 1.1 && !dataLoding) {
      getMoreItems();
    }
  }, [dataLoding, getMoreItems]);

  const searchFun = async (id: any) => {
    // if (!token) return;
    if (Number(id) <= 0 || !id) {
      setPageNum(1);
      await getInitData(1, ActiveTab, true);
    }
    if (String(id).length < 8) return;

    getMyInitData(id);
  };

  useEffect(() => {
    const container: any = loaderRef?.current;
    if (container) {
      container?.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container?.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    // if (!token) return;
    getInitData(PageNum, ActiveTab, true);
  }, [token, ActiveTab, hash]);
  useEffect(() => {
    if (Number(PageNum) === 1 || !!inputRef.current.value) return;
    // if (!token || ScrollTop === 0 || !!inputRef.current.value) return;
    getInitData(PageNum, ActiveTab);
  }, [token, PageNum]);

  useEffect(() => {
    if (imageRef?.current) {
      setImageHeight(imageRef?.current?.clientWidth);
    }
  }, [CommunityList?.length, width]);

  return (
    <CommunityContainer>
      <CommunityBox_Left_Tab>
        <RankBox_Left_Tab_Item
          className={Number(ActiveTab) === 1 ? "activeTab" : ""}
          onClick={() => {
            inputRef.current.value = null;
            setPageNum(1);
            setHash(+new Date());
            selectTabFun(1);
          }}
        >
          {t("400")}
        </RankBox_Left_Tab_Item>
        <RankBox_Left_Tab_Item
          className={Number(ActiveTab) === 2 ? "activeTab" : ""}
          onClick={() => {
            inputRef.current.value = null;
            setPageNum(1);
            setHash(+new Date());
            selectTabFun(2);
          }}
        >
          {t("401")}
        </RankBox_Left_Tab_Item>
      </CommunityBox_Left_Tab>
      <SearchBox>
        <InputBox>
          <input
            type="number"
            placeholder={t("403")}
            min={0}
            ref={inputRef}
            onChange={(e: any) => searchFun(e?.target?.value)}
          />
          <img src={SearchIcon} alt="" />
        </InputBox>
      </SearchBox>

      <CommunityContainer_Content ref={loaderRef}>
        <CommunityBox active={CommunityList?.length > 0 && !dataLoding}>
          {Number(ScrollTop) > 0 || !dataLoding ? (
            CommunityList?.length > 0 ? (
              <>
                {" "}
                {CommunityList?.map((item: any, index: any) =>
                  !!item?.id ? (
                    <CommunityBox_Item key={index}>
                      <CommunityBox_Item_Title>
                        {item?.name ?? "--"}
                      </CommunityBox_Item_Title>
                      {/* <CommunityBox_Item_Title>{t("214")}</CommunityBox_Item_Title> */}
                      <CommunityBox_Item_Content_Box
                        ref={index === 0 ? imageRef : null}
                      >
                        <img
                          src={!!item?.todayLike ? loveIcon : noLoveIcon}
                          alt=""
                        />
                        <div>#{item?.num}</div>
                        <LazyLoadImage
                          effect="blur"
                          // src={CommunityBg1}
                          src={
                            !!item?.logoImage ? item?.logoImage : CommunityBg
                          }
                          style={{
                            width: "100%",
                            minHeight: `${imageHeight}px`,
                            borderRadius:
                              width > 375 ? "0.91667rem" : "1.83333rem",
                          }}
                          // data-src={item?.logoImage}
                          // src={preLoading}
                          alt=""
                          placeholderSrc={CommunityBg}
                          threshold={80}
                        ></LazyLoadImage>
                      </CommunityBox_Item_Content_Box>

                      <CommunityBox_Item_Bottom>
                        <CommunityBox_Item_Bottom_Left>
                          {t("215", { num: item?.partakeNum ?? 0 })}
                          <div> {t("216", { num: item?.likeNum ?? 0 })}</div>
                        </CommunityBox_Item_Bottom_Left>
                        <CommunityBox_Item_Bottom_Btn
                          onClick={() => {
                            if (!!token) {
                              getBindStateFun(
                                () => {
                                  getVilifyState(item?.id);
                                },
                                () => {}
                              );
                            } else {
                              return setNoLoginModal(true);
                            }
                          }}
                        >
                          {t("217")}
                        </CommunityBox_Item_Bottom_Btn>
                      </CommunityBox_Item_Bottom>
                    </CommunityBox_Item>
                  ) : (
                    <div></div>
                  )
                )}
              </>
            ) : (
              <NoDataBox>
                <NoData />
              </NoDataBox>
            )
          ) : (
            <DataPageLoding_Box>
              <DataPageLoding></DataPageLoding>
            </DataPageLoding_Box>
          )}
        </CommunityBox>
      </CommunityContainer_Content>

      <SoonOpenModal
        visible={!!NoLoginModal}
        className="Modal"
        centered
        width={510}
        closable={false}
        footer={null}
        onCancel={() => {
          setNoLoginModal(false);
        }}
        src={sbBack}
      >
        <div
          className="close"
          onClick={() => {
            setNoLoginModal(false);
          }}
        >
          <img src={closeIcon} alt="" />
        </div>

        <NoDataContentModal>{t("Please link wallet")}</NoDataContentModal>
      </SoonOpenModal>
      {/* {!!dataLoding && <LodingMode></LodingMode>} */}
    </CommunityContainer>
  );
}
