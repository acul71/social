import { ethers } from 'ethers'
import { getSigner } from './ethers-service'
//import { LENS_HUB_CONTRACT_ADDRESS,LENS_HUB_ABI } from './config'
import { LENS_HUB_CONTRACT, LENS_HUB_ABI } from './config'

// lens contract info can all be found on the deployed
// contract address on polygon.
// not defining here as it will bloat the code example
export const lensHub = new ethers.Contract(
  //LENS_HUB_CONTRACT_ADDRESS,
  LENS_HUB_CONTRACT,
  LENS_HUB_ABI,
  getSigner()
)