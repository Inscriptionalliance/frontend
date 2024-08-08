import { ChangeEvent, useEffect, useRef, useState } from "react";
import "../../assets/style/join/step.scss";
import { useSign } from "../../hooks/useSign";
import {
  Login,
  Xarticle,
  acceptInvite,
  checkBindTwitter,
  checkFollowsTwitter,
  guanzhu,
  guanzhuDis,
  interestTwitterInfo,
  joinsys,
  lastStep,
  loginIncome,
  oauth2CallBack,
  oauth2Url,
  userInfo,
  whichType,
} from "../../API";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { addMessage, showLoding } from "../../utils/tool";
import { useDispatch, useSelector } from "react-redux";
import { createLoginSuccessAction } from "../../store/actions";
import { Input, InputRef } from "antd";
import border from "../../assets/image/join/greenBorder.png";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import useConnectWallet from "../../hooks/useConnectWallet";
import { useConnect } from "../../hooks/useConnect";
import { useTranslation } from "react-i18next";
import { twitterFollow } from "../../config";
import styled from "styled-components";

const J_step = styled.div`
  padding: 0px 12px;
  @media (max-width: 555px) {
    .topp {
      width: 100%;
      > div:nth-child(1) .step_box {
        display: flex;
        justify-content: center;
        /* &:first-child {
          justify-content: flex-start;
        }
        &:last-child {
          justify-content: flex-end;
        }
        > div:nth-child(1) {
          margin: 0rem !important;
        } */
      }
    }
  }
`;
const Type_Box2 = styled.div`
  width: 100%;
`;

