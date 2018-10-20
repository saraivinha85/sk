import cardMap from '../cards'

export const roundScore = (roundIndex, bets, tricks, bonus) => {
    return bets.map((b, idx) => {
        return b===0 && b===tricks[idx]
            ? (roundIndex + 1) * 10 + bonus[idx]
            : b===tricks[idx]
            ? b * 20 + bonus[idx]
            : b===0
            ? (roundIndex + 1) * -10 
            : Math.abs(b-tricks[idx]) * -10
    })
}

export const trickScore = (startIdx, cardsPlayed) => {
    const cards = cardsPlayed.slice(startIdx + 1, cardsPlayed.length + 1)
        .concat(cardsPlayed.slice(0, startIdx))
    cards.unshift(cardsPlayed[startIdx])

    const sk = cards.find((c) => {return c === 0})
    const p = cards.find((c) => {return c > 0 && c < 7})
    const m = cards.find((c) => {return c > 6 && c < 9})

    if (sk !== undefined && m === undefined) {
        return {
            winner: cards.indexOf(sk),
            bonus: cards.filter((c)=> {return c > 0 && c < 7 || c === 66}).length * 30
        }
    } else if (sk !== undefined && m !== undefined) {
        return {
            winner: cards.indexOf(m),
            bonus: 50
        } 
    } else if (p !== undefined) {
        return {
            winner: cards.indexOf(p),
            bonus: 0
        }
    } else if (m !== undefined) {
        return {
            winner: cards.indexOf(m),
            bonus: 0
        }
    }

    const blacks = cards.filter((c) => {return c > 8 && c < 22})
    if (blacks.length) {
        return {
            winner: cards.indexOf(Math.min(...blacks)),
            bonus: 0
        }
    }

    const first_color = cards.find((c)=>{return cardMap[c].color !== ''})

    if (first_color === undefined) {
        return {
            winner: 0,
            bonus: 0
        }
    }

    const color = Math.min(...cards.filter((c) => {return cardMap[c].color === cardMap[first_color].color}))
    return {
        winner: cards.indexOf(color),
        bonus: 0
    }
}

