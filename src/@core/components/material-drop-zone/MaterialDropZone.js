import React, { useState, useCallback, useEffect } from 'react';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';
import { makeStyles } from 'tss-react/mui';
import Button from '@mui/material/Button';
import FileIcon from '@mui/icons-material/Description';
import ActionDelete from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import CloudUpload from '@mui/icons-material/CloudUpload';
import './react-dropzone.css';
import isImage from './helpers/helpers.js';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';

const useStyles = makeStyles()((theme) => ({
  dropItem: {
    borderColor: 'rgba(0, 0, 0, 0.38)', //theme.palette.divider,
    background: '#FAFAFA', //theme.palette.background.default,
    borderRadius: '12px', //theme.rounded.medium,
    color: 'rgba(0, 0, 0, 0.38)', //theme.palette.text.disabled,
    textAlign: 'center'
  },
  uploadIconSize: {
    display: 'inline-block',
    '& svg': {
      width: 72,
      height: 72,
      fill: 'rgba(0, 0, 0, 0.38)', //theme.palette.secondary.main,
    }
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
    '& svg': {
      fill: '#FFF', //theme.palette.common.white
    }
  },
  button: {
    marginTop: 20
  }
}));

function MaterialDropZone({filesParam, imgsParam, acceptedFilesParam, showPreviews, maxSize, text, showButton, filesLimit, onFileChange}) {
  const [openSnackBar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [files, setFiles] = useState([]); // eslint-disable-line
  const [imgsBase64, setImgsBase64] = useState([]); // eslint-disable-line
  const [acceptedFiles, setAcceptedFiles] = useState(acceptedFilesParam); // eslint-disable-line
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

  const {
    classes,
    cx
  } = useStyles();
//   const {
//     showPreviews,
//     maxSize,
//     text,
//     showButton,
//     filesLimit,
//     ...rest
//   } = props;

  useEffect(() => {
    onFileChange(imgsBase64);
  }, [imgsBase64]);

  useEffect(() => {
    setImgsBase64(imgsParam);
  }, [imgsParam]);

  useEffect(() => {
    setFiles(filesParam);
    setAcceptedFiles(acceptedFilesParam);
  }, [filesParam, acceptedFilesParam]);

  const onDrop = useCallback((filesVal) => {
    let oldFiles = files;
    const filesLimitVal = filesLimit || '3';
    oldFiles = oldFiles.concat(filesVal);
    if (oldFiles.length > filesLimit) {
      setOpenSnackbar(true);
      setErrorMessage(`Não é permitido mais do que ${filesLimitVal} items.`);
    } else {
        for(let i = 0; i < oldFiles.length; i++) {
            const file = oldFiles[i];
            getBase64(file, (result) => {
                setImgsBase64(imgsBase64?.concat(result));
            });
        }
        setFiles(oldFiles);
    }
  }, [files, filesLimit]);

  const onDropRejected = () => {
    setOpenSnackbar(true);
    setErrorMessage('File too big, max size is 3MB');
  };

  const handleRequestCloseSnackBar = () => {
    setOpenSnackbar(false);
  };

  function getBase64(file, cb) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        cb(reader.result)
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
  }

  const handleRemove = useCallback((file, fileIndex) => {
    // This is to prevent memory leaks.
    window.URL.revokeObjectURL(file.preview);

    setFiles(thisFiles => {
      const tempFiles = [...thisFiles];
      tempFiles.splice(fileIndex, 1);
      return tempFiles;
    });
  }, [files]);

  const handleRemoveBase64 = useCallback((fileIndex) => {

    setImgsBase64(thisFiles => {
      const tempFiles = [...thisFiles];
      tempFiles.splice(fileIndex, 1);
      return tempFiles;
    });
  }, [imgsBase64]);

  const fileSizeLimit = maxSize || 3000000;
  const DeleteBtn = ({ file, index }) => ( // eslint-disable-line
    <Tooltip title="Remover">
        <div className={isMobile ? 'middle-mobile' : 'middle'}>
            <IconButton onClick={() => handleRemove(file, index)} size="large">
                <ActionDelete className="removeBtn" />
            </IconButton>
        </div>
    </Tooltip>
  );

  const DeleteBtnBase64 = ({ index }) => ( // eslint-disable-line
    <Tooltip title="Remover">
        <div className={isMobile ? 'middle-mobile' : 'middle'}>
            <IconButton onClick={() => handleRemoveBase64(index)} size="large">
                <ActionDelete className="removeBtn" />
            </IconButton>
        </div>
    </Tooltip>
  );

  DeleteBtn.propTypes = {
    file: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
  };

  const PreviewsImgsBase64 = ({ imgsArray }) => imgsArray?.map((base64, index) => {
    if (base64) {
      return (
        <Grid key={index.toString()} item xs={4}>
        <div>
          {/* <div className="imageContainer col fileIconImg"> */}
          <div className="imageContainer-h100-w100 fileIconImg">
            <figure className="imgWrap"><img className="smallPreviewImg-w100" src={base64} alt="preview" /></figure>
            <DeleteBtnBase64 index={index} />
          </div>
        </div>
        </Grid>
      );
    }
  });

  const Previews = ({ filesArray }) => filesArray.map((file, index) => {
    const base64Img = URL.createObjectURL(file);
    if (isImage(file)) {
      return (
        <Grid item xs={4}>
        <div key={index.toString()}>
          {/* <div className="imageContainer col fileIconImg"> */}
          <div className="imageContainer-h100-w100 fileIconImg">
            <figure className="imgWrap"><img className="smallPreviewImg-w100" src={base64Img} alt="preview" /></figure>
            <DeleteBtn file={file} index={index} />
          </div>
        </div>
        </Grid>
      );
    }
    return (
      <div key={index.toString()}>
        <div className="imageContainer col fileIconImg">
          <FileIcon className="smallPreviewImg" alt="preview" />
          <DeleteBtn file={file} index={index} />
        </div>
      </div>
    );
  });

  Previews.propTypes = {
    filesArray: PropTypes.array.isRequired
  };

  let dropzoneRef;
  console.log('imgsBase64: ', imgsBase64);
  return (
    <div>
      <Dropzone
        accept={acceptedFiles.join(',')}
        onDrop={onDrop}
        onDropRejected={onDropRejected}
        acceptClassName="stripes"
        rejectClassName="rejectStripes"
        maxSize={fileSizeLimit}
        ref={(node) => { dropzoneRef = node; }}
        //{...rest}
      >
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} className={cx(classes.dropItem, 'dropZone')}>
            <div className="dropzoneTextStyle">
              <input {...getInputProps()} />
              <p className="dropzoneParagraph">{text}</p>
              <div className={classes.uploadIconSize}>
                <CloudUpload />
              </div>
            </div>
          </div>
        )}
        {/* end */}
      </Dropzone>
      {showButton && (
        <Button
          className={classes.button}
          fullWidth
          variant="contained"
          onClick={() => {
            dropzoneRef.open();
          }}
          color="secondary"
        >
          Click to upload file(s)
          <span className={classes.rightIcon}>
            <CloudUpload />
          </span>
        </Button>
      )}
      <div className="row preview">
        {showPreviews && <Grid container spacing={2}><PreviewsImgsBase64 imgsArray={imgsBase64} /></Grid>}
      </div>
      <Snackbar
        open={openSnackBar}
        message={errorMessage}
        autoHideDuration={4000}
        onClose={handleRequestCloseSnackBar}
      />
    </div>
  );
}

MaterialDropZone.propTypes = {
  files: PropTypes.array.isRequired,
  text: PropTypes.string.isRequired,
  acceptedFiles: PropTypes.array,
  showPreviews: PropTypes.bool.isRequired,
  showButton: PropTypes.bool,
  maxSize: PropTypes.number.isRequired,
  filesLimit: PropTypes.number.isRequired,

};

MaterialDropZone.defaultProps = {
  acceptedFiles: [],
  showButton: false,
};

export default MaterialDropZone;