const JoinStep = () => {
  const { t } = useTranslation();
  const { connectWallet } = useConnectWallet();
  const { connectFun } = useConnect();
  // const params = useSearchParams();
  // console.log(params, "params");

  const nav = useNavigate();
  const token = useSelector<any>((state) => state.token);
  const web3 = new Web3();

  const { signFun } = useSign();
  let dispatch = useDispatch();
  const location = useLocation();
  const web3React = useWeb3React();

  const [stepArr, setStep] = useState([1, 2, 3, 4]);
  const [current, setCur] = useState(1);
  const [inputValue, setInput] = useState(Array.from({ length: 6 }));
  const [go4, setGo] = useState<number>(0);
  const [btnType, setBtnType] = useState<any>({});
  const [TwitterInfo, setTwitterInfo] = useState<any>({});
  const [LoginIncomeData, setLoginIncomeData] = useState<any>({});

  const inputRef = useRef<any>([]);
  const queryParams = new URLSearchParams(location.search);
  const state = queryParams.get("state");
  const twApproveCode = queryParams.get("code");

  const getWhichType = () => {
    whichType().then((res: any) => {
      if (res.code === 200) {
        setBtnType(res.data);
        if (res.data.currentPage === 0) {
          return;
        } else if (res.data.currentPage === 7) {
          nav("/View/join/person");
        } else {
          setCur(res.data.currentPage);
        }
      }
    });
  };

  useEffect(() => {
    if (token && web3React.account) {
      getWhichType();
    }

    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("invite");

    if (code) {
      setInput(code.split(""));
    }
  }, [token, go4, web3React.account]);

  let refereeUserAddress: any;

  const qm = async () => {
    let tag = await web3.utils.isAddress(window.location.pathname.slice(1));
    if (tag) {
      refereeUserAddress = window.location.pathname.slice(1);
    } else {
      refereeUserAddress = "";
    }
    await connectWallet();

    await signFun((res: any) => {
      Login({
        ...res,
        userAddress: web3React.account as string,
        userPower: 0,
        password: "123",
        ethAddress: "",
        // refereeUserAddress,
      }).then((res: any) => {
        if (res.code === 200) {
          showLoding(false);
          dispatch(
            createLoginSuccessAction(
              res.data.token,
              web3React.account as string
            )
          );
          setCur(2);
        } else {
          showLoding(false);
          addMessage(res.msg);
        }
      });
    }, `userAddress=${web3React.account as string}&refereeUserAddress=${refereeUserAddress}`);
  };

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const { value } = e.target;
    const newInputValues = [...inputValue];
    newInputValues[index] = value;

    setInput(newInputValues);

    if (value.length === 1 && index <= 4) {
      inputRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e: any, index: number) => {
    e.stopPropagation();
    if (e.key === "Backspace" && index > 0 && inputValue[index] === "") {
      inputRef.current[index - 1].focus();
    }
  };

  const jsyq = () => {
    const num = inputValue.join("");
    acceptInvite(num).then((res: any) => {
      if (res.code === 200) {
        setCur(3);
      } else {
        addMessage(res.msg);
      }
    });
  };

  const gz = () => {
    // guanzhu().then((res: any) => {
    //   if (res.code === 200) {
    //     setGo((prev) => prev + 1);
    //   } else {
    //     addMessage(res.msg);
    //   }
    // });
    if (!TwitterInfo?.twitterUsername) return;
    connectFun(
      () => {
        oauth2Url({}).then(async (res: any) => {
          if (res.code === 200) {
            await window.open(res.data);
          } else {
            addMessage(res.msg);
          }
        });
      },
      () => {
        window.open(twitterFollow + TwitterInfo?.twitterUsername);
      }
    );
  };

  const zftw = () => {
    connectFun(
      () => {
        oauth2Url({}).then(async (res: any) => {
          if (res.code === 200) {
            await window.open(res.data);
          } else {
            addMessage(res.msg);
          }
        });
      },
      () => {}
    );
  };

  useEffect(() => {
    if (go4 === 2) {
      setCur(4);
      setGo(0);
    }
  }, [go4]);

  const gzdiscord = () => {
    guanzhuDis().then((res: any) => {
      if (res.code === 200) {
        getWhichType();
        setCur(5);
      } else {
        addMessage(res.msg);
      }
    });
  };

  const yzyq = () => {
    lastStep().then((res: any) => {
      if (res.code === 200) {
        setCur(6);
      } else {
        addMessage(res.msg);
      }
    });
  };

  const joinus = () => {
    joinsys().then((res: any) => {
      if (res.code === 200) {
        nav("/View/join/person", { replace: true });
      } else {
        addMessage(res.msg);
      }
    });
  };

  const getInitData = () => {
    if (!token) return;
    interestTwitterInfo({}).then((res: any) => {
      if (res.code === 200) {
        setTwitterInfo(res.data);
      }
    });
    loginIncome({}).then((res: any) => {
      if (res.code === 200) {
        setLoginIncomeData(res.data);
      }
    });
  };
  // type(1:-:-
  const getVilifyState = (type: number) => {
    if (!token) return;
    if (type === 1) {
      checkBindTwitter({}).then((res: any) => {
        if (res.code === 200) {
          addMessage(t("136"));
          getWhichType();
        } else {
          addMessage(res.msg);
        }
      });
    } else if (type === 2) {
      checkFollowsTwitter({}).then((res: any) => {
        if (res.code === 200) {
          addMessage(t("137"));
          getWhichType();
        } else {
          addMessage(res.msg);
        }
      });
    }
  };

  useEffect(() => {
    if (token) {
      getInitData();
    }
  }, [token]);
  useEffect(() => {
    if (!!twApproveCode && state) {
      oauth2CallBack(state, twApproveCode).then((res: any) => {
        if (res.code === 200) {
          // -
        } else {
          addMessage(res.msg);
        }
      });
    }
  }, [twApproveCode, state]);

  return (
    <J_step className="j_step">
      {current <= 5 ? (
        <div className="topp">
          <div>
            {stepArr.map((item: number, index: number) => {
              return (
                <div className="step_box" key={index}>
                  <div
                    className={current === item ? "active" : ""}
                    style={{
                      marginLeft:
                        current === item && current !== 1 ? "-.5833rem" : "",
                    }}
                    key={index}
                  >
                    {item}
                  </div>
                  <div
                    style={{
                      display: index === stepArr.length - 1 ? "none" : "",
                      marginLeft: current === item ? "-.5833rem" : 0,
                    }}
                  />

                  <div
                    style={{
                      display: item === current ? "" : "none",
                      left:
                        current === item && current !== 1 ? "-.5833rem" : "",
                    }}
                  >
                    {item === 1
                      ? t("15")
                      : item === 2
                      ? t("16")
                      : item === 3
                      ? t("17")
                      : item === 4
                      ? t("19")
                      : item === 5
                      ? t("19")
                      : ""}
                  </div>
                </div>
              );
            })}
          </div>

          {current === 1 ? (
            <div className="type1">
              <div>{t("20")}</div>
              <div>{t("21")}</div>
              <div onClick={qm}>MeatMask</div>
              <div
                onClick={() => {
                  return addMessage(t("168"));
                }}
              >
                Other Wallet
              </div>
            </div>
          ) : current === 2 ? (
            <Type_Box2 className="type2">
              <div>{t("22")}</div>
              <div>
                {inputValue.map((item: any, index: number) => {
                  return (
                    <Input
                      onChange={(e) => handleChange(index, e)}
                      value={item}
                      key={index}
                      maxLength={1}
                      ref={(el) => (inputRef.current[index] = el)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                  );
                })}
              </div>
              <div className="btn" onClick={jsyq}>
                {t("23")}
              </div>
            </Type_Box2>
          ) : current === 3 ? (
            <div className="type3">
              <div>
                <div>
                  <span>{t("138")}</span>
                </div>
                <div onClick={zftw} className="btn">
                  &nbsp;&nbsp;
                  {btnType.isBindTwitter === 1 ? t("139") : t("140")}
                  &nbsp;&nbsp;
                </div>
                <div onClick={() => getVilifyState(1)} className="btn">
                  &nbsp;&nbsp;{t("141")}&nbsp;&nbsp;
                </div>

                <div onClick={() => setCur(4)}>({t("167")})</div>
              </div>
            </div>
          ) : current === 4 ? (
            <div className="type5">
              <span>{t("31")}</span>
              <div onClick={yzyq} className="btn">
                {t("32")}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        <div className="type6">
          <div />
          <div>
            {t("33")}，
            {web3React.account?.replace(/^(.{7}).+(.{6})$/, "$1...$2")}
          </div>
          <div>
            <div>{t("34")}</div>
            <div>
              <img alt="" src={border} />
              {LoginIncomeData?.loginIncomeCredit}
              {t("35")}
            </div>
            <div />
            <div>
              <img alt="" src={border} />
              {t("36", { num: LoginIncomeData?.loginIncomeMint })}
            </div>
          </div>
          <div>{t("37")}</div>
          <div
            onClick={joinus}
            className="btn"
            style={{ padding: "1.25rem 18.6667rem" }}
          >
            {t("38")}
          </div>
        </div>
      )}
    </J_step>
  );
};

export default JoinStep;
