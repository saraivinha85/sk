import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import Hand from './Hand'

import Card from './Card'
import GlowEffect from './GlowEffect'

import { placeBet } from '../actions/round'

class PlayersHand extends React.Component {

    renderPlayers = () => {
        const { width, height, players, playerId, classes, table, hand, currentPlayer } = this.props

        const playerIndex = players.findIndex((p) => p.id === playerId)
        const sortedPlayers = players.slice(playerIndex + 1, players.length + 1).concat(players.slice(0, playerIndex))
        let x = null
        let y = null
        const w = 40

        let placement = []
        switch (sortedPlayers.length) {
            case 1:
                placement = [{x: width/2 - w/2, y: 0}]
                break
            case 2:
                placement = [{x: 0, y: 0}, {x: width - w, y: 0}]
                break
            case 3:
                placement = [{x: 0, y: height/2 - w/2}, {x: width/2 - w/2, y: 0}, {x: width - w, y: height/2 - w/2}]
                break
            case 4:
                placement = [{x: 0, y: height/2 - w/2}, {x: 0, y: 0}, {x: width - w, y: 0}, {x: width - w, y: height/2 - w/2}]
                break
            case 5:
                placement = [{x: 0, y: height/2 - w/2}, {x: width/4 - w/2, y: 0}, {x: width/2 - w/2, y: 0}, {x: width - width/4 - w, y: 0}, {x: width - w, y: height/2 - w/2}]

        }

        const renderCards = (count) => {
            const isEven = count % 2 === 0? true : false
            const length = ~~(count / 2)
            const evenCount = isEven? count : count - 1 

            const cardElements = Array.from(Array(evenCount).keys()).map((c, idx) => {
                let angle = length * 20

                if (idx<length) {
                    angle = angle * -1 + (20*(idx%length))
                } else {
                    angle = angle - (20*(idx%length)) 
                }

                return <div style={{ zIndex: idx<length? idx : count - idx%length - 1, position: 'absolute', transform: `rotate(${angle}deg)`, transformOrigin: '50% 0%'}}>
                    <Card xs disabled id={67}/>
                </div>
            })

            if (!isEven) {
                cardElements.push(<div style={{ zIndex: length <= 0? 0: length-1, position: 'absolute'}}>
                    <Card xs disabled id={67}/>
                </div>)
            } 

            return cardElements
        }

        return sortedPlayers.map((p, idx) => {
            const handClass = placement[idx].x === 0? classes.hiddenHandLeft : placement[idx].x === width - w? classes.hiddenHandRight : classes.hiddenHandTop
            const pIndex = players.indexOf(p)
            const cardsLeft = table[pIndex] !== null? 1: 0
            const played = table[playerIndex] !== null? 1: 0
            const count = hand.length - cardsLeft + played
            const avatar = <Avatar className={classes.avatar} src={p.photo}/>
            return <div key={p.id} style={{ position: 'absolute', left: `${placement[idx].x}px`, top: `${placement[idx].y}px` }}>
                {currentPlayer === p.id? <GlowEffect className={classes.glow}>{avatar}</GlowEffect> : avatar}
                <div className={handClass} >
                    {renderCards(count<=0? 0: count)}
                </div>
            </div>
        })

    }

    render() {
        const { classes } = this.props

        return (
            <div>
                {this.renderPlayers()}
            </div>
        )
    }
}

const styles = {
    root: {
        height: '60vh',
        position: 'relative'
    },
    hand: {
        bottom: '0px',
        position: 'absolute'
    },
    avatar: {
        margin: 0,
        backgroundColor: 'transparent'
    },
    glow: {
        borderRadius: '50px'
    },
    'hiddenHandTop': {
        position: 'relative',
        left: '-9px',
        top: '20px'
        //display: 'inline-flex'
    },
    'hiddenHandRight': {
        position: 'relative',
        transform: 'rotateZ(90deg)',
        right: '80px',
        top: '-10px'
    },
    'hiddenHandLeft': {
        position: 'relative',
        transform: 'rotateZ(-90deg)',
        left: '80px',
        top: '-10px'
    }
}

const mapStateToProps = (state) => {
    return {
        playerId: state.game.id,
        hand: state.hand.cards,
        table: state.round.cards,
        set: state.round.set,
        round: state.round.index,
        players: state.game.players,
        currentPlayer: state.round.currentPlayer
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        placeBet: (bet) => { dispatch(placeBet(bet)) },
        dispatch
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(PlayersHand))
