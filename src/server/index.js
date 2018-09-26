import Http from 'http'
import SocketIO from 'socket.io'
import Express from 'express'
import Session from 'express-session'
import Random from 'random-array-generator'
import Passport from 'passport'
import Path from 'path'

import {expressAuth, socketioAuth, sessionOpts} from './auth'

const app = Express()
expressAuth(Passport)
app.use(Express.static(Path.resolve(__dirname, '..', '..', 'build')))
app.use(Session(sessionOpts))
app.use(Passport.initialize())
app.use(Passport.session())

const server = Http.createServer(app)

const io = SocketIO(server)
socketioAuth(io)

const isAuthenticated = (req, res, next) => { return req.isAuthenticated()? next() : res.redirect('/auth/google') }

app.get('/', isAuthenticated, (req, res) => {
    res.sendFile(Path.resolve(__dirname, '..', '..', 'build', 'index-client.html'))
})

app.get('/error', (req, res) => {
    res.status(404)
})

app.get('/auth/google', Passport.authenticate('google', {
    scope: [ 'profile' ]
}))

app.get('/auth/google/callback',
    Passport.authenticate('google', {
        failureRedirect: '/error'
    }),
    (req, res) => {
        res.redirect('/')
    }
)

server.listen(3001, () => {
    console.log('Server is running on port 3001')
})

const IO_CLIENTS = []
let BETS = []
let ROUND = 1
let LEADER = null
let ROUND_CARDS = []
let SET_COUNT = 1

io.set('authorization', function (req, callback) {
    callback(null, req.isAuthenticated())
})

io.on('connection', (socket) => {
    console.log("Socket connected: " + socket.id)

    IO_CLIENTS.push(socket)
    const players = getCurrentPlayers()

    if (LEADER === null) {
        LEADER = socket.id
    }

    socket.emit('action', {type: 'WELCOME_PLAYER', payload: socket.id})
    io.emit('action', {type: 'PLAYER_JOIN', payload: { players: players, leader: LEADER}})

    socket.on('action', (action) => {
        console.log("Got action: " + action.type + " " + action.payload)

        switch (action.type) {
            case 'server/START_ROUND':
                BETS = new Array(IO_CLIENTS.length)
                BETS.fill(null)
                ROUND_CARDS = new Array(IO_CLIENTS.length)
                ROUND_CARDS.fill(null)
                dealCardsForRound(ROUND++ % 11)
                return
            case 'server/PLACE_BET':
                BETS[getPlayerIndex(socket)] = action.payload
                if (BETS.findIndex((b) => {return b === null}) === -1) {
                    console.log('All players bet')
                    io.emit('action', {type: 'BETS_IN_PLACE', payload: BETS})
                }
                return
            case 'server/PLAY_CARD':
                ROUND_CARDS[getPlayerIndex(socket)] = action.payload
                if (ROUND_CARDS.findIndex((b) => {return b === null}) === -1) {
                    console.log('All players played. Computing score...')
                    io.emit('action', {type: 'TRICK_SCORE', payload: ROUND_CARDS})
                    SET_COUNT++
                }

                if (SET_COUNT > ROUND) {
                    io.emit('action', {type: 'NEXT_ROUND', payload: { leader: ''}})
                }

                return
            default:
                return
        }
    })

    socket.on('disconnect', () => {
        console.log("Socket disconnected: " + socket.id)
        const idx = IO_CLIENTS.indexOf(socket)
        IO_CLIENTS.splice(idx, 1)
        const players = getCurrentPlayers()
        if(LEADER === socket.id && players.length > 0) {
            LEADER = players[0].id 
        }

        if (players.length>0) {
            io.emit('action', {type: 'PLAYER_LEFT', payload: {players: players, leader: LEADER}})
        }
    })
})

const getPlayerIndex = (socket) => {
    return IO_CLIENTS.findIndex((c) => {return c.id === socket.id})
}

const getCurrentPlayers = () => {
	return IO_CLIENTS.map((c) => {return { id: c.id, name: c.request.user.displayName, photo: c.request.user.image}})
}

const dealCardsForRound = (round) => {
    const cards = Random.randomArray({min: 0, max: 65, elements: round * IO_CLIENTS.length})
    IO_CLIENTS.forEach((c) => {
        console.log(cards)
        const hand = cards.splice(0, round)
        c.emit('action', {type: 'DEAL_CARDS', payload: hand})
    })
}

