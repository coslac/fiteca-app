import React from 'react'
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import './styles.scss'
import { X } from 'react-feather'
import OutButton from '@src/@core/components/vsl-button'

const VSLModal = ({
    isOpen, onClose, onConfirm, children, title, loading, className, leftFooterButton = null, ...others
}) => {

    const handleConfirm = () => {
        onConfirm()
    }

    const handleClose = () => {
        onClose()
    }

    return (
        <Modal centered isOpen={isOpen} {...others} contentClassName={`modal-container`} backdropClassName="vsl-backdrop">
            <ModalHeader tag="div" className="vsl-header-modal" close>
                <span className="modal-title-header"> {title} </span>
                <X className="modal-close-header" onClick={onClose} size="24px" />
            </ModalHeader>
            <ModalBody className="vsl-body-modal">
                {children}
            </ModalBody>
            <ModalFooter className="vsl-footer-modal">
                <div>
                    { leftFooterButton }
                </div>
                <div className="vsl-footer-btns">
                <Button color='primary' className="vsl-cancel-button" disabled={loading} outline onClick={handleClose}>
                    Cancelar
                </Button>
                <OutButton type="submit" loading={loading} title="Confirmar" onClick={handleConfirm} />
                </div>
            </ModalFooter>
        </Modal>
    )
}

export default VSLModal