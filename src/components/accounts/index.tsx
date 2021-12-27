import React from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks' 
import { logout, selectAccount } from '../../reducers'
import {
    Box,
    Text,
    Button,
    Modal,
    Image,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    HStack,
    Flex,
} from '@chakra-ui/react'
import { numberFormat } from '../../utils/MathCommon' 

export default function Account() {
    const dispatch = useAppDispatch()
    const { walletAddress, shortAddress, balanceBNB, balanceKSC } = useAppSelector(selectAccount)
    const { isOpen, onOpen, onClose } = useDisclosure()

    const onLogout = () => {
        dispatch(logout())
        onClose()
    }
    return (
        <>
        <Flex
         p="6px 1px 6px 15px "
         bg="rgba(3, 170, 20, 0.4)"
                borderRadius="5px"
                cursor="pointer"
                onClick={onOpen}
                align="center"
                justifyContent="center"
            >
                <HStack spacing={3}>
                    <Flex alignItems="center">
                        <Box fontSize="1rem" fontWeight="600" mr="5px">
                            {numberFormat(balanceKSC)}
                        </Box>
                        <Image src='/icon/token_ksc.svg' h="20px" w="20px" alt="icon KSC" />
                    </Flex>

                    <Flex alignItems="center">
                        <Box fontSize="1rem" fontWeight="600" mr="5px">
                            {numberFormat(balanceBNB)}
                        </Box>
                        <Image src='/icon/BNB.png' h="25px" w="25px" alt="icon bnb" />
                    </Flex>

                    <Text bg="#000000" ml={4} p="1.5px 20px" fontSize="1rem" borderRadius="5px" as="span">
                        {shortAddress}
                    </Text>
                </HStack>
            </Flex>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Account</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>{walletAddress}</ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" onClick={onLogout}>
                            Logout
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}