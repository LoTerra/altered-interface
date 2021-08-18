import { Swap, CaretRight } from 'phosphor-react'
import React, { useCallback, useState, useMemo, useEffect } from 'react'
import debounce from 'lodash.debounce'
import { LCDClient, WasmAPI } from '@terra-money/terra.js'

const altered_address = process.env.DEV == true ? process.env.ALTERED_ADDR_TESTNET : process.env.ALTERED_ADDR

import {
    useWallet,
    WalletStatus,
    useConnectedWallet,
    ConnectType,
} from '@terra-money/wallet-provider'
import numeral from 'numeral'


export default function SwapForm(props) {
    let connectedWallet = ''
    const {
        switchValuta,
        isNativeToken,
        inputChange,
        returnAmount,
        commissionOfferAmount,
        spreadAmount,
        doSwap,
        amount,
    } = props

    const [bank, setBank] = useState()
    const [bankAlte, setBankAlte] = useState(0)
    const [bankUst, setBankUst] = useState(0)
    const [connected, setConnected] = useState(false)
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
        const lcd = new LCDClient({
            URL: connectedWallet.network.lcd,
            chainID: connectedWallet.network.chainID,
        })
        api = new WasmAPI(lcd.apiRequester)
        return lcd
    }, [connectedWallet])

    const handleChange = (event) => {
        event.persist()
        const debouncedSave = debounce(() => inputChange(event), 1000)
        debouncedSave()
        // highlight-ends
    }

    async function contactBalance() {
        if (connectedWallet && connectedWallet.walletAddress && lcd) {
            //   setShowConnectOptions(false);

            let coins
            let token
            try {
                coins = await lcd.bank.balance(connectedWallet.walletAddress)
                token = await api.contractQuery(altered_address, {
                    balance: {
                        address: connectedWallet.walletAddress,
                    },
                })

                console.log(coins)

            } catch (e) {
                console.log(e)
            }

            let uusd = coins.filter((c) => {
                return c.denom === 'uusd'
            })
            let ust = parseInt(uusd) / 1000000
            setBankUst(ust)

            let alte = parseInt(token.balance) / 1000000
            setBankAlte(alte)
            // connectTo("extension")
            setConnected(true)
        } else {
            setBank(null)
        }
    }


    const setAmount = (amount) => {
        if (!amount) return
        let input = document.querySelector('.amount');     
        const lastValue = input.value;
        input.value = amount;

        const event = new Event("input", { bubbles: true });
        const tracker = input._valueTracker;
        if (tracker) {
            tracker.setValue(lastValue);
        }
            input.dispatchEvent(event);        
    }

    useEffect(() => {
        contactBalance()
    }, [connectedWallet, lcd])


    const cleanInput = () => {
        setAmount(0)
    }

    return (
        <div className="swap-form">
            <div className="row">
                {/* <div className="col-12 text-center mb-5">
                    <h3>Swap</h3>
                </div> */}
                <div className="col-12 mb-3">
                    <span className="label">FROM</span>
                    <span className="valuta">
                        {isNativeToken ? 'ALTE' : 'UST'}
                    </span>

                    {
                        (
                            <span className="balance" onClick={() => setAmount((isNativeToken ? bankAlte : bankUst),(isNativeToken ? 'ALTE' : 'UST'))}>{isNativeToken ? 'MAX:'+numeral(bankAlte).format('0,0.00')+'ALTE' : 'MAX:'+numeral(bankUst).format('0,0.00')+'UST'}</span>

                        )
                    }
                    <input                          
                        type="number"
                        className="form-control amount"
                        onChange={handleChange}     
                        step="any"               
                        placeholder="0"
                    />
                </div>
                <div className="swapper-info">
                    <p>
                        Inputs are interchangeable you can swap UST for ALTE or
                        ALTE for UST
                    </p>
                    <CaretRight size={28} color={'#5F5F5F'} />
                </div>
                <button className="swapper" onClick={() => {switchValuta(); cleanInput();}}>
                    <Swap size={36} color={'#DCEF14'} />
                </button>
                <div className="col-12 mb-3">
                    <span className="label">TO</span>
                    <span className="valuta">
                        {isNativeToken ? 'UST' : 'ALTE'}
                    </span>
                    
                    <input
                        readOnly
                        type="number"
                        className="form-control"
                        value={returnAmount > 0 ? returnAmount : ''}
                        placeholder="0"
                    />
                </div>
                <div className="swap-final-info">
                   
                        <small>
                            Commission:  {commissionOfferAmount > 0 && (<>{commissionOfferAmount} UST</>)} 
                        </small>
                    
                   
                        <small>Spread:  {spreadAmount > 0 && (<>{spreadAmount} UST</>)}</small>
                   
                </div>
                <div className="col-12 mb-3">
                    <button
                        className={
                            amount > 0
                                ? 'btn btn-special w-100 grow'
                                : 'btn btn-special w-100'
                        }
                        disabled={amount <= 0}
                        onClick={doSwap}
                    >
                        Swap
                    </button>
                </div>
            </div>
        </div>
    )
}
