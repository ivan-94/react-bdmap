import React from 'react'
import Styled from 'rsg-components/Styled'
import logo from '../logo.png'
import pkg from '../package.json'

const styles = theme => {
  console.log(theme)
  const { fontFamily, color } = theme
  return {
    logo: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: 0,
      fontFamily: fontFamily.base,
      fontSize: 14,
      fontWeight: 'normal',
      color: color.base,
    },
    image: {
      width: '2.5em',
      marginBottom: '0.5em',
    },
    version: {
      fontSize: '13px',
      color: color.light,
    },
  }
}

export function LogoRenderer({ classes, children }) {
  return (
    <h1 className={classes.logo}>
      <img src={logo} className={classes.image} />
      {children}
      <span className={classes.version}>({pkg.version})</span>
    </h1>
  )
}

export default Styled(styles)(LogoRenderer)
