import React from 'react'
import { CloseIcon } from '@chakra-ui/icons' 

import {
    Alert,
    AlertIcon,
    AlertDescription,
    Link,
} from '@chakra-ui/react'

type transactionInfoProps = {
    transactionHash: string
    status: boolean
}

type alertProps = {
    transactionInfo: transactionInfoProps
    closeTransactionHash: Function
}

const BSC_SCAN_HASH_URL = "https://testnet.bscscan.com/tx/"

export default function AlertHashTransaction({ transactionInfo, closeTransactionHash }: alertProps) {
    const { transactionHash, status } = transactionInfo
    const shortTransactionHash = `${transactionHash?.substr(0, 6)}...${transactionHash?.substr(
        transactionHash.length - 6,
        transactionHash.length - 1
    )}`

    const handleCloseTransactionHash = () => {
        closeTransactionHash()
    }

    return (
        <Alert status={status ? 'success' : 'error'} p="5px 8px" borderRadius="5px">
            <AlertIcon />
            <AlertDescription>
                <Link href={`${BSC_SCAN_HASH_URL}${transactionHash}`} isExternal>
                    View transaction on BSCScan:  {`${shortTransactionHash}`}
                </Link>
            </AlertDescription>

            <CloseIcon onClick={handleCloseTransactionHash} cursor="pointer" position='absolute' right='8px' top='8px' />
        </Alert>
    )
}
