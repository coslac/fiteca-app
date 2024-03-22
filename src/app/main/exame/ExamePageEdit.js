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
import ConjuntoExameCard from 'app/shared-components/ConjuntoExameCard/ConjuntoExameCard';

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

const itemsFormBuilder = [
    {
        key: 'Header',
        name: 'Título',
        icon: 'fa fa-header',
        static: true,
        content: 'Seu Título...',
    },
    {
        key: 'Paragraph',
        name: 'Parágrafo',
        static: true,
        icon: 'fa fa-header',
        content: 'Placeholder Text...',
    },
    {
        group_name: 'Containers',
        key: 'TwoColumnRow',
        name: '2 Colunas',
    },
    {
        group_name: 'Containers',
        key: 'ThreeColumnRow',
        name: '3 Colunas',
    },
    {
        group_name: 'Containers',
        key: 'MultiColumnRow',
        name: '4 Colunas',
    },
    {
        group_name: 'Inputs',
        key: 'TextInput',
        name: 'Texto',
        static: true,
        icon: 'fas fa-font',
    },
    {
        group_name: 'Inputs',
        key: 'TextArea',
        name: 'Texto Multilinha',
        static: true,
        icon: 'fas fa-text-height',
        content: '',
    },
    {
        group_name: 'Inputs',
        key: 'NumberInput',
        name: 'Número',
        static: true,
        icon: 'fas fa-plus',
        content: '',
    },
    {
        group_name: 'Inputs',
        key: 'Date',
        name: 'Data',
        static: true,
        icon: 'fas fa-calendar',
    },
    {
        group_name: 'Inputs',
        key: 'Dropdown',
        name: 'Dropdown',
        static: true,
        icon: 'far fa-caret-square-down',
    },
    {
        group_name: 'Inputs',
        key: 'Checkboxes',
        name: 'Checkboxes',
        static: true,
        icon: 'far fa-check-square',
    },
    {
        group_name: 'Inputs',
        key: 'FileUpload',
        name: 'Upload de Arquivos',
        static: true,
        icon: 'fa fa-upload',
        content: 'Upload de Arquivos',
    },
];

