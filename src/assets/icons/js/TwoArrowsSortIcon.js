import React from 'react'
import Icon from 'react-icon-base'
export default (props) => {
  return (
    <Icon viewBox='0 0 24 24' {...props} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <title>{props.title || 'TwoArrowsSort'}</title>
      <g >
        <path d="M9.33268 8.16634L6.99935 5.83301L4.66602 8.16634" />
        <path d="M4.66602 19.833L6.99935 22.1663L9.33268 19.833" />
      </g>
    </Icon>
  )
}