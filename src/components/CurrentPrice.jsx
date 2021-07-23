import React from 'react';
import numeral from 'numeral';

export default function CurrentPrice(props){

    const {price} = props;
    

    return (
        <div className="current-price">
            <div className="row">
                <div className="col-12">
                    <p className="heading">Target price</p>
                    <p className="big">1.00 <span>UST</span></p>
                    <p className="heading">Current price</p>
                    <p className="small">{numeral(price).format("0,0.000000")} <span>UST</span></p>
                </div>
            </div>
        </div>
    )
}