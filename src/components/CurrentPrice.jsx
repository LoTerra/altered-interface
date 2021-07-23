import React from 'react';
import numeral from 'numeral';

export default function CurrentPrice(props){

    const {price} = props;
    

    return (
        <div className="current-price">
            <div className="row">
                <div className="col-12">
                    <p class="heading">Target price</p>
                    <p class="big">1.00 <span>UST</span></p>
                    <p class="heading">Current price</p>
                    <p class="small">{price} <span>UST</span></p>
                </div>
            </div>
        </div>
    )
}