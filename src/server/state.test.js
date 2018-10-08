
const state = () => {
    jest.resetModules()
    return require('./state').default
}

test('First state is lobby', () => {
    const s = state() 
    expect(s.current).toEqual('lobby')
})

test('On join event, state is lobby and players joined', () => {
    const s = state() 
    s.join('player1').then((options) => {
        expect(s.current).toEqual('lobby')
        expect(s.players).toEqual(['player1'])

        s.join('player2').then((options) => {
            expect(s.current).toEqual('lobby')
            expect(s.players).toEqual(['player1', 'player2'])
        })
    })
})

test('On start event, state is roundStarted', () => {
    const s = state()
    const players = ['p1', 'p2', 'p3']
    s.players = players

    s.start().then((options) => {
        expect(s.current).toEqual('roundStarted')
        expect(s.players).toEqual(players)
    })
})

/* test('On start event, deal event is fired', () => {
    const s = state()
    const players = ['p1', 'p2', 'p3']
    let called = false

    //s.deal = () => { called = true }

    //s.start().then((options) => {
        //expect(called).toEqual(true)
    //})
}) */

 test('On bet event, state is waitingBets till all players bet', () => {
    const s = state()
    const players = ['p1', 'p2', 'p3']
    s.players = players

    s.start()
        .then(() => {
            expect(s.current).toEqual('roundStarted')
            return s.deal()
        })
        .then((options) => {
            expect(s.current).toEqual('waitingBets')
            return s.bet(0, 2)
        })
        .then((options) => {
            expect(s.current).toEqual('waitingBets')
            //expect(s.round.bets[0]).toEqual(2)
            return s.bet(1, 0) 
        })
        .then((options) => {
            expect(s.current).toEqual('waitingBets')
            expect(s.round.bets[0]).toEqual(2)
            expect(s.round.bets[1]).toEqual(0)
            return s.bet(2, 3)
        })
        .then((options) => {
            expect(s.current).toEqual('setStarted')
            expect(s.round.bets[0]).toEqual(2)
            expect(s.round.bets[1]).toEqual(0)
            expect(s.round.bets[2]).toEqual(3)
        })
})

test('On setStarted should wait till all players play', () => {
    const s = state()
    const players = ['p1', 'p2', 'p3']
    s.players = players

    s.start()
        .then(() => {
            expect(s.current).toEqual('roundStarted')
            return s.deal()
        })
        .then((options) => {
            expect(s.current).toEqual('waitingBets')
            return s.bet(0, 2)
        })
        .then((options) => {
            expect(s.current).toEqual('waitingBets')
            expect(s.round.bets[0]).toEqual(2)
            return s.bet(1, 0) 
        })
        .then((options) => {
            expect(s.current).toEqual('waitingBets')
            expect(s.round.bets[0]).toEqual(2)
            expect(s.round.bets[1]).toEqual(0)
            return s.bet(2, 3)
        })
        .then((options) => {
            expect(s.current).toEqual('setStarted')
            expect(s.round.bets[0]).toEqual(2)
            expect(s.round.bets[1]).toEqual(0)
            expect(s.round.bets[2]).toEqual(3)
            return s.allowPlay()
        })
        .then((options) => {
            expect(s.current).toEqual('waitingPlays')
            expect(s.round.set.plays[0]).toEqual(null)
            expect(s.round.set.plays[1]).toEqual(null)
            expect(s.round.set.plays[2]).toEqual(null)
            return s.play(1, 10)
        })
        .then((options) => {
            expect(s.current).toEqual('waitingPlays')
            expect(s.round.set.plays[0]).toEqual(null)
            expect(s.round.set.plays[1]).toEqual(10)
            expect(s.round.set.plays[2]).toEqual(null)
            return s.play(0, 2)
        })
        .then((options) => {
            expect(s.current).toEqual('waitingPlays')
            expect(s.round.set.plays[0]).toEqual(2)
            expect(s.round.set.plays[1]).toEqual(10)
            expect(s.round.set.plays[2]).toEqual(null)
            return s.play(2, 20)
        })
        .then((options) => {
            expect(s.current).toEqual('setEnded')
            expect(s.round.set.plays[0]).toEqual(2)
            expect(s.round.set.plays[1]).toEqual(10)
            expect(s.round.set.plays[2]).toEqual(20)
        })
})

