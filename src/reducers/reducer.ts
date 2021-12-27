import { setBalanceKSC } from "./action";
import { createReducer } from "@reduxjs/toolkit";
import {
    logout, 
    setWalletAddress,
    setBalanceBNB, 
    setChainId,
    setWeb3, 
    setTotalStakedAmount, 
    setIsLoading 
    } from '../reducers'
import { notification } from "../utils/Notification";
import Web3 from 'web3'
const BNB_CHAIN = 97 
export interface AccountState {
    isLoading: boolean
    web3: Web3
    chainId: number | null
    walletAddress: string | null
    shortAddress: string | null
    balanceBNB: number
    balanceKSC: number
    totalStakedAmount: number
}
const initialState: AccountState ={
    isLoading: false,
    web3: new Web3(Web3.givenProvider),
    chainId: typeof window !== 'undefined' &&  window.localStorage && localStorage.getItem('chainId')
    ? parseInt(localStorage.getItem('chainId')!): BNB_CHAIN,
    walletAddress: null,
    shortAddress: null,
    balanceBNB: 0,
    balanceKSC: 0,
    totalStakedAmount: 0,
}
export const accountReducer = createReducer(initialState, (builder) => {
    builder.addCase(setIsLoading, (state, { payload }) =>{
    state.isLoading = payload
    }) 
    builder.addCase(setChainId, ( state, {payload }) => {
        localStorage.setItem('chainId', payload.toString())
        state.chainId = payload
    })
    builder.addCase(setWeb3, (state, {payload}) => {
        state.web3 = payload
    })
    builder.addCase(setWalletAddress, (state ,{ payload }) => {
        const shortAddress = payload ? `${payload?.substr(0, 4)}...${payload?.substr(
            payload.length - 4,
            payload.length - 1
        )}`: ""
        state.walletAddress = payload
        state.shortAddress  = shortAddress
        notification('Connected successfully', 'info')
    })
    builder.addCase(setBalanceBNB, (state, {payload}) => {
        state.balanceBNB = payload
    })
    builder.addCase(setBalanceKSC, (state, { payload}) => {
        state.balanceKSC = payload
    })
    builder.addCase(setTotalStakedAmount, (state, {payload}) =>{
        state.totalStakedAmount = payload
    })
    builder.addCase(logout, (state) => {
state.totalStakedAmount = null
state.shortAddress = null
state.balanceBNB = 0
    })
})
