import { extendTheme, ThemeConfig } from "@chakra-ui/react";
import { mode } from '@chakra-ui/theme-tools'
const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
}

const styles = {
    global: (props: any) => ({
        body: {
            bg: mode('#ffffff', '#000000')(props),
            fontFamily: 'Rajdhani !important',
        },
        '*:focus': {
            boxShadow: 'none !important',
        },
    }),
}

// 3. extend the theme
const theme = extendTheme({ config, styles })
export default theme