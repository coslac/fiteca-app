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
import { styled } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import CurrencyFormat from 'react-currency-format';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CardImg from './CardImg';

const apiURL = getConfigAPI().API_URL;

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});
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

export default function ProdutoPageAdd({ onChangeFields, onChangeValues }) {
    const [tabValue, setTabValue] = React.useState(0);
    const methods = useFormContext();
    const [file, setFile] = React.useState(null);
    const [imgBase64, setImgBase64] = React.useState(null);
    const { control, setValue, formState, watch, getValues } = methods;



    const { isValid, dirtyFields, errors, touchedFields } = formState;

    React.useEffect(() => {
        onChangeFields(dirtyFields.empresa_id);
    }, [dirtyFields.empresa_id]);

    React.useEffect(() => {
        onChangeValues(control._formValues);
    }, [control._formValues]);

    React.useEffect(() => {

    }, []);

    function handleTabChange(event, value) {
        setTabValue(value);
    }

    function genId() {
        return '_' + Math.random().toString(36).substr(2, 9);
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

    const handleFileChange = (e) => {
        console.log('handleFileChange: ', e);
        setFile([e.target.files[0]]);
        getBase64(e.target.files[0], (result) => {
            setImgBase64(result);
        })
        //uploadFile(file);
    };

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
                                        Artigo
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
                                        Descrição
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
                                        Largura (m)
                                    </FormLabel>
                                    <CurrencyFormat
                                            {...field}
                                            id='largura'
                                            customInput={TextField}
                                            thousandSeparator={'.'}
                                            decimalSeparator={','}
                                            decimalScale={2}
                                            fixedDecimalScale={true}
                                    />
                                </FormControl>
                            )}
                        />
                    </Grid>
                    {/* <Grid item xs={12}></Grid>
                    <Grid item xs={6}>
                                <Button fullWidth component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                                    Upload 
                                    <VisuallyHiddenInput onChange={handleFileChange} type="file" />
                                </Button>
                    </Grid>
                    <Grid item xs={12}></Grid>
                    <Grid item xs={6}>
                        <CardImg props={imgBase64} />
                    </Grid> */}
                </Grid>
            </div>
        </>
    );
}
