import React, {useState} from "react";
import {Link } from '@reach/router'
import ConnectWallet from "./ConnectWallet";
export default function Navbar (){
    return(
        <div>
            <div className="navbar">
                <div></div>
                {/*<nav>
                    <Link to="/">Lottery</Link>
                    <Link to="/public-sale">Public sale</Link>
                    <Link to="/staking">Staking</Link>
                    <Link to="/terrand-oracle">Terrand oracle</Link>
                    <Link to="/dao">DAO</Link>
                </nav>*/}
                <ConnectWallet/>
            </div>
        </div>
    )
}