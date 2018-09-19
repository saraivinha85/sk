import Http from 'http'
import SocketIO from 'socket.io'
import Express from 'express'
import Random from 'random-array-generator'

const server = Http.createServer()
server.listen(3001)

const io = SocketIO()
io.attach(server)

const IO_CLIENTS = []
let ROUND = 1

io.on('connection', (socket) => {
    console.log("Socket connected: " + socket.id)

    IO_CLIENTS.push(socket)
    const players = IO_CLIENTS.map((c) => {return c.id})
    io.emit('action', {type: 'PLAYER_JOIN', payload: players})

    socket.on('action', (action) => {
        console.log("Got action: " + action.type + " " + action.data)

        switch (action.type) {
            case 'server/LOGIN':
                return //login()
            case 'server/START':
                return dealCardsForRound(ROUND++ % 11)
            default:
                return
        }
    })

    socket.on('disconnect', () => {
        console.log("Socket disconnected: " + socket.id)
        const idx = IO_CLIENTS.indexOf(socket)
        IO_CLIENTS.splice(idx, 1)
        const players = IO_CLIENTS.map((c) => {return c.id})
        io.emit('action', {type: 'PLAYER_LEFT', payload: players})
    })
})

const dealCardsForRound = (round) => {
    const cards = Random.randomArray({min: 0, max: 65, elements: round * IO_CLIENTS.length})
    IO_CLIENTS.forEach((c) => {
        console.log(cards)
        const hand = cards.splice(0, round)
        c.emit('action', {type: 'DEAL_CARDS', payload: hand})
    })
}

