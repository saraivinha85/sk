import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import ListSubheader from '@material-ui/core/ListSubheader'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import Grid from '@material-ui/core/Grid'

import Players from './Players'
import { submitComment } from '../actions/game'

class Chat extends Component {
    state = {
        multiline: ''
    }

    handleChange = (e) => {
        this.setState({
            multiline: e.target.value
        })
    }

    submitComment = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            this.props.submitComment(e.target.value)
            e.target.value = ''
        }
    }

    renderComments = () => {
        const {comments, classes} = this.props
        return comments.map(row => {
            return (
                <ListItem key={row.ts}>
                    <Avatar src={row.photo} />
                    <ListItemText className={classes.text} primary={row.from} secondary={`${new Date(row.ts).toLocaleTimeString()}: ${row.text}`} />
                </ListItem>
            )
        })
    }

    componentDidUpdate = () => {
        document.getElementsByClassName('list')[0].scrollIntoView(0)
    }

    render() {
        const { classes } = this.props

        return (
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <StyledPaper className={classes.paper2}>
                        <Players />
                    </StyledPaper>
                </Grid>
                <Grid item xs={9}>
                    <StyledPaper className={classes.paper2}>
                        <Paper className={classes.paper2}>
                            <ListSubheader className={classes.header} component="div">Chat</ListSubheader>
                            <div style={{ height: '40vh', overflow: 'auto' }}>
                                <List className={'list'}>
                                    {this.renderComments()}
                                </List>
                            </div>
                            <TextField
                                id="standard-full-width"
                                fullWidth
                                variant='filled'
                                inputRef={(r)=>{this.input = r}}
                                InputProps={{
                                    inputProps: {className: classes.input},
                                    autoFocus: true,
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                onKeyPress={this.submitComment}
                            />
                        </Paper>

                    </StyledPaper>
                </Grid>
            </Grid>
        )
    }
}

const StyledPaper = withStyles({
    root: {
        backgroundColor: '#2f2f2fbd',
        overflow: 'hidden'
    }
})(Paper)

const styles = {
    root: {
        backgroundColor: '#ffffff00',
    },
    text: {
        paddingLeft: '7px',
    },
    paper2: {
        height: '100%',
        textAlign: 'center'
    },
    header: {
    },
    paper: {
        padding: '15px'
    },
    name: {
        fontSize: '15px',
        color: 'unset',
        width: '20%',
        borderBottom: '1px solid rgba(224, 224, 224, 0.19)',
        fontFamily: 'cursive'
    },
    message: {
        fontSize: '15px',
        color: 'unset',
        borderBottom: '1px solid rgba(224, 224, 224, 0.19)',
        fontFamily: 'cursive'
    },
    avatar: {
        borderBottom: '1px solid rgba(224, 224, 224, 0.19)',
        width: '1%'
    },
    input: {
        padding: '10px'
    }
}

const mapStateToProps = (state) => {
    return {
        comments: state.game.comments
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        submitComment: (c) => { dispatch(submitComment(c)) }
    }
}

export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatchToProps
)(Chat))
