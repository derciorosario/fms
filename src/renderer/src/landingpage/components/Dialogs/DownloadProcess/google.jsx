import React, { useRef } from 'react'
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

function GoogleLogin() {
const onSuccessRef = useRef(null);

  return (
    <div>  
<GoogleLogin
  onSuccess={credentialResponse => {
    const decoded = [] //jwtDecode(credentialResponse);
    console.log({credentialResponse,decoded});
  }}
  onError={() => {
    console.log('Login Failed');
  }}
/>;
    </div>
  )
}

export default GoogleLogin