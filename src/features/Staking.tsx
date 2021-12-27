import React from 'react'
import PackageData from '../_mocks_/PackageData'
import { InfoOutlineIcon } from '@chakra-ui/icons'
import { Box, Flex } from '@chakra-ui/react'
import PackageItem from './PackageItem'
import styled from '@emotion/styled'

export default function Staking() {
    const HeadingItem = styled(Box)`
        padding: 0 10px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        color: #8d9fb9;
    `
    return (
        <Box>
            <Flex bgColor="#011921" p="10px 50px" border="3px">
                <HeadingItem flex="1">Package</HeadingItem>
                <HeadingItem flex="2">APY</HeadingItem>
                <HeadingItem flex="4">
                    DURATION <InfoOutlineIcon style={{ marginLeft: '10px' }} />
                </HeadingItem>
                <HeadingItem flex="1" textAlign="center">
                    TYPE
                </HeadingItem>
                <HeadingItem flex="2" textAlign="center">
                    RANGE AMOUNT
                </HeadingItem>
                <HeadingItem flex="2"></HeadingItem>
            </Flex>
            {PackageData.map((item) => {
                return <PackageItem key={item.id} item={item} />
            })}
        </Box>
    )
}