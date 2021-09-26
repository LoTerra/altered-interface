import React, { useState } from 'react'
import { TelegramLogo, TwitterLogo, ArrowSquareOut, ChartLine} from 'phosphor-react'

export default function Footer() {
    return (
        <footer className="container pt-3 pb-5">
            <div className="row">
            <div className="col-md-6 text-center text-md-end mb-4">
                    <a
                        href="https://docs.alteredprotocol.com"
                        target="_blank"
                        className="btn btn-outline-secondary nav-item mx-lg-3 learn-altered"
                    >
                        <ArrowSquareOut
                            size={18}
                            style={{
                                marginTop: '-4px',
                                marginRight: '4px',
                            }}
                        />{' '}
                        Learn more about <strong>Altered</strong>
                    </a>
                </div>
                <div className="col-md-6 text-center text-md-start mb-4">
                    <a
                        href="https://coinhall.org/charts/terra/terra18adm0emn6j3pnc90ldechhun62y898xrdmfgfz"
                        target="_blank"
                        className="btn btn-outline-secondary nav-item mx-lg-3 learn-altered"
                    >
                        <ChartLine
                            size={18}
                            style={{
                                marginTop: '-4px',
                                marginRight: '4px',
                            }}
                        />{' '}
                        View chart on <strong>Coinhall</strong>
                    </a>
                </div>
                <div className="col-lg-8 mx-auto">
                    <div className="row justify-content-center">
                        <div className="col-2 col-md-1 text-center">
                            <a
                                href="https://twitter.com/Altered_ALTE"
                                target="_blank"
                            >
                                <TwitterLogo size={24} weight="fill" />
                            </a>
                        </div>
                        <div className="col-2 col-md-1 text-center">
                            <a href="https://t.me/Altered_ALTE" target="_blank">
                                <TelegramLogo size={24} weight="fill" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
