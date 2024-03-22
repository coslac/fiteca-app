import React, { useEffect, useRef, useState } from "react"
import { Badge, Button, DropdownItem, DropdownMenu, DropdownToggle, Label, Offcanvas, OffcanvasBody, OffcanvasHeader, UncontrolledDropdown } from "reactstrap";
import BellIcon from "@icons/BellIcon";
import classnames from 'classnames'
import OffCanvasPlacement from "../../../../views/components/offcanvas/OffCanvasPlacement";
import { Bell } from "react-feather";
import { PreviewNotificationComponent } from "../../../../views/pages/vsl-admin/notifications/newNotification/newNotificationContent";
import { getUserData } from '@utils'
import { axiosDb } from '@configs/appConfig'
import './NotificationsOffCanvasStyles.scss'
import EmptyNotificationIcon from "../../../../assets/icons/js/EmptyNotificationIcon";
import moment from 'moment';

export const useInterval = (callback, delay) => {

  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);


  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const NotificationsOffCanvas = () => {
  const [canvasPlacement, setCanvasPlacement] = useState('end')
  const [canvasOpen, setCanvasOpen] = useState(false)
  const [userNotificationId, setUserNotificationId] = useState([])
  const [notification, setNotification] = useState([])
  const [notificationToRender, setNotificationTorender] = useState([])
  //const [idToRemove, setIdToRemove] = useState()
  const today = new Date()
  const dateAndHour = moment(today).format("YYYY-MM-DD HH:mm:ss")
  const userId = getUserData()?.id

  const getNotificationId = async () => {
    try {
      const response = await axiosDb.get(`_table/sct_notificacao_usuario`, {
        params: {
          filter: `usu_id=${userId}`
        }
      })
      setUserNotificationId(response.data.resource)
      /*const allNotId = response.data.resource.filter((not) => !not.lida_em).map((not) => not.id)
      if (response.status === 200 && allNotId.length) {
        const patchResponse = await axiosDb.patch(`_table/sct_notificacao_usuario`, {
            resource: [
              { 
                lida_em: dateAndHour
            }
          ],
          ids: allNotId
        })
      }*/
    } catch (error) {
      console.warn(error)
    }
  }

  const patchReadTime = async() => {
    const allNotId = userNotificationId.filter((not) => !not.lida_em).map((not) => not.id)
    try {
      const patchResponse = await axiosDb.patch(`_table/sct_notificacao_usuario`, {
        resource: [
          { 
            lida_em: dateAndHour
        }
      ],
      ids: allNotId
    })
    } catch (error) {
      console.warn(error)
    }

  }

  const requestToDeleteUserNotification = async(id) => {
    try {
      const response = await axiosDb.delete(`_table/sct_notificacao_usuario/${id.id}`)
    } catch (error) {
      console.warn(error)
    }
    getNotificationId()
  }
  
  const postAccessDateAndHour = async(userNot) => {
    try {
      const response = await axiosDb.patch(`_table/sct_notificacao_usuario`, {
        resource: [
          { 
            id: userNot.id,
            acessada_em: dateAndHour
        }
      ]
    })
    } catch (error) {
      console.warn(error)
    }
  }

  const deleteAllNotifications = async(ids) => {
    const response = await axiosDb.delete(`_table/sct_notificacao_usuario`, {
      params: {
        ids
      }
    })
    if (response.status === 200) {
      getNotificationId()
    }

  }

  
  const requestNotifications = async (id) => {
    if (id.length > 0) {
      try {
        const response = await axiosDb.get(`_table/sct_notificacao`, {
          params: {
            ids: id
          }
        })

        setNotificationTorender(response.data.resource)
      } catch (error) {
        console.warn(error)
      }
    }
  }

  const toggleCanvasEnd = () => {
    setCanvasPlacement('end')
    setCanvasOpen(!canvasOpen)
  }

  const openCanvas = () => {
    getNotificationId()
    toggleCanvasEnd()
    patchReadTime()
  }

  
  const getIdAndStatusOfNotification = async (notificationsIds) => {
    setNotification([])
    notificationsIds.map((not) => setNotification((prev) => [...prev, not.not_id]))
    //requestNotifications(notification)
  }

  const removeUserNotification = (notId) => {
    requestToDeleteUserNotification(userNotificationId?.find((e) => e.not_id === notId))
    // setUserNotificationId(userNotificationId?.filter(notification => notification.not_id !== notId))
  }

  const handleDeleteAllNot = () => {
    const idsToDelete = userNotificationId.map((not) => {
      return (
        not.id
      )
    })
    deleteAllNotifications(idsToDelete)    
  }

  const setLinkAccessedTime = (notId) => {
    const userNotId = userNotificationId.find(e => e.not_id === notId)
    postAccessDateAndHour(userNotId)
  }

  
  const EmptyNotification = () => {
    return (
      <div style={{ padding: 16 }}>
        <div style={{ padding: 16, borderStyle: 'dashed', borderRadius: 5, borderWidth: 1, borderColor: '#424253', textAlign: 'center' }}>
          <div style={{ marginBottom: 12 }}><EmptyNotificationIcon /></div>
          <span style={{ fontSize: 16, color: '#EEF5F8', fontWeight: 400 }}>
          Não há notificações no momento
          </span>
          <p style={{fontSize: 12, color: '#788CA0'}} >
          Avisaremos você quando houver.
          </p>
        </div>
      </div>
    )
  }


  useEffect(() => {
    getNotificationId()

  }, [])


    useInterval(() => {
      getNotificationId()
    }, 120000)// Atualizar a cada 2 minutos*/


  useEffect(() => {
    if (userNotificationId.length > 0) {
      getIdAndStatusOfNotification(userNotificationId)
    }
  }, [userNotificationId])

  useEffect(() => {
    requestNotifications(notification)
  }, [notification])

  useEffect(() => {
    return (
      setNotification([])
    )
  }, [])


  return (
    <UncontrolledDropdown
      tag="li"
      className="dropdown-notification nav-item me-25"
    >
      <DropdownToggle
        tag="a"
        className="nav-link"
        href="/"
        onClick={(e) => e.preventDefault()}
      >
        <div >
          <BellIcon size={24}  onClick={() => { openCanvas() }} />
          {userNotificationId.length >= 1 ? <Badge
            pill
            color="danger"
            className="badge-up notification-badge"
          /> : null}
          <Offcanvas className="menu-dark menu-shadow" style={{ width: 436 }} direction={canvasPlacement} isOpen={canvasOpen} toggle={toggleCanvasEnd}>
            <OffcanvasHeader  style={{marginTop: 20}} toggle={toggleCanvasEnd} >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Bell size={24} />
                <h3 style={{ marginTop: 8, marginLeft: 12 }}>Notificações</h3>
              </div>
            </OffcanvasHeader>
            <OffcanvasBody>
              {userNotificationId.length >= 1 ? <Label onClick={() => handleDeleteAllNot()}  style={{marginBottom: 24, fontSize: 14, fontWeight: 600, color: '#8B61FF', cursor: 'pointer'}}>Apagar todas notificações</Label> : null}
              {userNotificationId.length >= 1 ? notificationToRender?.map((notification) => {
                return (
                  <div style={{ marginBottom: 16 }}>
                    <PreviewNotificationComponent
                      url={notification.foto_url}
                      title={notification.titulo}
                      text={notification.texto}
                      link={notification.link}
                      noBackground={true}
                      onClose={() => { removeUserNotification(notification.id) }}
                      onClick={() => { setLinkAccessedTime(notification.id) }}
                    />
                  </div>
                )
              }) : <EmptyNotification/>}
            </OffcanvasBody>
          </Offcanvas>
        </div>
      </DropdownToggle>
    </UncontrolledDropdown>
  )
}

export default NotificationsOffCanvas;