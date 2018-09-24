import {Strategy} from 'passport-google-oauth2'
import HttpsProxyAgent from 'https-proxy-agent'

const auth = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user)
    })

    passport.deserializeUser((user, done) => {
        done(null, user)
    })

    const extractProfile = (profile) => {
        let imageUrl = '';
        if (profile.photos && profile.photos.length) {
            imageUrl = profile.photos[0].value;
        }
        return {
            id: profile.id,
            displayName: profile.displayName,
            image: imageUrl
        };
    }

    const strategy = new Strategy({
        clientID: '133681555774-t2f5c8fmeiq1nhrhgkbols9se7m8slnp.apps.googleusercontent.com',
        clientSecret: 'N6nN83NytqfXmf3W2ZcF3ViD',
        callbackURL: '/auth/google/callback'
    }, (accessToken, refreshToken, profile, cb) => {
        cb(null, extractProfile(profile))
    })

    const proxy = new HttpsProxyAgent('http://localhost:3128')
    strategy._oauth2.setAgent(proxy)

    passport.use(strategy)
}

export default auth
