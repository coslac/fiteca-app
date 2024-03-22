import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { FormControl, FormLabel, Grid, MenuItem, Select, TextField, Typography } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import axios from "axios";
import CurrencyFormat from "react-currency-format";
import { Controller, useFormContext } from "react-hook-form";

const DadosPessoais = () => {

    const methods = useFormContext();

    const { control, clearErrors, setError, setValue, formState, watch, getValues } = methods;



    const { isValid, dirtyFields, errors, touchedFields } = formState;

    const handleChangeCEP = async (cep) => {
        try {
            console.log('cep', cep);
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

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
                <Controller
                    name="nome"
                    control={control}
                    render={({ field }) => (
                        <FormControl error={!!errors.nome} fullWidth required>
                            <FormLabel className="font-medium text-14" component="legend">
                                Nome Completo
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
            <Grid item xs={4}>
                            <Controller
                                control={control}
                                name="data_nascimento"
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            Data de Nascimento
                                        </FormLabel>
                                        <DateTimePicker
                                            {...field}
                                            ampm={false}
                                            views={['year', 'month', 'day']}
                                            clearable
                                            format='dd/MM/yyyy'
                                            value={new Date(field.value)}
                                            timezone='America/Sao_Paulo'
                                            disableFuture
                                            id='data_nascimento'
                                            localeText={{
                                                todayButtonLabel: 'Hoje',
                                                toolbarTitle: 'Selecione uma data',
                                            }}
                                            slotProps={{
                                                textField: {
                                                
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
                            name="sexo"
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth>
                                    <FormLabel className="font-medium text-14" component="legend">
                                        Sexo
                                    </FormLabel>
                                    <Select id="sexo" {...field} variant="outlined" fullWidth defaultValue="" value={field.value} defaultChecked displayEmpty 
                                        onChange={(e) => {
                                            field.onChange(e);
                                            if(e.target.value === 'Masculino') {
                                                setValue('ficha_anamnese.habitosVidaDiaria.gestante', null);
                                                setValue('ficha_anamnese.habitosVidaDiaria.periodoGestacional', null);
                                                setValue('ficha_anamnese.habitosVidaDiaria.gravidezAnterior', null);
                                                setValue('ficha_anamnese.habitosVidaDiaria.filhos', null);
                                                setValue('ficha_anamnese.habitosVidaDiaria.partos', null);
                                                setValue('ficha_anamnese.habitosVidaDiaria.cicloMenstrual', null);
                                                setValue('ficha_anamnese.habitosVidaDiaria.dum', null);
                                                setValue('ficha_anamnese.habitosVidaDiaria.usoAnticoncepcional', null);
                                                setValue('ficha_anamnese.habitosVidaDiaria.tipoAnticoncepcional', null);
                                            }
                                        }}
                                    >
                                        <MenuItem defaultChecked defaultValue={''} value=''>Selecione...</MenuItem>
                                        <MenuItem value='Feminino'>Feminino</MenuItem>
                                        <MenuItem value='Masculino'>Masculino</MenuItem>
                                    </Select>
                                </FormControl>
                            )}
                        />
                    </Grid>
                    <Grid item xs={6}>
                <Controller
                    name="profissao"
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <FormLabel className="font-medium text-14" component="legend">
                                Profissão
                            </FormLabel>
                            <TextField
                                {...field}
                                placeholder=''
                                autoFocus
                                id="profissao"
                                variant="outlined"
                                fullWidth
                            />
                        </FormControl>
                    )}
                />
            </Grid>
                        <Grid item xs={6}>
                            <Controller
                                name="cpf"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            CPF
                                        </FormLabel>
                                        <CurrencyFormat
                                            {...field}
                                            id='cpf'
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
                                name="rg"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            RG
                                        </FormLabel>
                                        <TextField
                                            {...field}
                                            id='rg'
                                            variant="outlined"
                                            fullWidth
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
                                    <FormControl fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            Email
                                        </FormLabel>
                                        <TextField
                                            {...field}
                                            id='email'
                                            variant="outlined"
                                            fullWidth
                                            type="email"
                                        />
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
                                            fullWidth
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
                                            format="(##) ####-###"
                                            mask="_"
                                            fullWidth
                                        />
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" className="font-medium mt-8 mb-4">
                                Endereço Residencial
                            </Typography>            
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
                                                handleChangeCEP(e.target.value);
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
    );
};

export default DadosPessoais;