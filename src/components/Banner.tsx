import React, {useEffect, useState} from "react";
import useInterval from "../hooks/userInterval";
import { numberFormat } from "../utils/MathCommon";
import { useAppSelector } from "../app/hooks";
import styped from '@emotion/styled'
import { Box, HStack, Text } from "@chakra-ui/react";
import { selectAccount } from "../reducers";
export default function Banner(){
    const { totalStakedAmount } = useAppSelector(selectAccount)
    const [kscPrice, setKscPrice] = useState(0)
    const Title = styped (Text) `
    font-size: 16px;
    font-weight: 600;
    line-height: 27px;
    `
    const Value = styped(Text)`
    font-size: 34px;
    line-height: 55px;
    `

    async function getCurrentKSCPrice() {
        try {
            const response = await fetch('https://api.coingecko.com/api/v3/coins/kingspeed')
            if (response.status === 200){
                const data = await response.json()
                const curretPrice = data.market_data.current_price.usd 
                setKscPrice(curretPrice)
            }
        }catch (error){
            console.log(error)
        }
    }
    useEffect (() => {
        getCurrentKSCPrice()
    }, [])
    useInterval(() => {
        getCurrentKSCPrice()
    }, 100 * 60)
    return(
        <Box
        mt="40px"
        pos="relative"
        bgSize="cover"
        bgPosition="top"
        overflow="hidden"
        borderBottom="1px solid rgb(33, 193, 134 ,0.16)"
        bgImage={{ base: 'none', md: "url('/background/banner.webp')" }}
    >
        <Box p="20px 30px">
            <Box fontSize="40px" fontWeight="600" lineHeight="62px">
                Staking
            </Box>
            <Box display="flex" mt="20px">
                <HStack spacing={{ base: '1.4rem', md: '3.75rem' }}>
                    <Box>
                        <Title>Total Staked</Title>
                        <Value color="#ffab00">{numberFormat(totalStakedAmount)} KSC</Value>
                    </Box>
                    <Box>
                        <Title>Total Value Locked</Title>
                        <Value color="#00aed6">
                            $ {numberFormat(totalStakedAmount * kscPrice)}
                        </Value>
                    </Box>
                    <Box>
                        <Title>Price KSC</Title>
                        <Value color="#c3fb12">${kscPrice}</Value>
                    </Box>
                </HStack>
            </Box>
        </Box>
     </Box>
    )
}
