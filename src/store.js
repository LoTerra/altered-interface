import React, {
    createContext,
    useContext,
    useReducer,
    useCallback,
} from 'react'

const StoreContext = createContext()

const initialState = {
    alteLPAddress: 'terra1x3musrr03tl3dy9xhagm6r5nthwwxgx0hezc79',
    alteStakingLPAddress: 'terra1augyqytpq9klph5egx99m5ufrcjx5f7xgrcqck',
    altePoolAddress: 'terra18adm0emn6j3pnc90ldechhun62y898xrdmfgfz',
    lotaPoolAddress: 'terra1pn20mcwnmeyxf68vpt3cyel3n57qm9mp289jta',
    blockHeight: 0,
    bankAlte: 0,
    wallet: {},
    LPBalance: {},
    LPHolderAccruedRewards: 0,
    holderClaimsLP: [],
    allHolderLP: {},
    stateLPStakingLOTA: {},
    poolInfoLOTA: {},
    stateLPStakingALTE: {},
    poolInfoALTE: {},
    totalAlteStaked: 0,
    APY: 0,
    pricePerLota: 0,
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'setPoolInfoALTE':
            return {
                ...state,
                poolInfoALTE: action.message,
            }
        case 'setPricePerLota':
            return {
                ...state,
                pricePerLota: action.message,
            }
        case 'setTotalAlteStaked':
            return {
                ...state,
                totalAlteStaked: action.message,
            }
        case 'setAPY':
            return {
                ...state,
                APY: action.message,
            }
        case 'setBlockHeight':
            return {
                ...state,
                blockHeight: action.message,
            }
        case 'setWallet':
            return {
                ...state,
                wallet: action.message,
            }
        case 'setBankAlte':
            return {
                ...state,
                bankAlte: action.message,
            }
        case 'setAllHolderLP':
            return {
                ...state,
                allHolderLP: action.message,
            }
        case 'setHolderClaimsLP':
            return {
                ...state,
                holderClaimsLP: action.message,
            }
        case 'setLPBalance':
            return {
                ...state,
                LPBalance: action.message,
            }
        case 'setLPHolderAccruedRewards':
            return {
                ...state,
                LPHolderAccruedRewards: action.message,
            }
        case 'setStateLPStaking':
            return {
                ...state,
                stateLPStakingALTE: action.message,
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`)
    }
}

export const StoreProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    return (
        <StoreContext.Provider value={{ state, dispatch }}>
            {children}
        </StoreContext.Provider>
    )
}

export const useStore = () => useContext(StoreContext)
