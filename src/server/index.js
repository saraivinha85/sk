import Http from 'http'
import SocketIO from 'socket.io'
import Express from 'express'
import Session from 'express-session'
import Random from 'random-array-generator'
import Passport from 'passport'
import Path from 'path'
import Uuid from 'uuid'
import Sleep from 'sleep'

import {expressAuth, socketioAuth, sessionOpts} from './auth'

import state from './state'

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
    // res.sendFile(Path.resolve(__dirname, '..', '..', 'build', 'index-client.html'))
    res.writeHead(302, {
        Location: 'http://localhost:3000/'
    })
    res.end()
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

let TRICKS = new Array(10).fill(null)

io.set('authorization', function (req, callback) {
    callback(null, req.isAuthenticated())
})

io.on('connection', (socket) => {
    console.log("Socket connected: " + socket.id)

    IO_CLIENTS.push(socket)
    const players = getCurrentPlayers()
    socket.emit('action', {type: 'USER_WELCOME', payload: socket.id})
    io.emit('action', {type: 'USER_JOIN', payload: { players: players }})

    socket.on('action', (action) => {
        console.log("Got action: " + action.type + " " + action.payload)

        switch (action.type) {
            case 'server/JOIN_QUEUE':
                return state.join(socket)
                    .then(() => {
                        return io.emit('action', {type: 'PLAYER_JOIN', payload: getPlayersInfo(state.players)})
                    })
                    .catch((error) => {
                        console.log(error)
                        return socket.emit('action', {type: 'ERROR', payload: "Can't join the game queue!"})
                    })
            case 'server/SUBMIT_COMMENT':
                return io.emit('action', {type: 'NEW_COMMENT', payload: {from: socket.request.user.displayName, photo: socket.request.user.image, text: action.payload, ts: new Date().toJSON()}})
            case 'server/LEAVE_QUEUE':
                return state.leave(socket)
                    .then(() => {
                        return io.emit('action', {type: 'PLAYER_LEAVE', payload: getPlayersInfo(state.players)})
                    })
                    .catch((error) => {
                        console.log(error)
                        return socket.emit('action', {type: 'ERROR', payload: "Can't leave the game queue!"})
                    })
            case 'server/START_GAME':
                return state.start().then(()=>{
                    io.emit('action', {type: 'ROUND_STARTED', payload: state.round.index})
                    return state.deal()
                }).then(() => {
                    return dealCardsForRound(state.players, state.round.index + 1)
                })
                .catch((error) => {
                    console.log(error)
                    return socket.emit('action', {type: 'ERROR', payload: "Can't start game!"})
                })
            case 'server/PLACE_BET':
                return state.bet(getPlayerIndex(socket, state.players), action.payload).then(() => {
                    if (state.is('setStarted')) {
                        io.emit('action', {type: 'SET_STARTED', payload: state.round.set.index})                        
                        io.emit('action', {type: 'BETS_IN_PLACE', payload: state.round.bets})
                        state.token = Uuid.v4()
                        const firstPlayer = state.players[state.first]
                        firstPlayer.emit('action', {type: 'PLAY', payload: state.token})
                        state.players.filter((p)=>p.id!==firstPlayer.id).forEach((p)=>{
                            p.emit('action', {type: 'WAIT_PLAY'})
                        })
                        return state.allowPlay() 
                    } else {
                        return
                    }
                }).catch((error) => {
                    console.log(error)
                    return socket.emit('action', {type: 'ERROR', payload: "Can't start game!"})
                })
            case 'server/PLAY_CARD':
                if (action.payload.token !== state.token) {
                    return
                }
                console.log('Played card', action.payload.id)
                return state.play(getPlayerIndex(socket, state.players), action.payload.id).then(() => {
                    console.log(state.round.set.plays)
                    io.emit('action', {type: 'CARD_PLAYED', payload: state.round.set.plays})
                    if (state.is('waitingPlays')) {
                        state.token = Uuid.v4()
                        state.first = ( state.first + 1 ) % state.players.length
                        const nextPlayer = state.players[state.first]
                        nextPlayer.emit('action', { type:'PLAY', payload: state.token })
                        state.players.filter((p)=>p.id!==nextPlayer.id).forEach((p)=>{
                            p.emit('action', {type: 'WAIT_PLAY'})
                        })
                    } else if (state.is('setEnded')) {
                        return state.nextSet().then(() => {
                            if (state.is('roundEnded')) {
                                Sleep.sleep(2)
                                io.emit('action', {type: 'SCORE', payload: state.score})
                                return state.nextRound()
                            }

                            Sleep.sleep(2)
                            io.emit('action', {type: 'SET_ENDED', payload: state.round.set.index})
                            
                            state.token = Uuid.v4()
                            const firstPlayer = state.players[state.first]
                            firstPlayer.emit('action', {type: 'PLAY', payload: state.token})
                            state.players.filter((p)=>p.id!==firstPlayer.id).forEach((p)=>{
                                p.emit('action', {type: 'WAIT_PLAY'})
                            })
                            return state.allowPlay() 
                        }).then(() => {
                            if (state.is('roundStarted')) {
                                io.emit('action', {type: 'ROUND_STARTED', payload: state.round.index})
                                return state.deal()
                            }
                        }).then(() => {
                            if (state.is('waitingBets')) {
                                return dealCardsForRound(state.players, state.round.index + 1)
                            }
                        }).catch((error) => {
                                    console.log(error)
                                    return socket.emit('action', {type: 'ERROR', payload: "Can't start game!"})

                        })
                    } 

                    return
                })
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
            io.emit('action', {type: 'USER_LEFT', payload: {players: players, leader: LEADER}})
        }
    })
})

const getPlayerIndex = (socket, players) => {
    return players.findIndex((c) => {return c.id === socket.id})
}

const getCurrentPlayers = () => {
    return IO_CLIENTS.map((c) => {return { id: c.id, name: c.request.user.displayName, photo: c.request.user.image}})
}

const getPlayersInfo = (players) => {
    return players.map((c) => {return { id: c.id, name: c.request.user.displayName, photo: c.request.user.image}})
}

const dealCardsForRound = (players, round) => {
    const cards = Random.randomArray({min: 0, max: 66, elements: round * players.length})
    players.forEach((c) => {
        console.log(cards)
        const hand = cards.splice(0, round)
        c.emit('action', {type: 'DEAL_CARDS', payload: hand})
    })
}

