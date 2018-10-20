import state from './state'

test('Full game state', () => {
    state.join('p1').then(() => {
        expect(state.current).toEqual('lobby')
        expect(state.players).toEqual(['p1'])
        return state.join('p2')
    }).then(() => {
        expect(state.current).toEqual('lobby')
        expect(state.players).toEqual(['p1', 'p2'])
        return state.join('p3')
    }).then(() => {
        expect(state.current).toEqual('lobby')
        expect(state.players).toEqual(['p1', 'p2', 'p3'])
        return state.start()
    }).then(() => {
        expect(state.current).toEqual('roundStarted')
        expect(state.round.index).toEqual(0)
        expect(state.round.bets).toEqual([null, null, null])
        expect(state.round.tricks).toEqual([0, 0, 0])
        return state.deal()
    }).then(() => {
        expect(state.current).toEqual('waitingBets')
        return state.bet(0, 1)
    }).then(() => {
        expect(state.current).toEqual('waitingBets')
        expect(state.round.bets).toEqual([1, null, null])
        return state.bet(2, 0)
    }).then(() => {
        expect(state.current).toEqual('waitingBets')
        expect(state.round.bets).toEqual([1, null, 0])
        return state.bet(1, 1)
    }).then(() => {
        expect(state.current).toEqual('setStarted')
        expect(state.round.bets).toEqual([1, 1, 0])
        expect(state.round.set.index).toEqual(0)
        return state.allowPlay()
    }).then(() => {
        expect(state.current).toEqual('waitingPlays')
        expect(state.round.set.plays).toEqual([null, null, null])
        return state.play(0, 13)
    }).then(() => {
        expect(state.current).toEqual('waitingPlays')
        expect(state.round.set.plays).toEqual([13, null, null])
        return state.play(1, 23)
    }).then(() => {
        expect(state.current).toEqual('waitingPlays')
        expect(state.round.set.plays).toEqual([13, 23, null])
        return state.play(2, 1)
    }).then(() => {
        expect(state.current).toEqual('setEnded')
        expect(state.round.set.plays).toEqual([13, 23, 1])
        expect(state.round.tricks).toEqual([0,0,1])
        expect(state.first).toEqual(2)
        return state.nextSet()
    })
})

// test('First state is lobby', () => {
//     const s = state()
//     expect(s.current).toEqual('lobby')
// })

// test('On join event, state is lobby and players joined', () => {
//     const s = state()
//     s.join('player1').then((options) => {
//         expect(s.current).toEqual('lobby')
//         expect(s.players).toEqual(['player1'])

//         s.join('player2').then((options) => {
//             expect(s.current).toEqual('lobby')
//             expect(s.players).toEqual(['player1', 'player2'])
//         })
//     })
// })

// test('On start event, state is roundStarted', () => {
//     const s = state()
//     const players = ['p1', 'p2', 'p3']
//     s.players = players

//     s.start().then((options) => {
//         expect(s.current).toEqual('roundStarted')
//         expect(s.players).toEqual(players)
//     })
// })

// /* test('On start event, deal event is fired', () => {
//     const s = state()
//     const players = ['p1', 'p2', 'p3']
//     let called = false

//     //s.deal = () => { called = true }

//     //s.start().then((options) => {
//         //expect(called).toEqual(true)
//     //})
// }) */

// test('On bet event, state is waitingBets till all players bet', () => {
//     const s = state()
//     const players = ['p1', 'p2', 'p3']
//     s.players = players

//     s.start()
//         .then(() => {
//             expect(s.current).toEqual('roundStarted')
//             return s.deal()
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingBets')
//             return s.bet(0, 2)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingBets')
//             //expect(s.round.bets[0]).toEqual(2)
//             return s.bet(1, 0)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingBets')
//             expect(s.round.bets[0]).toEqual(2)
//             expect(s.round.bets[1]).toEqual(0)
//             return s.bet(2, 3)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('setStarted')
//             expect(s.round.bets[0]).toEqual(2)
//             expect(s.round.bets[1]).toEqual(0)
//             expect(s.round.bets[2]).toEqual(3)
//         })
// })

// test('On setStarted should wait till all players play', () => {
//     const s = state()
//     const players = ['p1', 'p2', 'p3']
//     s.players = players

//     s.start()
//         .then(() => {
//             expect(s.current).toEqual('roundStarted')
//             return s.deal()
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingBets')
//             return s.bet(0, 2)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingBets')
//             expect(s.round.bets[0]).toEqual(2)
//             return s.bet(1, 0)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingBets')
//             expect(s.round.bets[0]).toEqual(2)
//             expect(s.round.bets[1]).toEqual(0)
//             return s.bet(2, 3)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('setStarted')
//             expect(s.round.bets[0]).toEqual(2)
//             expect(s.round.bets[1]).toEqual(0)
//             expect(s.round.bets[2]).toEqual(3)
//             return s.allowPlay()
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingPlays')
//             expect(s.round.set.plays[0]).toEqual(null)
//             expect(s.round.set.plays[1]).toEqual(null)
//             expect(s.round.set.plays[2]).toEqual(null)
//             return s.play(1, 10)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingPlays')
//             expect(s.round.set.plays[0]).toEqual(null)
//             expect(s.round.set.plays[1]).toEqual(10)
//             expect(s.round.set.plays[2]).toEqual(null)
//             return s.play(0, 2)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingPlays')
//             expect(s.round.set.plays[0]).toEqual(2)
//             expect(s.round.set.plays[1]).toEqual(10)
//             expect(s.round.set.plays[2]).toEqual(null)
//             return s.play(2, 20)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('setEnded')
//             expect(s.round.set.plays[0]).toEqual(2)
//             expect(s.round.set.plays[1]).toEqual(10)
//             expect(s.round.set.plays[2]).toEqual(20)
//         })
// })

