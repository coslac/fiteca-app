import React from 'react'
import Icon from 'react-icon-base'

export default (props) => {
  return (
    <Icon viewBox='0 0 24 24' {...props}  fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <title>{props.title || 'Marketplaceicon'}</title>
      <g>
<path fillRule="evenodd" clipRule="evenodd" d="M7.40899 14.246L5.87399 7H18.5C19.151 7 19.628 7.611 19.47 8.243L18.122 13.635C17.917 14.454 17.221 15.056 16.381 15.14L9.56499 15.822C8.54899 15.923 7.61999 15.244 7.40899 14.246Z"/>
<path d="M5.874 7L5.224 4H3.5"/>
<path d="M17.109 19.267C16.907 19.267 16.743 19.431 16.745 19.633C16.745 19.835 16.909 19.999 17.111 19.999C17.313 19.999 17.477 19.835 17.477 19.633C17.476 19.431 17.312 19.267 17.109 19.267"/>
<path d="M8.697 19.267C8.495 19.267 8.331 19.431 8.333 19.633C8.331 19.836 8.496 20 8.698 20C8.9 20 9.064 19.836 9.064 19.634C9.064 19.431 8.9 19.267 8.697 19.267"/>
</g>
    </Icon>
  )
}
