import React from 'react'
import { CheckCircle,XCircle,X } from 'phosphor-react'
import {useStore} from "../store";
import numeral from 'numeral';

export default function StakingModal(props) {

    const {open, toggleModal} = props;
    const {state, dispatch} = useStore();    

    const claimRewards = () => {

    }

    const doStake = (type) => {
        if(type == 'stake'){
            //Do stake
        } else {
            //Do unstake
        }
    }

    return(
            <>
            <div className={open ? 'staking-modal show' : 'staking-modal'}>
                <button className="toggle" onClick={() => toggleModal()}><X size={36} /></button>
                <h2>Staking</h2>
                <div className="staking-body">
                    <form>
                        <div className="row">
                            <div className="col-12 mb-3">                                
                                <input type="number" step="any" className="form-control"/>
                            </div>
                            <div className="col-6 mb-3 position-relative">
                                <span className="max-balance">MAX: {numeral(state.bankAlte).format('0.00')} ALTE</span>
                                <button className="btn btn-default w-100" onClick={() => doStake('stake')}>Stake</button>
                            </div>
                            <div className="col-6 mb-3 position-relative"> 
                                <span className="max-balance">MAX: 0.00 ALTE</span>
                                <button className="btn btn-default w-100" onClick={() => doStake('unstake')}>Unstake</button>
                            </div>
                        </div>
                    </form>
                    <h2 style={{marginTop:'15px'}}>Rewards</h2>
                    <h4>0.000000 UST</h4>
                    <form>
                        <div className="row">                            
                            <div className="col-12 mb-3">
                                <button className="btn btn-default w-100" onClick={() => claimRewards()}>Claim Rewards</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div className={open ? 'backdrop show' : 'backdrop'} onClick={() => toggleModal()}></div>
            </>
    )
}