// test('First round should have one set only', () => {
//     const s = state()
//     const players = ['p1', 'p2', 'p3']
//     s.players = players

//     s.start()
//         .then(() => {
//             expect(s.current).toEqual('roundStarted')
//             return s.deal()
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingBets')
//             return s.bet(0, 2)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingBets')
//             expect(s.round.bets[0]).toEqual(2)
//             return s.bet(1, 0)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingBets')
//             expect(s.round.bets[0]).toEqual(2)
//             expect(s.round.bets[1]).toEqual(0)
//             return s.bet(2, 3)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('setStarted')
//             expect(s.round.bets[0]).toEqual(2)
//             expect(s.round.bets[1]).toEqual(0)
//             expect(s.round.bets[2]).toEqual(3)
//             return s.allowPlay()
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingPlays')
//             expect(s.round.set.plays[0]).toEqual(null)
//             expect(s.round.set.plays[1]).toEqual(null)
//             expect(s.round.set.plays[2]).toEqual(null)
//             return s.play(1, 10)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingPlays')
//             expect(s.round.set.plays[0]).toEqual(null)
//             expect(s.round.set.plays[1]).toEqual(10)
//             expect(s.round.set.plays[2]).toEqual(null)
//             return s.play(0, 20)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingPlays')
//             expect(s.round.set.plays[0]).toEqual(20)
//             expect(s.round.set.plays[1]).toEqual(10)
//             expect(s.round.set.plays[2]).toEqual(null)
//             return s.play(2, 2)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('setEnded')
//             expect(s.round.set.plays[0]).toEqual(20)
//             expect(s.round.set.plays[1]).toEqual(10)
//             expect(s.round.set.plays[2]).toEqual(2)
//             expect(s.round.tricks[2]).toEqual(1)
//             expect(s.round.bonus[2]).toEqual(0)
//             expect(s.first).toEqual(2)
//             expect(s.round.set.index).toEqual(0)
//             return s.nextSet()
//         })
//         .then((options) => {
//             expect(s.current).toEqual('roundEnded')
//         })
// })

// test('Second round should start after first round ends', () => {
//     const s = state()
//     const players = ['p1', 'p2', 'p3']
//     s.players = players

//     s.start()
//         .then(() => {
//             expect(s.current).toEqual('roundStarted')
//             return s.deal()
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingBets')
//             return s.bet(0, 1)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingBets')
//             expect(s.round.bets[0]).toEqual(1)
//             return s.bet(1, 0)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingBets')
//             expect(s.round.bets[0]).toEqual(1)
//             expect(s.round.bets[1]).toEqual(0)
//             return s.bet(2, 1)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('setStarted')
//             expect(s.round.bets[0]).toEqual(1)
//             expect(s.round.bets[1]).toEqual(0)
//             expect(s.round.bets[2]).toEqual(1)
//             return s.allowPlay()
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingPlays')
//             expect(s.round.set.plays[0]).toEqual(null)
//             expect(s.round.set.plays[1]).toEqual(null)
//             expect(s.round.set.plays[2]).toEqual(null)
//             return s.play(1, 10)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingPlays')
//             expect(s.round.set.plays[0]).toEqual(null)
//             expect(s.round.set.plays[1]).toEqual(10)
//             expect(s.round.set.plays[2]).toEqual(null)
//             return s.play(0, 2)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingPlays')
//             expect(s.round.set.plays[0]).toEqual(2)
//             expect(s.round.set.plays[1]).toEqual(10)
//             expect(s.round.set.plays[2]).toEqual(null)
//             return s.play(2, 20)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('setEnded')
//             expect(s.round.set.plays[0]).toEqual(2)
//             expect(s.round.set.plays[1]).toEqual(10)
//             expect(s.round.set.plays[2]).toEqual(20)
//             return s.nextSet()
//         })
//         .then((options) => {
//             expect(s.current).toEqual('roundEnded')
//             expect(s.score).toEqual([20, 10, -10])
//             return s.nextRound()
//         })
//         .then((options) => {
//             expect(s.current).toEqual('roundStarted')
//             expect(s.round.index).toEqual(1)
//         })
// })

// test('Two rounds', () => {
//     const s = state()
//     const players = ['p1', 'p2', 'p3']
//     s.players = players

