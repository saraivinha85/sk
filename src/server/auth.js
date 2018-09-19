import {OAuth2Strategy} from 'passport-google-oauth'

const auth = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user)
    })

    passport.deserializeUser((user, done) => {
        done(null, user)
    })

    passport.use(
        new OAuth2Strategy({
            clientID: '610635911505-rovnunkkfha4p5sb95v0gpk2dmqau2k0.apps.googleusercontent.com',
            clientSecret: 'zm-1dCxv0SsZICCe07m-IvWG',
            callbackURL: ''
        }, (token, refreshToken, profile, done) => {
            return done(null, {
                profile: profile,
                token: token
            })
        }))
}

export default auth
