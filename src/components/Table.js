import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import Hand from './Hand'

import Card from './Card'
import { placeBet } from '../actions/round'

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
        const {players} = this.props

        const radius = 250
        const width = 885
        const height = 570 
        let angle = 360
        const step = 2 * Math.PI / 6 //players.length

        return [1,2,3,4,5,6].map(function() {
            const x = Math.round(width/2 + radius * Math.cos(angle) - 50/2)
            const y = Math.round(height/2 + radius * Math.sin(angle) - 100/2)
            angle += step
            return <div style={{position: 'absolute', left: `${x}px`, top: `${y}px`}}><Card id={67} disabled/></div>
        })

    }

    render() {
        const { classes, hasBet } = this.props
        const bets = this.renderBets()

        return (
            <div className={classes.root}>
                {this.renderPlayers()}
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
        position: 'relative'
    },
    hand: {
        bottom: '0px',
        position: 'absolute'
    }
}

const mapStateToProps = (state) => {
    return {
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
