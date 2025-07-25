import React, { useEffect, useState, useCallback, useRef } from 'react'

import {
    StdFee,
    MsgExecuteContract,
    LCDClient,
    WasmAPI,
    BankAPI,
} from '@terra-money/terra.js'
import BigNumber from 'bignumber.js'
import Countdown from '../components/Countdown'
import CurrentPrice from '../components/CurrentPrice'
import SwapForm from '../components/SwapForm'
import Notification from '../components/Notification'
import { Swap, Warning, ArrowSquareOut, ChartLine, Bank, Eye } from 'phosphor-react'
import StakingForm from '../components/StakingForm'
import { useStore } from '../../src/store'

let useConnectedWallet = {}
if (typeof document !== 'undefined') {
    useConnectedWallet =
        require('@terra-money/wallet-provider').useConnectedWallet
}

const altered_address =
    process.env.DEV == true
        ? process.env.ALTERED_ADDR_TESTNET
        : process.env.ALTERED_ADDR
const alte_ust_pair =
    process.env.DEV == true
        ? process.env.POOL_ADDR_TESTNET
        : process.env.POOL_ADDR
const lota_ust_pair =
    process.env.DEV == true
        ? process.env.POOL_ADDR_LOTA_TESTNET
        : process.env.POOL_ADDR_LOTA

const obj = new StdFee(700_000, { uusd: 150000 })
let api = {}

