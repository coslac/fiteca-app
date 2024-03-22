import React from 'react'
import Icon from 'react-icon-base'

export default (props) => {
  return (
    <Icon viewBox='0 0 24 24' {...props} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <title>{props.title || 'Myprojectsicon'}</title>
      <g>
<path d="M12 2.99625V7.99833"/>
<path d="M21.0037 17.0021V9.99916C21.0037 8.89413 20.1079 7.99833 19.0029 7.99833H4.99708C3.89205 7.99833 2.99625 8.89413 2.99625 9.99916V17.0021"/>
<rect x="6.99792" y="14.0008" width="5.00208" height="3.00125"/>
<path fillRule="evenodd" clipRule="evenodd" d="M19.0029 21.0037H5.24719C4.00403 21.0037 2.99625 19.996 2.99625 18.7528V8.49854C2.99593 7.95823 3.10553 7.4235 3.31838 6.92688L4.41284 4.36282C4.76675 3.53379 5.58129 2.99601 6.4827 2.99625H17.5163C18.4177 2.99601 19.2322 3.53379 19.5862 4.36282L20.6866 6.92688C20.8976 7.4239 21.0055 7.95859 21.0038 8.49854V19.0029C21.0038 20.1079 20.1079 21.0037 19.0029 21.0037Z"/>
</g>
    </Icon>
  )
}
