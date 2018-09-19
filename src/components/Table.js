import React from 'react'
import {connect} from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'

import Card from './Card'

class Table extends React.Component {
    buildDeck = () => {
        return this.props.cards.map( c =>
            <Grid key={c} item>
                <Card id={c} disabled/>
            </Grid>
        )
    }

    render() {
        return (
           <Grid item xs={12}>
                <Grid
                    container
                    justify="center"
                    spacing={8}
                >
                    {this.buildDeck()}
                </Grid>
            </Grid>
        )
    }
}

const styles = {
}

const mapStateToProps = (state) => {
    return {
        cards: state.round.cards
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Table))
