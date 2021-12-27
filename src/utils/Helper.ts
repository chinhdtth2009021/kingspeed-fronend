import { ethers } from "ethers"

export function parseBalance(amount: number | string) {
    return Number(ethers.utils.formatUnits(amount, 18))
}

const NONE_PACKAGE = 0
const PACKAGE_SILVER = 1
const PACKAGE_GOLD = 2
const PACKAGE_RUBY = 3
const PACKAGE_DIAMOND = 4
export function findPackageByAmount(amount: number) {
    if (amount < 500 || amount >= 2000000000){
        return NONE_PACKAGE
    }else if(amount >= 500 && amount < 5000){
return PACKAGE_SILVER
    }else if(amount >= 5000 && amount< 20000){
return PACKAGE_GOLD
    }else if(amount >= 20000 && amount <40000) {
return PACKAGE_RUBY
    }else if(amount >= 40000){
        return PACKAGE_DIAMOND
    }
}
