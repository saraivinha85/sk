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
        const { width, height, classes } = this.props

        //const otherPlayers = players.filter((p)=>p.id!==playerId)
        const players = [


            {
                name: 'p2', id: '2',
                photo: 'http://downloads.oppserver.net/linux/tux/tux57.png'
            },
            {
                name: 'p2', id: '4',
                photo: 'http://downloads.oppserver.net/linux/tux/tux57.png'
            },
            {
                name: 'p1', id: '3',
                photo: 'http://downloads.oppserver.net/linux/tux/tux57.png'
            },
            {
                name: 'p1', id: '5',
                photo: 'http://downloads.oppserver.net/linux/tux/tux57.png'
            },
            {
                name: 'p1', id: '1',
                photo: 'http://downloads.oppserver.net/linux/tux/tux57.png'
            },
            {
                name: 'p1', id: '6',
                photo: 'http://downloads.oppserver.net/linux/tux/tux57.png'
            },
        ]

        const playerId = '1'


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
                placement = [{x: 0, y: height/2 - w/2}, {x: 0, y: 0}, {x: width/2 - w/2, y: 0}, {x: width - w, y: 0}, {x: width - w, y: height/2 - w/2}]

        }

        const cards = [1,2,3,4,5,6]

        const radius = 70
        const cwidth = 40
        const cheight = 40 + 40
        const cardWidth = 50
        const cardHeight = 70
        let angle = 0
        const step = (Math.PI) / (cards.length -1)

        const renderCards = cards.map((c) => {
            const x = Math.round(cwidth/2 + radius * Math.cos(angle) - cardWidth/2);
            const y = Math.round(cheight/2 + radius * Math.sin(angle) - cardHeight/2);
            angle += step
            return <div style={{ position: 'absolute', left: `${x}px`, top: `${y}px` }}>
                <Card disabled id={67}/>
            </div>
        })

        return sortedPlayers.map((p, idx) => {
            return <div style={{ position: 'absolute', left: `${placement[idx].x}px`, top: `${placement[idx].y}px` }}>
                <Avatar className={classes.avatar} src={p.photo}/>
                <div className={classes.hiddenHand}>
                    {renderCards}
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
    'hiddenHand': {
        display: 'inline-flex'
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
