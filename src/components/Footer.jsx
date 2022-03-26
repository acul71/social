import { Container } from "@chakra-ui/layout"
import { Image, Box } from '@chakra-ui/react'
import { Text } from "@chakra-ui/react"

export const Footer = () => {
  return(
    <Container align="center" mt="100">
      <Box borderWidth="0px">
        <Image boxSize="10px" src="logo.svg" alt="Social Logo" align="top"/>
        <Text fontSize="xs">Social by PL</Text>
      </Box>
      <Text fontSize="xs">Made with LENS PROTOCOL</Text>
    </Container>
  )
}