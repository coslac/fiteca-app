// ** React Imports
import {useState} from 'react'
// ** Reactstrap Imports
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap'

const VslConfirmationModal = ({handleDelete}) => {
  // ** States
  const [modalOpened, setModalOpened] = useState(false)
  const [modalClosed, setModalClosed] = useState(false)

  return (
    <div className='demo-inline-spacing'>
      <div className='on-closed-modal'>
        <Button color='primary' outline onClick={() => setModalClosed(!modalClosed)}>
          On Closed
        </Button>
        <Modal
          isOpen={modalClosed}
          onClosed={() => handleDelete}
          toggle={() => setModalClosed(!modalClosed)}
          className='modal-dialog-centered'
        >
          <ModalHeader toggle={() => setModalClosed(!modalClosed)}>Basic Modal</ModalHeader>
          <ModalBody>

          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={() => setModalClosed(!modalClosed)}>
              Accept
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  )
}

export default VslConfirmationModal
