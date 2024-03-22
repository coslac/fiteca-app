import React from 'react'
import Icon from 'react-icon-base'

export default (props) => {
  return (
    <Icon viewBox='0 0 24 24' {...props} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <title>{props.title || 'Usersicon'}</title>
      <g>
<path d="M2 19C2 16.8 3.8 15 6 15H10C12.2 15 14 16.8 14 19"/>
<path d="M10.5 6C11.9 7.4 11.9 9.6 10.5 10.9C9.1 12.2 6.9 12.3 5.6 10.9C4.3 9.5 4.2 7.4 5.5 6C6.8 4.6 9.1 4.7 10.5 6"/>
<path d="M16 14H19C20.7 14 22 15.3 22 17"/>
<path d="M19.3 6.69999C20.3 7.69999 20.3 9.29999 19.3 10.2C18.3 11.1 16.7 11.2 15.8 10.2C14.9 9.19999 14.8 7.59999 15.8 6.69999C16.7 5.79999 18.3 5.79999 19.3 6.69999"/>
</g>
    </Icon>
  )
}
