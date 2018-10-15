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
                <TableRow key={row.ts}>
                    <TableCell style={{ width: '20%' }}>
                        {row.from}<p />{row.ts}
                    </TableCell>
                    <TableCell>{row.text}</TableCell>
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
                        label="Comment"
                        fullWidth
                        variant='filled'
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
