import {Strategy} from 'passport-google-oauth2'
import HttpsProxyAgent from 'https-proxy-agent'
import { MemoryStore } from 'express-session'
import PassportSocketIO from 'passport.socketio'
import cookieParser from 'cookie-parser'

const sessionStore = new MemoryStore()

export const expressAuth = (passport) => {
    passport.serializeUser((user, done) => {
        done(null, user)
    })

    passport.deserializeUser((user, done) => {
        done(null, user)
    })

    const strategy = googleStrategy() 
    // setProxy(strategy)
    passport.use(strategy)
}

export const socketioAuth = (socketio) => {
    socketio.use(PassportSocketIO.authorize(passportAuthorizeConfig))
}

const extractProfile = (profile) => {
    let imageUrl = ''
    if (profile.photos && profile.photos.length) {
        imageUrl = profile.photos[0].value
    }
    return {
        id: profile.id,
        displayName: profile.displayName,
        image: imageUrl
    }
}

const googleStrategy = () => {
    return new Strategy({
        clientID: '133681555774-t2f5c8fmeiq1nhrhgkbols9se7m8slnp.apps.googleusercontent.com',
        clientSecret: 'N6nN83NytqfXmf3W2ZcF3ViD',
        callbackURL: '/auth/google/callback'
    }, (accessToken, refreshToken, profile, cb) => {
        cb(null, extractProfile(profile))
    })
}

export const sessionOpts = {
    key: 'connect.sid',
    store: sessionStore,
    secret: 'test',
    resave: true,
    saveUninitialized: true
}

const passportAuthorizeConfig = {
    cookieParser: cookieParser,
    key: sessionOpts.key,
    secret: sessionOpts.secret,
    store: sessionOpts.store,
    success: (data, accept) => {
        console.log('Successful connection to socket.io')
        accept()
    },
    fail: (data, message, error, accept) => {
        accept(new Error("404"))
    }
}

const setProxy = (strategy) => {
    const proxy = new HttpsProxyAgent('http://localhost:3128')
    strategy._oauth2.setAgent(proxy)
}

