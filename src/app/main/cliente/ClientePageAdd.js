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
import axios from 'axios';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import InputPasswordToggle from 'src/@core/components/input-password-toggle';
import { InputGroup, InputGroupText } from 'reactstrap';
import { Eye, EyeOff } from 'react-feather';

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

export default function ClientePageAdd({ onChangeFields, onChangeValues }) {
    const [tabValue, setTabValue] = React.useState(0);
    const [conjunto_pacientes, setConjuntoClientes] = React.useState([]);
    const [conjClientesErrors, setConjClientesErrors] = React.useState([]);
    const [mostrarConfirmaSenha, setMostrarConfirmaSenha] = React.useState(false);
    const [mostrarSenha, setMostrarSenha] = React.useState(false);

    const methods = useFormContext();

    const { control, clearErrors, setError, setValue, formState, watch, getValues } = methods;



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

    const handleDeleteCjCliente = (id) => {
        const newCjClientes = conjunto_pacientes.filter((cjCliente) => cjCliente.id !== id);
        setConjuntoClientes(newCjClientes);
        setValue('conjunto_pacientes', newCjClientes);
    }

    const handleAddConjuntoCliente = () => {
        const cjCliente = { id: genId(), nome: '', descricao: '' };

        setValue('conjunto_pacientes', [...conjunto_pacientes, { id: cjCliente.id, nome: cjCliente.nome, descricao: cjCliente.descricao }]);

        setConjuntoClientes([...conjunto_pacientes, { id: cjCliente.id, nome: cjCliente.nome, descricao: cjCliente.descricao }]);
    }

    const handleChangeCjCliente = (event, id) => {
        const newCjClientes = conjunto_pacientes.map((cjCliente) => {
            if (cjCliente.id === id) {
                cjCliente[event.target.name] = event.target.value;
            }
            return cjCliente;
        });
        setConjuntoClientes(newCjClientes);
        setValue('conjunto_pacientes', newCjClientes);

        const item = newCjClientes.find((cjCliente) => cjCliente.id === id);
        const temNomeIgual = newCjClientes.filter((cjCliente) => cjCliente.nome.toUpperCase() === item.nome.toUpperCase());
        if (temNomeIgual.length > 1) {
            if (!conjClientesErrors.includes(id)) {
                setConjClientesErrors([...conjClientesErrors, id]);
            }
        } else {
            const newConjClientesErrors = conjClientesErrors.filter((cjClienteId) => cjClienteId !== id);
            setConjClientesErrors(newConjClientesErrors);
        }
    }

    const handlePostFormBuilder = (form) => {
        console.log('post form builder: ', form);
        setValue('formulario', JSON.stringify(form));
    }

    const handleChangeCEP = async (cep, isCliente) => {
        try {
            console.log('cep', cep);
            if(cep.length === 9) {
                const cepConsulta = cep.replace('-', '');
                console.log('cepConsulta', cepConsulta);
                if(cepConsulta.length === 8) {
                    const res = await axios.get(`https://brasilapi.com.br/api/cep/v2/${cepConsulta}`);
                    console.log('res', res);
                    if(res && res.status === 200) {
                        setValue(isCliente ? 'endereco' : 'dermoterapeuta.endereco', res.data.street);
                        setValue(isCliente ? 'bairro' : 'dermoterapeuta.bairro', res.data.neighborhood);
                        setValue(isCliente ? 'cidade' : 'dermoterapeuta.cidade', res.data.city);
                        setValue(isCliente ? 'estado' : 'dermoterapeuta.estado', res.data.state);
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const renderIconSenha = () => {
        const size = 14

        if (mostrarSenha === false) {
        return <Eye size={size} />
        } else {
        return <EyeOff size={size} />
        }
    }

    const renderIconConfirmaSenha = () => {
        const size = 14

        if (mostrarConfirmaSenha === false) {
        return <Eye size={size} />
        } else {
        return <EyeOff size={size} />
        }
    }
    
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
                <Tab className="h-64" style={{color: `${errors?.razao_social || errors?.cnpj || errors?.email ? 'red' : ''}`}} label="Informações do Cliente" />
                <Tab className="h-64" style={{color: `${errors?.dermoterapeuta?.nome ? 'red' : ''}`}} label="Profissional Dermoterapeuta" />
                <Tab className="h-64" style={{color: `${errors?.dermoterapeuta?.login?.email || errors?.dermoterapeuta?.login?.senha || errors?.dermoterapeuta?.login?.confirmaSenha ? 'red' : ''}`}} label="Dados de Acesso do Usuário" />
            </Tabs>
            <div className="p-16 sm:p-24">
                <div className={tabValue !== 0 ? 'hidden mb-32' : 'mb-32'}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Controller
                                name="razao_social"
                                control={control}
                                render={({ field }) => (
                                    <FormControl error={!!errors.razao_social} required fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            Razão Social
                                        </FormLabel>
                                        <TextField
                                            {...field}
                                            placeholder=''
                                            autoFocus
                                            id="razao_social"
                                            variant="outlined"
                                            fullWidth
                                        />
                                        <FormHelperText>{errors?.razao_social?.message}</FormHelperText>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controller
                                name="cnpj"
                                control={control}
                                render={({ field, fieldState, formState  }) => (
                                    <FormControl error={!!errors?.cnpj} fullWidth required>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            CNPJ
                                        </FormLabel>
                                        <CurrencyFormat
                                            {...field}
                                            id='cnpj'
                                            customInput={TextField}
                                            format="##.###.###/####-##"
                                            required
                                            mask="_"
                                            fullWidth
                                        />
                                        <FormHelperText>{errors?.cnpj?.message}</FormHelperText>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Controller
                                name="telefone"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            Telefone
                                        </FormLabel>
                                        <CurrencyFormat
                                            {...field}
                                            id='telefone'
                                            customInput={TextField}
                                            format="(##) ####-####"
                                            mask="_"
                                        />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Controller
                                name="celular"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            Celular
                                        </FormLabel>
                                        <CurrencyFormat
                                            {...field}
                                            id='celular'
                                            customInput={TextField}
                                            format="(##) #####-####"
                                            mask="_"
                                        />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <FormControl error={!!errors?.email} fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            Email
                                        </FormLabel>
                                        <TextField
                                            {...field}
                                            id="email"
                                            type='email'
                                            variant="outlined"
                                            fullWidth
                                        />
                                        <FormHelperText>{errors?.email?.message}</FormHelperText>
                                    </FormControl>

                                )}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <div className="mt-32 flex flex-row">
                                <h2>Endereço Comercial</h2>
                            </div>
                        </Grid>
                        <Grid item xs={4}>
                            <Controller
                                name="cep"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            CEP
                                        </FormLabel>
                                        <CurrencyFormat
                                            {...field}
                                            id='cep'
                                            customInput={TextField}
                                            format="#####-###"
                                            mask="_"
                                            fullWidth
                                            onChange={(e) => {
                                                console.log('e', e);
                                                field.onChange(e);
                                                handleChangeCEP(e.target.value, true);
                                            }}
                                        />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}></Grid>
                        <Grid item xs={5}>
                            <Controller
                                name="endereco"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            Endereço
                                        </FormLabel>
                                        <TextField
                                            {...field}
                                            id="endereco"
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
                                        <FormLabel className="font-medium text-14" component="legend">
                                            Número
                                        </FormLabel>
                                        <TextField
                                            {...field}
                                            id="numero"
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
                                        <FormLabel className="font-medium text-14" component="legend">
                                            Complemento
                                        </FormLabel>
                                        <TextField
                                            {...field}
                                            id="complemento"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controller
                                name="bairro"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            Bairro
                                        </FormLabel>
                                        <TextField
                                            {...field}
                                            id="bairro"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controller
                                name="cidade"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            Cidade
                                        </FormLabel>
                                        <TextField
                                            {...field}
                                            id="cidade"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controller
                                name="estado"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            Estado
                                        </FormLabel>
                                        <TextField
                                            {...field}
                                            id="estado"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                    </Grid>
                </div>
                <div className={tabValue !== 1 ? 'hidden mb-32' : 'mb-32'}>
                    <Grid container spacing={2}>
                        <Grid item xs={8}>
                            <Controller
                                name="dermoterapeuta.nome"
                                control={control}
                                render={({ field }) => (
                                    <FormControl error={!!errors?.dermoterapeuta?.nome} required fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            Nome Completo
                                        </FormLabel>
                                        <TextField
                                            {...field}
                                            placeholder=''
                                            autoFocus
                                            id="dermoterapeuta.nome"
                                            variant="outlined"
                                            fullWidth
                                        />
                                        <FormHelperText>{errors?.dermoterapeuta?.nome?.message}</FormHelperText>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Controller
                                control={control}
                                name="dermoterapeuta.data_nascimento"
                                render={({ field: { value, onChange } }) => (
                                    <FormControl fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            Data de Nascimento
                                        </FormLabel>
                                        <DateTimePicker
                                            ampm={false}
                                            views={['year', 'month', 'day']}
                                            clearable
                                            format='dd/MM/yyyy'
                                            timezone='America/Sao_Paulo'
                                            disableFuture
                                            
                                            localeText={{
                                                todayButtonLabel: 'Hoje',
                                                toolbarTitle: 'Selecione uma data',
                                            }}
                                            slotProps={{
                                                textField: {
                                                id: 'dermoterapeuta.data_nascimento',
                                                InputLabelProps: {
                                                    shrink: true,
                                                },
                                                fullWidth: true,
                                                variant: 'outlined',
                                                }
                                            }}
                                            slots={{
                                                openPickerIcon: () => <FuseSvgIcon size={20}>heroicons-solid:calendar</FuseSvgIcon>,
                                            }}
                                        />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controller
                                name="dermoterapeuta.cpf"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            CPF
                                        </FormLabel>
                                        <CurrencyFormat
                                            {...field}
                                            id='dermoterapeuta.cpf'
                                            customInput={TextField}
                                            format="###.###.###-##"
                                            mask="_"
                                            fullWidth
                                        />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controller
                                name="dermoterapeuta.rg"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            RG
                                        </FormLabel>
                                        <TextField
                                            {...field}
                                            id='dermoterapeuta.rg'
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Controller
                                name="dermoterapeuta.email"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            Email
                                        </FormLabel>
                                        <TextField
                                            {...field}
                                            id='dermoterapeuta.email'
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Controller
                                name="dermoterapeuta.telefone"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            Telefone
                                        </FormLabel>
                                        <CurrencyFormat
                                            {...field}
                                            id='dermoterapeuta.telefone'
                                            customInput={TextField}
                                            format="(##) ###-###"
                                            mask="_"
                                            fullWidth
                                        />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <Controller
                                name="dermoterapeuta.celular"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            Celular
                                        </FormLabel>
                                        <CurrencyFormat
                                            {...field}
                                            id='dermoterapeuta.celular'
                                            customInput={TextField}
                                            format="(##) ####-###"
                                            mask="_"
                                            fullWidth
                                        />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <div className="mt-32 flex flex-row">
                                <h2>Endereço Residencial</h2>
                            </div>
                        </Grid>
                        <Grid item xs={4}>
                            <Controller
                                name="dermoterapeuta.cep"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            CEP
                                        </FormLabel>
                                        <CurrencyFormat
                                            {...field}
                                            id='dermoterapeuta.cep'
                                            customInput={TextField}
                                            format="#####-###"
                                            mask="_"
                                            fullWidth
                                            onChange={(e) => {
                                                console.log('e', e);
                                                field.onChange(e);
                                                handleChangeCEP(e.target.value, false);
                                            }}
                                        />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}></Grid>
                        <Grid item xs={5}>
                            <Controller
                                name="dermoterapeuta.endereco"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            Endereço
                                        </FormLabel>
                                        <TextField
                                            {...field}
                                            id="dermoterapeuta.endereco"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Controller
                                name="dermoterapeuta.numero"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            Número
                                        </FormLabel>
                                        <TextField
                                            {...field}
                                            id="dermoterapeuta.numero"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <Controller
                                name="dermoterapeuta.complemento"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            Complemento
                                        </FormLabel>
                                        <TextField
                                            {...field}
                                            id="dermoterapeuta.complemento"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controller
                                name="dermoterapeuta.bairro"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            Bairro
                                        </FormLabel>
                                        <TextField
                                            {...field}
                                            id="dermoterapeuta.bairro"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controller
                                name="dermoterapeuta.cidade"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            Cidade
                                        </FormLabel>
                                        <TextField
                                            {...field}
                                            id="dermoterapeuta.cidade"
                                            variant="outlined"
                                            fullWidth
                                        />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controller
                                name="dermoterapeuta.estado"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            Estado
                                        </FormLabel>
                                        <TextField
                                            {...field}
                                            id="dermoterapeuta.estado"
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
                    <Grid container spacing={2} className='flex justify-content-center'>
                        <Grid item xs={8}>
                            <Controller
                                name="dermoterapeuta.login.email"
                                control={control}
                                render={({ field }) => (
                                    <FormControl error={!!errors?.dermoterapeuta?.login?.email} required fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            Email
                                        </FormLabel>
                                        <TextField
                                            {...field}
                                            placeholder=''
                                            autoFocus
                                            type='email'
                                            id="dermoterapeuta.login.email"
                                            variant="outlined"
                                            fullWidth
                                        />
                                        <FormHelperText>{errors?.dermoterapeuta?.login?.email?.message}</FormHelperText>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={8}>
                            <Controller
                                name="dermoterapeuta.login.senha"
                                control={control}
                                render={({ field }) => (
                                    <>
                                    <FormControl error={!!errors?.dermoterapeuta?.login?.senha} required fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            Senha
                                        </FormLabel>
                                        <InputGroup className='w-100' style={{flexWrap: 'nowrap'}}>
                                            <TextField
                                                {...field}
                                                placeholder=''
                                                className='w-100'
                                                type={mostrarSenha ? 'text' : 'password'}
                                                id="dermoterapeuta.login.senha"
                                                variant="outlined"
                                                size='large'
                                            />
                                            <InputGroupText className='cursor-pointer' onClick={() => setMostrarSenha(!mostrarSenha)}>
                                                {renderIconSenha()}
                                            </InputGroupText>
                                        </InputGroup>
                                    </FormControl>
                                    <FormHelperText sx={{color: errors?.dermoterapeuta?.login?.senha?.message ? 'red' : field.value?.length >= 8 ? 'green' : 'GrayText'}}>{`▪️ Mínimo de 8 caracteres`}</FormHelperText>
                                    </>
                                )}
                            />
                        </Grid>
                        <Grid item xs={8}>
                            <Controller
                                name="dermoterapeuta.login.confirmaSenha"
                                control={control}
                                render={({ field }) => (
                                    <FormControl error={!!errors?.dermoterapeuta?.login?.confirmaSenha} required fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            Digite a senha novamente
                                        </FormLabel>
                                        <InputGroup className='w-100' style={{flexWrap: 'nowrap'}}>
                                            <TextField
                                                {...field}
                                                placeholder=''
                                                className='w-100'
                                                type={mostrarConfirmaSenha ? 'text' : 'password'}
                                                id="dermoterapeuta.login.confirmaSenha"
                                                variant="outlined"
                                                size='large'
                                            />
                                            <InputGroupText className='cursor-pointer' onClick={() => setMostrarConfirmaSenha(!mostrarConfirmaSenha)}>
                                                {renderIconConfirmaSenha()}
                                            </InputGroupText>
                                        </InputGroup>
                                        <FormHelperText>{errors?.dermoterapeuta?.login?.confirmaSenha?.message}</FormHelperText>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                    </Grid>
                </div>
            </div>
        </>
    );
}
