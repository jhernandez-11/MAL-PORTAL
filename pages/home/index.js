import React, { useEffect } from 'react';
import { codeChallenge, codeVerifier } from '../../lib/codeCV/index'

const Home = () => {
    function authButton() {
        if (typeof window !== "undefined") {
            window.location = `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=587861d7a056b9aec5a42e018f9bbad4&code_challenge=${codeChallenge}`
          }
    }

    function tokenButton() {
        let params;
        let code;
        if (typeof window === 'object') {
            params = new URLSearchParams(document.location.search.substring(1));
            code = params.get('code')
        }      
        
        const tokenReqestData = { 
            'client_id': '587861d7a056b9aec5a42e018f9bbad4',
            'client_secret': '25526f713050949977060cecc77b0bde5287ad6cff3f07b3b51474390a7ec8ec',
            'grant_type': 'authorization_code',
            code,
            'code_verifier': codeVerifier
        };  

        // Example POST method implementation:
        const postData = async () => {
            const res = await fetch('https://myanimelist.net/v1/oauth2/token', {
            method: 'POST',
            mode: 'no-cors', // no-cors, *cors, same-origin
            credentials: 'omit', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: JSON.stringify(tokenReqestData) // body data type must match "Content-Type" header
            });
            return res; // parses JSON response into native JavaScript objects
        }
        
        postData()
            .then(data => {
                console.log(data); // JSON data parsed by `data.json()` call
            });
    }

    return (
        <React.Fragment>
            <button id="authorize" onClick={authButton}>Authorize</button>
            <button id="token" onClick={tokenButton}>Get Token</button>
        </React.Fragment>
    )
}

export default Home