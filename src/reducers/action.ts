import  { createAction } from '@reduxjs/toolkit'
import Web3 from 'web3'

export const setIsLoading = createAction<boolean>('accounts/setIsLoading')
export const setChainId = createAction<number>('accounts/setChaiId')
export const setWeb3 = createAction<Web3>('accounts/setWeb3')
export const setWalletAddress = createAction<string>('accounts/setWalletAddress')
export const setBalanceBNB = createAction<number>('accounts/setBalanceBNB')
export const setBalanceKSC = createAction<number>('accounts/setBalanceKSC')
export const setTotalStakedAmount = createAction<number>('accounts/setTotalStakedAddress')
export const logout = createAction('accounts/logout')
