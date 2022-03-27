import React from 'react'
import PropTypes from 'prop-types'
import { Box, Text, HStack, Button, Heading, FormControl, FormLabel, Input, Textarea } from '@chakra-ui/react';

import { apolloClient } from '../apollo-client';
// this is showing you how you use it with react for example
// if your using node or something else you can import using
// @apollo/client/core!
import { gql, useQuery, useMutation } from '@apollo/client'

import dateFormat, { masks } from "dateformat"
import { createPost } from '../create-post'
//import { litEncryptStatic, litDecryptStatic } from '../litEncryptStatic'

// --------------------- LIT TEST
import LitJsSdk from 'lit-js-sdk'
const chain = "mumbai"
let GaccessControlConditions; 
let GencryptedSymmetricKey; 
let GencryptedString; 

const litEncryptStatic = async (content) => {

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
        //value: '10000000000000'
        //value: '100000000000000000000' // 100 Eth
        value: '1000000000000000000' // 1 Eth
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

  // TEST LID
  GaccessControlConditions = accessControlConditions
  GencryptedSymmetricKey = encryptedSymmetricKey
  GencryptedString = encryptedString
}

const litDecryptStatic = async (accessControlConditions, encryptedSymmetricKey, encryptedString) => {
  // TEST LIT
  accessControlConditions = GaccessControlConditions
  encryptedSymmetricKey = GencryptedSymmetricKey
  encryptedString = GencryptedString


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



// -------------------- END LIT TEST


const GET_PUBLICATIONS = gql`
  query($request: PublicationsQueryRequest!) {
    publications(request: $request) {
      items {
        __typename 
        ... on Post {
          ...PostFields
        }
        ... on Comment {
          ...CommentFields
        }
        ... on Mirror {
          ...MirrorFields
        }
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }

  fragment MediaFields on Media {
    url
    mimeType
  }

  fragment ProfileFields on Profile {
    id
    name
    bio
    location
    website
    twitterUrl
    handle
    picture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        verified
      }
      ... on MediaSet {
        original {
          ...MediaFields
        }
      }
    }
    coverPicture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        verified
      }
      ... on MediaSet {
        original {
          ...MediaFields
        }
      }
    }
    ownedBy
    depatcher {
      address
    }
    stats {
      totalFollowers
      totalFollowing
      totalPosts
      totalComments
      totalMirrors
      totalPublications
      totalCollects
    }
    followModule {
      ... on FeeFollowModuleSettings {
        type
        amount {
          asset {
            name
            symbol
            decimals
            address
          }
          value
        }
        recipient
      }
    }
  }

  fragment PublicationStatsFields on PublicationStats { 
    totalAmountOfMirrors
    totalAmountOfCollects
    totalAmountOfComments
  }

  fragment MetadataOutputFields on MetadataOutput {
    name
    description
    content
    media {
      original {
        ...MediaFields
      }
    }
    attributes {
      displayType
      traitType
      value
    }
  }

  fragment Erc20Fields on Erc20 {
    name
    symbol
    decimals
    address
  }

  fragment CollectModuleFields on CollectModule {
    __typename
    ... on EmptyCollectModuleSettings {
      type
    }
    ... on FeeCollectModuleSettings {
      type
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
    }
    ... on LimitedFeeCollectModuleSettings {
      type
      collectLimit
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
    }
    ... on LimitedTimedFeeCollectModuleSettings {
      type
      collectLimit
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
      endTimestamp
    }
    ... on RevertCollectModuleSettings {
      type
    }
    ... on TimedFeeCollectModuleSettings {
      type
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
      endTimestamp
    }
  }

  fragment PostFields on Post {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ... on FollowOnlyReferenceModuleSettings {
        type
      }
    }
    appId
  }

  fragment MirrorBaseFields on Mirror {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ... on FollowOnlyReferenceModuleSettings {
        type
      }
    }
    appId
  }

  fragment MirrorFields on Mirror {
    ...MirrorBaseFields
    mirrorOf {
     ... on Post {
        ...PostFields          
     }
     ... on Comment {
        ...CommentFields          
     }
    }
  }

  fragment CommentBaseFields on Comment {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ... on FollowOnlyReferenceModuleSettings {
        type
      }
    }
    appId
  }

  fragment CommentFields on Comment {
    ...CommentBaseFields
    mainPost {
      ... on Post {
        ...PostFields
      }
      ... on Mirror {
        ...MirrorBaseFields
        mirrorOf {
          ... on Post {
             ...PostFields          
          }
          ... on Comment {
             ...CommentMirrorOfFields        
          }
        }
      }
    }
  }

  fragment CommentMirrorOfFields on Comment {
    ...CommentBaseFields
    mainPost {
      ... on Post {
        ...PostFields
      }
      ... on Mirror {
         ...MirrorBaseFields
      }
    }
  }
`





const Posts = () => {
  const profileId = localStorage.getItem('ProfileId') || "0x01"

  const request = {
    //profileId: "0x01",
    //profileId: "0x01e0",
    profileId: profileId,
    //publicationTypes: [POST, COMMENT, MIRROR],
    publicationTypes: ["POST"],
    limit: 10
  }
  const { loading, error, data } = useQuery(GET_PUBLICATIONS, {variables: { request },  client: apolloClient })
  if (loading) return 'Loading...';
  if (error) { 
    console.log('[Home.jsx] error=', JSON.stringify(error, null, 2))
    return `Error! ${error.message}`
  }

  console.log('[Home.jsx] data=', data)

  const PostBox = (props) => {
    const postDate = new Date(props.createdAt)
    const postDateF = dateFormat(postDate)
    return (
      <Box p="1" mt="2" maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
        <Box fontSize="sm">{postDateF}</Box>
        <HStack p="1">
          <Box fontWeight='semibold'>Author: </Box><Box>{props.profile.handle} ({props.profile.name})</Box>  
        </HStack>
        
        <Box mb="0" fontWeight='semibold' fontSize="x-large">{props.metadata.name}</Box>
        <Textarea readOnly fontSize="md" p="1" mt="0" maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden' value={props.metadata.content} />
      </Box>
    )
  }

  return(
    <Box align="center">
      {
        data.publications.items.map(
          (val, idx) =>
            <PostBox 
              key={val.id}
              profile={val.profile}
              metadata={val.metadata}
              createdAt={val.createdAt}
            />
          
        )
      }
    </Box>
  )
}
















/*
-----------------------------------------------------------------------------------------------------------------------------------

New Post stuff

-----------------------------------------------------------------------------------------------------------------------------------
*/




const CREATE_POST_TYPED_DATA = gql`
  mutation($request: CreatePublicPostRequest!) { 
    createPostTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          PostWithSig {
            name
            type
          }
        }
      domain {
        name
        chainId
        version
        verifyingContract
      }
      value {
        nonce
        deadline
        profileId
        contentURI
        collectModule
        collectModuleData
        referenceModule
        referenceModuleData
      }
    }
  }
}
`;




 
const NewPost = () => {
  const postTitle = React.createRef()
  const postContent = React.createRef()
  const profileId = localStorage.getItem('ProfileId') || "0x01"

  /*
  const createPostRequest = {
    profileId,
    //contentURI: 'ipfs://' + ipfsResult.path,
    contentURI: 'ipfs://QmPtyPRVkapmAhZCxnRygvRURa5p4SAb1yNWMvQARx6NDb' ,
    collectModule: {
      // feeCollectModule: {
      //   amount: {
      //     currency: currencies.enabledModuleCurrencies.map(
      //       (c: any) => c.address
      //     )[0],
      //     value: '0.000001',
      //   },
      //   recipient: address,
      //   referralFee: 10.5,
      // },
      revertCollectModule: true,
      // limitedFeeCollectModule: {
      //   amount: {
      //     currency: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
      //     value: '2',
      //   },
      //   collectLimit: '20000',
      //   recipient: '0x3A5bd1E37b099aE3386D13947b6a90d97675e5e3',
      //   referralFee: 0,
      // },
    },
    referenceModule: {
      followerOnlyReferenceModule: false,
    },
  };
  */

  const postIt = async () => {
    console.log('post clicked! postTitle=', postTitle.current.value, ' postContent=', postContent.current.value)

    await createPost(profileId, postTitle.current.value, postContent.current.value)

    console.log('createPost Done!')

/*
    const result = await createPostTypedData(createPostRequest);
    console.log('create post: createPostTypedData', result);

    const typedData = result.data.createPostTypedData.typedData;
    console.log('create post: typedData', typedData);

    const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
    console.log('create post: signature', signature);

    const { v, r, s } = splitSignature(signature);

    const tx = await lensHub.postWithSig({
      profileId: typedData.value.profileId,
      contentURI: typedData.value.contentURI,
      collectModule: typedData.value.collectModule,
      collectModuleData: typedData.value.collectModuleData,
      referenceModule: typedData.value.referenceModule,
      referenceModuleData: typedData.value.referenceModuleData,
      sig: {
        v,
        r,
        s,
        deadline: typedData.value.deadline,
      },
    });
    console.log('create post: tx hash', tx.hash);
  */
  }



  return(
    <Box align="center">
    <Box p="2" mb="5" maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
      <FormControl isRequired>
        <FormLabel mb="0" htmlFor='post-title'>Title</FormLabel>
        <Input ref={postTitle} id='post-title' placeholder='Post title' />
        <FormLabel mb="0" mt="3" htmlFor='post-content'>Content</FormLabel>
        <Textarea ref={postContent} id='post-content' placeholder='Post content' />
        <Button size='xs' onClick={ () => postIt()}>Post</Button>
      </FormControl>
      
    </Box>
    </Box>
  )
}

export const Home = (props) => {
  
  return (
    <Box>
      <Button onClick={ () => litEncryptStatic('My Secret Content')}>LIT Encrypt</Button>
      <Button onClick={ () => litDecryptStatic()}>LIT Decrypt</Button>
      
      <NewPost />
      <Posts />
    </Box>
  )
}

Home.propTypes = {}