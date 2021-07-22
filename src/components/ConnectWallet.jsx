import React, {useState, useEffect, useMemo} from "react";

import { LCDClient } from "@terra-money/terra.js";
import {
  useWallet,
  WalletStatus,
  useConnectedWallet,
  ConnectType,
} from "@terra-money/wallet-provider";

import { Wallet} from "phosphor-react";
import numeral from "numeral"

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
    margin: "10px 20px 10px 20px"
}
export default function ConnectWallet(){
    let connectedWallet = "";
    const [isDisplayDialog, setIsDisplayDialog] = useState(false);
    const [bank, setBank] = useState();
    const [connected, setConnected]= useState(false);
    let wallet = ""
    if (typeof document !== 'undefined') {
        wallet = useWallet();
        connectedWallet = useConnectedWallet()
    }
    const lcd = useMemo(() => {

        if (!connectedWallet) {
          return null;
        }
    
        return new LCDClient({
          URL: connectedWallet.network.lcd,
          chainID: connectedWallet.network.chainID,
        });
      }, [connectedWallet]);
    





    //const installChrome = useInstallChromeExtension();
    //const connectedWallet = ConnectedWallet ? useConnectedWallet() : undefined;


    function display(){
        // active or disable dialog
        setIsDisplayDialog(!isDisplayDialog)
    }
    function closeModal() {
        setIsDisplayDialog(false)
    }
    function connectTo(to) {
        if (to == "extension") {
            wallet.connect(wallet.availableConnectTypes[1])
        }
        else if (to == "mobile") {
            wallet.connect(wallet.availableConnectTypes[2])
        }else if (to == "disconnect"){
            wallet.disconnect()
        }
        setConnected(!connected)
        setIsDisplayDialog(false)
    }
    async function contactBalance(){

            if (connectedWallet && connectedWallet.walletAddress && lcd) {
                //   setShowConnectOptions(false);
                let coins
                try {
                    coins = await lcd.bank.balance(connectedWallet.walletAddress);

                }catch (e) {
                    console.log(e)
                }

                let uusd = coins.filter((c) => {
                    return c.denom === "uusd";
                });
                let ust = parseInt(uusd) / 1000000;
                setBank(numeral(ust).format("0,0.00"));
                // connectTo("extension")
                setConnected(true)
            } else {
                setBank(null);
            }
    }

    useEffect(() => {
        contactBalance()
    }, [connectedWallet, lcd]);

    function renderDialog(){
        if (isDisplayDialog){
            return(
                <div /*style={Modal}*/ onClick={() => closeModal()}>
                    <div /*style={Dialog}*/ className="card-glass">
                        <button onClick={() => connectTo("extension")} className="button-pink-outline" style={DialogButton}>Terra Station (extension)</button>
                        <button onClick={() => connectTo("mobile")} className="button-pink-outline" style={DialogButton}>Terra Station (mobile)</button>
                    </div>
                </div>
            )
        }
    }
    
    function returnBank(){
        return(
            <>
            <Wallet size={21} color="#f2145d" style={{display:'inline-block', marginTop:'-3px'}} /> {bank} <span className="text-sm">UST</span>
            </>
        )
    }

    return(
        <div>
            <div style={{display:"flex"}}>

                { !connected &&
                <>
                <button onClick={() => connectTo("extension")} className="button-pink-outline" style={DialogButton}>Terra Station (extension/mobile)</button>
                <button onClick={() => connectTo("mobile")} className="button-pink-outline" style={DialogButton}>Terra Station (mobile for desktop)</button>
                </>
                }
                 { connected &&
                <button onClick={() => connectTo("disconnect")} className="button-pink-outline" style={DialogButton}>{connected ? returnBank() : '' }</button>
            }
            </div>

            {/*<button onClick={() => display()}>Connect Wallet</button>
            {renderDialog()}*/}
        </div>

    )
}