import { signedTypeData, getAddressFromSigner, splitSignature } from './ethers-service';
import { createPostTypedData } from './create-post-typed-data';
import { lensHub } from './lens-hub';
import { uploadIpfs } from './ipfs'
export const createPost = async (profileId, postTitle, postContent) => {

  /*
  // hard coded to make the code example clear
  const createPostRequest = {
    profileId: "0x03",
    contentURI: "ipfs://QmPogtffEF3oAbKERsoR4Ky8aTvLgBF5totp5AuF8YN6vl.json",
    collectModule: {
        timedFeeCollectModule: {
            amount: {
               currency: "0xD40282e050723Ae26Aeb0F77022dB14470f4e011",
               value: "0.01"
             },
             recipient: "0xEEA0C1f5ab0159dba749Dc0BAee462E5e293daaF",
             referralFee: 10.5
         }
    },
    referenceModule: {
        followerOnlyReferenceModule: false
    }
  };
  */    


  const ipfsResult = await uploadIpfs(postTitle, postContent)

  const createPostRequest = {
    profileId,
    contentURI: 'ipfs://' + ipfsResult.path,
    //contentURI: 'ipfs://QmPtyPRVkapmAhZCxnRygvRURa5p4SAb1yNWMvQARx6NDb' ,
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


  const result = await createPostTypedData(createPostRequest);
  const typedData = result.data.createPostTypedData.typedData;
  
  const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value);
  const { v, r, s } = splitSignature(signature);
  
  const tx = await lensHub.postWithSig({
    profileId: typedData.value.profileId,
    contentURI:typedData.value.contentURI,
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
  console.log(tx.hash);
  // 0x64464dc0de5aac614a82dfd946fc0e17105ff6ed177b7d677ddb88ec772c52d3
  // you can look at how to know when its been indexed here: 
  //   - https://docs.lens.dev/docs/has-transaction-been-indexed
}