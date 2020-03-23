import FSM from 'fsm-as-promised'

import {trickScore, roundScore} from './score'

const s = {
    players: [],
    first: null,
    currentIdx: null,
    round: {
        index: -1,
        bets: [],
        set: {
            index: -1,
            plays: [],
        },
        score: [],
        tricks: [],
        bonus: [],
        hand: []
    },
    score: []
}

const fsm = {
    initial: 'lobby',
    final: 'lobby',
    events: [
        {name: 'start', from: 'lobby', to: 'roundStarted'},
        {name: 'join', from: 'lobby', to: 'lobby'},
        {name: 'deal', from: 'roundStarted', to: 'waitingBets'},
        {name: 'bet', from: 'waitingBets', to: ['waitingBets', 'setStarted'], condition: function () {return this.round.bets.find((b) =>  b === null) === undefined? 1: 0}},
        {name: 'allowPlay', from: 'setStarted', to: 'waitingPlays'},
        {name: 'play', from: 'waitingPlays', to: ['waitingPlays', 'setEnded'], condition: function () {return this.round.set.plays.find((b) => b === null) === undefined? 1: 0}},
        {name: 'nextSet', from: 'setEnded', to: ['setStarted', 'roundEnded'], condition: function () { return this.round.set.index >= this.round.index? 1: 0 }},
        {name: 'nextRound', from: 'roundEnded', to: ['roundStarted', 'end'], condition: function () { return this.round.index + 1 === 10? 1 : 0 }},
        {name: 'finish', from: 'end', to: 'lobby'},
    ],
    callbacks: {
        onjoin: function (options) {
            this.players.push(...options.args)
        },
        onstart: function (options) {
            this.round.index = -1
            this.score = new Array(this.players.length).fill(0)
            this.first = 0
            this.currentIdx = 0
        },
        onenterroundStarted: function (options) {
            this.round.index += 1
            this.round.bets = new Array(this.players.length).fill(null)
            this.round.tricks = new Array(this.players.length).fill(0)
            this.round.bonus = new Array(this.players.length).fill(0)
            this.round.set.index = -1
            this.round.hand = new Array(this.players.length).fill([])
        },
        onenterroundEnded: function (options) {
            const score = roundScore(this.round.index, this.round.bets, this.round.tricks, this.round.bonus)
            this.round.score = score
            this.score = this.score.map((s, idx) => {return s + score[idx]})
        },
        onbet: function (options) {
            this.round.bets[options.args[0]] = options.args[1]
        },
        onenterwaitingPlays: function (options) {
        },
        onentersetStarted: function (options) {
            this.round.set.index += 1
            this.round.set.plays = new Array(this.players.length).fill(null)
        },
        onentersetEnded: function (options) {
            console.log("score", this.first, this.round.set.plays)
            const trick = trickScore(this.first, this.round.set.plays)
            console.log("score", this.first, this.round.set.plays, trick)
            this.round.tricks[trick.winner] += 1
            this.round.bonus[trick.winner] += trick.bonus
            this.first = trick.winner
            this.currentIdx = trick.winner
        },
        onplay: function (options) {            
            this.round.set.plays[options.args[0]] = options.args[1]
        },
        onfinish: function (option) {

        }
    }
}

const clone = (obj) => {
    return JSON.parse(JSON.stringify(obj))
}

export const state = () => {
    let st = clone(s)
    console.log('New state', st)
    return FSM(fsm, st)
}

export default state 

