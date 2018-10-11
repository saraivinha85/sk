import FSM from 'fsm-as-promised'

import {trickScore, roundScore} from './score'
import { func } from 'prop-types';

const state = {
    players: [],
    first: null,
    round: {
        index: -1,
        bets: [],
        set: {
            index: -1,
            plays: [],
        },
        tricks: [],
        bonus: []
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
        {name: 'nextSet', from: 'setEnded', to: ['setStarted', 'roundEnded'], condition: function () { return this.round.set.index >= this.round.index? 1: 0 }},
        {name: 'nextRound', from: 'roundEnded', to: ['roundStarted', 'end'], condition: function () { return this.round.index === 10? 1 : 0 }},
        {name: 'finish', from: 'end', to: 'lobby'},
    ],
    callbacks: {
        onjoin: function (options) {
            this.players.push(...options.args)
        },
        onstart: function (options) {
            this.score = new Array(this.players.length).fill(0)
            this.first = 0
        },
        onenteredroundStarted: function (options) {
            this.round.index += 1
            this.round.bets = new Array(this.players.length).fill(null)
            this.round.tricks = new Array(this.players.length).fill(0)
            this.round.bonus = new Array(this.players.length).fill(0)
            this.round.set.index = -1
        },
        onenteredroundEnded: function (options) {
            const score = roundScore(this.round.index, this.round.bets, this.round.tricks, this.round.bonus)
            this.score = this.score.map((s, idx) => {return s + score[idx]})
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
            this.round.set.plays = new Array(this.players.length).fill(null)
        },
        onentersetStarted: function (options) {
            this.round.set.index += 1
        },
        onenteredsetEnded: function (options) {
            console.log('Set', state.round.set.index, 'ended')
            const trick = trickScore(this.round.set.plays)
            this.round.tricks[trick.winner] += 1
            this.round.bonus[trick.winner] += trick.bonus
            this.first = trick.winner
        },
        onplay: function (options) {            
            this.round.set.plays[options.args[0]] = options.args[1]
        },
        onnextSet: function (option) {
        }
    }
}, state)

export default state 

