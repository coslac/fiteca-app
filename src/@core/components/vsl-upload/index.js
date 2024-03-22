import { Fragment, useEffect, useState } from 'react'
import './styles.scss'
import { useDropzone } from 'react-dropzone'
import { Button, Col, Label, ListGroup, ListGroupItem, Row } from 'reactstrap'
import { Image, X } from 'react-feather'
import { uploadImageWithImagekit } from "@utils"

const VslUpload = ({ onUpload, label, onStartUpload, initialFileUrl }) => {
    const [files, setFiles] = useState([])

    const blobUrlToFile = blobUrl => new Promise((resolve) => {
        fetch(blobUrl).then((res) => {
          res.blob().then((blob) => {
            const file = new File([blob], 'user-image', {type: blob.type})
            resolve(file)
          })
        })
      })
    
      const loadFile = async (img) => {
        try {
          const base64getBase64FromUrl = await blobUrlToFile(img);
          setFiles([base64getBase64FromUrl])
        } catch (error) {
          console.warn(error)
        }
    
      }

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    const { getRootProps, getInputProps } = useDropzone({
        multiple: false,
        onDrop: async acceptedFiles => {
            onStartUpload()
            const fileUploaded = acceptedFiles.map(file => Object.assign(file))
            setFiles([...files, ...fileUploaded])
            let imageUrl = fileUploaded[0] ? await getBase64(fileUploaded[0]) : null
            imageUrl = (await uploadImageWithImagekit(imageUrl))?.data?.url
            onUpload(imageUrl)
        }
    })

    const handleRemoveFile = file => {
        const uploadedFiles = files
        const filtered = uploadedFiles.filter(i => i.name !== file.name)
        setFiles([...filtered])
    }

    const renderFileSize = size => {
        if (Math.round(size / 100) / 10 > 1000) {
            return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`
        } else {
            return `${(Math.round(size / 100) / 10).toFixed(1)} kb`
        }
    }

    const renderFilePreview = file => {
        if (file.type.startsWith('image')) {
            return <img className='rounded' alt={file.name} src={URL.createObjectURL(file)} height='28' width='28' />
        } else {
            return <FileText size='28' />
        }
    }

    useEffect(() => {
        if (initialFileUrl) {
            loadFile(initialFileUrl)
        }
    }, [initialFileUrl])

    const fileList = files.map((file, index) => (
        <ListGroupItem key={`${file.name}-${index}`} className='d-flex align-items-center justify-content-between'>
            <div className='file-details d-flex align-items-center'>
                <div className='file-preview me-1'>{renderFilePreview(file)}</div>
                <div>
                    <p className='file-name mb-0'>{file.name}</p>
                    <p className='file-size mb-0'>{renderFileSize(file.size)}</p>
                </div>
            </div>
            <Button color='danger' outline size='sm' className='btn-icon' onClick={() => handleRemoveFile(file)}>
                <X size={14} />
            </Button>
        </ListGroupItem>
    ))

    return (
        <div className="vsl-upload-container">
            <Label className='form-label input-label'>
                {label}
            </Label>
            {
                files?.length ? (
                    <div className="dropzone-size-component">
                        <Fragment>
                            <ListGroup>{fileList}</ListGroup>
                        </Fragment>
                    </div>
                ) : (
                    <div {...getRootProps({ className: 'dropzone' })}>
                        <input {...getInputProps()} />
                        <div className='d-flex align-items-center justify-content-center'>
                            <Image color="#7666f8" size={64} />
                            <div className="flex-column dropzone-texts-component">
                                <h5 className="paragraph text-offwhite">Clique ou solte a imagem aqui</h5>
                                <span className='text-lighter paragraph-small-semi-bold'>
                                    Tamanho recomendado: 1000x1000px
                                </span>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}
export default VslUpload;