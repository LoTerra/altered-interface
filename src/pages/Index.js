import React, {useEffect, useState, useCallback} from "react";
import numeral from "numeral";
import { Users, Ticket} from "phosphor-react";

import {StdFee, MsgExecuteContract,LCDClient, WasmAPI, BankAPI} from "@terra-money/terra.js"
import BigNumber from "bignumber.js";
import Countdown from "../components/Countdown";
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
    })
    const api = new WasmAPI(terra.apiRequester);
    try {
      const contractConfigInfo = await api.contractQuery(
          altered_address,
        {
          token_info: {},
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

      let ust = new BigNumber(contractPairInfo.assets[1].amount).div(6);
      let alte = new BigNumber(contractPairInfo.assets[0].amount).div(6);
      let formatPrice = ust.dividedBy(alte).toFixed()
        setPrice(formatPrice);

    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    fetchContractQuery();
  }, [fetchContractQuery]);

    const [combo, setCombo] = useState("")
    const [result, setResult] = useState("")
    const [amount, setAmount] = useState(0)
    let connectedWallet = ""
    if (typeof document !== 'undefined') {
        connectedWallet = useConnectedWallet()
    }

    async function swap(isNative, amount){
        let msg = {}
        if (isNative){
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
            msg = new MsgExecuteContract(mk.accAddress, alte_ust_pair, {
                    "swap": {
                        "offer_asset": {
                            "info" : {
                                "token": {
                                    "contract_addr": altered_address
                                }
                            },
                            "amount": amount
                        },
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
        let ticketAmount = e.target.value
        if (ticketAmount > 200) ticketAmount = 200
        multiplier(ticketAmount)
        setAmount(ticketAmount)
    }




     return (
         <div>
             {/* <div style={{display: "flex", flexDirection:"column", alignItems:"center"}}>
                 <div className="text-4xl font-bold">LoTerra</div>
                 
                 <div className="grid grid-cols-2 gap-4 my-4 stats">
                 <p className="col-span-2 text-center uppercase mt-2 mb-0">Current jackpot</p>
                 <h2 className="col-span-2">{numeral().format("0,0.00")}<span>UST</span></h2>
                 <h3><Users size={48} color="#f2145d" />{}</h3>
                 <h3><Ticket size={48} color="#f2145d" />{}</h3>
                 </div>
                 <Countdown expiryTimestamp={expiryTimestamp}/>
              <div className="buy-tickets">
              <div className="grid grid-cols-3 gap-4">
                     <div className="col-span-3">
                        <p className="font-bold m-0 text-2xl">Tickets on sale now!</p>
                     </div>
                 </div>
                 <div className="amount-block">
                  <label>Amount of  tickets</label>
                  <Ticket size={24} color="#f2145d" />
                  <input type="number" className="amount" value={amount} min="1" max="200" step="1" onChange={(e) => inputChange(e)} />
                  <p className="mb-4 text-sm">Total: {numeral((amount * price) / 1000000).format("0,0.00")} UST</p>
                 </div>
                 
             
                 <div className="text-sm">{result}</div>
                 <button onClick={()=> execute()} className="button-pink mt-5" disabled={amount <= 0}>Buy {amount} tickets</button>
      
              </div>

              <div className="mt-4">contract-v2.0.1</div>
                 <div className="text-sm">terra14mevcmeqt0n4myggt7c56l5fl0xw2hwa2mhlg0</div>
             </div>*/}
         </div>
     );
}