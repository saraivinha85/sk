import React from 'react'
import {connect} from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import Card from './Card'
import {start} from '../actions/game'

class Deck extends React.Component {

    state = {
        spacing: '0',
    }

    buildDeck = () => {
        return this.props.cards.map( c =>
            <Grid key={c} item>
                <Card id={c}/>
            </Grid>
        )
    }

    render() {
        const { classes } = this.props;
        const { spacing } = this.state;

        const deck = this.buildDeck()

        return (
            <Grid item xs={12}>
                <button onClick={this.props.start}>play</button>
                <Grid
                    container
                    justify="center"
                    spacing={Number(spacing)}
                >
                    {deck}
                </Grid>
            </Grid>
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
        cards: state.deck.cards
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        start: () => {dispatch(start())},
        dispatch
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Deck))
