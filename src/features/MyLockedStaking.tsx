import React, { useEffect, useState} from "react";
import { fromAscii } from "web3-utils";
import MyLocKedItem from "./MyLockedItem";
import {Table, Tr, Th, Tbody, TableCaption } from '@chakra-ui/react'
import StakingContract from '../contracts/KingSpeedStakingContac.json'
import styled from "@emotion/styled";
import { AbiItem } from "web3-utils";
import { selectAccount, setIsLoading } from "../reducers";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import NoData from "../components/NoData";

const FIRST_RECORD = 0
export default function MyLockedStaking(){
    const dispatch = useAppDispatch()
    const { walletAddress, web3 } = useAppSelector(selectAccount)
    const [stakes, setStakes] = useState([])

    const THItem = styled(Th)`
        padding: 10px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        border-bottom: none;
        font-family: inherit;
        margin-left: 20px;
        color: #8d9fb9;
    `
    useEffect(() => {
        async function getUserStakeInfo() {
            dispatch(setIsLoading(true))

            try {
                const stakingContract = new web3.eth.Contract(
                    StakingContract.abi as AbiItem[],
                    process.env.REACT_APP_STAKING_CONTRACT
                )

                const countLocked = await stakingContract.methods
                    .totalStakerInfoByRelease(walletAddress, false)
                    .call()

                const countReleased = await stakingContract.methods
                    .totalStakerInfoByRelease(walletAddress, true)
                    .call()

                const getStakeCount = parseInt(countLocked) + parseInt(countReleased) - 1
                if (getStakeCount > 0) {
                    await stakingContract.methods
                        .getStakerInfo(
                            walletAddress,
                            FIRST_RECORD,
                            parseInt(countLocked) + parseInt(countReleased) - 1
                        )
                        .call((err: any, res: any) => {
                            if (err) {
                                console.log(err)
                                dispatch(setIsLoading(false))
                                return
                            }
                            const listOfStaked = res.map((stake: any, indexStake: number) => {
                                return {
                                    ...stake,
                                    indexStake,
                                    isStaked: false
                                }
                            }).filter((stake: any) => !stake.isRelease)

                            setStakes(listOfStaked ?? [])
                            dispatch(setIsLoading(false))
                        })
                } else {
                    dispatch(setIsLoading(false))
                }
            } catch (error) {
                dispatch(setIsLoading(false))
                console.log(error)
            }
        }

        if (walletAddress) {
            getUserStakeInfo()
        }
    }, [walletAddress])

    const updateStaked = (indexStake: number) => {
        const newStakes: any = stakes.slice() ?? []

        setStakes(newStakes.map((stake: any) => {
            if (stake.indexStake === indexStake) {
                return {
                    ...stake,
                    isStaked: true
                }
            } else {
                return stake
            }
        }))
    }

    return (
        <Table>
            <Tr bgColor="#011921" p="10px 100px" borderRadius="3px">
                <THItem>Package</THItem>
                <THItem>Total Amount</THItem>
                <THItem w="160px">APY</THItem>
                <THItem>Stake Date</THItem>
                <THItem>Locked Days</THItem>
                <THItem>Interest End Date</THItem>
                <THItem>Accrue Days</THItem>
                <THItem>Estimated Interests</THItem>
                <THItem></THItem>
            </Tr>

            {stakes.length > 0 ? (
                <Tbody>
                    {stakes.map((stake, index) => {
                        return <MyLocKedItem key={index} stake={stake} updateStaked={updateStaked} />
                    })}
                </Tbody>
            ) : (
                <TableCaption>
                    <NoData />
                </TableCaption>
            )}
        </Table>
    )
}