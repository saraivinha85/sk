import React from 'react'
import {connect} from 'react-redux'

import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Drawer from '@material-ui/core/Drawer'
import Button from '@material-ui/core/Button'
import PersonAdd from '@material-ui/icons/PersonAdd'

import {openChat} from '../actions/game'

class ChatWindow extends React.Component {
    handleToggleChat = () => {
        const {toggle} = this.props
        toggle()
    }

    render() {
        const {classes, isOpen, children} = this.props
        return (
            <div>
                <Drawer
                    anchor={'bottom'}
                    variant={'temporary'}
                    open={isOpen}
                    PaperProps={ {component: StyledPaper} }
                >
                    {children} 
                </Drawer>
                <Button className={classes.button} color="primary" variant='contained' onClick={this.handleToggleChat}>
                    Open chat
                </Button>
            </div>
        )
    }
}

const StyledPaper = withStyles({
    root: {
        backgroundColor: '#fafafa14',
    }
})(Paper)

const styles = {
    root: {
        backgroundColor: '#ffffff00'
    },
    button: {
        zIndex: 5000
    }
}

const mapStateToProps = (state) => {
    return {
        isOpen: state.game.isChatOpen
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggle: () => {dispatch(openChat())},
        dispatch
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ChatWindow))
