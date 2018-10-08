import FSM from 'fsm-as-promised'

const state = {
    players: [],
    round: {
        index: -1,
        bets: [],
        set: {
            index: -1,
            tricks: []
        }
    },
    score: []
}

FSM({
    initial: 'lobby',
    events: [
        {name: 'start', from: 'lobby', to: 'roundStarted'},
        {name: 'join', from: 'lobby', to: 'lobby'},
        {name: 'deal', from: 'roundStarted', to: 'waitingBets'},
        {name: 'bet', from: 'waitingBets', to: 'waitingBets'},
        {name: 'startSet', from: 'waitingBets', to: 'setStarted'},
        {name: 'play', from: 'setStarted', to: 'waitingAllPlays'},
        {name: 'trickScore', from: 'waitingAllPlays', to: 'setEnded'},
        {name: 'nextSet', from: 'setEnded', to: 'setStarted'},
        {name: 'roundScore', from: 'setEnded', to: 'roundEnded'},
        {name: 'nextRound', from: 'roundEnded', to: 'roundStarted'},
        {name: 'finalScore', from: 'roundEnded', to: 'end'},
        {name: 'finish', from: 'end', to: 'lobby'},
    ],
    callbacks: {
        onjoin: function (options) {
            this.players.push(...options.args)
        },
        onstart: function (options) {
            this.round.index += 1
        },
        onenteredroundStarted: function (options) {
            this.round.bets = new Array(this.players.length).fill(null)
            //this.deal()
        },
        ondeal: function (options) {
            console.log('Dealing', this.round.index + 1, 'cards')
        },
        onbet: function (options) {
            this.round.bets[options.args[0]] = options.args[1]
        }
    }
}, state)

export default state 

