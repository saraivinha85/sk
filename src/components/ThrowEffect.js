import React from 'react'
import { Keyframes, config } from 'react-spring'
import { withStyles } from '@material-ui/core/styles'

const Container = Keyframes.Spring({
    glow: [ { from: { boxShadow: 0, translate: 100 }, to: { boxShadow: 360, translate: 0 } }],
})

const styles = {
    glow: {
        backgroundColor: 'transparent',
        display: 'inline-flex',
    }
}

class ThrowEffect extends React.Component {

    state = {
        reset: true
    }

    reset = (styles) => {
        // if (styles.boxShadow === 0) {
        //     this.setState({reset: true})
        // }
    }

    render() {
        const {start, classes, children, className} = this.props

        const container = <Container onRest={this.reset} state="glow">
            { styles => {
                return <div className={`${className} ${classes.glow}`} style={{transform: `translateY(${styles.translate}%) rotateZ(${styles.boxShadow}deg)`}}>
                    {children}
                </div>
            }}
        </Container>


          return (start? container : children)
    }
}

export default withStyles(styles)(ThrowEffect)
