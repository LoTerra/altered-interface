import React, {useEffect, useState, useCallback} from "react";
import numeral from "numeral";
import { Users, Ticket} from "phosphor-react";

import {StdFee, MsgExecuteContract,LCDClient, WasmAPI, BankAPI} from "@terra-money/terra.js"
import BigNumber from "bignumber.js";
import Countdown from "../components/Countdown";
import CurrentPrice from "../components/CurrentPrice";
import SwapForm from "../components/SwapForm";
let useConnectedWallet = {}
if (typeof document !== 'undefined') {
    useConnectedWallet = require('@terra-money/wallet-provider').useConnectedWallet
}

const HomeCard={
    marginTop: '50px',
    width: '100px',
    padding: '30px',
}

const altered_address ="terra19xvyr7c7j8pnp5r96ymcxnv26a4rgfz0xjjcal";
const alte_ust_pair = "terra10a2w37pwwqvyd8z6eefvzl4d7hak0c7mkm2w6w";
const fees = new StdFee(1_000_000, { uusd: 200000 })
let api = {}
export default () => {
    const targetPrice = 1;
    const [altePool, setAltePool] = useState(0)
    const [ustPool, setUstPool] = useState(0)
    const [price, setPrice] = useState(0)
    const [totalSupply, setTotalSupply] = useState(0);
    const [expiryTimestamp, setExpiryTimestamp] = useState(
    1
    ); /** default timestamp need to be > 1 */

  const fetchContractQuery = useCallback(async () => {
    const terra = new LCDClient({
        URL: "https://bombay-lcd.terra.dev",
        chainID: "bombay-0008",
    });

    api = new WasmAPI(terra.apiRequester);
    try {
      const contractConfigInfo = await api.contractQuery(
          altered_address,
        {
          token_info: {},
        }
      );

      setExpiryTimestamp(parseInt(contractConfigInfo.rebase /  1_000_000_000));
      setTotalSupply(contractConfigInfo.total_supply)

      const contractPairInfo = await api.contractQuery(
          alte_ust_pair,
        {
          pool: {},
        }
      );
      setAltePool(contractPairInfo.assets[0].amount);
      setUstPool(contractPairInfo.assets[1].amount);

      let ust = new BigNumber(contractPairInfo.assets[1].amount).div(6);
      let alte = new BigNumber(contractPairInfo.assets[0].amount).div(6);
      let formatPrice = ust.dividedBy(alte).toFixed();
      setPrice(formatPrice);
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    fetchContractQuery();
  }, [fetchContractQuery]);

    const [amount, setAmount] = useState(0)
    const [isNativeToken, setIsNativeToken] = useState(false)
    const [offerAskAmount, setOfferAskAmount] = useState(0)
    const [commissionOfferAmount, setCommissionOfferAmount] = useState(0)
    const [returnAmount, setReturnAmount] = useState(0)
    const [spreadAmount, setSpreadAmount] = useState(0)

    let connectedWallet = ""
    if (typeof document !== 'undefined') {
        connectedWallet = useConnectedWallet()
    }

    async function swap(){
        let msg = {}
        if (isNativeToken){
            // This message is for swapping UST to ALTE
            msg = new MsgExecuteContract(mk.accAddress, alte_ust_pair,{
                    "swap": {
                        "offer_asset": {
                            "info" : {
                                "native_token": {
                                    "denom": "uusd"
                                }
                            },
                            "amount": amount
                        }
                    }
                }, {"uusd": amount})
        }else{
            // This message is for swapping ALTE to UST
            msg = new MsgExecuteContract(mk.accAddress, altered_address, {
                "send": {
                    "contract": alte_ust_pair,
                    "amount": amount,
                    "msg": "eyJzd2FwIjp7fX0="
                }
            })
        }
        try {
            let tx_play = await  connectedWallet.post({
                msgs: [msg],
                fee: fees
            })

            let tx = await terra.tx.broadcast(tx_play)
            console.log(tx)
        }catch (e) {
            console.log(e)
        }
    }
 


    function inputChange(e){
        e.preventDefault();
        let swapAmount = e.target.value
        setAmount(swapAmount)
        console.log(amount)
        queryOfferAsset()
    }

    // Query this when you want to sell UST -> ALTE
    async function queryAskAsset(){
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
        setOfferAskAmount(new BigNumber(contractSimulationReverseInfo.offer_amount).dividedBy(1000000).toString());
        setReturnAmount(new BigNumber(contractSimulationReverseInfo.return_amount).dividedBy(1000000).toString());
        setSpreadAmount(new BigNumber(contractSimulationReverseInfo.spread_amount).dividedBy(1000000).toString())
    }

    // Query this when you want to sell ALTE -> UST
    async function queryOfferAsset(){
        const contractSimulationInfo = await api.contractQuery(
            alte_ust_pair,
            {
                "simulation": {
                    "offer_asset": {
                        "amount": String(amount),
                        "info": {
                            "native_token": {
                                "denom":"uusd"
                            }
                        }
                    }
                }
            });
        setCommissionOfferAmount(new BigNumber(contractSimulationInfo.commission_amount).dividedBy(1000000).toString());
        setReturnAmount(new BigNumber(contractSimulationInfo.return_amount).dividedBy(1000000).toString());
        setSpreadAmount(new BigNumber(contractSimulationInfo.spread_amount).dividedBy(1000000).toString())
    }


     return (
         <>
             <div className="w-100 align-self-center">
             <div className="row">
                 <div className="col-12 text-center mb-4">
                    <h1>ALTERED</h1>
                 </div>
                 <div className="col-12 col-lg-8 mx-auto">
                     <div className="row">
                        <div className="col-lg-8 mb-4">
                            <div className="card">
                                <div className="card-body">
                                        <Countdown expiryTimestamp={expiryTimestamp}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 mb-4">
                            <div className="card">
                                <div className="card-body">
                                        <CurrentPrice price={price}/>
                                </div>
                            </div>
                        </div>
                     </div>
                 </div>                
             </div>
             <div className="row">
                <div className="col-lg-4 mb-4 mx-auto">
                    <div className="card">
                         <div className="card-body">
                                <SwapForm switchValuta={''} inputChange={inputChange} selectedValuta={''} />
                                <p>{offerAskAmount}</p>
                         </div>
                     </div>
                 </div>
             </div>
             </div>
         </>
     );
}