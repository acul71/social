import { Button, Image, Stack} from '@chakra-ui/react'
import { ErrorBox } from './Error'
import { login } from '../login-user'




export const Auth = (props) => {
  // Just stubs for now
  let authError = false
  let isAuthenticating = false
  
  return (
    <Stack spacing={6}>
      {authError &&
        <ErrorBox title='Authentication has failed' message={authError.message} />
      }
      
      <Button isLoading={isAuthenticating} onClick={ () => {login(props.setAuthenticated, props.setSignerAddress)} }>
          Authenticate via Metamask
      </Button>
    </Stack>
  )
}

/*
<Image boxSize="15px" src="logo.svg" alt="Social Logo"/>
*/