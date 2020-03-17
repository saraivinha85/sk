import React from 'react'
import { connect } from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Drawer from '@material-ui/core/Drawer'

import Chat from './Chat'
import { toggleChatWindow } from '../actions/game'

class ChatWindow extends React.Component {
    handleClose = () => {
        const { toggleChatWindow } = this.props
        toggleChatWindow()
    }

    render() {
        const { classes, isOpen, children } = this.props
        return (
            <StyledPaper>
                <Drawer
                    anchor={'bottom'}
                    variant={'temporary'}
                    open={isOpen}
                    onClose={this.handleClose}
                    PaperProps={{ component: StyledPaper }}
                >
                    <Chat />
                </Drawer>
            </StyledPaper>
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
    paper: {
        height: '100%',
        textAlign: 'center'
    }
}

const mapStateToProps = (state) => {
    return {
        isOpen: state.game.isChatOpen
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleChatWindow: () => { dispatch(toggleChatWindow()) },
        dispatch
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ChatWindow))
