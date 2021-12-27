import React from "react";
import { Box, Flex, Spinner } from "@chakra-ui/react";

export default function ModalOverlay() {
    return (
        <Box
            position="fixed"
            top="0"
            left="0"
            h="100%"
            w="100%"
            bg="rgba(0,0,0,0.6)"
            overflow="auto"
            transform="all 0.3s"
        >
            <Box
                position="absolute"
                left="50%"
                top="50%"
                transform="translate(-50%,-50%)"
                zIndex="1000"
            >
                <Box textAlign="center">
                    <Spinner
                        color="red.500"
                        size="lg"
                        thickness="4px"
                        emptyColor="#c3fb12"
                        speed="0.65s"
                    />
                    <Box fontWeight="600" fontSize="1.2rem">
                        Now loading ...
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}