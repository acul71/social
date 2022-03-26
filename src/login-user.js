import { generateChallenge } from './generate-challenge'
import { authenticate } from './authenticate'
import { ethers } from 'ethers'

export const login = async (setAuthenticated, setSignerAddress) => {
  // Connect wallet
  const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
  //await ethersProvider.send("eth_requestAccounts", [])
  const signer = ethersProvider.getSigner()
  console.log('[login-user.js] signer=', signer)
  
  


  // we grab the address of the connected wallet
  const address = await signer.getAddress()
  setSignerAddress(address)
  console.log('[login-user.js] address=', address)
  
  // we request a challenge from the server
  const challengeResponse = await generateChallenge(address);
  
  // sign the text with the wallet
  //const signature = await signText(challengeResponse.data.challenge.text)
  const signature = await signer.signMessage(challengeResponse.data.challenge.text)
  
  const accessTokens = await authenticate(address, signature);
  console.log(accessTokens);
  localStorage.setItem('auth_token', accessTokens.data.authenticate.accessToken)  
  setAuthenticated(true)

  // you now have the accessToken and the refreshToken
  // {
  //  data: {
  //   authenticate: {
  //    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjB4YjE5QzI4OTBjZjk0N0FEM2YwYjdkN0U1QTlmZkJjZTM2ZDNmOWJkMiIsInJvbGUiOiJub3JtYWwiLCJpYXQiOjE2NDUxMDQyMzEsImV4cCI6MTY0NTEwNjAzMX0.lwLlo3UBxjNGn5D_W25oh2rg2I_ZS3KVuU9n7dctGIU",
  //    refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjB4YjE5QzI4OTBjZjk0N0FEM2YwYjdkN0U1QTlmZkJjZTM2ZDNmOWJkMiIsInJvbGUiOiJyZWZyZXNoIiwiaWF0IjoxNjQ1MTA0MjMxLCJleHAiOjE2NDUxOTA2MzF9.2Tdts-dLVWgTLXmah8cfzNx7sGLFtMBY7Z9VXcn2ZpE"
  //   }
  // }
}