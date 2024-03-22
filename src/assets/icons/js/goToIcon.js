import React from 'react'
import Icon from 'react-icon-base'

export default (props) => {
  return (
    <Icon viewBox='0 0 24 24' {...props} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <title>{props.title || 'Gotoicon'}</title>
      <g>
<path d="M16 3H21V8"/>
<path d="M14 10L21 3"/>
<path d="M19 14V19C19 20.105 18.105 21 17 21H5C3.895 21 3 20.105 3 19V7C3 5.895 3.895 5 5 5H10"/>
</g>
    </Icon>
  )
}
