import LitJsSdk from 'lit-js-sdk'

const chain = "mumbai"

export const litEncryptStatic = async (content) => {

  // First, obtain an authSig from the use
  const authSig = await LitJsSdk.checkAndSignAuthMessage({chain: chain})

  // Next, pass the thing you want to encrypt
  const { encryptedString, symmetricKey } = await LitJsSdk.encryptString( content )
  console.log('[litEnctyptStatic] content=', content)
  console.log('[litEnctyptStatic] symmetricKey=', symmetricKey)
  console.log('[litEnctyptStatic] encryptedString=', encryptedString)

  // define the access control conditions where a user will be allowed to decrypt
  const accessControlConditions = [
    {
      contractAddress: '',
      standardContractType: '',
      chain: chain,
      method: 'eth_getBalance',
      parameters: [
        ':userAddress',
        'latest'
      ],
      returnValueTest: {
        comparator: '>=',
        value: '10000000000000'
      }
    }
  ]

  // Now, you can save the encryption key with the access control condition, 
  //which tells Lit Protocol that users that meet this access control condition should be able to decrypt.
  const encryptedSymmetricKey = await window.litNodeClient.saveEncryptionKey({
    accessControlConditions,
    symmetricKey,
    authSig,
    chain,
  })

  // You now need to save the accessControlConditions, encryptedSymmetricKey, and the encryptedString. 
  // You will present the accessControlConditions and encryptedSymmetricKey to obtain the decrypted symmetric key, 
  // which you can then use to decrypt the encryptedString.
  console.log('[litEncryptStatic] accessControlConditions=', accessControlConditions)
  console.log('[litEncryptStatic] encryptedSymmetricKey=', encryptedSymmetricKey)
  console.log('[litEncryptStatic] encryptedString=', encryptedString)

}

export const litDecryptStatic = async (accessControlConditions, encryptedSymmetricKey, encryptedString) => {
  // There are 2 steps - you must obtain the decrypted symmetric key from Lit Protocol, and then you must decrypt the string using it.

   // First, obtain an authSig from the user. This will ask their metamask to sign a message proving they own their crypto address. 
   // Pass the chain you're using.
  const authSig = await LitJsSdk.checkAndSignAuthMessage({chain: chain})

  // To obtain the decrypted symmetric key, use the code below:
  const symmetricKey = await window.litNodeClient.getEncryptionKey({
    accessControlConditions,
    // Note, below we convert the encryptedSymmetricKey from a UInt8Array to a hex string.  This is because we obtained the encryptedSymmetricKey from "saveEncryptionKey" which returns a UInt8Array.  But the getEncryptionKey method expects a hex string.
    toDecrypt: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16"),
    chain,
    authSig
  })

  // Now, decrypt the string:
  const decryptedString = await LitJsSdk.decryptString(
    encryptedString,
    symmetricKey
  )
  console.log('[litDecryptStatic] decryptedString=', decryptedString)
}