import * as AuthSession from 'expo-auth-session';

const useProxy = Platform.select({ web: false, default: true });
const redirectUrl = AuthSession.makeRedirectUri({ useProxy });
console.log('redirectUrl: ', redirectUrl);

async function createTokenWithCode(clientIdSecret, code) {
    const url = `https://github.com/login/oauth/access_token` +
        `?client_id=${clientIdSecret.id}` +
        `&client_secret=${clientIdSecret.secret}` +
        `&code=${code}`;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    });
    return res.json();
}
const signInWithGoogle = async (authDomain, clientIdSecret, googleScopeFields) => {
    const authUrl = `${authDomain}/authorize` +
        `?client_id=${clientIdSecret.id}` +
        `&redirect_uri=${encodeURIComponent(redirectUrl)}` +
        `&scope=${encodeURIComponent(googleScopeFields.join(' '))}`
    const {type, params} = await AuthSession.startAsync({authUrl});
    console.log('signInWithGoogle: A: ', { type, params });

    if (type === 'success') {
        const { token_type, scope, access_token } = await createTokenWithCode(clientIdSecret, params.code);
        console.log('signInWithGoogle: B: ', { token_type, scope, access_token, });
        return access_token;
    }
};

export default signInWithGoogle;