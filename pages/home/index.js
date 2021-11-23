import axios from 'axios';
import qs from 'qs';
import React, { useEffect } from 'react';

const Home = () => {
    if (typeof window !== "undefined") {
        // GENERATING CODE VERIFIER
        function dec2hex(dec) {
            return ("0" + dec.toString(16)).substr(-2);
        }

        function generateCodeVerifier() {
            var array = new Uint32Array(56 / 2);
            window.crypto.getRandomValues(array);
            return Array.from(array, dec2hex).join("");
        }
        
        // GENERATING CODE CHALLENGE FROM VERIFIER
        function sha256(plain) {
            // returns promise ArrayBuffer
            const encoder = new TextEncoder();
            const data = encoder.encode(plain);
            return window.crypto.subtle.digest("SHA-256", data);
        }
        
        function base64urlencode(a) {
            var str = "";
            var bytes = new Uint8Array(a);
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
            str += String.fromCharCode(bytes[i]);
            }
            return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
        }
        
        async function generateCodeChallengeFromVerifier(v) {
            var hashed = await sha256(v);
            var base64encoded = base64urlencode(hashed);
            return base64encoded;
        }
        async function getCodeChallenge() {
            let codeVerifier = document.getElementById("code_verifier").value;
            try {
            let code_challenge = await generateCodeChallengeFromVerifier(codeVerifier);
            document.getElementById("code_challenge").value = code_challenge;
            } catch (e) {
            document.getElementById("code_challenge").value = JSON.stringify(e);
            }
        }
        
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        var clientId = '587861d7a056b9aec5a42e018f9bbad4'
        var clientSecret = '25526f713050949977060cecc77b0bde5287ad6cff3f07b3b51474390a7ec8ec'
        var codeVerifier = generateCodeVerifier()
        var codeChallenge;
        
        async function codeChallengeFunction() {
            try {
            let code_challenge = await generateCodeChallengeFromVerifier(codeVerifier);
            return code_challenge;
            } catch (e) {
            return JSON.stringify(e);
            }
        }
        
        codeChallengeFunction().then((res) => {
            codeChallenge = res
            return res
        })
    }

    function authButton() {
        if (typeof window !== "undefined") {
            window.location = `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${clientId}&code_challenge=${codeChallenge}`
          }
    }

    function tokenButton() {
        let params;
        let code;
        if (typeof window === 'object') {
            params = new URLSearchParams(document.location.search.substring(1));
            code = params.get('code')
        }
        
    
        const data = { 
        'title': 'MAL PORTAL',
        'body': 'mal portal postreq',
        'client_id': clientId,
        'client_secret': clientSecret,
        'grant_type': 'authorization_code',
        code,
        'code_verifier': codeVerifier
        };            

        const options = {
            method: 'POST',
            headers: { 'content-type': 'application/x-www-form-urlencoded'},
            data: qs.stringify(data),
            url: 'https://myanimelist.net/v1/oauth2/token'
        };

        axios(options).then((res) => {
            console.log(res)
        })
    }

    return (
        <React.Fragment>
            <button id="authorize" onClick={authButton}>Authorize</button>
            <button id="token" onClick={tokenButton}>Get Token</button>
        </React.Fragment>
    )
}

export default Home