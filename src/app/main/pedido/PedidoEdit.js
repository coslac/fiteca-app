/* eslint-disable import/no-duplicates */
import * as React from 'react';
import QrCodeWithLogo from "qrcode-with-logos";
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { ReactFormBuilder } from 'react-form-builder2';
import 'react-form-builder2/dist/app.css';
import { Add, CheckCircle, CleaningServices, CloseOutlined, CreateOutlined, DoNotDisturb, Error, ErrorOutlineOutlined, HighlightOff, Label, PlusOne, Title } from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import getConfigAPI from 'src/config';
import { Autocomplete, Badge, Button, Card, CardContent, CardHeader, CardMedia, CircularProgress, Divider, FormControl, FormHelperText, FormLabel, Grid, MenuItem, Select, Tab, Tabs, TextField } from '@mui/material';
import { motion } from 'framer-motion';
import { uuid } from 'uuidv4';
import { Controller, useForm, useFormContext } from 'react-hook-form';
import ColorPicker from 'app/shared-components/ColorPicker/ColorPicker';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import CurrencyFormat from 'react-currency-format';
import CanvasFile from './CanvasFile';
import CardImg from './CardImg';
import { useThemeMediaQuery } from '@fuse/hooks';
import authConfig from '../../../auth_config.json';
import Slide from '@mui/material/Slide';

const apiURL = getConfigAPI().API_URL;

