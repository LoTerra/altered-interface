import React from 'react'
import numeral from 'numeral'
import Equilibrium from './Equilibrium';

export default function CurrentPrice(props) {
    const { price, total } = props

    const indicatorPercentage = (data) => {
        let diff = 1.05 - numeral(data).format('0,0.000000');
        let percentage = diff * 10;
        if(percentage >= 100){
            return '100%';
        } else {
            return percentage+'%';
        }
        
    }

    return (
        <div className="current-price">
            <div className="row">
                <div className="col-12 overflow-hidden mb-4">
                    <p className="heading" style={{paddingBottom:"10px", fontSize:"16px"}}>Equilibrium Zone</p>
                    <div className="eq">
                        {/* <img src="eq.svg" /> */}
                        <Equilibrium style={{width:'100%', maxWidth:'100%'}}/>
                        <div style={{marginLeft:'50%'}} className="indicator subtle">
                            <span className={"span-stable"}></span>
                            <label>TARGET 1<i>UST</i></label>
                        </div>
                        <div style={{marginLeft:(numeral(price).format('0,0.000000') <= 0.95 ? '0%' : indicatorPercentage(price))}} className="indicator" > 
                            <span className={price < 0.95 || price > 1.05 ? "span-out" : "span-in"}></span>
                            <label className={price < 0.95 || price > 1.05 ? "colored-out current" : "colored-in current"}>{numeral(price).format('0,0.000000')}<i>UST</i></label>
                        </div>
                        <div className="static-indicator">
                            <span> {'<'}0.95</span>
                            <span> 1.05{'<'} </span>
                        </div>
                    </div>
                </div>
                <div className="col-12">                  
                    <p className="heading">
                        Current <strong>ALTE</strong> price
                    </p>
                    <p className="small">
                        {numeral(price).format('0,0.000000')} <span>UST</span>
                    </p>
                    <p className="heading">Total supply</p>
                    <p className="small">
                        {numeral(total / 1000000).format('0,0.00')}{' '}
                        <span>ALTE</span>
                    </p>
                </div>
            </div>           
        </div>
    )
}