//     s.start()
//         .then(() => {
//             expect(s.current).toEqual('roundStarted')
//             return s.deal()
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingBets')
//             return s.bet(0, 1)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingBets')
//             expect(s.round.bets[0]).toEqual(1)
//             return s.bet(1, 0)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingBets')
//             expect(s.round.bets[0]).toEqual(1)
//             expect(s.round.bets[1]).toEqual(0)
//             return s.bet(2, 1)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('setStarted')
//             expect(s.round.bets[0]).toEqual(1)
//             expect(s.round.bets[1]).toEqual(0)
//             expect(s.round.bets[2]).toEqual(1)
//             return s.allowPlay()
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingPlays')
//             expect(s.round.set.plays[0]).toEqual(null)
//             expect(s.round.set.plays[1]).toEqual(null)
//             expect(s.round.set.plays[2]).toEqual(null)
//             return s.play(1, 10)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingPlays')
//             expect(s.round.set.plays[0]).toEqual(null)
//             expect(s.round.set.plays[1]).toEqual(10)
//             expect(s.round.set.plays[2]).toEqual(null)
//             return s.play(0, 2)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingPlays')
//             expect(s.round.set.plays[0]).toEqual(2)
//             expect(s.round.set.plays[1]).toEqual(10)
//             expect(s.round.set.plays[2]).toEqual(null)
//             return s.play(2, 20)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('setEnded')
//             expect(s.round.set.plays[0]).toEqual(2)
//             expect(s.round.set.plays[1]).toEqual(10)
//             expect(s.round.set.plays[2]).toEqual(20)
//             return s.nextSet()
//         })
//         .then((options) => {
//             expect(s.current).toEqual('roundEnded')
//             expect(s.score).toEqual([20, 10, -10])
//             return s.nextRound()
//         })
//         .then((options) => {
//             expect(s.current).toEqual('roundStarted')
//             expect(s.round.index).toEqual(1)
//             return s.deal()
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingBets')
//             return s.bet(0, 0)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingBets')
//             expect(s.round.bets[0]).toEqual(0)
//             return s.bet(1, 1)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingBets')
//             expect(s.round.bets[0]).toEqual(0)
//             expect(s.round.bets[1]).toEqual(1)
//             return s.bet(2, 0)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('setStarted')
//             expect(s.round.set.index).toEqual(0)
//             expect(s.round.bets[0]).toEqual(0)
//             expect(s.round.bets[1]).toEqual(1)
//             expect(s.round.bets[2]).toEqual(0)
//             return s.allowPlay()
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingPlays')
//             expect(s.round.set.plays[0]).toEqual(null)
//             expect(s.round.set.plays[1]).toEqual(null)
//             expect(s.round.set.plays[2]).toEqual(null)
//             return s.play(1, 10)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingPlays')
//             expect(s.round.set.plays[0]).toEqual(null)
//             expect(s.round.set.plays[1]).toEqual(10)
//             expect(s.round.set.plays[2]).toEqual(null)
//             return s.play(0, 20)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingPlays')
//             expect(s.round.set.plays[0]).toEqual(20)
//             expect(s.round.set.plays[1]).toEqual(10)
//             expect(s.round.set.plays[2]).toEqual(null)
//             return s.play(2, 30)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('setEnded')
//             expect(s.round.set.plays[0]).toEqual(20)
//             expect(s.round.set.plays[1]).toEqual(10)
//             expect(s.round.set.plays[2]).toEqual(30)
//             expect(s.round.set.index).toEqual(0)
//             return s.nextSet()
//         })
//         .then((options) => {
//             expect(s.round.set.index).toEqual(1)
//             expect(s.current).toEqual('setStarted')
//             expect(s.round.tricks).toEqual([0, 1, 0])
//             return s.allowPlay()
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingPlays')
//             expect(s.round.set.plays[0]).toEqual(null)
//             expect(s.round.set.plays[1]).toEqual(null)
//             expect(s.round.set.plays[2]).toEqual(null)
//             return s.play(1, 40)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingPlays')
//             expect(s.round.set.plays[0]).toEqual(null)
//             expect(s.round.set.plays[1]).toEqual(40)
//             expect(s.round.set.plays[2]).toEqual(null)
//             return s.play(0, 50)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('waitingPlays')
//             expect(s.round.set.plays[0]).toEqual(50)
//             expect(s.round.set.plays[1]).toEqual(40)
//             expect(s.round.set.plays[2]).toEqual(null)
//             return s.play(2, 13)
//         })
//         .then((options) => {
//             expect(s.current).toEqual('setEnded')
//             expect(s.round.set.plays[0]).toEqual(50)
//             expect(s.round.set.plays[1]).toEqual(40)
//             expect(s.round.set.plays[2]).toEqual(13)
//             expect(s.round.set.index).toEqual(1)
//             expect(s.round.tricks).toEqual([0, 1, 1])
//             return s.nextSet()
//         })
//         .then((options) => {
//             expect(s.current).toEqual('roundEnded')
//             expect(s.score).toEqual([40, 30, -30])
//         })
//     })
