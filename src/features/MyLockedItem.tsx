import React, { useState } from "react";
import { Button, Link } from "@chakra-ui/react";
import { numberFormat } from "../utils/MathCommon";
import {
    Box, Flex, Tr, Td, Image, Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverArrow, PopoverCloseButton
} from '@chakra-ui/react'
import PackgeData from '../_mocks_/PackageData'
import dayjs from "dayjs";
import { findPackageByAmount, parseBalance } from "../utils/Helper";
import StakingContract from '../contracts/KingSpeedStakingContac.json'
import { formatDateYYYYMMDDHHMMSS } from "../utils/DateFormat";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectAccount, setIsLoading } from "../reducers";
import { AbiItem } from "web3-utils";
import { notification } from "../utils/Notification";

const BSC_SCAN_HASH_URL = 'https://testnet.bscscan.com/tx/'
export default function MyLocKedItem ({ stake, updateStaked }: any){
    console.log("stake", stake)
    const dispath = useAppDispatch()
    const { web3,walletAddress, isLoading} = useAppSelector(selectAccount)
    const [ transactionInfo, setTranssactionInfo ] = useState ({
        transactionHash: '',
        isOpen: false,
    })
    const stakedAmount = parseBalance(stake.amount)
    const optionName = stake.termOption
    const endDate = formatDateYYYYMMDDHHMMSS(dayjs.unix(parseFloat(stake.releaseDate)).toDate())
    const stakeDate = formatDateYYYYMMDDHHMMSS(
        dayjs.unix(parseFloat(stake.releaseDate) - parseInt(optionName) * 24 * 3600).toDate()
    )
const isClaim = dayjs(new Date()).unix() >= parseFloat(stake.releaseDate)
const rewardDebt = parseBalance(stake.rewardDebt)
const accueDays = dayjs (new Date()).diff(stakeDate, 'days')
const foundPakageId = findPackageByAmount(stakedAmount)
const foundPakage = PackgeData.find((pack) =>  pack.id === foundPakageId)!
const foundOption = foundPakage.options.find(
    (option) => option.duration === parseInt(optionName)
)!
const handleClain = async () => {
    dispath(setIsLoading(true))
    try {
        const stakingContract = new web3.eth.Contract(
            StakingContract.abi as AbiItem[],
            // process.env.REACT_APP_-STAKING_CONTRACT
            process.env.REACT_APP_STAKING_CONTRACT
        )
        await stakingContract.methods.unStake(stake.indexStake).send({ from: walletAddress }).on('receipt', async ( receipt: any) => {
            if (receipt.status) {
                setTranssactionInfo({
                    transactionHash: receipt?.transactionHash,
                    isOpen: true,
                })
                notification('Withdraw amount stake successfully.', 'success')
                updateStaked(stake.indexStake)
            } else {
                if (receipt?.transactionHash) {
                    setTranssactionInfo({
                        transactionHash: receipt?.transactionHash,
                        isOpen: true
                    })
                }
                notification('Withdraw amount stake fail.', "error")
            }

            dispath(setIsLoading(false))
        })
        .on('error', function (error: any, receipt: any) {
            if (receipt?.transactionHash) {
                setTranssactionInfo({ transactionHash: receipt?.transactionHash, isOpen: true })
            }
            notification('Withdraw amount stake fail.', 'error')
            dispath(setIsLoading(false))
        })
} catch (error) {
    dispath(setIsLoading(false))
}
}

const shortTransactionHash = (hash: string) => {
return hash
    ? `${hash?.substr(0, 6)}...${hash?.substr(hash.length - 6, hash.length - 1)}`
    : ''
}

const closeHash = () => {
setTranssactionInfo({
    transactionHash: '',
    isOpen: false,
})
}

return (
<Tr bgColor="#070e10">
    <Td borderBottom="8px solid #000000 !important" paddingLeft="10px" bgColor="#070e10">
        <Flex alignItems="center">
            <Image src={foundPakage.image} alt={foundPakage.name} h="17px" w="17px" />
            <Box fontSize="16px" fontWeight="600" textTransform="uppercase" ml="10px">
                {foundPakage.name}
            </Box>
        </Flex>
    </Td>
    <Td borderBottom="8px solid #000000 !important" paddingLeft="10px">
        <Box fontSize="16px">{numberFormat(stakedAmount)} KSC</Box>
    </Td>
    <Td borderBottom="8px solid #000000 !important" paddingLeft="10px">
        <Box color="#ffab00" fontSize="16px" fontWeight="600">
            <Box>{foundOption?.rate} %</Box>
            {foundOption?.gift && <Box> {foundOption.gift}</Box>}
        </Box>
    </Td>
    <Td borderBottom="8px solid #000000 !important" paddingLeft="10px">
        <Box fontSize="16px">
            <Box>{stakeDate}</Box>
        </Box>
    </Td>
    <Td borderBottom="8px solid #000000 !important" paddingLeft="10px">
        <Box fontSize="16px">
            <Box>{`${optionName} days`}</Box>
        </Box>
    </Td>
    <Td borderBottom="8px solid #000000 !important" paddingLeft="10px">
        <Box fontSize="16px">
            <Box>{endDate}</Box>
        </Box>
    </Td>
    <Td borderBottom="8px solid #000000 !important" paddingLeft="10px">
        <Box ontSize="16px">
            <Box>{accueDays} days</Box>
        </Box>
    </Td>
    <Td borderBottom="8px solid #000000 !important" paddingLeft="10px">
        <Box color="#ffab00" fontSize="16px" fontWeight="600">
            <Box>{numberFormat(rewardDebt)} KSC</Box>
        </Box>
    </Td>
    <Td borderBottom="8px solid #000000 !important" paddingLeft="10px">
        <Popover
            returnFocusOnClose={false}
            isOpen={transactionInfo.isOpen}
            onClose={closeHash}
            placement="right"
            closeOnBlur={false}
        >
            <PopoverTrigger>
                <Button
                    fontWeight="700"
                    disabled={!isClaim || isLoading || stake.isStaked}
                    onClick={handleClain}
                    color="#000000"
                    background="#ffab00"
                    fontSize="15px"
                    p="0 30px"
                    _hover={{
                        color: '#000000',
                        background: '#ffab00',
                    }}
                    isLoading={isLoading}
                    loadingText="Loading"
                >
                    Claim
                </Button>
            </PopoverTrigger>

            <PopoverContent>
                <PopoverHeader fontWeight="semibold">Information</PopoverHeader>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody>
                    <Link
                        href={`${BSC_SCAN_HASH_URL}${transactionInfo.transactionHash}`}
                        isExternal
                    >
                        View transaction on BSCScan:{' '}
                        {`${shortTransactionHash(transactionInfo.transactionHash)}`}
                    </Link>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    </Td>
</Tr>
)
}