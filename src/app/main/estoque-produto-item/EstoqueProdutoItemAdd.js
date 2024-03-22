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
import { useThemeMediaQuery } from '@fuse/hooks';

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

export default function EstoqueProdutoItemAdd({ onChangeFields, onChangeValues, produtoParam }) {
    const [tabValue, setTabValue] = React.useState(0);
    const methods = useFormContext();
    const [produto, setProduto] = React.useState(produtoParam);
    const { control, setValue, formState, watch, getValues } = methods;
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));


    const { isValid, dirtyFields, errors, touchedFields } = formState;

    React.useEffect(() => {
        setProduto(produtoParam);
    }, [produtoParam]);

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

    console.log('produto', produtoParam)
    return (
        <>
            <div className="p-16 sm:p-24">
                <Grid container spacing={2}>
                <Grid item xs={isMobile ? 12 : 4}>
                        <FormLabel className="font-medium text-14" component="legend">
                                            <b>{`ARTIGO: ${produto?.artigo ? produto?.artigo : ''}`}</b>
                                        </FormLabel>
                        </Grid>
                        <Grid item xs={isMobile ? 12 : 4}>
                        <FormLabel className="font-medium text-14" component="legend">
                        <b>{`LARGURA (m): ${produto?.largura ? produto?.largura : ''}`}</b>
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
                                            placeholder='Nº Rolo'
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
                                            placeholder='Nº Tear'
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
                                            placeholder='Tipo Tear'
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
                                            placeholder='Metros (m)'
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
                                            placeholder='Revisor'
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
                </Grid>
            </div>
        </>
    );
}
