import React from 'react';
import numeral from 'numeral';

export default function CurrentPrice(props){

    const {price} = props;
    

    return (
        <div className="current-price">
            <div className="row">
                <div className="col-12">
                    <span>Current price</span>
                    <p>{price}</p>
                </div>
            </div>
        </div>
    )
}