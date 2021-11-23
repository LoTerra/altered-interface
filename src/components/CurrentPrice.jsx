import React from 'react'
import numeral from 'numeral'
import Equilibrium from './Equilibrium'
import { Crosshair } from 'phosphor-react'

export default function CurrentPrice(props) {
    const { price, total } = props

    const indicatorPercentage = (data) => {
        //Rewrite
        let total = 1.05 - 0.95;
        let perc_total = total / 100;
        let percentage = (parseFloat(data) - 0.95) / perc_total;

        if(data > 0.95 && data < 1.05){
            return percentage+'%';
        }
        // I changed to minus 5% on all for a better UI displaying
        if(data >= 1.05){
            return '95%';
        }
        if(data <= 0.95){
            return '5%';
         }
    }

    return (
        <div className="current-price">
            <div className="row">
                <div className="col-12 overflow-hidden mb-4">
                    <h2>Current Stats</h2>
                    <p
                        className="heading"
                        style={{ paddingBottom: '10px', fontSize: '16px' }}
                    >
                        Equilibrium Zone
                    </p>
                    <div className="eq">
                        {/* <img src="eq.svg" /> */}
                        <Equilibrium
                            style={{ width: '100%', maxWidth: '100%' }}
                        />
                        <div
                            style={{ marginLeft: '50%' }}
                            className="indicator subtle"
                        >
                            <span className={'span-stable'}></span>
                            <label>
                                <Crosshair size={24} /> TARGET 1<i>UST</i>
                            </label>
                        </div>
                        <div
                            style={{
                                marginLeft:
                                    numeral(price).format('0,0.000000') <= 0.95
                                        ? '0%'
                                        : indicatorPercentage(price),
                            }}
                            className="indicator"
                        >
                            <span
                                className={
                                    price < 0.95
                                        ? 'span-out'
                                        : 'span-in'
                                }
                            ></span>
                            {<label
                                className={
                                    price < 0.95 || price >= 1.05
                                        ? 'colored-out current'
                                        : 'colored-in current'
                                }
                            >
                                {numeral(price).format('0,0.00')}
                            </label> }
                        </div>
                        <div className="static-indicator">
                            <span> {'<'}0.95</span>
                            <span> 1.05{'<'} </span>
                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <div className="row">
                        <div className="col-12">
                            <p className="heading">
                                Current <strong>ALTE</strong> price
                            </p>
                            <p className="small" style={{ lineHeight: '34px', fontSize: '30px' }}>
                                {numeral(price).format('0,0.000000')}{' '}
                                <span>UST</span>
                            </p>
                        </div>

                        <div className="col-12">
                            <p className="heading">Total supply</p>
                            <p className="small" style={{ fontSize: '35px' }}>
                                {numeral(total / 1000000).format('0,0.00')}{' '}
                                <span>ALTE</span>
                            </p>
                        </div>
                        <div className="col-12">
                            <p className="heading">Market Cap</p>
                            <p className="small" style={{ fontSize: '40px' }}>
                                {numeral(price * (total / 1000000)).format(
                                    '0,0.00'
                                )}{' '}
                                <span>UST</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
