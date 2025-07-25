import React, { useState } from 'react'
import { TelegramLogo, Info } from 'phosphor-react'
import { useStore } from '../../store'
import { MsgExecuteContract, StdFee } from '@terra-money/terra.js'

import numeral from 'numeral'

const obj = new StdFee(700_000, { uusd: 150000 })

export default function LpStaking(props) {
    const { showNotification } = props
    const { state, dispatch } = useStore()

    function setInputAmount(amount) {
        const input = document.querySelector('.amount-input-lpstaking')
        input.value = amount / 1000000
    }

    function stakeOrUnstake(type) {
        var input = document.querySelector('.amount-input-lpstaking')
        //console.log(type,input.value);
        const amount = parseInt(input.value * 1000000)
        if (amount <= 0) {
            showNotification('Input amount empty', 'error', 4000)
            return
        }
        let msgs = []
        if (type == 'stake') {
            msgs.push(
                new MsgExecuteContract(
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
            )

        } else {
            // unbond
            msgs.push(
                new MsgExecuteContract(
                    state.wallet.walletAddress,
                    state.alteStakingLPAddress,
                    {
                        unbond_stake: { amount: amount.toString() },
                    }
                )
            )
            // Withdraw directly after unbond
            msgs.push(
                new MsgExecuteContract(
                    state.wallet.walletAddress,
                    state.alteStakingLPAddress,
                    {
                        withdraw_stake: {},
                    }
                )
            )

        }

        state.wallet
            .post({
                msgs: msgs,
                gasPrices: obj.gasPrices(),
                gasAdjustment: 1.7,
            })
            .then((e) => {
                console.log(e)
                let notification_msg =
                    type == 'stake' ? 'Stake success' : 'Unstake success'
                if (e.success) {
                    showNotification(notification_msg, 'success', 4000)
                } else {
                    console.log(e)
                }
            })
            .catch((e) => {
                console.log(e)
                showNotification(e.message, 'error', 4000)
            })
    }

    function claimInfo() {
        if (state.holderClaimsLP) {
            let total_amount_claimable = 0
            state.holderClaimsLP.map((e) => {
                console.log("state.blockHeight")
                console.log(state.blockHeight)
                if (e.release_at.at_height < state.blockHeight) {
                    total_amount_claimable += parseInt(e.amount)
                }
            })
            return total_amount_claimable / 1000000
        }
        return 0
    }

    function pendingClaim() {
        if (state.holderClaimsLP) {
            let total_amount_pending = 0
            state.holderClaimsLP.map((e) => {
                if (e.release_at.at_height > state.blockHeight) {
                    total_amount_pending += parseInt(e.amount)
                }
            })
            return total_amount_pending / 1000000
        }
        return 0
    }

    function claimUnstake() {
        const msg = new MsgExecuteContract(
            state.wallet.walletAddress,
            state.alteStakingLPAddress,
            {
                withdraw_stake: {},
            }
        )
        state.wallet
            .post({
                msgs: [msg],
                gasPrices: obj.gasPrices(),
                gasAdjustment: 1.5,
            })
            .then((e) => {
                if (e.success) {
                    showNotification('Claim unstake success', 'success', 4000)
                } else {
                    console.log(e)
                }
            })
            .catch((e) => {
                console.log(e.message)
                showNotification(e.message, 'error', 4000)
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
        state.wallet
            .post({
                msgs: [msg],
                gasPrices: obj.gasPrices(),
                gasAdjustment: 1.5,
            })
            .then((e) => {
                if (e.success) {
                    showNotification('Claim rewards succes', 'success', 4000)
                } else {
                    console.log(e)
                }
            })
            .catch((e) => {
                console.log(e.message)
                showNotification(e.message, 'error', 4000)
            })
    }

    return (
        <div className="row">
            <div className="col-md-12">
                <p className="input-heading">The amount you want to LP Stake</p>
                <p className="input-slogan" style={{fontWeight:300}}>
                    <Info size={14} weight="fill" className="me-1"/>Provide liquidity on <a href="https://app.terraswap.io/" target="_blank">Terraswap</a> for pair ALTE-UST.
                    Rewards are waiting! Stake
                    now your LP tokens and unstake at any time!
                </p>
                <span className="info special">
                    <div className="row">
                    <div className="col-12">
                            <p>
                                <strong  style={{color:'#aaa', fontSize:'18px', fontWeight:500}}>APR</strong>
                                <br />{' '}
                                <span style={{
                                        fontSize: '26px',
                                        color: '#dcef14',
                                        position: 'relative',
                                        top: '5px',
                                        marginBottom: '15px',
                                        display: 'block',
                                        fontWeight:700
                                }}>
                                {state.APY != 0
                                    ? numeral(state.APY).format('0')
                                    : '...'}
                                %
                                </span>
                            </p>
                        </div>
                        <div className="col-md-6">
                            <p>
                                <strong>Daily rewards</strong>
                                <br />                               
                                410 LOTA    
                               
                            </p>
                            </div>
                            <div className="col-md-6">
                            <p>
                                <strong>Yearly rewards</strong>
                                <br />                               
                                150,000 LOTA
                               
                            </p>
                            </div>
                        <div className="col-md-6">
                            <p>
                                <strong>Total staked LP</strong>
                                <br />                               
                                {state.poolInfoALTE != 0
                                    ? numeral(parseInt(state.poolInfoALTE.total_share) / 1000000).format(
                                    '0,0.00'
                                ) + 'LP'
                                    : '...'}
                               
                            </p>
                            </div>
                            <div className="col-md-6">
                            <p>
                                <strong>Total staked LP in ALTE</strong>
                                <br />
                                {state.totalAlteStaked != 0
                                    ? numeral(state.totalAlteStaked).format(
                                    '0,0.00'
                                ) + 'ALTE'
                                    : '...'}
                            </p>
                        </div>                        
                    </div>
                </span>
                <div className="input-group mb-3">                    
                    <input
                        type="number"
                        className="form-control amount-input-lpstaking"
                        autoComplete="off"
                        placeholder="0.00"
                        name="amount"
                    />
                    <span className="input-group-text" id="basic-addon1">
                        <img
                            src="/ALTEUST.png"
                            width="30px"
                            className="img-fluid"
                        />
                    </span>
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
                <button
                    className="btn btn-secondary w-100"
                    onClick={() => stakeOrUnstake('stake')}
                >
                    Stake Now
                </button>
                <small className="float-end text-muted mt-2">
                    Available:{' '}
                    <strong
                        style={{ textDecoration: 'underline' }}
                        onClick={() =>
                            setInputAmount(parseInt(state.LPBalance.balance))
                        }
                    >
                        {state.wallet && state.wallet.walletAddress && (
                            <>
                                {numeral(
                                    parseInt(state.LPBalance.balance) / 1000000
                                ).format('0.00')}
                            </>
                        )}{' '}
                        LP token
                        {' | ('}
                        {state.wallet && state.wallet.walletAddress && state.poolInfoALTE &&(
                            <>
                                {numeral(
                                    parseInt(state.poolInfoALTE.assets[0].amount) / parseInt(state.poolInfoALTE.total_share) * parseInt(state.LPBalance.balance) /
                                    1000000
                                ).format('0.00')}
                            </>
                        )}{' '} ALTE
                        {' - '}
                        {state.wallet && state.wallet.walletAddress && state.poolInfoALTE &&(
                            <>
                                {numeral(
                                    parseInt(state.poolInfoALTE.assets[1].amount) / parseInt(state.poolInfoALTE.total_share) * parseInt(state.LPBalance.balance) /
                                    1000000
                                ).format('0.00')}
                            </>
                        )}UST{')'}
                    </strong>
                </small>
            </div>
            <div className="col-6 my-3">
                <button
                    className="btn btn-default w-100"
                    onClick={() => stakeOrUnstake('unstake')}
                >
                    Unstake
                </button>

                <small className="float-end text-muted mt-2">
                    Available:{' '}
                    <strong
                        style={{ textDecoration: 'underline' }}
                        onClick={() =>
                            setInputAmount(state.allHolderLP.balance)
                        }
                    >
                        {state.wallet && state.wallet.walletAddress && (
                            <>
                                {numeral(
                                    parseInt(state.allHolderLP.balance) /
                                        1000000
                                ).format('0.00')}
                            </>
                        )}{' '}
                        LP token {' | ('}
                        {state.wallet && state.wallet.walletAddress && state.poolInfoALTE &&(
                            <>
                                {numeral(
                                    parseInt(state.poolInfoALTE.assets[0].amount) / parseInt(state.poolInfoALTE.total_share) * parseInt(state.allHolderLP.balance) /
                                    1000000
                                ).format('0.00')}
                            </>
                        )}{' '} ALTE
                        {' - '}
                        {state.wallet && state.wallet.walletAddress && state.poolInfoALTE &&(
                            <>
                                {numeral(
                                    parseInt(state.poolInfoALTE.assets[1].amount) / parseInt(state.poolInfoALTE.total_share) * parseInt(state.allHolderLP.balance) /
                                    1000000
                                ).format('0.00')}
                            </>
                        )}UST{')'}
                    </strong>
                </small>

            </div>

            <div className="col-md-12 my-3">
                <div className="claim-unstake">
                    <p className="input-heading">Claim rewards</p>
                    <p className="input-slogan" style={{fontWeight:300}}>
                        <Info size={14} weight="fill" className="me-1"/>
                        Daily payout! Next payout
                        {" "+ new Date(parseInt(state.stateLPStakingALTE.open_block_time) * 1000).toUTCString()}
                    </p>
                    <p className="rewards-counter w-100 mb-0">
                        {state.wallet && state.wallet.walletAddress && (
                            <>
                                {numeral(
                                    parseInt(state.LPHolderAccruedRewards) /
                                        1000000
                                ).format('0.00000')}{' '}
                                LOTA ={' '}
                                {numeral(
                                    (parseInt(state.LPHolderAccruedRewards) /
                                        1000000) *
                                        state.pricePerLota
                                ).format('0.00000')}{' '}
                                UST
                            </>
                        )}
                    </p>
                    <button
                        className="btn btn-secondary w-100 mb-3"
                        disabled={
                            state.LPHolderAccruedRewards <= 0 ? true : false
                        }
                        onClick={() => claimLPRewards()}
                        style={{ marginTop: '10px' }}
                    >
                        Claim Rewards
                    </button>

                    { claimInfo() && pendingClaim() && pendingClaim() > 0 || claimInfo() > 0 &&
                        
                        <>
                            <p className="input-heading mt-3">Claim unstake</p>
                            <p className="input-slogan">
                                Instant unbonding, no lock time. ⚠️ unbonding token get no rewards
                            </p>
                            <span className="info">
                        <Info size={14} weight="fill" className="me-1" />
                        Your pending claim amount available soon:
                        <strong> {pendingClaim()} LP token</strong>
                        <div style={{ marginTop: '20px' }}>
                            List of pending claims
                        </div>
                        <table>
                            {' '}
                            <thead>
                                <tr>
                                    <td style={{ paddingLeft: '20px' }}>
                                        Amount
                                    </td>{' '}
                                    <td style={{ paddingLeft: '20px' }}>
                                        Release at blockheight
                                    </td>
                                </tr>
                            </thead>{' '}
                            <tbody>
                                {state.holderClaimsLP ? (
                                    state.holderClaimsLP.map((e) => {
                                        if (
                                            e.release_at.at_height >
                                            state.blockHeight
                                        ) {
                                            return (
                                                <tr>
                                                    <td
                                                        style={{
                                                            paddingLeft: '20px',
                                                        }}
                                                    >
                                                        {numeral(
                                                            parseInt(e.amount) /
                                                                1000000
                                                        ).format('0,0.000000')}
                                                        LP token
                                                    </td>{' '}
                                                    <td
                                                        style={{
                                                            paddingLeft: '20px',
                                                        }}
                                                    >
                                                        {e.release_at.at_height}
                                                    </td>{' '}
                                                </tr>
                                            )
                                        }
                                    })
                                ) : (
                                    <tr>
                                        <td>Empty</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </span>
                            <button
                                className="btn btn-default w-100"
                                onClick={() => claimUnstake()}                               
                                style={{ marginTop: '10px' }}
                            >
                                Claim unstake
                            </button>
                            <small className="float-end text-muted mt-2">

                        Available:
                        <strong>
                            {claimInfo()}
                            LP token
                        </strong>
                    </small>
                            </>
                        
                    }
                </div>
            </div>
        </div>
    )
}
