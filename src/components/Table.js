import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import Hand from './Hand'

import Card from './Card'
import { placeBet } from '../actions/round'

class Table extends React.Component {
    buildCardsInTable = () => {
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

    render() {
        const { classes, hasBet } = this.props
        const bets = this.renderBets()

        return (
            <Grid className={classes.root} item xs={12}>
                <Grid
                    container
                    justify="center"
                    spacing={8}
                >
                    {this.buildCardsInTable()}
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
    }
}

const mapStateToProps = (state) => {
    return {
        hand: state.hand.cards,
        table: state.round.cards,
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
