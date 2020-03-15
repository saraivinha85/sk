import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import Card from './Card'
import GlowEffect from './GlowEffect'

class Hand extends React.Component {

    state = {
        spacing: '0',
    }

    buildHand = () => {
        const { cards } = this.props
        return cards.map(c =>
        <Grid key={c} item>
            <Card id={c} />
        </Grid>
        )
    }

    render() {
        const { classes, canPlay } = this.props
        const { spacing } = this.state
        const hand = this.buildHand()
        return (
            <div>
                <Grid item xs={12}>
                    <Grid
                        className={classes.grid}
                        container
                        justify="center"
                        spacing={Number(spacing)}
                    >
                        {canPlay? <GlowEffect className={classes.glow}>{hand}</GlowEffect> : hand}
                    </Grid>
                </Grid>
            </div>
        )
    }
}

const styles = theme => ({
    glow: {
        borderRadius: '10px'
    },
    root: {
        flexGrow: 1,
    },
    grid: {
        // flexWrap: 'nowrap',
        // overflowX: 'auto',
        // display: 'flex',
        // justifyContent: 'flex-start'
    },
    control: {
        padding: theme.spacing(2),
    },
    turnIndicatorOn: {
        border: '1px solid',
        padding: '5px',
        display: 'flex'
    },
    turnIndicatorOff: {
        border: '1px solid transparent',
        padding: '5px',
        display: 'flex'
    },
})

const mapStateToProps = (state) => {
    return {
        cards: state.hand.cards,
        canPlay: state.round.canPlay
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Hand))
