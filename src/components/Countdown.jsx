import React, { useState, useEffect, useMemo } from 'react'
import { useTimer } from 'react-timer-hook'
import numeral from 'numeral'

export default function Countdown(props) {
    const {
        expiryTimestamp,
        predictedPrice,
        predictedTotalSupply,
        doRebase,
        loading,
    } = props

    const { seconds, minutes, hours, days, restart } = useTimer({
        autoStart: false,
        expiryTimestamp,
        onExpire: () => console.warn('onExpire called'),
    })

    const start = new Date(
        new Date(expiryTimestamp).getTime() - 24 * 60 * 60 * 1000
    )
    const now = Date.now()
    const end = new Date(expiryTimestamp).getTime()
    let percentageTillRebase = Math.round(((now - start) / (end - start)) * 100)

    useEffect(() => {
        console.log(expiryTimestamp)
        console.log(predictedPrice, predictedTotalSupply)
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
                    {/*<div className="title">COUNTDOWN BEFORE NEXT REBASE</div>*/}
                    <div className="title">PRICE ALTERATION IN PROGRESS...</div>
                </div>
                {expiryTimestamp > new Date() && (
                    <div className="col-12">
                        <div className="progress">
                            <div
                                className="progress-bar"
                                role="progressbar"
                                style={{ width: percentageTillRebase + '%' }}
                                aria-valuenow={percentageTillRebase}
                                aria-valuemin="0"
                                aria-valuemax="100"
                            >
                                {numeral(percentageTillRebase).format('0')}%
                            </div>
                        </div>
                    </div>
                )}
                {expiryTimestamp < new Date() && loading && (
                    <div className="col-12">
                        <button
                            className="btn btn-special-black w-100"
                            onClick={doRebase}
                        >
                            Alter now
                        </button>
                    </div>
                )}
                {expiryTimestamp > new Date() && (
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
                                <div
                                    className="font-bold time"
                                    x-text="minutes"
                                >
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
                                <div
                                    className="font-bold time"
                                    x-text="seconds"
                                >
                                    {expiryTimestamp > 1
                                        ? seconds.toString().padStart(2, 0)
                                        : '-'}
                                </div>
                                <div className="text-sm time-low">Seconds</div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="col-12">
                    <div className="row">
                        <div className="col-12 text-start prediction-intro">
                            <h2>Future Stats</h2>
                            <p
                                className="heading"
                                style={{
                                    paddingBottom: '10px',
                                    fontSize: '16px',
                                }}
                            >
                                Predictions
                            </p>
                        </div>
                        <div className="col-12">
                            <div className="prediction-amount">
                                <p>
                                    Next <strong>ALTE</strong> price
                                </p>
                                <span>
                                    {numeral(predictedPrice).format(
                                        '0,0.000000'
                                    )}{' '}
                                    <i>UST</i>
                                </span>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="prediction-amount">
                                <p>Total supply</p>
                                <span>
                                    {numeral(predictedTotalSupply).format(
                                        '0,0.00'
                                    )}{' '}
                                    <i>ALTE</i>
                                </span>
                            </div>
                        </div>
                        {/* <div className="col-12 p-0">
                                <div className="prediction-amount">
                                    <p>Market cap</p>
                                    <span>{numeral((predictedPrice * predictedTotalSupply)).format('0,0.00')} <i>UST</i></span>
                                </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}
