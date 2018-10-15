import React from 'react'
import { connect } from 'react-redux'
import ContainerDimensions from 'react-container-dimensions'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import Hand from './Hand'

import Card from './Card'
import { placeBet } from '../actions/round'
import PlayersHand from './PlayersHand'

class Table extends React.Component {
    renderCenterCards = () => {
        return this.props.table.map(c =>
            <Grid key={c} item>
                <Card id={c} disabled />
            </Grid>
        )
    }

    renderBets = () => {
        const {hand} = this.props
        return [...Array(hand.length + 1).keys()].map((t) => {
            return <Grid key={t} item>
                <Avatar onClick={() => { this.handleBet(t) }}>{`${t}`}</Avatar>
            </Grid>
        })
    }

    handleBet = (bet) => {
        this.props.placeBet(bet)
    }

    renderPlayers = () => {
        const {players, playerId} = this.props

        //const otherPlayers = players.filter((p)=>p.id!==playerId)
        const otherPlayers = [
            {name: 'p1',
            photo: 'http://downloads.oppserver.net/linux/tux/tux57.png'},
            {name: 'p2',
            photo: 'http://downloads.oppserver.net/linux/tux/tux57.png'},
        ]

        const x = this.table
        const radius = 250
        const width = 885
        const height = 570 
        let angle = 0
        const step = -Math.PI / ( otherPlayers.length - 1)

        return otherPlayers.map((p) => {
            const x = Math.round(width/2 + radius * Math.cos(angle) - 50/2)
            const y = Math.round(height/2 + radius * Math.sin(angle) - 100/2)
            angle += step
            return <div style={{position: 'absolute', left: `${x}px`, top: `${y}px`}}><Avatar
            src={p.photo}
        /></div>
        })
    }

    render() {
        const { classes, hasBet } = this.props
        const bets = this.renderBets()

        return (
            <div ref={r=>this.table=r} className={classes.root}>
                <ContainerDimensions>
                    <PlayersHand />
                </ContainerDimensions>
                <div className={classes.hand}>
                    <Hand/>
                </div>
            </div>
        )
           {/*  <Grid className={classes.root} item xs={12}>
                <Grid
                    container
                    justify="center"
                    spacing={8}
                >
                    {this.buildCenterCards()}
                </Grid>

                <Grid
                    container
                    justify="center"
                    spacing={Number(8)}
                >
                    {!hasBet && bets}
                </Grid>
                <Grid
                    className={classes.hand}
                    container
                    justify='center'
                    spacing={Number(8)}
                >
                    <Hand />
                </Grid>
                
            </Grid>
*/}
        
    }
}

const styles = {
    root: {
        height: '60vh',
        position: 'relative',
    },
    hand: {
        bottom: '0px',
        position: 'absolute',
        width: '100%'
    }
}

const mapStateToProps = (state) => {
    return {
        playerId: state.game.id,
        hand: state.hand.cards,
        table: state.round.cards,
        players: state.game.players,
        hasBet: state.round.bets.length > 0
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        placeBet: (bet) => { dispatch(placeBet(bet)) },
        dispatch
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Table))
