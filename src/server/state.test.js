
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

test('On start event, deal event is fired', () => {
    const s = state()
    const players = ['p1', 'p2', 'p3']
    let called = false

    //s.deal = () => { called = true }

    //s.start().then((options) => {
        //expect(called).toEqual(true)
    //})
})

test('On bet event, eal event is fired', () => {
    const s = state()
    const players = ['p1', 'p2', 'p3']

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
        })
})

