import React from 'react';

 export default function SwapForm(){

    return(
        <div className="swap-form">
            <div className="row">
                <div className="col-12 text-center mb-5">
                    <h3>Swap</h3>
                </div>
                <div className="col-12 mb-3">
                    <span className="label">FROM</span>
                    <span className="valuta">UST</span>
                    <input type="number" className="form-control" value="" placeholder="0" />                    
                </div>
                <div className="col-12 mb-3">
                    <span className="label">TO</span>
                    <span className="valuta">ALTE</span>
                    <input type="number" className="form-control" value="" placeholder="0" />
                </div>
                <div className="col-12 mb-3">
                    <button className="btn btn-special w-100">Swap</button>
                </div>
            </div>
        </div>
    )
 }