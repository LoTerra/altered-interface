import React, { useState, useEffect, useMemo } from 'react'
import { useTimer } from 'react-timer-hook'
import numeral from 'numeral'

export default function Countdown(props) {
    const { expiryTimestamp } = props

    const { seconds, minutes, hours, days, restart } = useTimer({
        autoStart: false,
        expiryTimestamp,
        onExpire: () => console.warn('onExpire called'),
    })

    let percetageTillRebase = (Date.now() * 100) / expiryTimestamp;

    useEffect(() => {
        console.log(expiryTimestamp)
        if (
            expiryTimestamp >
            1 /** in ordder to avoid unnecessary re-rendering/ layout */
        )
            restart(expiryTimestamp)
    }, [expiryTimestamp])

    return (
        <div className="countdown">
            <div className="row">
                <div className="col-12 text-center">
                    <div className="title">COUNTDOWN BEFORE NEXT REBASE</div>
                </div>
                <div className="col-12">
                    <div className="progress">
                        <div
                            className="progress-bar"
                            role="progressbar"
                            style={{ width: percetageTillRebase+'%' }}
                            aria-valuenow={percetageTillRebase}
                            aria-valuemin="0"
                            aria-valuemax="100"
                        >
                            {numeral(percetageTillRebase).format('0.00000')}%
                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <div className="row text-center">
                        <div className="col px-1">
                            <div className="font-bold time" x-text="days">
                                {expiryTimestamp > 1
                                    ? days.toString().padStart(2, 0)
                                    : '-'}
                            </div>
                            <div className="text-sm time-low">Days</div>
                        </div>
                        <div className="col px-1">
                            <span className="spacer"></span>
                        </div>
                        <div className="col px-1">
                            <div className="font-bold time" x-text="hours">
                                {expiryTimestamp > 1
                                    ? hours.toString().padStart(2, 0)
                                    : '-'}
                            </div>
                            <div className="text-sm time-low">Hours</div>
                        </div>
                        <div className="col px-1">
                            <span className="spacer"></span>
                        </div>
                        <div className="col px-1">
                            <div className="font-bold time" x-text="minutes">
                                {expiryTimestamp > 1
                                    ? minutes.toString().padStart(2, 0)
                                    : '-'}
                            </div>
                            <div className="text-sm time-low">Minutes</div>
                        </div>
                        <div className="col px-1">
                            <span className="spacer"></span>
                        </div>
                        <div className="col px-1">
                            <div className="font-bold time" x-text="seconds">
                                {expiryTimestamp > 1
                                    ? seconds.toString().padStart(2, 0)
                                    : '-'}
                            </div>
                            <div className="text-sm time-low">Seconds</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
