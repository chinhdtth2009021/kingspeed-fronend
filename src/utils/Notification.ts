import { createStandaloneToast } from "@chakra-ui/react";
const toast = createStandaloneToast()
export const notification = (
    description: string,
    status: 'info' | 'warning' | 'success' | 'error' | undefined
) => {
    return toast ({
        title: 'KingSpeed Staking',
        description: description,
        status: status,
        duration: 5000,
        position: 'bottom-right',
        isClosable: true,
    })
}