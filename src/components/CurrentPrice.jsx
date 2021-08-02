import React from 'react'
import numeral from 'numeral'

export default function CurrentPrice(props) {
    const { price, total } = props

    return (
        <div className="current-price">
            <div className="row">
                <div className="col-12 overflow-hidden mb-4">
                    <div className="eq">
                        <img src="eq.svg" />
                        <div style={{marginLeft:'47%'}} className="indicator" > 
                            <span></span>
                            <label>0.98</label>
                        </div>
                        <div className="static-indicator">
                            <span>0.95</span>
                            <span>1.05</span>
                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <p className="heading">Target price</p>
                    <p className="big">
                        1.00 <span>UST</span>
                    </p>
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
