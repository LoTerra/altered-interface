import React, { Component, Suspense } from 'react'
import { Root, Routes } from 'react-static'
import { Router, Link } from '@reach/router'
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import './styles/base.scss'
import {Head} from "react-static";
import { popper } from '@popperjs/core';

let bootstrap= {}
if (typeof document !== 'undefined') {
    bootstrap = require("bootstrap")
}


class App extends Component {
  render() {
    return (
        <Suspense fallback={<div>Loading... </div>}>
            <Root>
                <Head>
                    <meta charSet="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                    <title>Altered protocol</title> 
                    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon"/>
                    <link rel="icon" href="/favicon.ico" type="image/x-icon"/>
                    <meta property="og:title" content="Altered" />
                    {/* <meta property="og:image" content="https://loterra.io/loterra.png" /> */}
                    <meta property="og:image:alt" content="Altered icon" />
                    <meta property="og:type" content="website" />
                    <meta property="og:site_name" content="Altered protocol" />
                    <meta property="og:description" content="Altered elastic protocol"/>
                </Head>
              <Navbar/>
              <div className="container d-flex" style={{minHeight:'85vh'}}>
                  <Routes default />
              </div>
              {/*<Footer/>*/}
            </Root>
        </Suspense>

    )
  }
}

export default App
