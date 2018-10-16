import React from 'react'
import {connect} from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import Card from './Card'

class Hand extends React.Component {

    state = {
        spacing: '0',
    }

    buildHand = () => {
        const {cards} = this.props
        return cards.map( c =>
            <Grid key={c} item>
                <Card id={c}/>
            </Grid>
        )
    }

    render() {
        const { spacing } = this.state;

        const hand = this.buildHand()

        return (
            <div>
                <Grid item xs={12}>
                    <Grid
                        container
                        justify="center"
                        spacing={Number(spacing)}
                    >
                        {hand}
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
    control: {
        padding: theme.spacing.unit * 2,
    },
})

const mapStateToProps = (state) => {
    return {
        cards: state.hand.cards,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Hand))
