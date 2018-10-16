import React, { Component } from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import ListSubheader from '@material-ui/core/ListSubheader'
import InputAdornment from '@material-ui/core/InputAdornment'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
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
        const {classes} = this.props
        return this.props.comments.map(row => {
            return (
                <TableRow key={row.ts}>
                    <TableCell className={classes.avatar}>
                        <Avatar src={row.photo}/>
                    </TableCell>
                    <TableCell className={classes.name}>
                        {row.from}
                    </TableCell>
                    <TableCell className={classes.name}>
                        {row.ts}
                    </TableCell>
                    <TableCell className={classes.message}>{row.text}</TableCell>
                </TableRow>
            )
        })
    }

    render() {
        const { classes } = this.props

        return (
            <div>
                <ListSubheader className={classes.header} component="div">Chat</ListSubheader>
                <div style={{height: '200px', overflow: 'auto'}}>
                    <Table className={classes.table}>
                        <TableBody>
                            {this.renderComments()}
                        </TableBody>
                    </Table>
                </div>
                <TextField
                        id="standard-full-width"
                        fullWidth
                        variant='filled'
                        InputProps={{
                            className: classes.input
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onKeyPress={this.submitComment}
                    />
            </div>
        )
    }
}

const styles = {
    header: {
        color: '#ffffff9c'
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