export default function ExamePageEdit({ props, onChange, onChangeFields, onChangeValues }) {
    const [tabValue, setTabValue] = React.useState(0);
    const [conjunto_exames, setConjuntoExames] = React.useState([]);
    const [conjExamesErrors, setConjExamesErrors] = React.useState([]);
    const methods = useFormContext();

    const { control, setValue, formState, watch, getValues } = methods;

    const { isValid, dirtyFields, errors, touchedFields } = formState;

    function handleTabChange(event, value) {
        setTabValue(value);
    }

    function genId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    const handleDeleteCjExame = (id) => {
        const newCjExames = conjunto_exames.filter((cjExame) => cjExame.id !== id);
        setConjuntoExames(newCjExames);
        setValue('conjunto_exames', newCjExames);
    }

    const handleAddConjuntoExame = () => {
        const cjExame = { id: genId(), nome: '', descricao: '' };
        
        setValue('conjunto_exames', [...conjunto_exames, { id: cjExame.id, nome: cjExame.nome, descricao: cjExame.descricao }]);
        
        setConjuntoExames([...conjunto_exames, { id: cjExame.id, nome: cjExame.nome, descricao: cjExame.descricao }]);
    }

    const handleChangeCjExame = (event, id) => {
        const newCjExames = conjunto_exames.map((cjExame) => {
            if (cjExame.id === id) {
                cjExame[event.target.name] = event.target.value;
            }
            return cjExame;
        });
        setConjuntoExames(newCjExames);
        setValue('conjunto_exames', newCjExames);

        const item = newCjExames.find((cjExame) => cjExame.id === id);
        const temNomeIgual = newCjExames.filter((cjExame) => cjExame.nome.toUpperCase() === item.nome.toUpperCase());
        if (temNomeIgual.length > 1) {
            if(!conjExamesErrors.includes(id)) {
                setConjExamesErrors([...conjExamesErrors, id]);
            }
        } else {
            const newConjExamesErrors = conjExamesErrors.filter((cjExameId) => cjExameId !== id);
            setConjExamesErrors(newConjExamesErrors);
        }
    }

    const handlePostFormBuilder = (form) => {
        console.log('post form builder: ', form);
        setValue('formulario', JSON.stringify(form));
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
                <Tab className="h-64" label={getValues('tipo') === 'Individual' ? 'Informações do Exame' : 'Informações do Conjunto de Exames'} />
                <Tab className="h-64" label="Formulário de Solicitação" />
            </Tabs>
            <div className="p-16 sm:p-24">
                <div className={tabValue !== 0 ? 'hidden mb-32' : 'mb-32'}>
                    <div className='mb-32 mt-4'>
                        <Controller
                            name="tipo"
                            control={control}
                            render={({ field }) => (
                                <FormControl error={!!errors.tipo} required fullWidth>
                                    <FormLabel className="font-medium text-14" component="legend">
                                        Tipo do Exame
                                    </FormLabel>
                                    <Select required id="tipo" {...field} variant="outlined" fullWidth placeholder='Selecione o tipo do exame...'>
                                        <MenuItem value='Individual'>Individual</MenuItem>
                                        <MenuItem value='Conjunto de Exames'>Conjunto de Exames</MenuItem>
                                    </Select>
                                    <FormHelperText>{errors?.tipo?.message}</FormHelperText>
                                </FormControl>
                            )}
                        />
                    </div>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Controller
                                name="nome"
                                control={control}
                                render={({ field }) => (
                                    <FormControl error={!!errors.nome} fullWidth required>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            {getValues('tipo') == 'Individual' ? 'Nome do Exame' : 'Nome do Conjunto de Exames'}
                                        </FormLabel>
                                        <TextField
                                            {...field}
                                            placeholder=''
                                            autoFocus
                                            id="nome"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </FormControl>

                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controller
                                name="valor"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            Valor
                                        </FormLabel>
                                        <CurrencyFormat
                                            {...field}
                                            id='valor'
                                            customInput={TextField}
                                            thousandSeparator={'.'}
                                            decimalSeparator={','}
                                            decimalScale={2}
                                            fixedDecimalScale={true}
                                            prefix={'R$ '}
                                        />
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
                                            id="descricao"
                                            variant="outlined"
                                            multiline
                                            fullWidth
                                            rows={5}
                                        />
                                    </FormControl>

                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controller
                                name="resultado_em"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            Resultado em
                                        </FormLabel>
                                        <TextField
                                            {...field}
                                            required
                                            id="resultado_em"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </FormControl>

                                )}
                            />
                        </Grid>
                    </Grid>
                    {
                        control._formValues.tipo !== 'Individual' && (
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <div className="mt-32 flex flex-row justify-content-between align-items-baseline">
                                        <h2>Conjunto de Exames*</h2>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            startIcon={<Add />}
                                            onClick={handleAddConjuntoExame}
                                        >
                                            Adicionar Exame
                                        </Button>
                                    </div>
                                </Grid>
                                <Grid item xs={12}>
                                    {conjunto_exames.length > 0 ? (
                                        <>
                                            {conjunto_exames.length < 2 && (
                                                <div className="flex flex-1 items-center justify-center">
                                                    <Typography color="error" className="text-15 my-24">
                                                        Adicione no mínimo 2 Exames para criar um Conjunto de Exames.
                                                    </Typography>
                                                </div>
                                            )}
                                            <motion.div
                                                className="flex grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-32"
                                                variants={container}
                                                initial="hidden"
                                                animate="show"
                                            >
                                                {conjunto_exames.map((cjExame, index) => {
                                                    return (
                                                        <motion.div variants={item} key={index}>
                                                            <ConjuntoExameCard conjuntoExame={cjExame} handleDelete={handleDeleteCjExame} handleChange={handleChangeCjExame} hasErrorParam={conjunto_exames.length < 2 ? true : conjExamesErrors.includes(cjExame.id) ? true : false} temNomeIgual={conjExamesErrors.includes(cjExame.id) ? true : false}/>
                                                        </motion.div>
                                                    );
                                                })}
                                            </motion.div>
                                        </>
                                    ) : (
                                        <div className="flex flex-1 items-center justify-center">
                                            <Typography color="error" className="text-20 my-24">
                                                Adicione no mínimo 2 Exames para criar um Conjunto de Exames.
                                            </Typography>
                                        </div>
                                    )
                                    }
                                </Grid>
                            </Grid>

                        )
                    }
                </div>
                <div className={tabValue !== 1 ? 'hidden mb-32' : 'mb-32'}>
                    <div className='row mb-32 mt-4'>
                        <div className='col-12'>
                            <ReactFormBuilder onPost={handlePostFormBuilder} show_description editMode toolbarItems={itemsFormBuilder} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
