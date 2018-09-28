import {calculateScore} from './score'

test('With all flags, first flag should win', () => {
    const score = calculateScore([65, 64, 63, 62, 61])
    expect(score).toEqual({
        winner: 0,
        bonus: 0
    })
})

test('With 5 flags and 1 color card, color card should win', () => {
    const score = calculateScore([65, 64, 63, 40, 62, 61])
    expect(score).toEqual({
        winner: 3,
        bonus: 0
    })
})

test('With 3 cards with different color, first color card should win', () => {
    const score = calculateScore([40, 30, 52])
    expect(score).toEqual({
        winner: 0,
        bonus: 0
    })
})

test('With 3 cards with same color, highest card should win', () => {
    const score = calculateScore([41, 40, 42])
    expect(score).toEqual({
        winner: 1,
        bonus: 0
    })
})

test('With 6 black cards, highest card should win', () => {
    const score = calculateScore([12, 9, 11, 16, 13, 10])
    expect(score).toEqual({
        winner: 1,
        bonus: 0
    })
})

test('With 1 black card and 3 cards with color, black card should win', () => {
    const score = calculateScore([40, 30, 52, 10])
    expect(score).toEqual({
        winner: 3,
        bonus: 0
    })
})

test('With 2 black card and 3 cards with color, highest black card should win', () => {
    const score = calculateScore([40, 30, 9, 52, 10])
    expect(score).toEqual({
        winner: 2,
        bonus: 0
    })
})

test('With skull king and cards with color, Skull King should win with no bonus points', () => {
    const score = calculateScore([40, 50, 9, 0, 10])
    expect(score).toEqual({
        winner: 3,
        bonus: 0
    })
})

test('With skull king and 1 pirate, Skull King should win with 30 bonus points', () => {
    const score = calculateScore([40, 3, 9, 0, 10])
    expect(score).toEqual({
        winner: 3,
        bonus: 30
    })
})

test('With skull king and 3 pirate, Skull King should win with 90 bonus points', () => {
    const score = calculateScore([4, 3, 9, 0, 1])
    expect(score).toEqual({
        winner: 3,
        bonus: 90
    })
})

test('With skull king and 3 pirate and 1 mermaid, mermaid should win with 50 bonus points', () => {
    const score = calculateScore([4, 3, 9, 0, 8, 1])
    expect(score).toEqual({
        winner: 4,
        bonus: 50
    })
})

test('With skull king and 3 pirate and 2 mermaid, first mermaid should win with 50 bonus points', () => {
    const score = calculateScore([4, 3, 7, 0, 8, 1])
    expect(score).toEqual({
        winner: 2,
        bonus: 50
    })
})

test('With 1 pirate and color cards, pirate should win', () => {
    const score = calculateScore([10, 25, 1, 39, 57])
    expect(score).toEqual({
        winner: 2,
        bonus: 0
    })
})

test('With 2 pirate and color cards, first pirate should win', () => {
    const score = calculateScore([10, 3, 1, 39, 57])
    expect(score).toEqual({
        winner: 1,
        bonus: 0
    })
})

test('With 1 pirate and 1 mermaid and color cards, pirate should win', () => {
    const score = calculateScore([10, 8, 1, 39, 57])
    expect(score).toEqual({
        winner: 2,
        bonus: 0
    })
})

test('With 1 mermaid and color cards, mermaid should win', () => {
    const score = calculateScore([10, 8, 11, 39, 57])
    expect(score).toEqual({
        winner: 1,
        bonus: 0
    })
})

test('With 2 mermaid and color cards, first mermaid should win', () => {
    const score = calculateScore([10, 8, 11, 7, 57])
    expect(score).toEqual({
        winner: 1,
        bonus: 0
    })
})
