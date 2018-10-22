import React, { Component } from 'react'
import {connect} from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'

import Toolbar from './Toolbar' 
import ChatWindow from './ChatWindow'
import Chat from './Chat'
import Queue from './Queue'
import Players from './Players'
import Table from './Table'

class Layout extends Component {
    render() {
        const {classes, isGameStarted} = this.props

        return (
            <div className={classes.root}>
                <Grid container spacing={24}>
                    <Grid item xs={12}>
                        <StyledPaper className={classes.paper}>
                            <Toolbar />
                        </StyledPaper>
                    </Grid>
                    <Grid item xs={12}>
                        <StyledPaper className={classes.paper}>
                            {isGameStarted? <Table />: <Queue />}
                        </StyledPaper>
                    </Grid>
                    <Grid item xs={3}>
                        <StyledPaper className={classes.paper}>
                            <Players />
                        </StyledPaper>
                    </Grid>
                    <Grid item xs={9}>
                                            </Grid>                    
                </Grid>
                <ChatWindow>
                    <StyledPaper className={classes.paper}>
                        <Chat />
                    </StyledPaper>
                </ChatWindow>
                
            </div>
        )
    }
}

const StyledPaper = withStyles({
    root: {
        backgroundColor: '#fafafa14',
    }
})(Paper)

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: '#ffffff9c',
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
