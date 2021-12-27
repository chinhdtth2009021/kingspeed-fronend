import React from "react";
import { border, Box } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { connectWeb3Modal } from "../connections/web3Modal";
export default function ButtonConnectWallet() {
    const BtnWallet = styled(Box)`
    border: 2px solid #ffffff;
    font-size: 19px;
    font-weight: 600;
        height: 37px;
        line-height: 35px;
        width: 192px;
        text-align: center;s
        background-color: transparent;
        text-transform: uppercase;
        text-align: center;
        cursor: pointer;
        transition: 0.5s;

        /* box-shadow */
        -webkit-box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 3px;
        -moz-box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 3px;
        box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 3px;
        -webkit-transform: skew(-20deg);
        -moz-transform: skew(-20deg);
        -o-transform: skew(-20deg);
    `
    const Text = styled(Box)`
        display: inline-block;
        -webkit-transform: skew(20deg);
        -moz-transform: skew(20deg);
        -o-transform: skew(20deg);
    `
const handleConnectWallet = async () =>{
    connectWeb3Modal()
}
return(
    <BtnWallet onClick={handleConnectWallet}>
<Text>Connect Wallet</Text>
    </BtnWallet>
)
}