import FSM from 'fsm-as-promised'

const state = {
    players: [],
    round: {
        index: -1,
        bets: [],
        set: {
            index: -1,
            plays: [],
            tricks: []
        }
    },
    score: []
}

FSM({
    initial: 'lobby',
    final: 'lobby',
    events: [
        {name: 'start', from: 'lobby', to: 'roundStarted'},
        {name: 'join', from: 'lobby', to: 'lobby'},
        {name: 'deal', from: 'roundStarted', to: 'waitingBets'},
        {name: 'bet', from: 'waitingBets', to: ['waitingBets', 'setStarted'], condition: function () {return this.round.bets.find((b) =>  b === null) === undefined? 1: 0}},
        {name: 'allowPlay', from: 'setStarted', to: 'waitingPlays'},
        {name: 'play', from: 'waitingPlays', to: ['waitingPlays', 'setEnded'], condition: function () {return this.round.set.plays.find((b) => b === null) === undefined? 1: 0}},
        {name: 'nextSet', from: 'setEnded', to: ['setStarted', 'roundEnded'], condition: function () { return this.round.index === this.round.set.index? 1: 0 }},
        {name: 'nextRound', from: 'roundEnded', to: ['roundStarted', 'end'], condition: function () { return this.round.index === 10? 1 : 0 }},
        {name: 'finish', from: 'end', to: 'lobby'},
    ],
    callbacks: {
        onjoin: function (options) {
            this.players.push(...options.args)
        },
        onstart: function (options) {
        },
        onenteredroundStarted: function (options) {
            this.round.index += 1
            this.round.bets = new Array(this.players.length).fill(null)
        },
        ondeal: function (options) {
            console.log('Dealing', this.round.index + 1, 'cards')
        },
        onbet: function (options) {
            this.round.bets[options.args[0]] = options.args[1]
        },
        onenteredwaitingBets: function (options) {
        },
        onenteredsetStarted: function (options) {
            this.round.set.index += 1
            this.round.set.plays = new Array(this.players.length).fill(null)
        },
        onenteredsetEnded: function (options) {
            console.log('Set', state.round.set.index, 'ended')
        },
        onplay: function (options) {
            this.round.set.plays[options.args[0]] = options.args[1]
        }
    }
}, state)

export default state 

