import React from 'react';
import { useState, useEffect } from 'react'
import { Routes, Route, Link as ReactLink } from "react-router-dom"
import {
  ChakraProvider,
  Box,
  Text,
  VStack,
  HStack,
  Link,
  Code,
  Button,
  Grid,
  theme,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';

import { login } from './login-user'
import { Auth } from './components/Auth'
import { Footer } from './components/Footer'
import { GetProfiles } from './components/GetProfiles'
import { Home } from './components/Home'
import LitJsSdk from 'lit-js-sdk'

const LitInit = async () => {
  const client = new LitJsSdk.LitNodeClient()
  await client.connect()
  window.litNodeClient = client
  console.log('LitInit: client=', client)
}

function App() {
  const [authenticated, setAuthenticated] = useState(false)
  const [signerAddress, setSignerAddress] = useState(null)

  LitInit()
  
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="1vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          
          { !authenticated &&
              <VStack spacing={20}>
                <Auth setAuthenticated={setAuthenticated} setSignerAddress={setSignerAddress}/>
              </VStack> 
          }

          { authenticated &&
            <Box>
              <HStack mb="5"><nav><Link as={ReactLink} to="/">Home</Link> <Link as={ReactLink} to="/profiles">Profiles</Link></nav></HStack>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="profiles" element={<GetProfiles signerAddress={signerAddress}/>} />
              </Routes>
            </Box>
          }
          
          <Footer/>
          
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
