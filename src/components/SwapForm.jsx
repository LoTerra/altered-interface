import { Swap } from 'phosphor-react';
import React from 'react';


 export default function SwapForm(props){

    const {switchValuta, selectedValuta, inputChange} = props;

    return(
        <div className="swap-form">
            <div className="row">
                <div className="col-12 text-center mb-5">
                    <h3>Swap</h3>
                </div>
                <div className="col-12 mb-3">
                    <span className="label">FROM</span>
                    <span className="valuta">UST</span>
                    <input type="number" className="form-control" onChange={(e) => inputChange(e)} placeholder="0" />                    
                </div>
                <button className="swapper" onClick={() => switchValuta()}>
                    <Swap size={36} color={'#DCEF14'}/>
                </button>
                <div className="col-12 mb-3">
                    <span className="label">TO</span>
                    <span className="valuta">ALTE</span>
                    <input type="number" className="form-control" placeholder="0" />
                </div>
                <div className="col-12 mb-3">
                    <button className="btn btn-special w-100">Swap</button>
                </div>
            </div>
        </div>
    )
 }