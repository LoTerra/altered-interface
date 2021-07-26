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

const altered_address ="terra1vw0rq89lcf43f6fgjjz6wvx7p55wj2382wc869";
const alte_ust_pair = "terra1lgzv5s3yr7jhpv449h7qjtd2fth8pl42lm0jcn";
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
    const [amount, setAmount] = useState(0)
    const [isNativeToken, setIsNativeToken] = useState(false)
    //const [offerAskAmount, setOfferAskAmount] = useState(0)
    const [commissionOfferAmount, setCommissionOfferAmount] = useState(0)
    const [returnAmount, setReturnAmount] = useState(0)
    const [spreadAmount, setSpreadAmount] = useState(0)


    const fetchContractQuery = useCallback(async () => {
    const terra = new LCDClient({
        /*URL: "https://bombay-lcd.terra.dev",
        chainID: "bombay-0008",*/
        URL: "https://tequila-lcd.terra.dev",
        chainID: "tequila-0004",
    });

    api = new WasmAPI(terra.apiRequester);
    try {
      const contractConfigInfo = await api.contractQuery(
          altered_address,
        {
          extra_token_info: {},
        }
      );

      setExpiryTimestamp(parseInt(contractConfigInfo.rebase * 1000));
      setTotalSupply(contractConfigInfo.total_supply)

      const contractPairInfo = await api.contractQuery(
          alte_ust_pair,
        {
          pool: {},
        }
      );
      setAltePool(contractPairInfo.assets[0].amount);
      setUstPool(contractPairInfo.assets[1].amount);

      let ust = new BigNumber(contractPairInfo.assets[1].amount);
      let alte = new BigNumber(contractPairInfo.assets[0].amount);
        console.log(ust.toString())
        console.log(alte.toString())

      let formatPrice = ust.dividedBy(alte);
      setPrice(formatPrice.toFixed());
    } catch (e) {
      console.log(e);
    }
    }, []);

    useEffect(() => {
        fetchContractQuery();
        checkAsset()
    },[fetchContractQuery, amount, isNativeToken]);


    /*let connectedWallet = ""
    if (typeof document !== 'undefined') {
        connectedWallet = useConnectedWallet()
    } */

    function inputChange(e){
        // e.preventDefault();
        let swapAmount = e.target.value
        setAmount(swapAmount)
        console.log(amount)
    }

    function switchValuta(){
        console.log(isNativeToken)
        setAmount(amount)
        setIsNativeToken(!isNativeToken)
    }

    function checkAsset(){
        if(!isNativeToken){
            queryAskAsset()
        } else {
            queryOfferAsset()
        }
    }

    // Query this when you want to sell UST -> ALTE
    async function queryAskAsset(){
        setReturnAmount(0)
        setSpreadAmount(0)
        setCommissionOfferAmount(0)
        const contractSimulationInfo = await api.contractQuery(
            alte_ust_pair,
            {
                "simulation": {
                    "offer_asset": {
                        "amount": String(amount * 1000000),
                        "info": {
                            "native_token": {
                                "denom":"uusd"
                            }
                        }
                    }
                }
            });
        setCommissionOfferAmount(contractSimulationInfo.commission_amount > 0 ? new BigNumber(contractSimulationInfo.commission_amount).dividedBy(1000000).toString(): 0);
        setReturnAmount(contractSimulationInfo.return_amount > 0 ? new BigNumber(contractSimulationInfo.return_amount).dividedBy(1000000).toString() : 0);
        setSpreadAmount(contractSimulationInfo.spread_amount > 0 ? new BigNumber(contractSimulationInfo.spread_amount).dividedBy(1000000).toString(): 0)
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
    async function queryOfferAsset(){
        setReturnAmount(0)
        setSpreadAmount(0)
        setCommissionOfferAmount(0)
        const contractSimulationInfo = await api.contractQuery(
            alte_ust_pair,
            {
                "simulation": {
                    "offer_asset": {
                        "amount": String(amount * 1000000),
                        "info": {
                            "token": {
                                "contract_addr": altered_address
                            }
                        }
                    }
                }
            });
        setCommissionOfferAmount(contractSimulationInfo.commission_amount > 0 ? new BigNumber(contractSimulationInfo.commission_amount).dividedBy(1000000).toString(): 0);
        setReturnAmount(contractSimulationInfo.return_amount > 0 ? new BigNumber(contractSimulationInfo.return_amount).dividedBy(1000000).toString() : 0);
        setSpreadAmount(contractSimulationInfo.spread_amount > 0 ? new BigNumber(contractSimulationInfo.spread_amount).dividedBy(1000000).toString(): 0)
    }


    async function swap(){
        let msg = {}
        if(!connectedWallet){
            alert('You first need to connect your wallet');
            return false;
        }
        console.log(connectedWallet.accAddress)
        if (!isNativeToken){
            // This message is for swapping UST to ALTE
            msg = new MsgExecuteContract(connectedWallet.accAddress, alte_ust_pair,{
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
            msg = new MsgExecuteContract(connectedWallet.accAddress, altered_address, {
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

    //Final swap function
    function doSwap(){

        // let token = 'ust';
        // if(isNativeToken){
        //     token = 'alte'
        // }

        // alert('simulate swap from '+amount+' '+token)
        swap();
        //Check if wallet is connected else > alert

        //Run swap function >> swap()
        

        //swap() > Return result
        //swap() success > Reset form values to zero
    }


     return (
         <>
           
             <div className="row">
                 <div className="col-12 text-center mb-md-4">
                    <h1>ALTERED</h1>
                 </div>
                 <div className="col-12 col-lg-8 mx-auto">
                     <div className="row">
                        <div className="col-lg-6 mb-4">
                            <div className="card">
                                <div className="card-body">
                                        <Countdown expiryTimestamp={expiryTimestamp}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 mb-4">
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
                    <div className="card special">
                         <div className="card-body">
                                <h2>Make your move</h2>
                                <SwapForm switchValuta={() => switchValuta()} doSwap={() => doSwap()} amount={amount} current={commissionOfferAmount, spreadAmount} inputChange={(e) => inputChange(e)} returnAmount={returnAmount} isNativeToken={isNativeToken} />
                                {/* DEV PURPOSES <div style={{color:'#fff', fontSize:'11px'}}>
                                    <p>amount: {amount}</p>
                                <p>commission: {commissionOfferAmount}</p>                                
                                <p>spread: {spreadAmount}</p>
                                <p>return: {returnAmount}</p>
                                </div> */}
                          
                         </div>
                     </div>
                 </div>
             </div>
         </>
     );
}