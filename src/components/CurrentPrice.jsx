import React from 'react';
import numeral from 'numeral';

export default function CurrentPrice(props){

    const {price} = props;
    

    return (
        <div className="current-price">
            <div className="row">
                <div className="col-12">
                    <span>Current price</span>
                    <p>{ numeral(price*10000000).format("0.00")}</p>
                </div>
            </div>
        </div>
    )
}