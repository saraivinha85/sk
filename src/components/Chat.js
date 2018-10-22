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
        return this.props.comments.map(row => {
            return (
                <ListItem key={row.ts}>
                    <Avatar src={row.photo} />
                    <ListItemText primary={row.from} secondary={`${new Date(row.ts).toLocaleTimeString()}: ${row.text}`} />
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
            <Paper className={classes.paper}>
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
                    InputProps={{
                        className: classes.input
                    }}
                    InputLabelProps={{
                        ref: (r) => {this.input = r},
                        shrink: true,
                    }}
                    onKeyPress={this.submitComment}
                />
            </Paper>
        )
    }
}

const styles = {
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
        color: 'unset'
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