const container = {
    show: {
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const item = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    show: {
        opacity: 1,
        y: 0,
    },
};

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const headCellsArtigos = [
    {
        id: 'artigo',
        numeric: false,
        disablePadding: false,
        label: 'ARTIGO',
        textAlign: 'left'
    },
    {
        id: 'largura',
        numeric: false,
        disablePadding: true,
        label: 'LARGURA',
        textAlign: 'left'
    }
];

const appOrigin = authConfig?.appOrigin || `http://localhost:3000`;

export default function PedidoEdit({ props, onChange, onChangeFields, onChangeValues }) {
    const methods = useFormContext();

    const { control, setValue, formState, watch, getValues } = methods;

    const { isValid, dirtyFields, errors, touchedFields } = formState;
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
    const [width, setWidth] = React.useState(0);
    const [tabValue, setTabValue] = React.useState(0);
    const refGrid = React.useRef(null);
    const [isMobileParam, setIsMobileParam] = React.useState(isMobile);
    const [qrCodeBase64, setQrCodeBase64] = React.useState('');
    const [artigos, setArtigos] = React.useState([]);
    const [idsArtigosSelected, setIdsArtigosSelected] = React.useState([]);
    const [artigosSelected, setArtigosSelected] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [artigoAdd, setArtigoAdd] = React.useState('');

    React.useEffect(() => {
        setWidth(refGrid.current.offsetWidth - 40);
      }, [refGrid.current]);

      React.useEffect(() => {
        setIsMobileParam(isMobile);
        setWidth(refGrid.current.offsetWidth - 40);
      }, [isMobile]);

      React.useEffect(() => {
        setIsMobileParam(isMobile);
      }, []);

      React.useEffect(() => {
        async function genQRCode() {
            const urlBase64 = await generateQRCode();
            setQrCodeBase64(urlBase64);
        }
        if(control?._formValues) {
            genQRCode();
        }
      }, [control?._formValues]);

    function genId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    async function generateQRCode() {
        return new Promise((resolve, reject) => {
            try {
                let qrCodeImg;
                const linkContent = `${appOrigin}/estoque/${control?._formValues?.produto?.id}/item/${control?._formValues?.id}`;

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

    const handleChangeCEP = async (cep) => {
        try {
            console.log('cep', cep);
            cep = cep.replaceAll('_', '');
            if(cep.length === 9) {
                const cepConsulta = cep.replace('-', '');
                console.log('cepConsulta', cepConsulta);
                if(cepConsulta.length === 8) {
                    const res = await axios.get(`https://brasilapi.com.br/api/cep/v2/${cepConsulta}`);
                    console.log('res', res);
                    if(res && res.status === 200) {
                        setValue('endereco', res.data.street);
                        setValue('bairro', res.data.neighborhood);
                        setValue('cidade', res.data.city);
                        setValue('estado', res.data.state);
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleOpenAddArtigo = async () => {
        try {
            const res = await axios.get(`${apiURL}/romaneio/artigos`);
            console.log('res artigos', res);

            if(res && res.status === 200) {
                setArtigos(res.data);
            }
        } catch (err) {
            console.log(err);
        }
    }

    const handleAddArtigo = async () => {
        console.log('Add artigo: ', artigoAdd);
        const artigo = artigos?.find((item) => item.id === artigoAdd);
        console.log('artigo', artigo);
        if(artigo) {
        }

        setOpen(false);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleOpen = () => {
        setOpen(true);
    }

    const handleChangeArtigos = (event) => {
        console.log('artigos', event);
        const {
            target: { value },
          } = event;
          setIdsArtigosSelected(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
          );
    }
    
    function handleTabChange(event, value) {
        setTabValue(value);
    }
    console.log('control formvalues', control._formValues)
    return (
        <>
            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="secondary"
                textColor="secondary"
                variant="scrollable"
                scrollButtons="auto"
                classes={{ root: 'w-full h-64 border-b-1' }}
            >
                <Tab className="h-64" label="PRINCIPAL" />
                <Tab className="h-64" label="ENDEREÇO" />
                <Tab className="h-64" label="ROMANEIO" />
            </Tabs>
            <div className="p-16 sm:p-24">
            <div className={tabValue !== 0 ? 'hidden mb-32' : 'mb-32'}>
                <Grid container spacing={2}>
                        <Grid item xs={isMobile ? 12 : 6}>
                        <Controller
                            name="nome"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth>
                                    <TextField
                                            {...field}
                                            autoFocus
                                            id="nome"
                                            label="Cliente"
                                            variant="outlined"
                                            fullWidth
                                    />
                                </FormControl>
                            )}
                        />
                    </Grid>
                    <Grid item xs={isMobile ? 12 : 6}>
                        <Controller
                            name="cnpjCpf"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth>
                                    <TextField
                                            {...field}
                                            id="cnpjCpf"
                                            label="CNPJ/CPF"
                                            variant="outlined"
                                            fullWidth
                                    />
                                </FormControl>
                            )}
                        />
                    </Grid>
                    <Grid item xs={isMobile ? 12 : 6}>
                        <Controller
                            name="inscEst"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth>
                                    <TextField
                                            {...field}
                                            id="inscEst"
                                            label="Inscrição Estadual"
                                            variant="outlined"
                                            fullWidth
                                    />
                                </FormControl>
                            )}
                        />
                    </Grid>
                    <Grid item xs={isMobile ? 12 : 6}>
                        <Controller
                            name="tel"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth>
                                    <CurrencyFormat
                                        {...field}
                                        id='tel'
                                        label="Telefone"
                                        customInput={TextField}
                                        format="(##) ####-####"
                                        mask="_"
                                        fullWidth
                                    />
                                </FormControl>
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                    <FormControl fullWidth>
                                    <FormLabel className="font-medium text-14" component="legend">
                                        Artigos
                                    </FormLabel>
                                    <Select id="artigos" variant="outlined" fullWidth defaultValue="" value={idsArtigosSelected} defaultChecked displayEmpty multiple onChange={handleChangeArtigos}
                                    input={<OutlinedInput label="Tag" />}
                                    renderValue={(selected) => {
                                        console.log('selected', selected);
                                        return selected.map((value) => {
                                            const artigo = artigos?.find((item) => item.id === value);
                                            return artigo?.artigo;
                                        }).join(', ');
                                    }}
                                    MenuProps={MenuProps}>
                                        {
                                            artigos?.map((item, index) => (
                                                <MenuItem key={`${item?.id}-${index}`} value={item?.id}>
                                                    <Checkbox checked={idsArtigosSelected?.indexOf(item?.id) > -1} />
                                                    <ListItemText primary={item?.artigo} />
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                    <CustomizedTable titleParam={''} columnsParam={headCellsArtigos} data={artigosSelected} showToolbar={false} showSelectRow={false} />
                    </Grid>
                </Grid>
                </div>
                <div className={tabValue !== 1 ? 'hidden mb-32' : 'mb-32'}>
                    <Grid container spacing={2}>
                    <Grid item xs={isMobile ? 12 : 4}>
                        <Controller
                            name="cep"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth>
                                    <CurrencyFormat
                                            {...field}
                                            id='cep'
                                            label="CEP"
                                            customInput={TextField}
                                            format="#####-###"
                                            mask="_"
                                            fullWidth
                                            onChange={(e) => {
                                                console.log('e', e);
                                                field.onChange(e);
                                                handleChangeCEP(e.target.value);
                                            }}
                                        />
                                </FormControl>
                            )}
                        />
                    </Grid>
                    <Grid item xs={6}></Grid>
                    <Grid item xs={isMobile ? 10 : 5}>
                        <Controller
                            name="endereco"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth>
                                    <TextField
                                            {...field}
                                            id="endereco"
                                            label="Endereço"
                                            variant="outlined"
                                            fullWidth
                                    />
                                </FormControl>
                            )}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Controller
                            name="numero"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth>
                                    <TextField
                                            {...field}
                                            id="numero"
                                            label="Número"
                                            variant="outlined"
                                            fullWidth
                                    />
                                </FormControl>
                            )}
                        />
                    </Grid>
                    <Grid item xs={5}>
                            <Controller
                                name="complemento"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <TextField
                                            {...field}
                                            id="complemento"
                                            label="Complemento"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Controller
                                name="bairro"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <TextField
                                            {...field}
                                            id="bairro"
                                            label="Bairro"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Controller
                                name="cidade"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <TextField
                                            {...field}
                                            id="cidade"
                                            label="Cidade"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Controller
                                name="estado"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <TextField
                                            {...field}
                                            id="estado"
                                            label="Estado"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                    </Grid>                
                </div>
                <div className={tabValue !== 2 ? 'hidden mb-32' : 'mb-32'}>
                    <Grid container spacing={2}>
                        {
                            control?._formValues?.produtosPedido?.map((item, index) => (
                                <Grid key={`${item?.produto?.id}-${index}`} item xs={isMobile ? 12 : 6}>
                                    <CardArtigo props={item?.produto} />
                                </Grid>
                            ))
                        }
                    </Grid>                
                </div>
            </div>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
                fullWidth
            >
                <DialogTitle>ADICIONAR ARTIGO</DialogTitle>
                <DialogContent>
                <FormControl fullWidth>
                                    <FormLabel className="font-medium text-14" component="legend">
                                        ARTIGO
                                    </FormLabel>
                                    <Select id="artigo" variant="outlined" fullWidth defaultValue={''} value={artigoAdd} defaultChecked displayEmpty onChange={(event) => {
                                        setArtigoAdd(event.target.value);
                                    }}
                                    >
                                        <MenuItem value="">Selecione o Artigo...</MenuItem>
                                        {
                                            artigos?.map((item, index) => (
                                                <MenuItem key={`${item?.id}-${index}`} value={item?.id}>{item?.artigo}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleAddArtigo}>Adicionar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
