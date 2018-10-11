export const PLACE_BET = 'server/PLACE_BET'
export const placeBet = (bet) => {
    return {
        type: PLACE_BET,
        payload: bet
    }
}

export const PLAY_CARD = "server/PLAY_CARD"
export const playCard = (id, token) => {
    return {
        type: PLAY_CARD,
        payload: {id, token}
    }
}
