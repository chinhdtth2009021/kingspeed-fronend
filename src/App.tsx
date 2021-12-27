import React, { useState, useEffect } from 'react';
import 'scss/global.css';
import Staking from './features/Staking';
import MyLockedStaking from './features/MyLockedStaking';
import KingSpeedToKenContract from './contracts/KingSpeedStakingContac.json';
import StakingContract from './contracts/KingSpeedStakingContac.json';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { selectAccount, setBalanceKSC, setTotalStakedAmount, setWeb3} from './reducers';
import { AbiItem } from 'web3-utils'
import { Box, Flex } from '@chakra-ui/react'
import { parseBalance } from './utils/Helper'
import ModalOverlay from './components/ModalOverlay'
function App (){
    const dispatch = useAppDispatch()
    const { walletAddress, web3, isLoading } =  useAppDispatch(selectAccount)
    const [selectTab, setSelectTab] = useState<'STAKE' | 'LOCKED'>('STAKE')

    const handleClickTab = (type: 'STAKE' | 'LOCKED') => {
        setSelectTab(type)
    }

    async function getAvailableKSCToken() {
        const kingSpeedContract = new web3.eth.Contract(
            KingSpeedToKenContract.abi as AbiItem[],
            process.env.REACT_APP_KING_SPEED_TOKEN_CONTRACT
        )

        const balanceKSC = await kingSpeedContract.methods.balanceOf(walletAddress).call()
        const convertBalanceKSC = parseBalance(balanceKSC)

        dispatch(setBalanceKSC(convertBalanceKSC))
    }

    async function getTotalStaked() {
        const stakingAddressContract = process.env.REACT_APP_STAKING_CONTRACT

        const stakingContract = new web3.eth.Contract(
            StakingContract.abi as AbiItem[],
            stakingAddressContract
        )

        const stakedAmount = await stakingContract.methods.totalStakedAmount().call()
        const convertAmount = parseBalance(stakedAmount)

        dispatch(setTotalStakedAmount(convertAmount))
    }

    useEffect(() => {
        if (walletAddress) {
            getAvailableKSCToken()
        }
    }, [walletAddress])

    useEffect(() => {
        getTotalStaked()
    }, [])

    return (
        <>
            <Box mt="40px" minW="1070px" overflowX="scroll">
                <Flex alignItems="center" justifyContent="center">
                    <Box
                        textTransform="uppercase"
                        fontSize="18px"
                        lineHeight="50px"
                        padding="0 30px"
                        cursor="pointer"
                        fontWeight="700"
                        color={selectTab === 'STAKE' ? '#ffffff' : '#8d9fb9'}
                        borderBottom={selectTab === 'STAKE' ? '1px solid #00aed6' : 'none'}
                        onClick={() => handleClickTab('STAKE')}
                    >
                        Staking
                    </Box>
                    <Box
                        textTransform="uppercase"
                        fontSize="18px"
                        lineHeight="50px"
                        padding="0 30px"
                        cursor="pointer"
                        fontWeight="700"
                        color={selectTab === 'LOCKED' ? '#ffffff' : '#8d9fb9'}
                        borderBottom={selectTab === 'LOCKED' ? '1px solid #00aed6' : 'none'}
                        onClick={() => handleClickTab('LOCKED')}
                    >
                        My Locked Staking
                    </Box>
                </Flex>

                <Box
                    padding={{ base: '20px 10px 10px', xl: '20px 30px 10px' }}
                    borderRadius="10px"
                    border="1px solid rgba(0, 174, 214, 0.33)"
                >
                    {selectTab === 'STAKE' ? <Staking /> : <MyLockedStaking />}
                </Box>
            </Box>

            {isLoading && <ModalOverlay />}
        </>
    )
}

export default App