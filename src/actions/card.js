export const PLAY_CARD = "PLAY_CARD"
export const playCard = (id) => {
    return {
        type: PLAY_CARD,
        payload: id
    }
}
