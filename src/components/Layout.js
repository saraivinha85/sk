import React, { Component } from 'react'
import {connect} from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'

import GameOptions from './GameOptions'
import GameQueue from './Queue'
import Players from './Players'
import Chat from './Chat'
import Hand from './Hand'
import GameTable from './Table'

class Layout extends Component {
    render() {
        const {classes, isGameStarted} = this.props

        return (
            <div className={classes.root}>
                <Grid container spacing={24}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>Skull King</Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            {isGameStarted? <div><GameTable /><Hand/></div>: <GameQueue />}
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper className={classes.paper}>
                            <Players />
                        </Paper>
                    </Grid>
                    <Grid item xs={9}>
                        <Paper className={classes.paper}>
                            <Chat />
                        </Paper>
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
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
})

const mapStateToProps = (state) => {
    return {
        isGameStarted: state.game.started
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Layout))
