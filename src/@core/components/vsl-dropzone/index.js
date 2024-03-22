// ** React Imports
import { Fragment } from "react";

// ** Reactstrap Imports
import { Button, Label, ListGroup, ListGroupItem } from "reactstrap";
import "./dropzone.scss";

import { useTranslation } from "react-i18next";
// ** Third Party Imports
import { useDropzone } from "react-dropzone";
import { DownloadCloud, Image, X } from "react-feather";

const FileUploaderSingle = ({ handleRemoveFile, renderFileSize, files, setFiles, renderFilePreview }) => {
  // ** State

  const { t } = useTranslation();
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: (acceptedFiles) => {
      setFiles([...files, ...acceptedFiles.map((file) => Object.assign(file))]);
    },
  });

  const fileList = files.map((file, index) => (
    <ListGroupItem
      key={`${file.name}-${index}`}
      className="d-flex align-items-center justify-content-between"
    >
      <div className="file-details d-flex align-items-center">
        <div className="file-preview">{renderFilePreview(file)}</div>
        <div>
          <p className="file-name mb-0 text-offwhite paragraph-small mx-1">{file.name}</p>
          <p className="file-size mb-0 mx-1">{renderFileSize(file.size)}</p>
        </div>
      </div>
      <Button
        color="danger"
        outline
        size="sm"
        className="btn-icon"
        onClick={() => handleRemoveFile(file)}
      >
        <X size={14} />
      </Button>
    </ListGroupItem>
  ));

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  return (
    <div>
      <Label className='form-label input-label'>
        Foto de capa:
      </Label>
      {
        files?.length ? (
          <div className="dropzone-size">
            <Fragment>
              <ListGroup className="vsl-list-group">{fileList}</ListGroup>
            </Fragment>
          </div>
        ) : (
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <div className='vsl-dropzone-flex'>
              <img
                src={require('src/assets/icons/svg/PlusImage.svg').default}
                alt="Ícone de editar card"
                width={52}
              />
              <div className="dropzone-texts">
                <span className="paragraph-lead text-offwhite">Clique ou solte a imagem aqui</span>
                <span className='text-lighter paragraph-small-semi-bold vsl-top-8'>
                  Tamanho recomendado: 1000x1000px
                </span>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default FileUploaderSingle;
