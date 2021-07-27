import React from 'react'
import numeral from 'numeral'

export default function CurrentPrice(props) {
    const { price, totalSupply } = props

    return (
        <div className="current-price">
            <div className="row">
                <div className="col-12">
                    <p className="heading">Target price</p>
                    <p className="big">
                        1.00 <span>UST</span>
                    </p>
                    <p className="heading">Current price</p>
                    <p className="small">
                        {numeral(price).format('0,0.000000')} <span>UST</span>
                    </p>
                    <p className="heading">Total supply</p>
                    <p className="small">
                        {totalSupply} <span>ALTE</span>
                    </p>
                </div>
            </div>
            <svg
                width="96"
                height="89"
                viewBox="0 0 96 89"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M0 82.446C0 85.1335 1.2985 87.1152 3.75666 88.1793C5.17899 88.7951 9.97537 88.9804 24.9423 88.9981C41.661 89.0179 44.5649 88.8909 46.3184 88.0634C49.7809 86.4292 50.9889 82.5435 49.14 78.9874C47.5326 75.8959 45.6847 75.5479 30.8769 75.5479C20.4516 75.5479 17.6048 75.3882 17.8261 74.8157C18.2267 73.7791 50.0567 23.8572 50.8675 22.9939C51.3755 22.4529 55.4919 30.0414 68.0266 54.6264C83.8968 85.7537 84.6026 87.0122 86.7835 88.0715C88.7336 89.0187 89.3741 89.0755 91.3761 88.4789C93.981 87.7027 95.9955 85.0791 96 82.4596C96.0033 80.0941 57.547 3.60883 55.3404 1.59216C53.2668 -0.302956 50.5951 -0.51782 48.095 1.00947C46.8863 1.74779 39.9789 12.8851 23.211 41.1318C3.68504 74.0245 0 80.5837 0 82.446Z"
                    fill="white"
                    fillOpacity="0.1"
                />
            </svg>
        </div>
    )
}
