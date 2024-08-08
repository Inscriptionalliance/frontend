import React, { useCallback } from "react";
import moment from 'moment';
const { useState, useEffect, useRef } = React;

let timer: any = null;

function CountDown(props: any) {
    //react Hooks
    console.log(props.timeStamp, 'props.timeStamp');

    // -
    const [currentTime, setCurrentTime] = useState(moment());
    // -
    const [endTime, setEndTime] = useState<any>(moment().add(Number(props.timeStamp), "s"));
    // -/-
    const [diffTime, setDiffTime] = useState<any>(moment().add(Number(props.timeStamp), "s").diff(currentTime, "s"));
    // const timer = useRef();
    useEffect(() => {
        // -
        if (diffTime == 0) {
            window.clearInterval(timer);
        }
        if (timer) return;
        timer = window.setInterval(() => {
            setDiffTime((diffTime: any) => diffTime - 1);
        }, 1000);
    }, [diffTime, props.timeStamp]);

    useEffect(() => {
        // setEndTime(moment().add(Number(props.timeStamp), "s"))
        // setDiffTime(moment().add(Number(props.timeStamp), "s").diff(currentTime, "s"))
        // -
        return () => {
            clearInterval(timer);
        };
    }, []);

    // -
    const convertSecToHHmmss = (sec: any) => {
        let currentSec = moment.duration(sec, "seconds");
        return moment({
            h: currentSec.hours(),
            m: currentSec.minutes(),
            s: currentSec.seconds(),
        }).format("HH:mm:ss");
    }

    return (
        <>
            {convertSecToHHmmss(diffTime)}
        </>
    );
}

export default CountDown;