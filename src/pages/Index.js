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
import { Swap, Warning,ArrowSquareOut,ChartLine } from 'phosphor-react'


let useConnectedWallet = {}
if (typeof document !== 'undefined') {
    useConnectedWallet =
        require('@terra-money/wallet-provider').useConnectedWallet
}

const altered_address = process.env.DEV == true ? process.env.ALTERED_ADDR_TESTNET : process.env.ALTERED_ADDR
const alte_ust_pair = process.env.DEV == true ? process.env.POOL_ADDR_TESTNET : process.env.POOL_ADDR

const fees = process.env.DEV == true ? new StdFee(400_000, { uusd: 60000 + 2000000 }) :new StdFee(600_000, { uusd: 90000 + 1610379 })
let api = {}

export default () => {
    const targetPrice = 1
    const [notification,setNotification] = useState({type:'success',message:'',show:false})
    const [altePool, setAltePool] = useState(0)
    const [ustPool, setUstPool] = useState(0)
    const [predictedPrice, setPredictedPrice] = useState(0)
    const [predictedTotalSupply, setPredictedTotalSupply] = useState(0)
    const [price, setPrice] = useState(0)
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
            URL: process.env.DEV == true ? process.env.URL_TESTNET : process.env.URL_MAINNET ,
            chainID: process.env.DEV == true ? process.env.CHAIN_ID_TESTNET : process.env.CHAIN_ID_MAINNET,
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

            const contractPairInfo = await api.contractQuery(alte_ust_pair, {
                pool: {},
            })

            setAltePool(contractPairInfo.assets[0].amount)
            setUstPool(contractPairInfo.assets[1].amount)



            let ust = new BigNumber(contractPairInfo.assets[1].amount)
            let alte = new BigNumber(contractPairInfo.assets[0].amount)

            if (ust.isLessThan(alte)){
                let totalSupplyBig = new BigNumber(contractConfigInfo.total_supply)
                let percentageSupply = alte.multipliedBy(100).dividedBy(totalSupplyBig);
                let rebasedSupply = ust.multipliedBy(totalSupplyBig.dividedBy(alte));
                let rebase = totalSupplyBig.minus(rebasedSupply).dividedBy(Date.now() / 1000 > contractConfigInfo.rebase_damping_launch ? 10 : 30);
                let expectedRebaseSupply = totalSupplyBig.minus(rebase)
                let expectedPoolSupplyAlte = expectedRebaseSupply.multipliedBy(percentageSupply).dividedBy(100)
                setPredictedPrice(ust.dividedBy(1000000).dividedBy(expectedPoolSupplyAlte.dividedBy(1000000)).toFixed())
                setPredictedTotalSupply(expectedRebaseSupply.dividedBy(1000000).toFixed())
            }else {
                let totalSupplyBig = new BigNumber(contractConfigInfo.total_supply)
                let percentageSupply = alte.multipliedBy(100).dividedBy(totalSupplyBig);
                let rebasedSupply = alte.multipliedBy(totalSupplyBig.dividedBy(ust));
                let rebase = totalSupplyBig.minus(rebasedSupply).dividedBy(10);
                let expectedRebaseSupply = totalSupplyBig.minus(rebase)
                let expectedPoolSupplyAlte = expectedRebaseSupply.multipliedBy(percentageSupply).dividedBy(100)
                setPredictedPrice(ust.dividedBy(1000000).dividedBy(expectedPoolSupplyAlte.dividedBy(1000000)).toFixed())
                setPredictedTotalSupply(expectedRebaseSupply.dividedBy(1000000).toFixed())
            }
            console.log(ust.toString())
            console.log(alte.toString())

            let formatPrice = ust.dividedBy(alte)
            setPrice(formatPrice.toFixed())
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
        let swapAmount = parseInt(e.target.value)
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
                    amount: String(amount * 1000000),
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
                    amount: String(amount * 1000000),
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
                            amount: String(amount * 1000000),
                        },
                    },
                },
                { uusd: String(amount * 1000000) }
            )
        } else {
            // This message is for swapping ALTE to UST
            msg = new MsgExecuteContract(
                connectedWallet.walletAddress,
                altered_address,
                {
                    send: {
                        contract: alte_ust_pair,
                        amount: String(amount * 1000000),
                        msg: 'eyJzd2FwIjp7fX0=',
                    },
                }
            )
        }
        try {
            let tx_play = await connectedWallet.post({
                msgs: [msg],
                fee: fees,
            })

            // let tx = await terra.tx.broadcast(tx_play)
            // console.log(tx)
            console.log(tx_play)
            showNotification('Successful','success',4000)
        } catch (e) {
            console.log(e)
            showNotification('Error','error',4000)
        }
    }
    // rebase function
    async function rebase(){
        try {
            let rebaseMsg = new MsgExecuteContract(connectedWallet.walletAddress, altered_address, {
                rebase: {}
            })
            let txRebase = await connectedWallet.post({
                msgs: [rebaseMsg],
                fee: fees
            })
            console.log(txRebase)
        }catch (e) {
            console.log(e)
        }
    }

    function hideNotification(){
        setNotification({
            message:notification.message,
            type: notification.type,
            show: false
        })
    }

    function showNotification(message,type,duration){
        console.log('fired notification')
        setNotification({
            message:message,
            type: type,
            show: true
        })
        console.log(notification)
        //Disable after $var seconds
        setTimeout(() => {           
            setNotification({ 
                message:message,
                type: type,              
                show: false
            })        
            console.log('disabled',notification)
        },duration)
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
        <div className="wrapper" style={{display:'flex',flexDirection:'column'}}>
        <div className="row">
            <div className="col-12 text-center logo">
                <h1>ALTERED</h1>
            </div>  
           
                <div className="col-md-6 text-center text-md-end mb-4">
            <a
                                href="https://docs.alteredprotocol.com"
                                target="_blank"
                                className="btn btn-outline-secondary nav-item mx-3 learn-altered"
                            >
                                <ArrowSquareOut
                                    size={18}
                                    style={{
                                        marginTop: '-4px',
                                        marginRight: '4px',
                                    }}
                                />{' '}
                                Learn more about <strong>Altered</strong>
                            </a>
            </div>
            <div className="col-md-6 text-center text-md-start mb-4">
        <a
                                href="https://coinhall.org/charts/terra/terra18adm0emn6j3pnc90ldechhun62y898xrdmfgfz"
                                target="_blank"
                                className="btn btn-outline-secondary nav-item mx-3 learn-altered"
                            >
                                <ChartLine
                                    size={18}
                                    style={{
                                        marginTop: '-4px',
                                        marginRight: '4px',
                                    }}
                                />{' '}
                                View chart on <strong>Coinhall</strong>
                            </a>
        </div>

        </div>
        
            <div className="row">                           
                <div className="col-12 col-lg-12 mx-auto">
                    <div className="row">
                        <div className="col-lg-4 mb-4 order-2 order-lg-1">
                            <div className="card">
                                <div className="card-body">
                                    <Countdown
                                        expiryTimestamp={expiryTimestamp}
                                        predictedPrice={predictedPrice}
                                        predictedTotalSupply={predictedTotalSupply}
                                        doRebase={() => rebase()}
                                        loading={isLoaded}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 mb-4 order-1 order-lg-2">
                    <div className="card special">
                        <div className="card-body">
                        {process.env.DEV == true &&
                    <span className="badge bg-primary" style={{color:'#000', fontSize:'18px', display:'block',marginBottom:'15px'}}><Warning size={21} style={{position:'relative',top:'-2px'}}/> Testnet mode</span>
                }
                            <h2>SWAP</h2>
                            {/* <p className="slogan">Easily swap UST to ALTE</p> */}
                            <SwapForm                                
                                switchValuta={() => switchValuta()}
                                doSwap={() => doSwap()}
                                amount={amount}
                                commissionOfferAmount={commissionOfferAmount}
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
                        <div className="col-lg-4 order-3 mb-4">
                            <div className="card h-100">
                                <div className="card-body">
                                    <CurrentPrice
                                        price={price}
                                        total={totalSupply}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <Notification notification={notification} close={() => hideNotification()}/>
        </div>
    )
}
