import React from 'react'
import {connect} from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'

import Card from './Card'
import {placeBet} from '../actions/round'

class Deck extends React.Component {

    state = {
        spacing: '0',
        hasBet: false
    }

    buildDeck = () => {
        return this.props.cards.map( c =>
            <Grid key={c} item>
                <Card disabled={!this.props.canPlayCard} id={c}/>
            </Grid>
        )
    }

    buildTricks = (round) => {
        return [...Array(round+1).keys()].map((t)=>{
            return <Grid key={t} item>
                <Avatar onClick={() => {this.handleBet(t)}}>{`${t}`}</Avatar> 
            </Grid>
        })
    }

    handleBet = (bet) => {
        this.props.placeBet(bet)
        this.setState({hasBet: true})
    }

    render() {
        const { classes, cards } = this.props;
        const { spacing } = this.state;

        const deck = this.buildDeck()

        const round = cards.length
        const tricks = this.buildTricks(round)

        return (
            <div>
                <Grid item xs={12}>
                    <Grid
                        container
                        justify="center"
                        spacing={Number(spacing)}
                    >
                        {deck}
                    </Grid>
                    <br/>
                    <Grid
                        container
                        justify="center"
                        spacing={Number(spacing)}
                    >
                        { round > 0 && !this.state.hasBet && tricks}
                    </Grid>
                </Grid>
            </div>
        )
    }
}

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        height: 140,
        width: 100,
    },
    control: {
        padding: theme.spacing.unit * 2,
    },
})

const mapStateToProps = (state) => {
    return {
        cards: state.deck.cards,
        canPlayCard: state.round.bets.length === state.game.players.length,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        placeBet: (bet) => {dispatch(placeBet(bet))},
        dispatch
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Deck))
