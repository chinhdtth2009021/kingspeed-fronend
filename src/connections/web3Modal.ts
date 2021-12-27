import WalletConnectProvider from "@walletconnect/web3-provider";
import store from "../app/store";
import { logout, setWalletAddress, setChainId, setBalanceBNB, setWeb3 } from "../reducers";
import { getWeb3 } from "../utils/getWeb3List";
import { parseBalance } from "../utils/Helper";
import { notification } from "../utils/Notification";
import Web3 from "web3";
import { numberToHex } from "web3-utils";
import Web3Modal from 'web3modal';

declare let window: any
const rpcSupport: { [key: string]: string } = {
    97: 'https://data-seed-prebsc-2-s1.binance.org:8545/',
    56: 'https://bsc-dataseed.binance.org/',
}
const providerOptions = {
    walletconnect: {
        package: WalletConnectProvider,
    }
}
const paramsSwitchNetwork: { [key: string]: object } = {
    56: [{
        chainId: '0x38',
        chainName: 'BSC - Mainnet',
        nativeCurrency: {
            name: 'BNB',
            symbol: 'BNB',
            decimals: 18,
        },
        rpcUrls: ['https://bsc-dataseed.binance.org/'],
        blockExplorerUrls: ['https://bscscan.com/'],
    },
    ],
    97: [
        {
            chainId: '0x61',
            chainName: 'BSC - Testnet',
            nativeCurrency: {
                name: 'BNB',
                symbol: 'BNB',
                decimals: 18,
            },
            rpcUrls: ['https://data-seed-prebsc-2-s1.binance.org:8545/'],
            blockExplorerUrls: ['https://testnet.bscscan.com/'],
        },
    ],
}

export const selectChain = async (chainId: number, walletAddress: string) => {
    if (!!rpcSupport[chainId]) {
        if (!!walletAddress) {
            injectNetworkNoEthereum(chainId)
        } else {
            const { web3Procider } = getWeb3(chainId)
            store.dispatch(setWeb3(web3Procider))
        }
        store.dispatch(setChainId(chainId))
    } else {
        notification('KingSpeed does nott support this network', 'warning')
    }
}

export const injectNetworkEthereum = async (chainId: number) => {
    if (window.ethereum) {
        await window.ethereum?.request({
            method: 'wallet_switchEthereumChain',
            params: [
                {
                    chainId: numberToHex(chainId)
                },
            ],
        })
    } else {
        notification('Metamask is not installed', 'warning')
    }
}

export const injectNetworkNoEthereum = async (chainId: number) => {
    if (window.ethereum) {
        await window.ethereum?.request({
            method: 'wall_addEthereumChain',
            params: paramsSwitchNetwork[chainId],
        })
    } else {
        notification('Metamask is not installed', 'warning')
    }
}

export const connectWeb3Modal = async () => {
    const { chainId } = store.getState().accountState

    if (chainId && paramsSwitchNetwork[chainId]) {
        injectNetworkNoEthereum(chainId)
    }
    if (chainId && !paramsSwitchNetwork[chainId]) {
        injectNetworkNoEthereum(chainId)
    }
    setupWebModal()
}

const setupWebModal = async () => {
    const web3modal = new Web3Modal({
        cacheProvider: true,
        providerOptions,
    })
    const provider = await web3modal.connect()
    const web3 = new Web3(provider)
    let currentChainId = await web3.eth.net.getId()

    if (currentChainId && rpcSupport[currentChainId]) {
        let accounts = await web3.eth.getAccounts()

        store.dispatch(setChainId(currentChainId))
        store.dispatch(setWeb3(web3))

        if (accounts.length > 0) {
            const balance = await web3.eth.getBalance(accounts[0])

            store.dispatch(setWalletAddress(accounts[0]))
            store.dispatch(setBalanceBNB(parseBalance(balance)))
        }
    } else {
        notification('Kingspeed does not support this network', 'warning')
    }

    provider.on('accountsChanged', async (accounts: string[]) => {
        store.dispatch(setWalletAddress(accounts[0]))
    })
    provider.on('chainChanged', async (currentChainId: number) => {
        currentChainId = web3.utils.hexToNumber(currentChainId)
        if (!!rpcSupport[currentChainId]) {
            store.dispatch(setChainId(currentChainId))
            store.dispatch(setWeb3(web3))
        }else{
            notification('KingSpeed does not support thhis network', 'warning')
        store.dispatch(logout())
        }
    })
    provider.on('connect', (info: { currentChainId: number}) => {
        console.log(info)
    })
    provider.on('disconnect', (error: {code: number; message: string}) => {
        console.log(error)
        store.dispatch(setWalletAddress(null))
    })


}
