import React, {useEffect, useState } from "react";
import { Box, Flex, Link, Image, SimpleGrid, Button } from '@chakra-ui/react'
import { numberFormat } from "../utils/MathCommon";
import { formatDateYYYYMMDDHHMMSS } from "../utils/DateFormat";
import dayjs from "dayjs";
import NumberFormat from "react-number-format";
import useInterval  from '../hooks/userInterval'
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectAccount, setBalanceKSC, setIsLoading, setTotalStakedAmount } from "../reducers";
import { AbiItem } from 'web3-utils'
import KingSpeedTokenContract from '../contracts/KingSpeedTokenContract.json'
import StakingContract from '../contracts/KingSpeedStakingContac.json'
import { ethers } from "ethers";
import AlertHashTransactioon from '../components/AlertHashTransation'
import { notification } from "../utils/Notification";

const UNLIMITED_KSC = 200000000
const PACKAGE_SILVER = 1
const PACKAGE_GOLD = 2
const PACKAGE_RUBY = 3
const PACKAGE_DIAMOND = 4
const OPTION_7_DAYS = 1
const OPTION_30_DAYS = 2
const OPTION_90_DAYS = 3
const OPTION_180_DAYS = 4

const URL_BUY_KSC =
    'https://pancakeswap.finance/swap?outputCurrency=0x3ac0f8cecc1fb0ee6c2017a072d52e85b00c6694'

