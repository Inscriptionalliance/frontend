import { useEffect, useRef, useState } from 'react'
import { useTranslation } from "react-i18next";
import '../assets/style/componentsStyle/Massage.scss'
import { AddrHandle, dateFormat } from '../utils/tool';

function App(props) {
    const { t, i18n } = useTranslation()
    const [isScrolle, setIsScrolle] = useState(true) //-
    const [context, setContext] = useState([]) //-
    const speed = 25 //---
    const warper = useRef() //-arent-
    const childDomInit = useRef() //-
    const childDomCopy = useRef() //-

    useEffect(() => {
        setContext([...props.messageData, ...props.messageData, ...props.messageData, ...props.messageData])
        childDomCopy.current.innerHTML = childDomInit.current.innerHTML // ---
    }, [props])

    // -
    useEffect(() => {
        let timer
        if (isScrolle) {
            timer = setInterval(() => {
                /**
                *-
                 * warper.current.scrollLeft：-
                 * childDomInit.current.scrollWidth ：-
                 */
                warper.current.scrollLeft >= childDomInit.current.scrollWidth
                    ? (warper.current.scrollLeft = 0)
                    : warper.current.scrollLeft++
            }, speed)
        }
        return () => {
            clearTimeout(timer)
        }
    }, [isScrolle])

    // --
    const hoverHandler = (flag) => setIsScrolle(flag)

    return (
        <>
            <div>
                <div className="parent" ref={warper} >
                    <div className="child" ref={childDomInit}>
                        {context.map((item, index) => (
                            <div
                                key={index}
                                onMouseOver={() => hoverHandler(false)}
                                onMouseLeave={() => hoverHandler(true)}
                                className='recordItem'
                            >
                                {/* {AddrHandle(item.userAddress)}  {t("bought")}  {item.payTokenNum} PUSD {`\u00A0\u00A0\u00A0`} */}
                                <span className='titleContent'> {item?.noticeTitle}`\u00A0\u00A0\u00A0``\u00A0\u00A0\u00A0``\u00A0\u00A0\u00A0``\u00A0\u00A0\u00A0``\u00A0\u00A0\u00A0`</span> <span className='timeContent'>{dateFormat("YYYY-mm-dd", new Date(item?.createTime))}</span>
                            </div>
                        ))}
                    </div>
                    <div className="child" ref={childDomCopy}></div>
                </div>
            </div>
        </>
    )
}

export default App