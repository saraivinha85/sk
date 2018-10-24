import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import { Transition, animated, Keyframes, config } from 'react-spring'
import delay from 'delay'

import Card from './Card'

const Container = Keyframes.Spring({
    // Single props
    show: { from: { boxShadow: 0 }, to: { boxShadow: 20 }, config: config.default},
    // Chained animations (arrays)
    showAndHide: [ { to: { opacity: 1 } }, { to: { opacity: 0 } }],
    // Functions with side-effects with access to component props
    glow: async (next, ownProps) => {
        await next({ from: { boxShadow: 0 }, to: { boxShadow: 25 }, config: config.default })
            console.log('im here2')
        //await delay(100)
        await next({ from: { boxShadow: 25 }, to: { boxShadow: 0 }, config: config.default })
            console.log('im here3')
    }
})

class Hand extends React.Component {

    state = {
        spacing: '0',
        reset: false
    }

    buildHand = () => {
        const { cards } = this.props
        return cards.map(c =>
        <Grid key={c} item>
            <Card id={c} />
        </Grid>
        )
    }

    reset = (other, a, b, c, d) => {
        //setInterval(() => {
        if (other.boxShadow === 0) {
            this.setState({reset: true})
            console.log(other, a, b, c, d)
        }
    }

    render() {
        const { classes, canPlay } = this.props
        const { spacing } = this.state;

        const hand = this.buildHand()

        const glowHand = <Container reset={this.state.reset} onRest={this.reset} state="glow">
            { styles => {
                return <div className={classes.test} style={{boxShadow: `0 0 ${styles.boxShadow}px #ffcf40`}}>
                    {hand}
                </div>}
            }
        </Container>


            return (
                <div>
                    <Grid item xs={12}>
                        <Grid
                            container
                            justify="center"
                            spacing={Number(spacing)}
                        >
                            {canPlay? glowHand : hand}
                        </Grid>
                    </Grid>
                </div>
            )
    }
}

const styles = theme => ({
    test: {
        backgroundColor: 'transparent',
        borderRadius: '20px',
        display: 'inline-flex'
    },
    root: {
        flexGrow: 1,
    },
    control: {
        padding: theme.spacing.unit * 2,
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
