import React, { useEffect, useState, useCallback, useRef } from 'react'
import { Ticket } from 'phosphor-react';
import axios from 'axios'


export default () => {

    const [traders, setTraders] = useState(0);

    async function getHomePageData() {
        try {
          const result = await axios.get("https://privilege.digital/api/get-all-orders")
          console.log(result.data);       
          setTraders(result.data.orders)
          
        } catch (error) {
          console.error(error);
        }
      }

      const getRank = (nr) => {
          //Add 1 to not get 0
          let rank = nr + 1;

          return (
              rank
          )
      }

      const getRankPrize = (nr) => {
        let rank = nr + 1;
          if(rank === 1){
              return '3000'
          }
          if(rank === 2){
            return '2500'
          }
          if(rank === 3){
            return '2000'
          }
          if(rank === 4){
            return '1500'
          }
          if(rank === 5){
            return '1000'
          }
          if(rank >= 6 && rank <= 10){
            return '500'
          }
          if(rank >= 11 && rank <= 40){
            return '100'
          }
          return 0;
      }

      const getRankClass = (nr) => {
        //Add 1 to not get 0
        let rank = nr + 1;

        if(rank <= 3){
            return 'big';
        } else {
            return 'normal';
        }
    }


      useEffect(() => { 
        getHomePageData()
    }, [])
    return (
        <div className="container">
        <div className="trading-competition-intro">
            <h1 className="text-center">Altered</h1>
            <h3 className="text-center">Trading competition</h3>            
            <div className="row text-center">
              <div className="col-12">
                <p
                style={{
                  color:'#fff'
                }}
                ><strong>Competition Period:</strong> 2021-12-06 12:00 PM to 2021-12-24 12:00 PM (UTC)</p>
              </div>
              <div className="col-6 mb-4 text-end d-flex">
                <a href="https://dex.loop.markets/" target="_blank" className="d-block align-self-center w-100">
                  <img src="https://dex.loop.markets/static/media/logo_lg.0455595b.svg" style={{width:'100%', maxWidth:'150px'}} />
                </a>
              </div>
              <div className="col-6 mb-4 text-start d-flex">
                <a href="https://app.terraswap.io/#Swap" target="_blank" className="d-block align-self-center w-100">
                <img src="https://terraswap.io/wp-content/uploads/2020/10/terra_swap_WH_logo-02-1.svg" style={{width:'100%', maxWidth:'200px'}} className="img-fluid" />
                </a>
              </div>
            </div>
        </div>
        <div class="table-responsive">
        <table className="table trading-competition-table mb-5">
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Trader</th>
                    <th className="text-end">Volume</th>
                </tr>
            </thead>
            <tbody>
            { traders && traders.sort((a,b) => { return b.volume_amount - a.volume_amount}).map((obj,index) => {
                return (
                <tr className={getRankClass(index)}>
                    <td className="rank"><span>{getRank(index)}</span> <p>{getRankPrize(index)} <Ticket size={21} color={'#858585'} style={{position:'relative', top:'-2px'}}/></p></td>
                    <td className="trader-address">{obj._id}</td>
                    <td className="amount text-end">{(obj.volume_amount / 1000000).toFixed(2)} ALTE</td>
                </tr>
                )
                
            })

            }
            </tbody>
        </table>
        </div>
        </div>
    )
}