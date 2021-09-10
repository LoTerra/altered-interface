import React, {useState} from "react";
import { TelegramLogo, Info } from "phosphor-react";
import { useStore } from "../../store";
import {MsgExecuteContract,StdFee} from "@terra-money/terra.js"

import numeral from "numeral";

const addToGas = 5800
const obj = new StdFee(700_000, { uusd: 319200 + addToGas }) 


export default function LpStaking(props){
    const {showNotification} = props;
    const {state, dispatch} = useStore();

    function setInputAmount(amount){
        const input = document.querySelector('.amount-input-lpstaking');
        input.value = amount / 1000000;
    }
 
    function stakeOrUnstake(type) {
        var input = document.querySelector('.amount-input-lpstaking')
        //console.log(type,input.value);
        const amount = parseInt(input.value * 1000000)
        if(amount <= 0){
            showNotification('Input amount empty','error',4000)
            return;
        }
        let msg
        if(type == 'stake'){
            msg = new MsgExecuteContract(
                state.wallet.walletAddress,
                state.alteLPAddress,
                {
                  send: {
                    contract: state.alteStakingLPAddress,
                    amount: amount.toString(),
                    msg: 'eyAiYm9uZF9zdGFrZSI6IHt9IH0=',
                  },
                }
              ) 
        } else {
            msg = new MsgExecuteContract(
                state.wallet.walletAddress,
                state.alteStakingLPAddress,
                {
                  unbond_stake: { amount: amount.toString() },
                }
              )   
        }
             

        state.wallet.post({
            msgs: [msg],
            fee: obj
            // gasPrices: obj.gasPrices(),
            // gasAdjustment: 1.5,
        }).then(e => {
            console.log(e)
            let notification_msg = type == 'stake' ? 'Stake success' : 'Unstake success';
            if (e.success) {   
                    showNotification(notification_msg,'success',4000)
            }
            else{
                console.log(e)
            }
        }).catch(e =>{
            console.log(e)
            showNotification(e.message,'error',4000)
        })
    }

    function claimInfo (){
        if (state.holderClaimsLP){
            let total_amount_claimable = 0
            state.holderClaimsLP.map(e => {
                if (e.release_at.at_height < state.blockHeight ) {
                    total_amount_claimable += parseInt(e.amount)
                }
            })
            return  (<>{total_amount_claimable/ 1000000}</>)
        }
        return  (<>0</>)

    }
    function pendingClaim (){
        if (state.holderClaimsLP){
            let total_amount_pending = 0
            state.holderClaimsLP.map(e => {
                if (e.release_at.at_height > state.blockHeight ) {
                    total_amount_pending += parseInt(e.amount)
                }
            })
            return  (<>{total_amount_pending/ 1000000}</>)
        }
        return  (<>0</>)

    }

    function claimUnstake() {
        const msg = new MsgExecuteContract(
            state.wallet.walletAddress,
            state.alteStakingLPAddress,
            {
              withdraw_stake: {},
            }
          )
          state.wallet.post({
            msgs: [msg],
            fee: obj
            // gasPrices: obj.gasPrices(),
            // gasAdjustment: 1.5,
        }).then(e => {
            if (e.success) {              
                showNotification('Claim unstake success','success',4000)
            }
            else{
                console.log(e)
            }
        }).catch(e =>{
            console.log(e.message)
            showNotification(e.message,'error',4000)
        })
    }

    function claimLPRewards() {
        const msg = new MsgExecuteContract(
            state.wallet.walletAddress,
            state.alteStakingLPAddress,
            {
                claim_rewards: {},
            }
        )
        state.wallet.post({
            msgs: [msg],
            fee: obj
            // gasPrices: obj.gasPrices(),
            // gasAdjustment: 1.5,
        }).then(e => {
            if (e.success) {
                showNotification('Claim rewards succes','success',4000)
            }
            else{
                console.log(e)
            }
        }).catch(e =>{
            console.log(e.message)
            showNotification(e.message,'error',4000)
        })
    }

    return (
        <div className="row">
            <div className="col-md-12">
                <p className="input-heading">The amount you want to LP Stake</p>
                <p className="input-slogan">Provide liquidity on Terraswap for pair ALTE-UST and stake your LP token to share: 410.00 LOTA daily rewards | 150,000.00 LOTA year rewards</p>
                <span className="info special">
                    <div className="row">
                        <div className="col-6">
                            <p><strong>Total staked LP in ALTE</strong><br/>{state.totalAlteStaked != 0 ? numeral(state.totalAlteStaked).format("0,0.00") + 'ALTE': '...'}</p>
                        </div>
                        <div className="col-6">
                            <p><strong>APY</strong><br/> {state.APY != 0 ? numeral(state.APY).format("0") : '...' }%</p>
                        </div>
                    </div>                   
                </span>
                <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1"><img src="/ALTEUST.png" width="30px" className="img-fluid"/></span>
                <input type="number" className="form-control amount-input-lpstaking" autoComplete="off" placeholder="0.00"  name="amount" />
                </div>
            </div>
            {/* <div className="col-md-12 my-3">
                <small>
                    total staked LP in ALTE:
                    <p className="input-heading">{state.totalAlteStaked != 0 ? numeral(state.totalAlteStaked).format("0,0.00") + 'ALTE': '...'}</p>
                </small>
                APY:
                <p className="input-heading mb-2">{state.APY != 0 ? numeral(state.APY).format("0") : '...' }%</p>
            </div> */}
            {/*<div className="col-md-12">
                <div className="total-stats w-100">
                    <div className="row">
                        <div className="col-6">
                            Pool APR
                        </div>
                        <div className="col-6 text-end">
                            ?%
                        </div>
                        <div className="col-6">
                            Pool APY
                        </div>
                        <div className="col-6 text-end">
                            ?%
                        </div>
                    </div>
                </div>
            </div>*/}
            <div className="col-6 my-3">
                <button className="btn btn-secondary w-100" onClick={()=> stakeOrUnstake('stake')}>Stake Now <small>(⚠️ REWARDS COMING SOON)</small></button>
                <small className="float-end text-muted mt-2">Available: <strong style={{textDecoration:'underline'}} onClick={()=> setInputAmount(parseInt(state.LPBalance.balance))}>{ state.wallet &&
                        state.wallet.walletAddress &&
                        (<>{(numeral(parseInt(state.LPBalance.balance) / 1000000).format('0.00'))}</>)
                        } LP token</strong></small>
            </div>
            <div className="col-6 my-3">
        
                <button className="btn btn-default w-100" onClick={()=> stakeOrUnstake('unstake')}>Unstake</button>

                <small className="float-end text-muted mt-2">Available: <strong style={{textDecoration:'underline'}} onClick={()=> setInputAmount(state.allHolderLP.balance)}>{ state.wallet &&
                        state.wallet.walletAddress &&
                        (<>{numeral(parseInt(state.allHolderLP.balance) / 1000000).format('0.00')}</>)
                        } LP token</strong></small>
            </div>

            <div className="col-md-12 my-3">
                        <div className="claim-unstake">
                        <p className="input-heading">Claim rewards</p>
                        <p className="rewards-counter w-100 mb-0">{ state.wallet && state.wallet.walletAddress &&
                                    (<>{numeral(parseInt(state.LPHolderAccruedRewards) / 1000000).format('0.00000')} LOTA</>)
                                    }</p>
                        <button className="btn btn-secondary w-100 mb-3" disabled={state.LPHolderAccruedRewards <= 0 ? true : false} onClick={()=> claimLPRewards()}
                            style={{marginTop:'10px'}}>Claim Rewards</button>
                        <p className="input-heading">Claim unstake</p>
                            <p className="input-slogan">Unbonding period of 700,000 block height ~1.5 | 2 Months, ⚠️ unbonding token get no rewards</p>
                        <button className="btn btn-default w-100" onClick={()=> claimUnstake()}
                            style={{marginTop:'10px'}}>Claim
                            unstake</button>
                        {/* If unstake claiming condition */}
                        <span className="info">
                            <Info size={14} weight="fill" className="me-1" />
                            Your pending claim amount available soon:
                            <strong> {pendingClaim()} LP token</strong>
                        </span>
                        <small className="float-end text-muted mt-2">Available: <strong>
                                {
                                state.wallet && state.wallet.walletAddress && claimInfo()
                                }
                                LP token</strong></small>
                        </div>
            </div>

        </div>
    )
}