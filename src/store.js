import React, { createContext, useContext, useReducer, useCallback } from 'react';

const StoreContext = createContext();


    const initialState = {
        blockHeight: 0,
        bankAlte: 0,
    };

  const reducer = (state, action) => {
    switch(action.type) {
      case "setBlockHeight":
        return {
          ...state,
          blockHeight: action.message
        }
      case "setBankAlte":
        return {
          ...state,
          bankAlte: action.message
        }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }


    export const StoreProvider = ({ children }) => { 
        const [state, dispatch] = useReducer(reducer, initialState);
      
        return (
          <StoreContext.Provider value={{state, dispatch}}>
            {children}
          </StoreContext.Provider>
        )
      }
      
      export const useStore = () => useContext(StoreContext);