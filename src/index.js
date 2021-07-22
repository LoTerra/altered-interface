import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import store from './store'
let Wallet = {}
if (typeof document !== 'undefined') {
  Wallet = require("@terra-money/wallet-provider").WalletProvider
}
// Your top level component
import App from './App'

const mainnet = {
  name: 'mainnet',
  chainID: 'columbus-4',
  lcd: 'https://lcd.terra.dev',
};

const testnet = {
  name: 'testnet',
  chainID: 'tequila-0004',
  lcd: 'https://tequila-lcd.terra.dev',
};

// Export your top level component as JSX (for static rendering)
export default App

// Render your app
if (typeof document !== 'undefined') {
  const target = document.getElementById('root')

  const renderMethod = target.hasChildNodes()
    ? ReactDOM.hydrate
    : ReactDOM.render

  const render = Comp => {
    renderMethod(
        <Wallet defaultNetwork={mainnet} walletConnectChainIds={{
          0: testnet,
          1: mainnet,
        }}>
          <AppContainer>
            <Provider store={store}>
                <Comp />
            </Provider>
          </AppContainer>
        </Wallet>,
      target
    )
  }

  // Render!
  render(App)

  // Hot Module Replacement
  if (module && module.hot) {
    module.hot.accept('./App', () => {
      render(App)
    })
  }
}
