import React, {useState, useEffect, useMemo} from "react";
import { useTimer } from "react-timer-hook";




export default function Countdown(props){

    const { expiryTimestamp } = props;

    const { seconds, minutes, hours, days, restart } = useTimer({
      autoStart: false,
      expiryTimestamp,
      onExpire: () => console.warn("onExpire called"),
    });
  
    useEffect(() => {
        console.log(expiryTimestamp)
      if (
        expiryTimestamp >
        1 /** in ordder to avoid unnecessary re-rendering/ layout */
      )
        restart(expiryTimestamp);
    }, [expiryTimestamp]);

    return (
        <>
        <div className="w-96 countdown">
      <div className="text-center opacity-50 text-lg md:text-xl time-start">
        Next draw in
      </div>
    
      <div className="text-5xl md:text-6xl text-center flex items-center justify-center">
        <div className="p-2 rounded-lg">
          <div className="text-sm time-low">Days</div>
          <div className="font-bold time" x-text="days">
            {expiryTimestamp > 1 ? days.toString().padStart(2, 0) : "-"}
          </div>
        </div>
        <div className="text-5xl md:text-6xl font-bold time-dot">:</div>
        <div className="p-2 rounded-lg">
          <div className="text-sm time-low">Hours</div>
          <div className="font-bold time" x-text="hours">
            {expiryTimestamp > 1 ? hours.toString().padStart(2, 0) : "-"}
          </div>
        </div>
        <div className="text-5xl md:text-6xl font-bold time-dot">:</div>
        <div className="p-2 rounded-lg">
          <div className="text-sm time-low">Minutes</div>
          <div className="font-bold time" x-text="minutes">
            {expiryTimestamp > 1 ? minutes.toString().padStart(2, 0) : "-"}
          </div>
        </div>
        <div className="text-5xl md:text-6xl font-bold time-dot">:</div>
        <div className="p-2 rounded-lg">
          <div className="text-sm time-low">Seconds</div>
          <div className="font-bold time" x-text="seconds">
            {expiryTimestamp > 1 ? seconds.toString().padStart(2, 0) : "-"}
          </div>
        </div>
      </div>
    </div>
        </>
    )
}