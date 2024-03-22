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

const appOrigin = authConfig?.appOrigin || `http://localhost:3000`;

export default function EstoqueProdutoItemEdit({ props, onChange, onChangeFields, onChangeValues }) {
    const methods = useFormContext();

    const { control, setValue, formState, watch, getValues } = methods;

    const { isValid, dirtyFields, errors, touchedFields } = formState;
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
    const [width, setWidth] = React.useState(0);
    const refGrid = React.useRef(null);
    const [isMobileParam, setIsMobileParam] = React.useState(isMobile);
    const [qrCodeBase64, setQrCodeBase64] = React.useState('');

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
        if(control?._formValues && control?._formValues?.produto?.id && control?._formValues?.id) {
            genQRCode();
        }
      }, [control?._formValues?.produto?.id, control?._formValues?.id]);

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

    console.log('control formvalues', control._formValues)
    return (
        <>
            <div className="p-16 sm:p-24">
                <div className={'mb-32'}>
                    <Grid container spacing={2}>
                        <Grid item xs={isMobile ? 12 : 4}>
                        <FormLabel className="font-medium text-14" component="legend">
                                            <b>{`ARTIGO: ${control?._formValues?.produto?.artigo ? control._formValues.produto.artigo : ''}`}</b>
                                        </FormLabel>
                        </Grid>
                        <Grid item xs={isMobile ? 12 : 4}>
                        <FormLabel className="font-medium text-14" component="legend">
                                            <b>{`LARGURA (m): ${control?._formValues?.produto?.largura ? control?._formValues?.produto?.largura : ''}`}</b>
                                        </FormLabel>
                        </Grid>
                        <Grid item xs={12}></Grid>
                        <Grid item xs={12}></Grid>
                        <Grid item xs={isMobile ? 12 : 4}>
                            <Controller
                                name="numRolo"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            Nº ROLO
                                        </FormLabel>
                                        <TextField
                                                {...field}
                                                placeholder='Nº ROLO'
                                                autoFocus
                                                id="numRolo"
                                                variant="outlined"
                                                fullWidth
                                                type='number'
                                        />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={isMobile ? 12 : 4}>
                            <Controller
                                name="numTear"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            Nº TEAR
                                        </FormLabel>
                                        <TextField
                                                {...field}
                                                placeholder='Nº TEAR'
                                                autoFocus
                                                id="numTear"
                                                variant="outlined"
                                                fullWidth
                                                type='number'
                                        />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={isMobile ? 12 : 4}>
                            <Controller
                                name="tipoTear"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            TIPO TEAR
                                        </FormLabel>
                                        <TextField
                                                {...field}
                                                placeholder='TIPO TEAR'
                                                id="tipoTear"
                                                variant="outlined"
                                                fullWidth
                                        />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={isMobile ? 12 : 4}>
                            <Controller
                                name="metros"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            METROS (m)
                                        </FormLabel>
                                        <CurrencyFormat
                                                {...field}
                                                id='metros'
                                                placeholder='METROS (m)'
                                                customInput={TextField}
                                                thousandSeparator={''}
                                                decimalSeparator={'.'}
                                                decimalScale={2}
                                                fixedDecimalScale={true}
                                        />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={isMobile ? 12 : 4}>
                            <Controller
                                name="revisor"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            REVISOR
                                        </FormLabel>
                                        <TextField
                                                {...field}
                                                placeholder='REVISOR'
                                                id="revisor"
                                                variant="outlined"
                                                fullWidth
                                        />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={isMobile ? 12 : 4}>
                            <Controller
                                name="cliente"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            CLIENTE
                                        </FormLabel>
                                        <TextField
                                                {...field}
                                                placeholder='CLIENTE'
                                                id="cliente"
                                                variant="outlined"
                                                fullWidth
                                        />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={isMobile ? 12 : 4}>
                            <Controller
                                name="created_at"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            DATA
                                        </FormLabel>
                                        <TextField
                                                {...field}
                                                id="created_at"
                                                variant="outlined"
                                                fullWidth
                                                disabled
                                        />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={isMobile ? 12 : 4}>
                        <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                    <FormLabel className="font-medium text-14" component="legend">
                                        STATUS
                                    </FormLabel>
                                    <Select id="status" {...field} variant="outlined" fullWidth defaultValue="" value={field.value} defaultChecked displayEmpty
                                    >
                                        <MenuItem value='Em revisão'>Em revisão</MenuItem>
                                        <MenuItem value='Em estoque'>Em estoque</MenuItem>
                                    </Select>
                                </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={isMobile ? 12 : 4}>
                        <Controller
                                name="defeito"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                    <FormLabel className="font-medium text-14" component="legend">
                                        DEFEITO DE PRODUÇÃO
                                    </FormLabel>
                                    <Select id="defeito" {...field} variant="outlined" fullWidth defaultValue={false} value={field.value} defaultChecked displayEmpty
                                    >
                                        <MenuItem value={false}>Não</MenuItem>
                                        <MenuItem value={true}>Sim</MenuItem>
                                    </Select>
                                </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item ref={refGrid} id="grid-xs-12" xs={isMobile ? 12 : 7}></Grid>
                        <Grid item xs={isMobile ? 12 : 7}>
                            {
                                qrCodeBase64 !== '' && {
                                    <CardImg props={qrCodeBase64} />
                                }
                            }
                        </Grid>
                        {
                            control?._formValues?.id && width > 0 && (
                                <>
                                    <Grid item xs={isMobile ? 12 : 7}>
                                    <FormControl fullWidth>
                                        <CanvasFile isMobile={isMobileParam} width={width} props={control?._formValues} />
                                        </FormControl>
                                    </Grid>
                                </>
                            )
                        } 
                    </Grid>
                </div>
            </div>
        </>
    );
}
