import Web3 from "web3";
export const web3Default: { [key: string]: any} = {
    56: {
        web3Procider: new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/')),
        name: 'BSC Mainnet',
        explorer: 'https://bscscan.com/tx/',
    },
    97:{
        web3Procider: new Web3 (
            new Web3.providers.HttpProvider('https://data-seed-prebsc-2-s3.binance.org:8545/')       
        ),
        name: 'BSC Testnet',
        explorer: 'https://testnet.bscscan.com/tx/',
    },
}

export const injeccNetworks: { [key: string]: object} = {
    56: {
        chainId: '0x38',
        chainName: 'Binance Smart Chain',
        nativeCurrency: {
            name: 'Binance Coin',
            symbol: 'BNB',
            decimals: 18,
        },
        rpcUrls: ['https://bsc-dataseed.binance.org'],
        blockExplorerUrls: ['https://bscscan.com'],
    },
    97: {
        chainId: '0x61',
        chainName: 'Binance Smart Chain',
        nativeCurrency: {
    name: 'Binance Coin',
    symbol: 'BNB',
    decimals: 18,
},
rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
blockExplorerUrls: ['https://testnet.bscscan.com/'],
    },
}
export const getWeb3 = (chainId: number) => {
    return web3Default[chainId];
}
export const getInjecNetwork = (chainId: number) => {
    return injeccNetworks[chainId];
}