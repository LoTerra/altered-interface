
import React, { useState, useEffect, useMemo, useCallback } from 'react'

import { LCDClient, WasmAPI } from '@terra-money/terra.js'
import {
    useWallet,
    WalletStatus,
    useConnectedWallet,
    ConnectType,
} from '@terra-money/wallet-provider'

import { Wallet, CaretRight, ArrowSquareOut,Power } from 'phosphor-react'
import numeral from 'numeral'
import {useStore} from "../store";


const altered_address = process.env.DEV == true ? process.env.ALTERED_ADDR_TESTNET : process.env.ALTERED_ADDR

// let useWallet = {}
// if (typeof document !== 'undefined') {
//     useWallet = require('@terra-money/wallet-provider').useWallet
// }
/*const Modal = {
    position: "absolute",
    width: "100%",
    height:"100%",
    left: "0",
    top: "0",
}
const Dialog = {
    position: "absolute",
    right: "100px",
    top: "120px",
    width: "300px",
    display: "flex",
    justifyContent: "center",
    flexDirection:"column",

} */
const DialogButton = {
    margin: '10px 20px 10px 20px',
}
export default function ConnectWallet() {
    let connectedWallet = ''
    const [isDisplayDialog, setIsDisplayDialog] = useState(false)
    const [bank, setBank] = useState()
    const [totalSupply, setTotalSupply] = useState(0)
    const [yourPercentage, setYourPercentage] = useState(0)
    const [bankAlte, setBankAlte] = useState()
    const [connected, setConnected] = useState(false)

    const {state, dispatch} = useStore();    

    let wallet = ''
    if (typeof document !== 'undefined') {
        wallet = useWallet()
        connectedWallet = useConnectedWallet()
    }
    let api
    const lcd = useMemo(() => {
        if (!connectedWallet) {
            return null
        }
        return new LCDClient({
            URL: connectedWallet.network.lcd,
            chainID: connectedWallet.network.chainID,
          });
    }, [connectedWallet])

    //const installChrome = useInstallChromeExtension();
    //const connectedWallet = ConnectedWallet ? useConnectedWallet() : undefined;

    function display() {
        // active or disable dialog
        setIsDisplayDialog(!isDisplayDialog)
    }
    function closeModal() {
        setIsDisplayDialog(false)
    }
    function connectTo(to) {
        if (to == 'extension') {
            wallet.connect(wallet.availableConnectTypes[1])
        } else if (to == 'mobile') {
            wallet.connect(wallet.availableConnectTypes[2])
        } else if (to == 'disconnect') {
            dispatch({type: "setWallet", message: {}})  
            wallet.disconnect()
        }
        setConnected(!connected)
        setIsDisplayDialog(false)
    }
    async function contactBalance() {
        if (connectedWallet && connectedWallet.walletAddress && lcd) {
            //   setShowConnectOptions(false);
            dispatch({type: "setWallet", message: connectedWallet})    

            let coins
            let token
            let contractConfigInfo

            try {
                const api = new WasmAPI(lcd.apiRequester);
                coins = await lcd.bank.balance(connectedWallet.walletAddress)

                token = await api.contractQuery(altered_address, {
                    balance: {
                        address: connectedWallet.walletAddress,
                    },
                })

                contractConfigInfo = await api.contractQuery(
                    altered_address,
                    {
                        extra_token_info: {},
                    }
                )

                console.log(token)

            } catch (e) {
                console.log(e)
            }

            let uusd = coins.filter((c) => {
                return c.denom === 'uusd'
            })
            let ust = parseInt(uusd) / 1000000

            setBank(ust)
            let alte = parseInt(token.balance) / 1000000
            setBankAlte(alte)
            dispatch({type: "setBankAlte", message: alte})

            setTotalSupply(contractConfigInfo.total_supply)
            let share = token.balance * 100 / contractConfigInfo.total_supply
            setYourPercentage(share)

            const tokenLP = await api.contractQuery(
                state.alteLPAddress,
                {
                    balance: { address: connectedWallet.walletAddress},
                })
            dispatch({type: "setLPBalance", message: tokenLP})
            
            console.log(tokenLP)
            const LPHolderAccruedRewards = await api.contractQuery(
                state.alteStakingLPAddress,
                {
                    accrued_rewards: { address: connectedWallet.walletAddress },
                }
            );
            dispatch({type: "setLPHolderAccruedRewards", message: LPHolderAccruedRewards.rewards})

            const holderLP = await api.contractQuery(
                state.alteStakingLPAddress,
                {
                    holder: { address: connectedWallet.walletAddress },
                }
            );
            dispatch({type: "setAllHolderLP", message: holderLP})

            const claimsLP = await api.contractQuery(
                state.alteStakingLPAddress,
                {
                    claims: { address: connectedWallet.walletAddress },
                }
            );

            dispatch({type: "setHolderClaimsLP", message: claimsLP.claims})

            // connectTo("extension")
            setConnected(true)
        } else {
            setBank(null)
        }
    }

    useEffect(() => {
        if(connectedWallet){
            contactBalance()  
        }   
    }, [connectedWallet, lcd])

    function renderDialog() {
        if (isDisplayDialog) {
            return (
                <div /*style={Modal}*/ onClick={() => closeModal()}>
                    <div /*style={Dialog}*/ className="card-glass">
                        <button
                            onClick={() => connectTo('extension')}
                            className="btn"
                            style={DialogButton}
                        >
                            Terra Station (extension)
                        </button>
                        <button
                            onClick={() => connectTo('mobile')}
                            className="btn"
                            style={DialogButton}
                        >
                            Terra Station (mobile)
                        </button>
                    </div>
                </div>
            )
        }
    }

    function returnBank() {
        return (
            <>
                <Wallet
                    size={21}
                    style={{ display: 'inline-block', marginTop: '-3px' }}
                />{' '}
                {bankAlte == null ? "0.00" : numeral(bankAlte).format('0,0.00')} <span className="text-sm">ALTE</span>

            </>
        )
    }

    return (
        <div className="navbar navbar-expand p-2 p-md-3">
            <div className="container-fluid">
                <div className="navbar-nav ms-auto">
                    {!connectedWallet && (
                        <>                           
                            <div className="btn-group">
                                <button
                                    className="btn btn-outline-primary nav-item dropdown-toggle"
                                    type="button"
                                    id="dropdownMenuButton1"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    <Wallet
                                        size={18}
                                        style={{
                                            marginTop: '-4px',
                                            marginRight: '4px',
                                        }}
                                    />
                                    Connect
                                </button>
                                <ul
                                    className="dropdown-menu dropdown-menu-end"
                                    aria-labelledby="dropdownMenuButton1"
                                >
                                    <button
                                        onClick={() => connectTo('extension')}
                                        className="dropdown-item"
                                    >
                                        <CaretRight
                                            size={16}
                                            style={{ marginTop: '-4px' }}
                                        />{' '}
                                        Terra Station (extension/mobile)
                                    </button>
                                    <button
                                        onClick={() => connectTo('mobile')}
                                        className="dropdown-item"
                                    >
                                        <CaretRight
                                            size={16}
                                            style={{ marginTop: '-4px' }}
                                        />{' '}
                                        Terra Station (mobile for desktop)
                                    </button>
                                </ul>
                            </div>
                        </>
                    )}
                    {connectedWallet && (
                        <>
                        <div className="nav-item user-info">
                            <p className="top">Your stats</p>
                            <p className="bottom">{numeral(yourPercentage).format('0.000000')}% of total supply </p>
                        </div>
                        <button                            
                            className="btn btn-outline-primary nav-item dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            {connectedWallet ? returnBank() : ''}
                        </button>
                        <ul
                        className="dropdown-menu dropdown-menu-end"
                        aria-labelledby="dropdownMenuButton2"
                        >
                            <button
                                        onClick={() => connectTo('disconnect')}
                                        className="dropdown-item"
                                    >
                                        <Power
                                            size={16}
                                            style={{ marginTop: '-4px' }}
                                        />{' '}
                                        Disconnect
                                    </button>
                        </ul>
                        </>
                    )}
                </div>
            </div>

            {/*<button onClick={() => display()}>Connect Wallet</button>
            {renderDialog()}*/}
        </div>
    )
}
