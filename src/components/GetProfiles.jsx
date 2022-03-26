import React from 'react'
import PropTypes from 'prop-types'
import { Box, Text, HStack, Button, Heading } from '@chakra-ui/react';

import { apolloClient } from '../apollo-client';
// this is showing you how you use it with react for example
// if your using node or something else you can import using
// @apollo/client/core!
import { gql, useQuery } from '@apollo/client'


const GET_PROFILES = gql`
  query($request: ProfileQueryRequest!) {
    profiles(request: $request) {
      items {
        id
        name
        bio
        location
        website
        twitterUrl
        picture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
          __typename
        }
        handle
        coverPicture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
          __typename
        }
        ownedBy
        depatcher {
          address
          canUseRelay
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
                symbol
                name
                decimals
                address
              }
              value
            }
            recipient
          }
          __typename
        }
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }
`

export const getProfiles = (request) => {
   return apolloClient.query({
    query: gql(GET_PROFILES),
    variables: {
      request
    },
  })
}



const ProfileBox = (props) => {
  
  const bio = props.bio == null ? '' : props.bio.length < 20 ? props.bio : props.bio.substring(0,17) + '...'
  return (
    <Box mt="2" maxW='sm' borderWidth='1px' borderRadius='lg' overflow='hidden'>
      <HStack p="1">
        <Box fontWeight='semibold'>ID: </Box><Box>{props.id}</Box>&ensp;
        <Box fontWeight='semibold'>Name:</Box> <Box>{props.name}</Box>
        <Button>Sel</Button>
      </HStack>
      <HStack p="1"><Box fontWeight='semibold'>Bio: </Box><Box>{bio}</Box></HStack>
    </Box>
  )
}




export const GetProfiles = (props) => {
  const request = { ownedBy: [props.signerAddress], limit: 10 }
  const { loading, error, data } = useQuery(GET_PROFILES, {variables: { request },  client: apolloClient })
  if (loading) return 'Loading...';
  if (error) { 
    console.log('[GetProfiles.jsx] error=', JSON.stringify(error, null, 2))
    return `Error! ${error.message}`
  }

  console.log('[GetProfiles.jsx] data=', data)

  
  return (
    <Box>
      <Heading fontSize='x-large'>Profiles:</Heading>
      <Box align="center">
        {
          data.profiles.items.map(
            (val, idx) =>  
              <ProfileBox 
                key={val.id}
                id={val.id}
                name={val.name}
                bio={val.bio}
              />
            
          )
        }
      </Box>
      <Box mt="8">
        <Button>New Profile</Button>
      </Box>
    </Box>
  )
}

GetProfiles.propTypes = {}