export default function StakeDetail({ option, packageItem }: any) {
    const dispatch = useAppDispatch()
    const { balanceKSC, totalStakedAmount, web3, walletAddress, isLoading } =
        useAppSelector(selectAccount)

    const [transactionInfo, setTransactionInfo] = useState({
        transactionHash: '',
        status: false,
    })
    const [allowanceAmount, setAllowanceAmount] = useState(0)
    const [errorMessage, setErrorMessage] = useState('')
    const [disableConfirm, setDisableConfirm] = useState(false)

    const [stakeAmount, setStakeAmount] = useState(packageItem.minStake)
    const [stakeDate, setStakeDate] = useState(new Date())
    const [totalStakedByOption, setTotalStakedByOption] = useState(0)

    const poolLimit =
        option?.poolLimit === UNLIMITED_KSC ? 'Unlimited' : `${numberFormat(option?.poolLimit)} KSC`

    const percentPool =
        option?.poolLimit !== UNLIMITED_KSC ? (totalStakedByOption / option?.poolLimit) * 100 : 0

    useInterval(() => {
        setStakeDate(new Date())
    }, 1000)

    const getAllowanceAmount = async () => {
        try {
            const kingSpeedContract = new web3.eth.Contract(
                KingSpeedTokenContract.abi as AbiItem[],
                process.env.REACT_APP_KING_SPEED_TOKEN_CONTRACT
            )

            await kingSpeedContract.methods.allowance(walletAddress, process.env.REACT_APP_STAKING_CONTRACT)
                .call((err: any, res: any) => {
                    if (err) {
                        notification("Get amount allowance fail", "error")
                        return
                    }
                    if (res) {
                        setAllowanceAmount(Number(ethers.utils.formatUnits(res, 18)))
                    }
                })
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (walletAddress) {
            getAllowanceAmount()
        }
    }, [walletAddress])

    const handleStakeAmount = (values: any) => {
        const { value } = values
        setStakeAmount(value ? parseFloat(value) : 0)

        setErrorMessage('')
        setDisableConfirm(false)

        if (parseFloat(value) > packageItem.maxStake) {
            setDisableConfirm(true)
            setErrorMessage(
                `The stake amount can not be higher than ${numberFormat(
                    packageItem.maxStake
                )} maximum KSC of ${packageItem.name} package`
            )
            return
        }

        if (parseFloat(value) > balanceKSC) {
            setDisableConfirm(true)
            setErrorMessage('The stake amount can not be higher than the available amount')
            return
        }

        if (parseFloat(value) < packageItem.minStake) {
            setDisableConfirm(true)
            setErrorMessage(
                `The stake amount can not be lower than ${numberFormat(
                    packageItem.minStake
                )} KSC`
            )
            return
        }
    }

    const handleMaxKSC = () => {
        if (balanceKSC >= packageItem.maxStake) {
            setStakeAmount(packageItem.maxStake)
        } else {
            setStakeAmount(balanceKSC)
        }
    }

    const approve = async () => {
        if (balanceKSC < packageItem.minStake) {
            notification("Your KSC balance is insufficient to approve ", "error")
            return
        }

        try {
            const kingSpeedContract = new web3.eth.Contract(
                KingSpeedTokenContract.abi as AbiItem[],
                process.env.REACT_APP_KING_SPEED_TOKEN_CONTRACT
            )

            await kingSpeedContract.methods
                .approve(
                    process.env.REACT_APP_STAKING_CONTRACT,
                    web3.utils.toWei(balanceKSC.toString(), 'ether')
                )
                .send({
                    from: walletAddress,
                }).on('receipt', (receipt: any) => {
                    if (receipt.status) {
                        setTransactionInfo({ transactionHash: receipt?.transactionHash, status: true })
                        notification("An Approve has been successfully", "success")
                    } else {
                        if (receipt?.transactionHash) {
                            setTransactionInfo({ transactionHash: receipt?.transactionHash, status: false })
                        }
                        notification("An approval has failed", "error")
                    }
                })
                .on('error', (error: any, receipt: any) => {
                    if (receipt?.transactionHash) {
                        setTransactionInfo({ transactionHash: receipt?.transactionHash, status: false })
                    }
                    notification("An approval has failed", "error")
                })
        } catch (error) {
            console.log(error)
        }
    }

    const updateData = (stakeAmount: number) => {
        notification('Congratulation, you have staked successfully', 'success')
        setStakeAmount(packageItem.minStake)
        dispatch(setBalanceKSC(balanceKSC - stakeAmount))
        dispatch(setTotalStakedAmount(totalStakedAmount + stakeAmount))
        dispatch(setIsLoading(false))
    }

    const deposit = async () => {
        const stakingContract = new web3.eth.Contract(
            StakingContract.abi as AbiItem[],
            process.env.REACT_APP_STAKING_CONTRACT
        )

        if (option.id === OPTION_7_DAYS) {
            await stakingContract.methods
                .oneWeekStake(web3.utils.toWei(stakeAmount.toString(), 'ether'))
                .send({ from: walletAddress })
                .on('receipt', async (receipt: any) => {
                    if (receipt.status) {
                        setTransactionInfo({
                            transactionHash: receipt?.transactionHash,
                            status: true,
                        })
                        getAllowanceAmount()
                        updateData(stakeAmount)
                    } else {
                        if (receipt?.transactionHash) {
                            setTransactionInfo({ transactionHash: receipt?.transactionHash, status: false })
                        }
                        notification("The transaction is failed", "error")
                    }
                })
                .on('error', function (error: any, receipt: any) {
                    if (receipt?.transactionHash) {
                        setTransactionInfo({ transactionHash: receipt?.transactionHash, status: false })
                    }
                    notification('The transaction is failed', 'error')
                })
        }

        if (option.id === OPTION_30_DAYS) {
            await stakingContract.methods
                .oneMonthStake(web3.utils.toWei(stakeAmount.toString(), 'ether'))
                .send({ from: walletAddress })
                .on('receipt', async (receipt: any) => {
                    if (receipt.status) {
                        setTransactionInfo({
                            transactionHash: receipt?.transactionHash,
                            status: true,
                        })
                        getAllowanceAmount()
                        updateData(stakeAmount)
                    } else {
                        if (receipt?.transactionHash) {
                            setTransactionInfo({ transactionHash: receipt?.transactionHash, status: false })
                        }
                        notification("The transaction is failed", "error")
                    }
                })
                .on('error', function (error: any, receipt: any) {
                    if (receipt?.transactionHash) {
                        setTransactionInfo({ transactionHash: receipt?.transactionHash, status: false })
                    }
                    notification('The transaction is failed', 'error')
                })
        }

        if (option.id === OPTION_90_DAYS) {
            await stakingContract.methods
                .threeMonthStake(web3.utils.toWei(stakeAmount.toString(), 'ether'))
                .send({ from: walletAddress })
                .on('receipt', async (receipt: any) => {
                    if (receipt.status) {
                        setTransactionInfo({
                            transactionHash: receipt?.transactionHash,
                            status: true,
                        })
                        getAllowanceAmount()
                        updateData(stakeAmount)
                    } else {
                        if (receipt?.transactionHash) {
                            setTransactionInfo({ transactionHash: receipt?.transactionHash, status: false })
                        }
                        notification("The transaction is failed", "error")
                    }
                })
                .on('error', function (error: any, receipt: any) {
                    if (receipt?.transactionHash) {
                        setTransactionInfo({ transactionHash: receipt?.transactionHash, status: false })
                    }
                    notification('The transaction is failed', 'error')
                })
        }

        if (option.id === OPTION_180_DAYS) {
            await stakingContract.methods
                .sixMonthStake(web3.utils.toWei(stakeAmount.toString(), 'ether'))
                .send({ from: walletAddress })
                .on('receipt', async (receipt: any) => {
                    if (receipt.status) {
                        setTransactionInfo({
                            transactionHash: receipt?.transactionHash,
                            status: true,
                        })
                        getAllowanceAmount()
                        updateData(stakeAmount)
                    } else {
                        if (receipt?.transactionHash) {
                            setTransactionInfo({ transactionHash: receipt?.transactionHash, status: false })
                        }
                        notification("The transaction is failed", "error")
                    }
                })
                .on('error', function (error: any, receipt: any) {
                    if (receipt?.transactionHash) {
                        setTransactionInfo({ transactionHash: receipt?.transactionHash, status: false })
                    }
                    notification('The transaction is failed', 'error')
                })
        }
    }

    const formatDataStaked = (amount: string) => {
        return Number(ethers.utils.formatUnits(amount, 18)) ?? 0
    }

    useEffect(() => {
        getDetailStakedPool()
        closeTransactionHash()
    }, [packageItem, option])

    const getDetailStakedPool = async () => {
        const stakingContract = new web3.eth.Contract(
            StakingContract.abi as AbiItem[],
            process.env.REACT_APP_STAKING_CONTRACT
        )
        await stakingContract.methods.getDetailStakedPool().call((err: any, res: any) => {
            if (err) {
                console.log(err)
                return
            }
            const adjacencyMatrix = res

            if (option.id === OPTION_7_DAYS) {
                const option7Days = adjacencyMatrix[0]

                if (packageItem.id === PACKAGE_SILVER) {
                    setTotalStakedByOption(formatDataStaked(option7Days[0]))
                }

                if (packageItem.id === PACKAGE_GOLD) {
                    setTotalStakedByOption(formatDataStaked(option7Days[1]))
                }

                if (packageItem.id === PACKAGE_RUBY) {
                    setTotalStakedByOption(formatDataStaked(option7Days[2]))
                }

                if (packageItem.id === PACKAGE_DIAMOND) {
                    setTotalStakedByOption(formatDataStaked(option7Days[3]))
                }
            }

            if (option.id === OPTION_30_DAYS) {
                const option30Days = adjacencyMatrix[1]

                if (packageItem.id === PACKAGE_SILVER) {
                    setTotalStakedByOption(formatDataStaked(option30Days[0]))
                }

                if (packageItem.id === PACKAGE_GOLD) {
                    setTotalStakedByOption(formatDataStaked(option30Days[1]))
                }

                if (packageItem.id === PACKAGE_RUBY) {
                    setTotalStakedByOption(formatDataStaked(option30Days[2]))
                }

                if (packageItem.id === PACKAGE_DIAMOND) {
                    setTotalStakedByOption(formatDataStaked(option30Days[3]))
                }
            }

            if (option.id === OPTION_90_DAYS) {
                const option90Days = adjacencyMatrix[2]

                if (packageItem.id === PACKAGE_SILVER) {
                    setTotalStakedByOption(formatDataStaked(option90Days[0]))
                }

                if (packageItem.id === PACKAGE_GOLD) {
                    setTotalStakedByOption(formatDataStaked(option90Days[1]))
                }

                if (packageItem.id === PACKAGE_RUBY) {
                    setTotalStakedByOption(formatDataStaked(option90Days[2]))
                }

                if (packageItem.id === PACKAGE_DIAMOND) {
                    setTotalStakedByOption(formatDataStaked(option90Days[3]))
                }
            }

            if (option.id === OPTION_180_DAYS) {
                const option180Days = adjacencyMatrix[3]

                if (packageItem.id === PACKAGE_SILVER) {
                    setTotalStakedByOption(formatDataStaked(option180Days[0]))
                }

                if (packageItem.id === PACKAGE_GOLD) {
                    setTotalStakedByOption(formatDataStaked(option180Days[1]))
                }

                if (packageItem.id === PACKAGE_RUBY) {
                    setTotalStakedByOption(formatDataStaked(option180Days[2]))
                }

                if (packageItem.id === PACKAGE_DIAMOND) {
                    setTotalStakedByOption(formatDataStaked(option180Days[3]))
                }
            }
        })
    }

    const isCheckApprove = () => {
        return allowanceAmount < stakeAmount
    }

    const handleConfirmStake = async () => {
        dispatch(setIsLoading(true))
        try {
            if (isCheckApprove()) {
                await approve()
            }
            await deposit()
        } catch (error) {
            dispatch(setIsLoading(false))
        }
    }

    const calculateRate = () => {
        return (option.rate * option.duration * stakeAmount) / (365 * 100)
    }

    const isDisable = () => {
        return balanceKSC < packageItem.minStake || totalStakedByOption > option.poolLimit
    }

    const closeTransactionHash = () => {
        setTransactionInfo({
            transactionHash: '',
            status: false,
        })
    }

    return (
        <Box padding="20px 0" maxW="670px" margin="0 auto">
            <Box
                display="flex"
                justifyContent="space-between"
                padding="10px 20px"
                borderStyle="solid"
                borderWidth="0.6px"
                borderRadius="5px"
                background="linear-gradient(to left, rgba(3, 170, 20, 0.46), rgba(0, 174, 214, 0.12))"
            >
                <Box>
                    <Box fontSize="12px" fontWeight="600">
                        Total Staked
                    </Box>
                    <Box mt="6px" fontSize="20px" color="#ffab00" fontWeight="700">
                        {numberFormat(totalStakedByOption)} KSC
                    </Box>
                </Box>
                <Box textAlign="right">
                    <Box color="#8d9fb9" fontSize="12px" fontWeight="600" textTransform="uppercase">
                        Pool Limit
                    </Box>
                    <Box
                        w="200px"
                        display="flex"
                        justifyContent={
                            option?.poolLimit === UNLIMITED_KSC ? 'flex-end' : 'space-between'
                        }
                        fontSize="16px"
                        fontWeight="600"
                        mt="5px"
                    >
                        {option?.poolLimit !== UNLIMITED_KSC && (
                            <Box>{percentPool?.toFixed(2)}%</Box>
                        )}
                        <Box className="amount">{poolLimit}</Box>
                    </Box>
                    {option?.poolLimit !== UNLIMITED_KSC && (
                        <Box
                            fontSize="21px"
                            lineHeight="33px"
                            textTransform="uppercase"
                            borderRadius="2px"
                            flex="1"
                            mt="10px"
                            borderBottom="7px solid rgb(0, 174, 214, 0.16)"
                            className="progress"
                        >
                            <Box
                                w={percentPool}
                                borderRadius="3px"
                                borderBottom="7px solid #ffffff"
                                mb="-7px"
                                className="progress-detail"
                            ></Box>
                        </Box>
                    )}
                </Box>
            </Box>

            <SimpleGrid columns={2} spacing={16} mt="20px">
                <Box>
                    <Flex justify="space-between" align="center">
                        <Box fontSize="22px" fontWeight="700" color="#c3fb12">
                            STAKE
                        </Box>
                        <Link href={URL_BUY_KSC} isExternal>
                            <Flex align="center" justify="flex-end" cursor="pointer">
                                <Box
                                    color="#21c186"
                                    fontSize="14px"
                                    mt="3px"
                                    fontWeight="700"
                                    mr="10px"
                                >
                                    Buy KSC
                                </Box>

                                <Image src="./icon/icon-buy.svg" alt="icon-buy" />
                            </Flex>
                        </Link>
                    </Flex>
                    <Flex justify="space-between" alignItems="center" mt="10px">
                        <Box fontSize="14px">Stake amount</Box>
                        <Box fontSize="14px">Available amount: {numberFormat(balanceKSC)} KSC</Box>
                    </Flex>
                    <Box
                        border={
                            balanceKSC < packageItem.minStake || disableConfirm
                                ? '1px solid #ee2737'
                                : '1px solid #003947'
                        }
                        borderRadius={4}
                        mt="5px"
                        p="5px 10px"
                    >
                        <Flex justify="space-between" align="center">
                            <NumberFormat
                                style={{
                                    backgroundColor: '#000000',
                                }}
                                value={stakeAmount}
                                min={packageItem.minStake}
                                max={packageItem.maxStake}
                                thousandSeparator={true}
                                decimalScale={4}
                                allowNegative={false}
                                disabled={isLoading || isDisable()}
                                onValueChange={(values) => handleStakeAmount(values)}
                            />
                            <Flex justify="center" align="center">
                                <Box as="span" fontWeight="600" fontSize="20px">
                                    KSC
                                </Box>
                                <Box
                                    padding="5px 10px"
                                    fontWeight="600"
                                    fontSize="16px"
                                    color="#21c186"
                                    background="rgba(33, 193, 134, 0.19)"
                                    borderRadius="5px"
                                    cursor="pointer"
                                    ml={4}
                                    onClick={handleMaxKSC}
                                >
                                    Max
                                </Box>
                            </Flex>
                        </Flex>
                    </Box>

                    {errorMessage && (
                        <Box color="#ee2737" fontSize="13px" mt="10px" fontWeight="600">
                            {errorMessage}
                        </Box>
                    )}

                    {balanceKSC < packageItem.minStake && (
                        <Box color="#ee2737" fontSize="13px" mt="10px" fontWeight="600">
                            {`The available amount can not be lower than ${numberFormat(
                                packageItem.minStake
                            )} KSC`}
                        </Box>
                    )}

                    {transactionInfo.transactionHash && (
                        <Box mt="10px">
                            <AlertHashTransactioon
                                transactionInfo={transactionInfo}
                                closeTransactionHash={closeTransactionHash}
                            />
                        </Box>
                    )}
                </Box>
                <Box className="stake-info">
                    <Box fontSize="18px" fontWeight="600">
                        SUMMARY
                    </Box>
                    <Flex alignItems="center" justify="space-between" mt="5px">
                        <Box fontSize="16px">Stake Date</Box>
                        <Box fontSize="16px">{formatDateYYYYMMDDHHMMSS(stakeDate)}</Box>
                    </Flex>
                    <Flex alignItems="center" justify="space-between" mt="5px">
                        <Box fontSize="16px">Interest End Date</Box>
                        <Box fontSize="16px">
                            {formatDateYYYYMMDDHHMMSS(dayjs(stakeDate).add(option.duration, 'day'))}
                        </Box>
                    </Flex>
                    <Flex alignItems="center" justify="space-between" mt="5px">
                        <Box fontSize="16px">Withdrawal Delay Time</Box>
                        <Box fontSize="16px">None</Box>
                    </Flex>

                    <Box border="1px solid rgba(0, 174, 214, 0.33)" mt="10px" mb="10px"></Box>

                    <Flex alignItems="center" justify="space-between" mt="5px">
                        <Box fontSize="16px" fontWeight="700" color="white">
                            APY
                        </Box>
                        <Box fontSize="16px" fontWeight="700" color="white">
                            {option.rateDisplay}%
                        </Box>
                    </Flex>
                    <Flex alignItems="center" justify="space-between" mt="5px">
                        <Box fontSize="16px" fontWeight="700" color="white">
                            Estimated Interests
                        </Box>
                        <Box fontSize="16px" fontWeight="700" color="white">
                            {calculateRate().toFixed(3)} KSC
                        </Box>
                    </Flex>
                    <Button
                        onClick={handleConfirmStake}
                        color="#000000"
                        fontWeight="700"
                        background="#ffab00"
                        mt="10px"
                        isLoading={isLoading}
                        disabled={isDisable() || disableConfirm || isLoading}
                        loadingText="Loading"
                        fontSize="20px"
                        p="20px 100px"
                        w="100%"
                        _hover={{
                            color: '#000000',
                            background: '#ffab00',
                        }}
                    >
                        Confirm
                    </Button>
                </Box>
            </SimpleGrid>
        </Box>
    )
}