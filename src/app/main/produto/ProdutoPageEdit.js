/* eslint-disable import/no-duplicates */
import * as React from 'react';
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
import MaterialDropZone from 'src/@core/components/material-drop-zone/MaterialDropZone';

const apiURL = getConfigAPI().API_URL;

export default function ProdutoPageEdit({ props, onChange, onChangeFields, onChangeValues }) {
    const methods = useFormContext();

    const { control, setValue, formState, watch, getValues } = methods;

    const { isValid, isDirty, dirtyFields, errors, touchedFields } = formState;

    const [files] = React.useState([]);

    function handleTabChange(event, value) {
        setTabValue(value);
    }

    function genId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    const handleFileChange = (imgs) => {
        console.log('imgs change: ', imgs);
        if(imgs && imgs.length > 0) {
            setValue('imagem', imgs[0]);
        } else {
            setValue('imagem', '');
        }
    }

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

    console.log('control formvalues', control._formValues)
    return (
        <>
            <div className="p-16 sm:p-24">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Controller
                            name="artigo"
                            control={control}
                            render={({ field }) => (
                                <FormControl error={!!errors.artigo} required fullWidth>
                                    <FormLabel className="font-medium text-14" component="legend">
                                        ARTIGO
                                    </FormLabel>
                                    <TextField
                                            {...field}
                                            placeholder='Artigo'
                                            autoFocus
                                            id="artigo"
                                            variant="outlined"
                                            fullWidth
                                    />
                                    <FormHelperText>{errors?.artigo?.message}</FormHelperText>
                                </FormControl>
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            name="descricao"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth>
                                    <FormLabel className="font-medium text-14" component="legend">
                                        DESCRIÇÃO
                                    </FormLabel>
                                    <TextField
                                            {...field}
                                            placeholder='Descrição'
                                            id="descricao"
                                            variant="outlined"
                                            fullWidth
                                            multiline
                                            rows={3}
                                    />
                                </FormControl>
                            )}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                            name="largura"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth>
                                    <FormLabel className="font-medium text-14" component="legend">
                                        LARGURA (m)
                                    </FormLabel>
                                    <CurrencyFormat
                                            {...field}
                                            id='largura'
                                            customInput={TextField}
                                            decimalScale={2}
                                            fixedDecimalScale={true}
                                    />
                                </FormControl>
                            )}
                        />
                    </Grid>
                    <Grid item xs={6}></Grid>
                    <Grid item xs={12}></Grid>
                    <Grid item xs={12}>
                    <FormLabel className="font-medium text-14" component="legend">
                                        IMAGEM DO PRODUTO
                                    </FormLabel>
                        <MaterialDropZone
                            acceptedFilesParam={['image/jpeg', 'image/jpg', 'image/png', 'image/bmp']}
                            filesParam={files}
                            showPreviews
                            maxSize={5000000}
                            imgsParam={control?._formValues?.imagem ? [control?._formValues?.imagem] : []}
                            filesLimit={1}
                            onFileChange={handleFileChange}
                            text="Arraste e solte a imagem ou clique aqui"
                        />       
                    </Grid>
                </Grid>
            </div>
        </>
    );
}
