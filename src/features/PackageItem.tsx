import React, { useState} from "react";
import { ChevronRightIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { numberFormat } from "../utils/MathCommon";
import { AddIcon } from "@chakra-ui/icons";
import StakeDetail from './StakeDetail'
import { useAppSelector } from "../app/hooks";
import { selectAccount } from "../reducers";
import { notification } from "../utils/Notification";
import { Box, Flex, Image, Button } from "@chakra-ui/react";
const UNLIMITED_KSC = 200000000

export default function PackageItem({ item }: any) {
    const { walletAddress } = useAppSelector(selectAccount)
    const defaultOption = item.options.find((option: any) => option.isDefault)

    const [selectOption, setSelectOption] = useState(
        item.options.find((option: any) => option.id === defaultOption.id)
    )

    const [isStake, setIsStake] = useState<boolean>(false)

    const handleSelectOption = (optionId: number) => {
        const foundOption = item.options.find((option: any) => option.id === optionId)!
        setSelectOption(foundOption)
    }

    const handleStake = () => {
        if (!walletAddress) {
            notification('Please connect to your Wallet first', 'warning')
            return
        }

        setIsStake(!isStake)
    }

    return (
        <Box padding="30px 19px 0">
            <Flex align="center">
                <Flex p="0 10px" flex="1" align="center">
                    <Image src={item.image} alt={item.name} h="17px" w="17px" />
                    <Box fontSize="16px" fontWeight="600" textTransform="uppercase" ml="10px">
                        {item.name}
                    </Box>
                </Flex>
                <Box p="0 10px" flex="2">
                    <Flex
                        border="1px solid rgba(0, 174, 214, 0.33)"
                        bg="linear-gradient(rgba(3, 170, 20, 0.24), rgba(0, 174, 214, 0.12))"
                        borderRadius="5px"
                        padding="7px 10px"
                        fontSize="18px"
                        alignItems="center"
                        width="fit-content"
                    >
                        <Box fontWeight="700" fontSize="20px">
                            {selectOption.rateDisplay}%
                        </Box>

                        {selectOption.gift && (
                            <>
                                <AddIcon color="#fba346" margin="0 10px" height="12px" />
                                <Box
                                    as="span"
                                    fontSize="12px"
                                    textTransform="uppercase"
                                    fontWeight="600"
                                >
                                    {selectOption.gift}
                                </Box>
                            </>
                        )}
                    </Flex>
                </Box>
                <Box p="0 10px" flex="4">
                    <Flex alignItems="center">
                        {item.options.map((option: any) => {
                            return (
                                <Box
                                    padding="7px 22px"
                                    textAlign="center"
                                    borderRadius="5px"
                                    mr="10px"
                                    textTransform="uppercase"
                                    fontSize="18px"
                                    cursor="pointer"
                                    color={option.id === selectOption.id ? '#ffab00' : '#ffffff'}
                                    border={
                                        option.id === selectOption.id
                                            ? 'solid 0.6px rgba(3, 170, 20, 0.44)'
                                            : '1px solid rgba(0, 174, 214, 0.33)'
                                    }
                                    bg={
                                        option.id === selectOption.id
                                            ? 'linear-gradient(rgba(255, 171, 0, 0.12), rgba(0, 174, 214, 0.17))'
                                            : 'none'
                                    }
                                    fontWeight={option.id === selectOption.id ? '700' : '400'}
                                    key={option.id}
                                    onClick={() => handleSelectOption(option.id)}
                                >
                                    {option.duration}
                                    <Box fontWeight="700" fontSize="10px" mt="-5px">
                                        Days
                                    </Box>
                                </Box>
                            )
                        })}
                    </Flex>
                </Box>
                <Flex p="0 10px" flex="1" justifyContent="center">
                    <Box
                        width="fit-content"
                        borderRadius="10px"
                        padding="7px 15px"
                        bg="rgb(0, 174, 214, 0.2)"
                        color="#00aed6"
                        fontWeight="700"
                        fontSize="14px"
                        textTransform="uppercase"
                    >
                        Lock
                    </Box>
                </Flex>
                <Flex p="0 10px" flex="2" justifyContent="center">
                    <Box
                        w="fit-content"
                        padding="7px 13px"
                        borderRadius="10px"
                        fontWeight="700"
                        fontSize="14px"
                        bg="rgb(3, 170, 20, 0.2)"
                        color="#03aa14"
                    >
                        {`${numberFormat(item.minStake)} - ${
                            item.maxStake === UNLIMITED_KSC
                                ? 'Unlimited'
                                : numberFormat(item.maxStake)
                        }`}{' '}
                        KSC
                    </Box>
                </Flex>
                <Flex
                    p="0 10px"
                    flex="2"
                    alignItems="center"
                    justifyContent="flex-end"
                    cursor="pointer"
                    onClick={handleStake}
                >
                    <Box>
                        {isStake ? (
                            <ChevronDownIcon w="30px" h="30px" />
                        ) : (
                            <>
                                <Button
                                    fontSize="15px"
                                    fontWeight="700"
                                    padding="10px 20px"
                                    mr="5px"
                                    bg="#ffab00"
                                    color="#000000"
                                    borderRadius="5px"
                                    cursor="pointer"
                                    _hover={{ bg: '#ffab00', color: '#000000' }}
                                >
                                    Stake Now
                                </Button>

                                <ChevronRightIcon w="30px" h="30px" />
                            </>
                        )}
                    </Box>
                </Flex>
            </Flex>

            {isStake && <StakeDetail packageItem={item} option={selectOption} />}
        </Box>
    )
}