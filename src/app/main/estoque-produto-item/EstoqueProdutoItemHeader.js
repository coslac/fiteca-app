import QrCodeWithLogo from "qrcode-with-logos";
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import _ from '@lodash';
import AWS from 'aws-sdk';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import {Buffer} from 'buffer';
import { forwardRef, useEffect, useState } from 'react';
import { Add, Create, Edit, EditNoteOutlined, PlusOneRounded, SaveAltOutlined } from '@mui/icons-material';
import axios from 'axios';
import getConfigAPI from 'src/config';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import authConfig from '../../../../src/auth_config.json';
import { CircularProgress, Dialog } from '@mui/material';
import { showMessage } from 'app/store/fuse/messageSlice';
import DisabledByDefaultOutlinedIcon from '@mui/icons-material/DisabledByDefaultOutlined';

const apiURL = getConfigAPI().API_URL;
const appOrigin = getConfigAPI.APP_URL || `http://localhost:3000`;

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function EstoqueProdutoItemHeader({props, isEditParam, isChangeForm, itemEstoqueAddParam, handleSave}) {
    const dispatch = useDispatch();
    const theme = useTheme();
    const navigate = useNavigate();
    const [itemEstoque, setItemEstoque] = useState(null);
    const [itemEstoqueAdd, setItemEstoqueAdd] = useState(null);
    const [titleEdit, setTitleEdit] = useState('');
    const [titleAdd, setTitleAdd] = useState('');
    const [isEdit, setIsEdit] = useState(true);
    const [isChange, setIsChange] = useState(isChangeForm);
    const [formAddIsValid, setFormAddIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [openBaixa, setOpenBaixa] = useState(false);
    const { idProduto, idItem } = useParams();

    useEffect(() => {
        setIsChange(isChangeForm);
    }, [isChangeForm]);

    useEffect(() => {
        setIsEdit(isEditParam);
        setItemEstoque(props);
        if(isEditParam) {
            if(props) {
                setTitleEdit(`Editar Rolo`);
            }
        } else {
            setTitleEdit(`${props?.artigo} | Novo Rolo`);
        }
    }, [props, isEditParam]);

    useEffect(() => {
        if (itemEstoqueAddParam) {
            setItemEstoqueAdd(itemEstoqueAddParam);
        }
    }, [itemEstoqueAddParam]);

    function validaFormAdd(formValues) {
        console.log('formValues para validar', formValues);
        if(!formValues) {
            return false;
        }

        if(!formValues?.artigo || formValues?.artigo === '') {
            return false;
        }

        return true;
    }
    
    function handleSaveProduct() {
        // dispatch(saveProduct(getValues()));
    }

    function handleRemoveProduct() {
        // dispatch(removeProduct()).then(() => {
        //     navigate('/apps/e-commerce/products');
        // });
    }

    async function handleExcluir() {
        try {
            setOpen(false);
            const res = await axios.delete(`${apiURL}/itemEstoque/${itemEstoque.id}`);
            if (res && res.status === 200) {
                dispatch(
                    showMessage({
                        message: 'Produto excluído com sucesso!',
                        autoHideDuration: 6000,
                        anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                        },
                        variant: 'success'
                    })
                );
                navigate('/itemEstoques')
            } else {
                dispatch(
                    showMessage({
                        message: 'Erro ao excluir Produto!',
                        autoHideDuration: 6000,
                        anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                        },
                        variant: 'error'
                    })
                );
            }
        } catch (err) {
            console.log(err);
            dispatch(
                showMessage({
                    message: 'Erro ao excluir Produto!',
                    autoHideDuration: 6000,
                    anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                    },
                    variant: 'error'
                })
            );
        }
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseBaixa = () => {
        setOpenBaixa(false);
    };

    const handleBaixaEstoque = () => {
        console.log('baixa estoque');
        setOpenBaixa(true);
    }

    const darBaixa = async () => {
        try {
            const res = await axios.put(`${apiURL}/item-estoque/${itemEstoque?.id}/baixa`);

            if(res && res.status === 200) {
                dispatch(
                    showMessage({
                        message: `Baixa realizada com sucesso!`,
                        autoHideDuration: 6000,
                        anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                        },
                        variant: 'success'
                    })
                );
                navigate(`/estoque/${itemEstoque?.produto?.id}`)
            } else {
                dispatch(
                    showMessage({
                        message: `Erro ao dar baixa!`,
                        autoHideDuration: 6000,
                        anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                        },
                        variant: 'error'
                    })
                );
            }
        } catch (e) {
            console.log(e);
            dispatch(
                showMessage({
                    message: `Erro ao dar baixa!`,
                    autoHideDuration: 6000,
                    anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                    },
                    variant: 'error'
                })
            );
        }
    }

    function formataDataObj(data) {
        if(data?.numTear) data.numTear = parseInt(data.numTear);
        if(data?.numRolo) data.numRolo = parseInt(data.numRolo);
        if(data?.metros) data.metros = parseFloat(data.metros);
        data.data = new Date();
        return data;
    }

    async function generateQRCode(linkContent, idItem) {
        return new Promise((resolve, reject) => {
            try {
                let qrCodeImg;
        
                const qrcode = new QrCodeWithLogo({
                content: linkContent,
                width: 480,
                logo: {
                    src: "https://i.ibb.co/PCxKNmv/fiteca-logo.jpg",
                }
                });

                qrcode.getCanvas().then(canvas => {
                    const qrCodeImg = canvas.toDataURL();
                    resolve(qrCodeImg);
                    // or do other things with canvas
                });
            
                /*qrcode.downloadImage(`${idItem}.png`).then(data => {
                    console.log('data qrCode: ', data);
                    qrCodeImg = data;
                    resolve(qrCodeImg);
                });*/
            
            } catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }

    async function uploadQRCodeS3(base64, id) {
        return new Promise( async (resolve, reject) => {
            try {
                const S3_BUCKET = authConfig.bucketName;
                const REGION = authConfig.bucketRegion;
            
                AWS.config.update({
                accessKeyId: authConfig.awsAccessKeyId,
                secretAccessKey: authConfig.awsSecretKeyId,
                });
                const s3 = new AWS.S3({
                    params: { Bucket: S3_BUCKET },
                    region: REGION,
                });

                const buf = Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""),'base64');
                const key = `${id}.jpeg`;
            
                const dataImg = {
                    Key: key, 
                    Body: buf,
                    ContentEncoding: 'base64',
                    ContentType: 'image/jpeg'
                };

                s3.putObject(dataImg, function(err, data){
                    if (err) { 
                    console.log(err);
                    console.log('Error uploading data: ', data); 
                    reject(err);
                    } else {
                    console.log('successfully uploaded the image: ', data);
                    resolve({
                        data: {
                            key: key,
                            tipo: 'image/jpeg',
                            bucket: S3_BUCKET,
                            region: REGION,
                            url: `https://${S3_BUCKET}.s3.amazonaws.com/${key}`
                        }
                    });
                    }
                });
            } catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }

    async function vinculaQRCode(qrCodeData, itemEstoqueId) {
        try {
            if(!qrCodeData || !itemEstoqueId) return;

            const res = await axios.post(`${apiURL}/item-estoque/${itemEstoqueId}/qrcode`, {
                data : qrCodeData
            });

            if(res && res.status === 201) {
                return res.data;
            } else {
                return null;
            }
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    async function handleCriarInventario() {
        try {

            const data = formataDataObj(itemEstoqueAdd);
            const res = await axios.post(`${apiURL}/estoque-produto/${idProduto}/item`, {
                data : data
            });

            console.log('res inventario: ', res);

            if (res && res.status === 201) {
                const qrCodeImg = await generateQRCode(`${appOrigin}/estoque/${idProduto}/item/${res?.data?.id}`);

                if(qrCodeImg) {
                    const resS3 = await uploadQRCodeS3(qrCodeImg, res?.data?.id);
                    if(resS3 && resS3?.data) {
                        const resVincularQRCode = await vinculaQRCode(resS3?.data, res?.data?.id);

                        if(resVincularQRCode) {
                            dispatch(
                                showMessage({
                                    message: `Inventário cadastrado com sucesso!`,
                                    autoHideDuration: 6000,
                                    anchorOrigin: {
                                    vertical: 'top',
                                    horizontal: 'right',
                                    },
                                    variant: 'success'
                                })
                            );
                            //navigate(`/estoque/${idProduto}/item/${res.data.id}`)
                            window.location.replace(`${window.location.hostname}/estoque/${idProduto}/item/${res.data.id}`)
                        } else {
                            dispatch(
                                showMessage({
                                    message: `Erro ao vincular QR Code!`,
                                    autoHideDuration: 6000,
                                    anchorOrigin: {
                                    vertical: 'top',
                                    horizontal: 'right',
                                    },
                                    variant: 'error'
                                })
                            );
                        }
                    } else {
                        dispatch(
                            showMessage({
                                message: `Erro ao salvar QR Code!`,
                                autoHideDuration: 6000,
                                anchorOrigin: {
                                vertical: 'top',
                                horizontal: 'right',
                                },
                                variant: 'error'
                            })
                        );
                    }
                } else {
                    dispatch(
                        showMessage({
                            message: `Erro ao gerar QR Code!`,
                            autoHideDuration: 6000,
                            anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right',
                            },
                            variant: 'error'
                        })
                    );
                }
            } else {
                dispatch(
                    showMessage({
                        message: `Erro ao Cadastrar Inventário!`,
                        autoHideDuration: 6000,
                        anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                        },
                        variant: 'error'
                    })
                );
            }
        } catch (err) {
            console.log(err);
            dispatch(
                showMessage({
                    message: `Erro ao Cadastrar Inventário!`,
                    autoHideDuration: 6000,
                    anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                    },
                    variant: 'error'
                })
            );
        }
    }

    async function handleSalvarProduto() {
        try {
            const data = itemEstoque;
            const res = await axios.put(`${apiURL}/itemEstoque/${data.id}`, {
                data
            });
            if (res && res.status === 200) navigate('/itemEstoques');
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="mb-32 flex flex-col sm:flex-row flex-1 w-full items-center justify-between space-y-8 sm:space-y-0 px-24 md:px-32">
            <div className="flex flex-col items-center sm:items-start space-y-8 sm:space-y-0 w-full sm:max-w-full min-w-0">
                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
                >
                    <Typography
                        className="flex items-center sm:mb-12"
                        component={Link}
                        role="button"
                        to={`/estoque/${itemEstoque?.idProduto ? itemEstoque.idProduto : itemEstoque?.produto?.id}`}
                        color="inherit"
                    >
                        <FuseSvgIcon size={20}>
                            {theme.direction === 'ltr'
                                ? 'heroicons-outline:arrow-sm-left'
                                : 'heroicons-outline:arrow-sm-right'}
                        </FuseSvgIcon>
                        <span className="flex mx-4 font-medium">{`Estoque ${isEdit ? itemEstoque?.produto?.artigo : itemEstoque?.artigo}`}</span>
                    </Typography>
                </motion.div>

                <div className="flex items-center max-w-full">
                    {/* <motion.div
                        className="hidden sm:flex"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, transition: { delay: 0.3 } }}
                    >
                        <img
                            className="w-32 sm:w-48 rounded"
                            src={ itemEstoque?.logo ? itemEstoque.logo : "assets/images/itemEstoques/page-itemEstoque-icon.png" }
                            alt={name}
                        />
                    </motion.div> */}
                    <motion.div
                        className="flex flex-col items-center sm:items-start min-w-0 mx-8 sm:mx-16"
                        initial={{ x: -20 }}
                        animate={{ x: 0, transition: { delay: 0.3 } }}
                    >
                        <Typography className="text-16 sm:text-20 truncate font-semibold">
                            {titleEdit}
                        </Typography>
                    </motion.div>
                </div>
            </div>
            <motion.div
                className="flex"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
            >
                {isEdit ? (
                    <>
                        <Button
                            className="whitespace-nowrap mx-4"
                            variant="contained"
                            color="secondary"
                            //disabled={!isChange}
                            startIcon={<SaveAltOutlined />}
                            onClick={handleSave}
                        >
                            Salvar
                        </Button>
                        <Button
                            className="whitespace-nowrap mx-4"
                            variant="contained"
                            color="warning"
                            //disabled={!isChange}
                            startIcon={<DisabledByDefaultOutlinedIcon />}
                            onClick={handleBaixaEstoque}
                        >
                            Dar Baixa
                        </Button>
                        <Button
                            className="whitespace-nowrap mx-4"
                            variant="contained"
                            color="error"
                            onClick={handleClickOpen}
                            startIcon={<FuseSvgIcon className="hidden sm:flex">heroicons-outline:trash</FuseSvgIcon>}
                        >
                            Excluir
                        </Button>
                    </>
                ) : (
                        <>
                        <Button
                            className="whitespace-nowrap mx-4"
                            variant="contained"
                            color="success"
                            startIcon={!isLoading ? <Add /> : <CircularProgress size={20} />}
                            onClick={handleCriarInventario}
                        >
                            Cadastrar
                        </Button>
                        </>
                )}
            </motion.div>
            <Dialog
                open={openBaixa}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseBaixa}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>Tem certeza que deseja dar baixa neste item?</DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseBaixa}>Cancelar</Button>
                    <Button onClick={darBaixa}>Sim</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>Tem certeza que deseja excluir o itemEstoque?</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Ao excluir o itemEstoque, você não poderá mais recuperá-lo.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleExcluir}>Ok, excluir</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default EstoqueProdutoItemHeader;
