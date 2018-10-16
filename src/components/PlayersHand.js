import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import Hand from './Hand'

import Card from './Card'
import { placeBet } from '../actions/round'

class PlayersHand extends React.Component {

    renderPlayers = () => {
        const { width, height, players, playerId, classes, hand } = this.props

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

        const numberCards = hand.length 
        const radius = 70
        const cwidth = 40
        const cheight = 58
        const cardWidth = 50
        const cardHeight = 70
        const step = (Math.PI) / (numberCards -1)

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
                    <Card disabled id={67}/>
                </div>
            })

            if (!isEven) {
                cardElements.push(<div style={{ zIndex: length-1, position: 'absolute'}}>
                    <Card disabled id={67}/>
                </div>)
            } 

            return cardElements
        }

        return sortedPlayers.map((p, idx) => {
            const handClass = placement[idx].x === 0? classes.hiddenHandLeft : placement[idx].x === width - w? classes.hiddenHandRight : classes.hiddenHandTop
            return <div key={p.id} style={{ position: 'absolute', left: `${placement[idx].x}px`, top: `${placement[idx].y}px` }}>
                <Avatar className={classes.avatar} src={p.photo}/>
                <div className={handClass} >
                    {renderCards(numberCards)}
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
        backgroundColor: '#00000069'
    },
    'hiddenHandTop': {
        position: 'relative',
        left: '-5px',
        top: '35px'
        //display: 'inline-flex'
    },
    'hiddenHandRight': {
        position: 'relative',
        transform: 'rotateZ(90deg)',
        right: '60px',
        top: '-10px'
    },
    'hiddenHandLeft': {
        position: 'relative',
        transform: 'rotateZ(-90deg)',
        left: '60px',
        top: '-10px'
    }
}

const mapStateToProps = (state) => {
    return {
        playerId: state.game.id,
        hand: state.hand.cards,
        table: state.round.cards,
        players: state.game.players,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        placeBet: (bet) => { dispatch(placeBet(bet)) },
        dispatch
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(PlayersHand))
