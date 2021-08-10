import React, { Component, Suspense } from 'react'
import { Root, Routes } from 'react-static'
import { Router, Link } from '@reach/router'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import './styles/base.scss'
import { Head } from 'react-static'
import { popper } from '@popperjs/core'

let bootstrap = {}
if (typeof document !== 'undefined') {
    bootstrap = require('bootstrap')
}

class App extends Component {
    render() {
        return (
            <Suspense fallback={<div className="vh-100 d-flex">
              <div className="align-self-center w-100 text-center">
              <h1 style={{fontSize:'75px', marginBottom:'0'}}>ALTERED</h1>
                <p style={{                
                textTransform: 'uppercase',
                fontSize: '18px',  
                color:'#fff',
                fontFamily: 'Cosmos',     
                fontWeight: '300',
                marginTop: '-30px'                   
            }} className="loading_animation">Loading... </p>
              </div>
            </div>}>
                <Root>
                    <Head>
                        <meta charSet="UTF-8" />
                        <meta
                            name="viewport"
                            content="width=device-width, initial-scale=1"
                        />
                        <title>Altered protocol</title>
                        <link
                            rel="shortcut icon"
                            href="/favicon.ico"
                            type="image/x-icon"
                        />
                        <link
                            rel="icon"
                            href="/favicon.ico"
                            type="image/x-icon"
                        />
                        <meta property="og:title" content="Altered" />
                        <meta
                            property="og:image"
                            content="https://testnet.alteredprotocol.com/altered.png"
                        />
                        <meta property="og:image:alt" content="Altered icon" />
                        <meta property="og:type" content="website" />
                        <meta
                            property="og:site_name"
                            content="Altered protocol"
                        />
                        <meta
                            property="og:description"
                            content="Altered protocol is a synthetic commodity-money with near-perfect supply elasticity on Terra. Supply is elastic and can change every day while the ownership of the ALTE tokens is never diluted"
                        />
                    </Head>
                    <Navbar />
                    <div className="container">
                        <Routes default />
                    </div>
                    <Footer />
                </Root>
            </Suspense>
        )
    }
}

export default App
