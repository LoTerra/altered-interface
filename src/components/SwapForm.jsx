import { Swap, CaretRight } from 'phosphor-react'
import React, { useCallback } from 'react'
import debounce from 'lodash.debounce'

export default function SwapForm(props) {
    const {
        switchValuta,
        isNativeToken,
        inputChange,
        returnAmount,
        current,
        doSwap,
        amount,
    } = props
    const handleChange = (event) => {
        event.persist()
        const debouncedSave = debounce(() => inputChange(event), 1000)
        debouncedSave()
        // highlight-ends
    }

    return (
        <div className="swap-form">
            <div className="row">
                {/* <div className="col-12 text-center mb-5">
                    <h3>Swap</h3>
                </div> */}
                <div className="col-12 mb-3">
                    <span className="label">FROM</span>
                    <span className="valuta">
                        {isNativeToken ? 'ALTE' : 'UST'}
                    </span>
                    <input
                        type="number"
                        className="form-control"
                        onChange={handleChange}
                        placeholder="0"
                    />
                </div>
                <div className="swapper-info">
                    <p>
                        Inputs are interchangeable you can swap UST for ALTE or
                        ALTE for UST
                    </p>
                    <CaretRight size={28} color={'#5F5F5F'} />
                </div>
                <button className="swapper" onClick={switchValuta}>
                    <Swap size={36} color={'#DCEF14'} />
                </button>
                <div className="col-12 mb-3">
                    <span className="label">TO</span>
                    <span className="valuta">
                        {isNativeToken ? 'UST' : 'ALTE'}
                    </span>
                    <input
                        readOnly
                        type="number"
                        className="form-control"
                        value={returnAmount > 0 ? returnAmount : ''}
                        placeholder="0"
                    />
                </div>
                <div className="swap-final-info">
                    {current.commissionOfferAmount && (
                        <small>
                            Commission: {current.commissionOfferAmount}
                        </small>
                    )}
                    {current.spreadAmount && (
                        <small>Spread: {current.spreadAmount}</small>
                    )}
                </div>
                <div className="col-12 mb-3">
                    <button
                        className={
                            amount > 0
                                ? 'btn btn-special w-100 grow'
                                : 'btn btn-special w-100'
                        }
                        disabled={amount <= 0}
                        onClick={doSwap}
                    >
                        Swap
                    </button>
                </div>
            </div>
        </div>
    )
}
