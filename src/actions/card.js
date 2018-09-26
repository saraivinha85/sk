export const PLAY_CARD = "server/PLAY_CARD"
export const playCard = (id) => {
    return {
        type: PLAY_CARD,
        payload: id
    }
}
