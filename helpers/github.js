import * as AuthSession from 'expo-auth-session';

const useProxy = Platform.select({ web: false, default: true });
const redirectUrl = AuthSession.makeRedirectUri({ useProxy });
console.log('redirectUrl: ', redirectUrl);

async function createTokenWithCode(github, code) {
    const url =
        `https://github.com/login/oauth/access_token` +
        `?client_id=${github.id}` +
        `&client_secret=${github.secret}` +
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
const signInWithGitHub = async (auth0Domain, github, githubFields) => {
    const authUrl = `${auth0Domain}/authorize` +
        `?client_id=${github.id}` +
        `&redirect_uri=${encodeURIComponent(redirectUrl)}` +
        `&scope=${encodeURIComponent(githubFields.join(' '))}`
    const {type, params} = await AuthSession.startAsync({authUrl});

    console.log('getGithubTokenAsync: A: ', { type, params });
    if (type === 'success') {
        const { token_type, scope, access_token } = await createTokenWithCode(github, params.code);
        console.log('signInWithGithub: B: ', { token_type, scope, access_token, });
        return access_token;
    }
};

export default signInWithGitHub;