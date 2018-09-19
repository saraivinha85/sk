const INITIAL_STATE = {
    players: []
}

const game = (state=INITIAL_STATE, action) => {
    switch (action.type) {
        case 'PLAYER_JOIN':
        case 'PLAYER_LEFT':
            return {...state, players: action.payload}
        default:
            return state
    }
}

export default game 