export default () => {
    const { state, dispatch } = useStore()

    const targetPrice = 1
    const [notification, setNotification] = useState({
        type: 'success',
        message: '',
        show: false,
    })
    const [altePool, setAltePool] = useState(0)
    const [ustPool, setUstPool] = useState(0)
    const [predictedPrice, setPredictedPrice] = useState(0)
    const [predictedTotalSupply, setPredictedTotalSupply] = useState(0)
    const [price, setPrice] = useState(0)
    const [stakingModal, setStakingModal] = useState(0)
    const [totalSupply, setTotalSupply] = useState(0)
    const [expiryTimestamp, setExpiryTimestamp] =
        useState(1) /** default timestamp need to be > 1 */
    const [amount, setAmount] = useState(0)
    const [isNativeToken, setIsNativeToken] = useState(false)
    //const [offerAskAmount, setOfferAskAmount] = useState(0)
    const [commissionOfferAmount, setCommissionOfferAmount] = useState(0)
    const [returnAmount, setReturnAmount] = useState(0)
    const [spreadAmount, setSpreadAmount] = useState(0)
    const [isLoaded, setLoaded] = useState(false)

    const formswap = useRef(null)

    const fetchContractQuery = useCallback(async () => {
        console.log(process.env.URL)

        const terra = new LCDClient({
            /*URL: "https://bombay-lcd.terra.dev",
        chainID: "bombay-0008",*/
            URL:
                process.env.DEV == true
                    ? process.env.URL_TESTNET
                    : process.env.URL_MAINNET,
            chainID:
                process.env.DEV == true
                    ? process.env.CHAIN_ID_TESTNET
                    : process.env.CHAIN_ID_MAINNET,
        })
        api = new WasmAPI(terra.apiRequester)

        try {
            const contractConfigInfo = await api.contractQuery(
                altered_address,
                {
                    extra_token_info: {},
                }
            )

            setExpiryTimestamp(parseInt(contractConfigInfo.rebase * 1000))
            setTotalSupply(contractConfigInfo.total_supply)

            const poolAlte = await api.contractQuery(alte_ust_pair, {
                pool: {},
            })

            setAltePool(poolAlte.assets[0].amount)
            setUstPool(poolAlte.assets[1].amount)
            dispatch({type: 'setPoolInfoALTE', message: poolAlte})

            let ust = new BigNumber(poolAlte.assets[1].amount)
            let alte = new BigNumber(poolAlte.assets[0].amount)

            let formatPrice = ust.dividedBy(alte)
            setPrice(formatPrice.toFixed())

            if (ust.isLessThan(alte)) {
                let totalSupplyBig = new BigNumber(
                    contractConfigInfo.total_supply
                )
                let percentageSupply = alte
                    .multipliedBy(100)
                    .dividedBy(totalSupplyBig)
                let rebasedSupply = ust.multipliedBy(
                    totalSupplyBig.dividedBy(alte)
                )
                let rebase = totalSupplyBig
                    .minus(rebasedSupply)
                    .dividedBy(
                        Date.now() / 1000 >
                            contractConfigInfo.rebase_damping_launch
                            ? 10
                            : 30
                    )
                let expectedRebaseSupply = totalSupplyBig.minus(rebase)
                let expectedPoolSupplyAlte = expectedRebaseSupply
                    .multipliedBy(percentageSupply)
                    .dividedBy(100)

                let predicted = ust
                    .dividedBy(1000000)
                    .dividedBy(expectedPoolSupplyAlte.dividedBy(1000000))
                    .toFixed()

                let priceAfter = formatPrice.toFixed()  > 0.95 && formatPrice.toFixed()  < 1.05 ? formatPrice.toFixed() : predicted
                let totalSupplyAfter = formatPrice.toFixed()  > 0.95 && formatPrice.toFixed()  < 1.05 ? totalSupplyBig.dividedBy(1000000).toFixed() : expectedRebaseSupply.dividedBy(1000000).toFixed()

                setPredictedPrice(
                    priceAfter
                )
                setPredictedTotalSupply(
                    totalSupplyAfter
                )
            } else {

                let totalSupplyBig = new BigNumber(
                    contractConfigInfo.total_supply
                )
                let percentageSupply = ust
                    .multipliedBy(100)
                    .dividedBy(totalSupplyBig)
                let rebasedSupply = ust.multipliedBy(
                    totalSupplyBig.dividedBy(alte)
                )
                console.log(rebasedSupply.toFixed())
                let rebase =  rebasedSupply.minus(totalSupplyBig).dividedBy(Date.now() / 1000 >
                contractConfigInfo.rebase_damping_launch
                    ? 10
                    : 30)
                console.log("rebase amount")
                console.log(rebase.toFixed())
                let expectedRebaseSupply = totalSupplyBig.plus(rebase)
                console.log("expectedRebaseSupply")
                console.log(expectedRebaseSupply.toString())
                let expectedPoolSupplyAlte = expectedRebaseSupply
                    .multipliedBy(percentageSupply)
                    .dividedBy(100)
                console.log("expectedPoolSupplyAlte")
                console.log(expectedPoolSupplyAlte.toString())

                let predicted = rebasedSupply.dividedBy(1000000).dividedBy(expectedRebaseSupply.dividedBy(1000000)).toFixed()

                let priceAfter = formatPrice.toFixed()  > 0.95 && formatPrice.toFixed()  < 1.05 ? formatPrice.toFixed() : predicted
                let totalSupplyAfter = formatPrice.toFixed()  > 0.95 && formatPrice.toFixed()  < 1.05 ? totalSupplyBig.dividedBy(1000000).toFixed() : expectedRebaseSupply.dividedBy(1000000).toFixed()

                setPredictedPrice(
                    priceAfter
                )
                setPredictedTotalSupply(
                    totalSupplyAfter
                )
            }
            console.log(ust.toString())
            console.log(alte.toString())



            // Get pool alte
            const poolLota = await api.contractQuery(state.lotaPoolAddress, {
                pool: {},
            })
            let pricePerAlte =
                poolAlte.assets[1].amount / poolAlte.assets[0].amount
            let pricePerLota =
                poolLota.assets[1].amount / poolLota.assets[0].amount
            const state_lp_staking = await api.contractQuery(
                state.alteStakingLPAddress,
                {
                    state: {},
                }
            )
            dispatch({ type: 'setStateLPStaking', message: state_lp_staking })
            let ratio = poolAlte.total_share / poolAlte.assets[0].amount
            const inAlte = state_lp_staking.total_balance / ratio
            console.log('inAlte')
            console.log(inAlte)
            let amountInAlte = (inAlte * pricePerAlte) / 1000000
            let amountInLota = amountInAlte / pricePerLota
            console.log(amountInLota)
            console.log((150000 / amountInLota) * 100)
            dispatch({ type: 'setTotalAlteStaked', message: inAlte / 1000000 })
            dispatch({ type: 'setAPY', message: (150000 / amountInLota) * 100 })
            dispatch({ type: 'setPricePerLota', message: pricePerLota })


            // Set loaded
            setLoaded(true)
        } catch (e) {
            console.log(e)
        }
    }, [])

    useEffect(() => {
        fetchContractQuery()
        checkAsset()
    }, [fetchContractQuery, amount, isNativeToken, totalSupply, notification])

    let connectedWallet = ''
    if (typeof document !== 'undefined') {
        connectedWallet = useConnectedWallet()
    }
    console.log(connectedWallet)

    function inputChange(e) {
        // e.preventDefault();
        let swapAmount = e.target.value
        setAmount(swapAmount)
        console.log(amount)
    }

    function switchValuta() {
        console.log(isNativeToken)
        setAmount(amount)
        setIsNativeToken(!isNativeToken)
    }

    function checkAsset() {
        if (!isNativeToken) {
            queryAskAsset()
        } else {
            queryOfferAsset()
        }
    }

    // Query this when you want to sell UST -> ALTE
    async function queryAskAsset() {
        setReturnAmount(0)
        setSpreadAmount(0)
        setCommissionOfferAmount(0)
        const contractSimulationInfo = await api.contractQuery(alte_ust_pair, {
            simulation: {
                offer_asset: {
                    amount: String((amount * 1000000).toFixed()),
                    info: {
                        native_token: {
                            denom: 'uusd',
                        },
                    },
                },
            },
        })
        setCommissionOfferAmount(
            contractSimulationInfo.commission_amount > 0
                ? new BigNumber(contractSimulationInfo.commission_amount)
                      .dividedBy(1000000)
                      .toString()
                : 0
        )
        setReturnAmount(
            contractSimulationInfo.return_amount > 0
                ? new BigNumber(contractSimulationInfo.return_amount)
                      .dividedBy(1000000)
                      .toString()
                : 0
        )
        setSpreadAmount(
            contractSimulationInfo.spread_amount > 0
                ? new BigNumber(contractSimulationInfo.spread_amount)
                      .dividedBy(1000000)
                      .toString()
                : 0
        )
        /*
        const contractSimulationReverseInfo = await api.contractQuery(
            alte_ust_pair,
            {
                "reverse_simulation": {
                    "ask_asset": {
                        "amount": String(amount),
                        "info": {
                            "native_token": {
                                "denom":"uusd"
                            }
                        }
                    }
                }
            });
        setOfferAskAmount(contractSimulationReverseInfo.offer_amount > 0 ? new BigNumber(contractSimulationReverseInfo.offer_amount).dividedBy(1000000).toString(): 0);
        setReturnAmount(contractSimulationReverseInfo.return_amount > 0 ? new BigNumber(contractSimulationReverseInfo.return_amount).dividedBy(1000000).toString(): 0);
        setSpreadAmount(contractSimulationReverseInfo.spread_amount > 0 ? new BigNumber(contractSimulationReverseInfo.spread_amount).dividedBy(1000000).toString(): 0);
        */
    }

    // Query this when you want to sell ALTE -> UST
    async function queryOfferAsset() {
        setReturnAmount(0)
        setSpreadAmount(0)
        setCommissionOfferAmount(0)
        const contractSimulationInfo = await api.contractQuery(alte_ust_pair, {
            simulation: {
                offer_asset: {
                    amount: String((amount * 1000000).toFixed()),
                    info: {
                        token: {
                            contract_addr: altered_address,
                        },
                    },
                },
            },
        })
        setCommissionOfferAmount(
            contractSimulationInfo.commission_amount > 0
                ? new BigNumber(contractSimulationInfo.commission_amount)
                      .dividedBy(1000000)
                      .toString()
                : 0
        )
        setReturnAmount(
            contractSimulationInfo.return_amount > 0
                ? new BigNumber(contractSimulationInfo.return_amount)
                      .dividedBy(1000000)
                      .toString()
                : 0
        )
        setSpreadAmount(
            contractSimulationInfo.spread_amount > 0
                ? new BigNumber(contractSimulationInfo.spread_amount)
                      .dividedBy(1000000)
                      .toString()
                : 0
        )
    }

    async function swap() {
        let msg = {}
        if (!connectedWallet) {
            alert('You first need to connect your wallet')
            return false
        }
        if (!isNativeToken) {
            // This message is for swapping UST to ALTE
            msg = new MsgExecuteContract(
                connectedWallet.walletAddress,
                alte_ust_pair,
                {
                    swap: {
                        offer_asset: {
                            info: {
                                native_token: {
                                    denom: 'uusd',
                                },
                            },
                            amount: String(Math.trunc(amount * 1000000)),
                        },
                    },
                },
                { uusd: String(Math.trunc(amount * 1000000)) }
            )
        } else {
            // This message is for swapping ALTE to UST
            msg = new MsgExecuteContract(
                connectedWallet.walletAddress,
                altered_address,
                {
                    send: {
                        contract: alte_ust_pair,
                        amount: String(Math.trunc(amount * 1000000)),
                        msg: 'eyJzd2FwIjp7fX0=',
                    },
                }
            )
        }
        try {
            let tx_play = await connectedWallet.post({
                msgs: [msg],
                gasPrices: obj.gasPrices(),
                gasAdjustment: 1.5,
            })

            // let tx = await terra.tx.broadcast(tx_play)
            // console.log(tx)
            console.log(tx_play)
            showNotification('Successful', 'success', 4000)
        } catch (e) {
            console.log(e)
            console.log(e.message)
            showNotification('Error', 'error', 4000)
        }
    }
    // rebase function
    async function rebase() {
        try {
            let rebaseMsg = new MsgExecuteContract(
                connectedWallet.walletAddress,
                altered_address,
                {
                    rebase: {},
                }
            )
            let txRebase = await connectedWallet.post({
                msgs: [rebaseMsg],
                gasPrices: obj.gasPrices(),
                gasAdjustment: 1.5,
            })
            console.log(txRebase)
        } catch (e) {
            console.log(e)
        }
    }

    function hideNotification() {
        setNotification({
            message: notification.message,
            type: notification.type,
            show: false,
        })
    }

    function showNotification(message, type, duration) {
        console.log('fired notification')
        setNotification({
            message: message,
            type: type,
            show: true,
        })
        console.log(notification)
        //Disable after $var seconds
        setTimeout(() => {
            setNotification({
                message: message,
                type: type,
                show: false,
            })
            console.log('disabled', notification)
        }, duration)
    }

    //Final swap function
    function doSwap() {
        // let token = 'ust';
        // if(isNativeToken){
        //     token = 'alte'
        // }

        // alert('simulate swap from '+amount+' '+token)
        swap()
        //Check if wallet is connected else > alert

        //Run swap function >> swap()

        //swap() > Return result
        //swap() success > Reset form values to zero
    }

    return (
        <div
            className="wrapper"
            style={{ display: 'flex', flexDirection: 'column' }}
        >
            <div className="row">
                <div className="col-12 text-center logo">
                    <h1>ALTERED</h1>
                    <p>Terras first elastic token</p>
                    <small>
                        Built by team{' '}
                        <a href="https://loterra.io/" target="_blank">
                            LoTerra
                        </a>
                    </small>
                    {/* <div classNaame="d-block">
                    <a href="/trading-competition" target="_blank" className="btn btn-secondary"
                    style={{                        
                        boxShadow: '0px 0px 13px #d0e027c4',
                        fontWeight:'bold'
                    }}
                    >
                        <span className="d-block"><Eye size={17} weight="bold"/> Trading Competition stats</span>
                        <span className="d-block" style={{fontSize:'12px', marginTop:'-7px', fontWeight:'200', fontFamily:'Oswald'}}>15000 LOTERRA TICKETS TO BE WON!</span>
                        </a>                    
                    </div>
                    <small className="d-block mb-3" style={{top:'8px', fontSize:'12px'}}>Competition Period: 2021-12-06 12:00 PM to 2021-12-24 12:00 PM (UTC)</small> */}
                </div>                
            </div>

            <div className="row">
                <div className="col-12 col-lg-12 mx-auto">
                    <div className="row">
                        <div className="col-lg-4 mb-4">
                            <div className="card special">
                                <div className="card-body">
                                    {process.env.DEV == true && (
                                        <span
                                            className="badge bg-primary"
                                            style={{
                                                color: '#000',
                                                fontSize: '18px',
                                                display: 'block',
                                                marginBottom: '15px',
                                            }}
                                        >
                                            <Warning
                                                size={21}
                                                style={{
                                                    position: 'relative',
                                                    top: '-2px',
                                                }}
                                            />{' '}
                                            Testnet mode
                                        </span>
                                    )}
                                    <h2>SWAP</h2>

                                    <SwapForm
                                        switchValuta={() => switchValuta()}
                                        doSwap={() => doSwap()}
                                        amount={amount}
                                        commissionOfferAmount={
                                            commissionOfferAmount
                                        }
                                        spreadAmount={spreadAmount}
                                        inputChange={(e) => inputChange(e)}
                                        returnAmount={returnAmount}
                                        isNativeToken={isNativeToken}
                                    />
                                    {/* DEV PURPOSES <div style={{color:'#fff', fontSize:'11px'}}>
                                    <p>amount: {amount}</p>
                                <p>commission: {commissionOfferAmount}</p>                                
                                <p>spread: {spreadAmount}</p>
                                <p>return: {returnAmount}</p>
                                </div> */}
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 mb-4">
                            <div className="card h-100">
                                <div className="card-body">
                                    <CurrentPrice
                                        price={price}
                                        total={totalSupply}
                                    />
                                    <Countdown
                                        expiryTimestamp={expiryTimestamp}
                                        predictedPrice={predictedPrice}
                                        predictedTotalSupply={
                                            predictedTotalSupply
                                        }
                                        doRebase={() => rebase()}
                                        loading={isLoaded}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 mb-4">
                            <StakingForm
                                showNotification={(message, type, dur) =>
                                    showNotification(message, type, dur)
                                }
                            />
                        </div>
                        {/* <div className="col-lg-4 mb-4">
                            <div className="card">
                                <div className="card-body">
                                    
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
            <Notification
                notification={notification}
                close={() => hideNotification()}
            />
        </div>
    )
}
