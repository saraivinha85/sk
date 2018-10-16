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
        return this.props.table.filter((c) =>c!==null).map(c =>
            <Grid key={c} item>
                <Card id={c} disabled />
            </Grid>
        )
    }

    renderBets = () => {
        const {hand, classes} = this.props
        return [...Array(hand.length + 1).keys()].map((t) => {
            return <Grid className={classes.betsGrid} key={t} item>
                <Avatar className={classes.bet} onClick={() => { this.handleBet(t) }}>{`${t}`}</Avatar>
            </Grid>
        })
    }

    handleBet = (bet) => {
        this.props.placeBet(bet)
    }

    render() {
        const { classes, hasBet } = this.props
        const bets = this.renderBets()
        const playedCards = this.renderCenterCards()

        return (
            <div className={classes.root}>
                <ContainerDimensions>
                    <PlayersHand />
                </ContainerDimensions>
                <div className={classes.centerCards}>
                    {playedCards}
                </div>
                {!hasBet && <div className={classes.betsContainer}>
                    {bets}
                </div>}
                <div className={classes.hand}>
                    <Hand/>
                </div>
            </div>
        )
    }
}

const styles = {
    root: {
        height: '85vh',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        textAlign: 'center',
    },
    hand: {
        bottom: '0px',
        position: 'absolute',
        width: '100%'
    },
    betsContainer: {
        display: 'inline-flex',
        alignItems: 'center'
    },
    centerCards: {
        display: 'inline-flex',
        alignItems: 'center'
    },

    betsGrid: {
        margin: '5px'
    },
    bet: {
        backgroundColor: '#0000002b',
        width: '80px',
        height: '80px',
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
