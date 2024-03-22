// ** React Imports
import React, {useEffect, useState} from 'react'
import ReactDOM from "react-dom";
import {
  useLocation
} from "react-router-dom";
import PageBuilder from '../../views/pages/vsl-client/projects/pageBuilder'

// ** Custom Hooks
import {useSkin} from '@hooks/useSkin'

// ** Third Party Components
import classnames from 'classnames'

const BlankLayout = ({ children }) => {
  // ** States
  const [isMounted, setIsMounted] = useState(false)

  // ** Hooks
  const { skin } = useSkin()

  /* const location = useLocation().pathname.replaceAll("/", ''); */

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  if (!isMounted) {
    return null
  }

  if (location.pathname.includes('/page-builder')) {
    return <PageBuilder />
  } else {
    return (
      <div
        className={classnames('blank-page', {
          'dark-layout': skin === 'dark'
        })}
      >
        <div className='app-content content'>
          <div className='content-wrapper'>
            <div className='content-body'>{children}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default BlankLayout
