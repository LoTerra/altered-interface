import React, { useState } from 'react'
import { TelegramLogo, TwitterLogo } from 'phosphor-react'

export default function Footer() {
    return (
        <footer className="container pt-3 pb-5">
            <div className="row">
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
