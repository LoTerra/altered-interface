import React, { Component, Suspense } from 'react'
import { Root, Routes } from 'react-static'
import { Router, Link } from '@reach/router'
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import './styles/app.css'
import {Head} from "react-static";

class App extends Component {
  render() {
    return (
        <Suspense fallback={<div>Loading... </div>}>
            <Root>
                <Head>
                    <meta charSet="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, shrink-to-fit=no"/>
                    <title>LoTerra interface</title>
                    <meta property="og:title" content="LoTerra" />
                    <meta property="og:image" content="https://loterra.io/loterra.png" />
                    <meta property="og:image:alt" content="LoTerra icon" />
                    <meta property="og:type" content="website" />
                    <meta property="og:site_name" content="LoTerra interface" />
                    <meta property="og:description" content="LoTerra is building a lottery gaming ecosystem thanks smart contracts on Terra blockchain."/>
                </Head>
              <Navbar/>
              <div className="content px-3">
                  <Routes default />
              </div>
              {/*<Footer/>*/}
            </Root>
        </Suspense>

    )
  }
}

export default App
