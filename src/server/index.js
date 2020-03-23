import Http from 'http'
import SocketIO from 'socket.io'
import Express from 'express'
import Session from 'express-session'
import Random from 'random-array-generator'
import Passport from 'passport'
import Path from 'path'
import Uuid from 'uuid'
import Wait from 'wait-for-stuff'

import {expressAuth, socketioAuth, sessionOpts} from './auth'

import State from './state'
import cards from '../cards'

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
    if (process.env.NODE_ENV==='production') {
        res.sendFile(Path.resolve(__dirname, '..', '..', 'build', 'index-client.html'))
    } else {
        res.writeHead(302, {
            Location: 'http://localhost:3000/'
        })
        res.end()
    }
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

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
    console.log('Server is running on port 3001')
})

const IO_CLIENTS = []

let state = State()

io.set('authorization', function (req, callback) {
    callback(null, req.isAuthenticated())
})

io.on('connection', (socket) => {
    console.log("Socket connected: " + socket.request.user.id)
    IO_CLIENTS.push(socket)

    const existingPlayerIdx = state.players.findIndex((p) => p.request.user.id === socket.request.user.id)
    if (existingPlayerIdx>=0) {
        console.log("Already connected", state.players[existingPlayerIdx].connected)
        if (state.players[existingPlayerIdx].connected) {
            socket.emit('action', {type: 'ERROR', payload: "Already connected!"})
            console.log('Already connected')
            return
        }

        state.players[existingPlayerIdx] = socket

        let payload = {
            id: socket.request.user.id,
            users: getPlayersInfo(IO_CLIENTS),
            players: getPlayersInfo(state.players),
            first: state.players[state.first].request.user.id,
            score: state.score,
            token: (state.currentIdx === existingPlayerIdx)? state.token : null,
            canPlay: false,
            bet: null,
            bets: [],
            cards: []
        }

        switch(state.current) {
            case 'end':
            case 'roundEnded':
            case 'setStarted':
            case 'setEnded':
            case 'waitingPlays':
                payload.canPlay = (state.currentIdx === existingPlayerIdx)
                payload.cards = state.round.set.plays 
            case 'setStarted':
                payload.set = state.round.set.index
                payload.bets = state.round.bets
            case 'waitingBets':
                payload.bet = state.round.bets[existingPlayerIdx]
            case 'roundStarted':
                payload.round = state.round.index
                payload.hand = state.round.hand[existingPlayerIdx]
        }

        socket.emit('action', {type: 'RECOVER', payload: payload})
        io.emit('action', {type: 'PLAYER_RECONNECT'})
    } else {
        socket.emit('action', {type: 'USER_WELCOME', payload: {id: socket.request.user.id, players: getPlayersInfo(state.players)}})
        io.emit('action', {type: 'USER_JOIN', payload: getCurrentUsers()})
    }

    socket.on('action', (action) => {
        console.log("Got action: " + action.type + " " + action.payload)

        switch (action.type) {
            case 'server/JOIN_QUEUE':
                if (state.players.length === 6) {
                    return socket.emit('action', {type: 'ERROR', payload: "Cannot join because maximum players in queue was reached!"}) 
                } else if (state.current !== 'lobby') {
                    return socket.emit('action', {type: 'ERROR', payload: "Game already in progress :("}) 
                }

                return state.join(socket)
                    .then(() => {
                        const playersInfo = getPlayersInfo(state.players)
                        console.log("JOIN_QUEUE", playersInfo[state.players.indexOf(socket)])
                        return io.emit('action', {type: 'PLAYER_JOIN', payload: playersInfo})
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
                        console.log("LEAVE_QUEUE", socket.request.user.id, socker.request.user)
                        return io.emit('action', {type: 'PLAYER_LEAVE', payload: getPlayersInfo(state.players)})
                    })
                    .catch((error) => {
                        console.log(error)
                        return socket.emit('action', {type: 'ERROR', payload: "Can't leave the game queue!"})
                    })
            case 'server/START_GAME':
                if (state.players.length < 3) {
                    return socket.emit('action', {type: 'ERROR', payload: "Cannot start game because more players are needed :("}) 
                }

                return state.start().then(()=>{
                    io.emit('action', {type: 'ROUND_STARTED', payload: state.round.index})
                    console.log("ROUND_STARTED", state.round.index)
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
                        console.log("BET", socket.request.user.id, socket.request.user.displayName, action.payload)
                        console.log("SET_STARTED", state.round.set.index)
                        io.emit('action', {type: 'BETS_IN_PLACE', payload: state.round.bets})
                        io.emit('action', {type: 'SET_STARTED', payload: state.round.set.index})                        
                        state.token = Uuid.v4()
                        const firstPlayer = state.players[state.first]
                        firstPlayer.emit('action', {type: 'PLAY', payload: state.token})
                        state.players.filter((p)=>p.request.user.id!==firstPlayer.request.user.id).forEach((p)=>{
                            p.emit('action', {type: 'WAIT_PLAY', payload: firstPlayer.request.user.id})
                        })
                        return state.allowPlay() 
                    } else {
                        console.log("BET", socket.request.user.id, socket.request.user.displayName, action.payload)
                        return
                    }
                }).catch((error) => {
                    console.log(error)
                    return socket.emit('action', {type: 'ERROR', payload: "Can't start game!"})
                })
            case 'server/PLAY_CARD':
                if (action.payload.token !== state.token) {
                    console.log('PLAY_CARD', socket.request.user.id, 'Invalid token!')
                    return
                }
                
                const playerIdx = getPlayerIndex(socket, state.players)
                const cardIdx = state.round.hand[playerIdx].findIndex((c) => c === action.payload.id)

                if (cardIdx < 0) {
                    console.log('PLAY_CARD', socket.request.user.id, 'Invalid card!')
                }

                state.round.hand[playerIdx].splice(cardIdx, 1)

                console.log('PLAY_CARD', socket.request.user.id, socket.request.user.displayName, cards[action.payload.id])
                
                return state.play(getPlayerIndex(socket, state.players), action.payload.id).then(() => {
                    console.log(state.round.set.plays)
                    io.emit('action', {type: 'CARD_PLAYED', payload: state.round.set.plays})
                    if (state.is('waitingPlays')) {
                        state.token = Uuid.v4()
                        const playedCards = state.round.set.plays.filter((p)=>p!==null)
                        console.log(state.first, playedCards, (state.first+1)%state.players.length)
                        state.currentIdx = (state.first+playedCards.length)%state.players.length
                        const nextPlayer = state.players[state.currentIdx]
                        nextPlayer.emit('action', { type:'PLAY', payload: state.token })
                        state.players.filter((p)=>p.request.user.id!==nextPlayer.request.user.id).forEach((p)=>{
                            p.emit('action', {type: 'WAIT_PLAY', payload: nextPlayer.request.user.id})
                        })
                    } else if (state.is('setEnded')) {
                        console.log("SET_ENDED", state.round.set.index, state.first)
                        io.emit('action', {type: 'SET_ENDED', payload: {index: state.round.set.index, tricks: state.round.tricks}})

                        Wait.for.time(2)

                        return state.nextSet().then(() => {
                            if (state.is('roundEnded')) {
                                console.log("ROUND_ENDED", state.round.index)
                                io.emit('action', {type: 'ROUND_ENDED', payload: { score: state.round.score, currentPlayer: state.players[state.first].request.user.id }})
                                console.log("SCORE", state.score)
                                console.log("LAST TRICK WINNER", state.players[state.first].request.user.id, state.players[state.first].request.user.displayName)
                                return state.nextRound().then(() => {
                                    if (state.is("end")) {
                                        io.emit('action', {type: 'FINISH', payload: { score: state.score }})
                                        return state.finish()
                                    }
                                })
                            }
                            
                            state.token = Uuid.v4()
                            const firstPlayer = state.players[state.first]
                            console.log("TRICK WINNER", firstPlayer.request.user.id, firstPlayer.request.user.displayName)
                            firstPlayer.emit('action', {type: 'PLAY', payload: state.token})
                            state.players.filter((p)=>p.request.user.id!==firstPlayer.request.user.id).forEach((p)=>{
                                p.emit('action', {type: 'WAIT_PLAY', payload: firstPlayer.request.user.id})
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
        console.log("Socket disconnected: " + socket.request.user.id)
        const idx = IO_CLIENTS.indexOf(socket)
        IO_CLIENTS.splice(idx, 1)
        
        const playerIdx = getPlayerIndex(socket, state.players)
        if (playerIdx>= 0) {
            if (state.is('join')) {
                state.players.splice(playerIdx, 1)
                io.emit('action', {type: 'PLAYER_LEFT', payload: getPlayersInfo(state.players)})
            } else {
                // in game.. wait for reconnect
            }
        }

        const users = getCurrentUsers()
        if (users.length>0) {
            console.log("User disconnected: " + socket.request.user.id)
            io.emit('action', {type: 'USER_LEFT', payload: users})
        }
    })
})

const getPlayerIndex = (socket, players) => {
    return players.findIndex((c) => {return c.request.user.id === socket.request.user.id})
}

const getCurrentUsers = () => {
    return IO_CLIENTS.map((c) => {return { id: c.request.user.id, name: c.request.user.displayName, photo: c.request.user.image}})
}

const getPlayersInfo = (players) => {
    return players.map((c) => {return { id: c.request.user.id, name: c.request.user.displayName, photo: c.request.user.image}})
}

const dealCardsForRound = (players, round) => {
    const cards = Random.randomArray({min: 0, max: 65, elements: round * players.length})
    players.forEach((c, idx) => {
        const hand = cards.splice(0, round)
        state.round.hand[idx] = hand
        console.log('DEAL_CARDS', c.id, c.request.user.displayName, hand)
        c.emit('action', {type: 'DEAL_CARDS', payload: hand})
    })
}
