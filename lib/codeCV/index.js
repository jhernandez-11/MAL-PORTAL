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

export { codeChallenge, codeVerifier }