test('First round should have one set only', () => {
    const s = state()
    const players = ['p1', 'p2', 'p3']
    s.players = players

    s.start()
        .then(() => {
            expect(s.current).toEqual('roundStarted')
            return s.deal()
        })
        .then((options) => {
            expect(s.current).toEqual('waitingBets')
            return s.bet(0, 2)
        })
        .then((options) => {
            expect(s.current).toEqual('waitingBets')
            expect(s.round.bets[0]).toEqual(2)
            return s.bet(1, 0) 
        })
        .then((options) => {
            expect(s.current).toEqual('waitingBets')
            expect(s.round.bets[0]).toEqual(2)
            expect(s.round.bets[1]).toEqual(0)
            return s.bet(2, 3)
        })
        .then((options) => {
            expect(s.current).toEqual('setStarted')
            expect(s.round.bets[0]).toEqual(2)
            expect(s.round.bets[1]).toEqual(0)
            expect(s.round.bets[2]).toEqual(3)
            return s.allowPlay()
        })
        .then((options) => {
            expect(s.current).toEqual('waitingPlays')
            expect(s.round.set.plays[0]).toEqual(null)
            expect(s.round.set.plays[1]).toEqual(null)
            expect(s.round.set.plays[2]).toEqual(null)
            return s.play(1, 10)
        })
        .then((options) => {
            expect(s.current).toEqual('waitingPlays')
            expect(s.round.set.plays[0]).toEqual(null)
            expect(s.round.set.plays[1]).toEqual(10)
            expect(s.round.set.plays[2]).toEqual(null)
            return s.play(0, 2)
        })
        .then((options) => {
            expect(s.current).toEqual('waitingPlays')
            expect(s.round.set.plays[0]).toEqual(2)
            expect(s.round.set.plays[1]).toEqual(10)
            expect(s.round.set.plays[2]).toEqual(null)
            return s.play(2, 20)
        })
        .then((options) => {
            expect(s.current).toEqual('setEnded')
            expect(s.round.set.plays[0]).toEqual(2)
            expect(s.round.set.plays[1]).toEqual(10)
            expect(s.round.set.plays[2]).toEqual(20)
            return s.nextSet()
        })
        .then((options) => {
            expect(s.current).toEqual('roundEnded')
        })
})

test('Second round should start after first round ends', () => {
    const s = state()
    const players = ['p1', 'p2', 'p3']
    s.players = players

    s.start()
        .then(() => {
            expect(s.current).toEqual('roundStarted')
            return s.deal()
        })
        .then((options) => {
            expect(s.current).toEqual('waitingBets')
            return s.bet(0, 2)
        })
        .then((options) => {
            expect(s.current).toEqual('waitingBets')
            expect(s.round.bets[0]).toEqual(2)
            return s.bet(1, 0) 
        })
        .then((options) => {
            expect(s.current).toEqual('waitingBets')
            expect(s.round.bets[0]).toEqual(2)
            expect(s.round.bets[1]).toEqual(0)
            return s.bet(2, 3)
        })
        .then((options) => {
            expect(s.current).toEqual('setStarted')
            expect(s.round.bets[0]).toEqual(2)
            expect(s.round.bets[1]).toEqual(0)
            expect(s.round.bets[2]).toEqual(3)
            return s.allowPlay()
        })
        .then((options) => {
            expect(s.current).toEqual('waitingPlays')
            expect(s.round.set.plays[0]).toEqual(null)
            expect(s.round.set.plays[1]).toEqual(null)
            expect(s.round.set.plays[2]).toEqual(null)
            return s.play(1, 10)
        })
        .then((options) => {
            expect(s.current).toEqual('waitingPlays')
            expect(s.round.set.plays[0]).toEqual(null)
            expect(s.round.set.plays[1]).toEqual(10)
            expect(s.round.set.plays[2]).toEqual(null)
            return s.play(0, 2)
        })
        .then((options) => {
            expect(s.current).toEqual('waitingPlays')
            expect(s.round.set.plays[0]).toEqual(2)
            expect(s.round.set.plays[1]).toEqual(10)
            expect(s.round.set.plays[2]).toEqual(null)
            return s.play(2, 20)
        })
        .then((options) => {
            expect(s.current).toEqual('setEnded')
            expect(s.round.set.plays[0]).toEqual(2)
            expect(s.round.set.plays[1]).toEqual(10)
            expect(s.round.set.plays[2]).toEqual(20)
            return s.nextSet()
        })
        .then((options) => {
            expect(s.current).toEqual('roundEnded')
            return s.nextRound()
        })
        .then((options) => {
            expect(s.current).toEqual('roundStarted')
            expect(s.round.index).toEqual(1)
        })
})