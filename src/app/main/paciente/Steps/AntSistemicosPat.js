import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Checkbox, FormControl, FormControlLabel, FormLabel, Grid, InputAdornment, MenuItem, Select, TextField, Typography } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import axios from "axios";
import CurrencyFormat from "react-currency-format";
import { Controller, useFormContext } from "react-hook-form";

const opcoesAntPatologicos = [
    'Hepatite',
    'Cardiológico',
    'Obesidade',
    'Alergia',
    'Doenças Infectocontagiosas',
    'Marca-passo',
    'Diabetes',
    'Dermatológico',
    'Hipotensão',
    'Epilepsia ou Convulsões',
    'Hipotireoidismo',
    'Psicológico (depressão, ansiedade)',
    'Hipertensão',
    'Implantes Dentários',
    'Hipertireoidismo',
    'Tricotilomania',
    'Circulatório',
    'Estresse',
    'Ginecológico',
    'Psoríase'
];

const AntSistemicosPat = () => {

    const methods = useFormContext();

    const { control, clearErrors, setError, setValue, formState, watch, getValues } = methods;



    const { isValid, dirtyFields, errors, touchedFields } = formState;

    const values = watch('ficha_anamnese.antecedentesSistemicosPat.values');

    const proteseMetalica = watch('ficha_anamnese.antecedentesSistemicosPat.proteseMetalica');
    const cirurgias = watch('ficha_anamnese.antecedentesSistemicosPat.cirurgias');
    const cirurgiaPlastica = watch('ficha_anamnese.antecedentesSistemicosPat.cirurgiaPlastica');

    const antecedenteOncologico = watch('ficha_anamnese.antecedentesSistemicosPat.antecedenteOncologico');

    const outros = watch('ficha_anamnese.antecedentesSistemicosPat.outros');

    const prefixField = 'ficha_anamnese.antecedentesSistemicosPat.';
    return (
        <Grid container spacing={2}>

            <Grid item xs={12}>
                <Grid container spacing={2}>
                    {opcoesAntPatologicos.map((opcao, index) => (
                        <Grid item xs={4} key={`${opcao}${index}`}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        tabIndex={-1}
                                        title={opcao}
                                        inputProps={{ 'aria-label': opcao }}
                                        checked={values ? values.includes(opcao) : false}
                                        onChange={(ev) => {
                                            if (!values) {
                                                setValue(`${prefixField}values`, []);
                                            }
                                            if (ev.target.checked) {
                                                if (!values.includes(opcao)) {
                                                    setValue(`${prefixField}values`, [...values, opcao]);
                                                }
                                            } else {
                                                if (values.includes(opcao)) {
                                                    const newValues = values.filter((value) => value !== opcao);
                                                    setValue(`${prefixField}values`, newValues);
                                                }
                                            }
                                        }}
                                    />}
                                label={opcao}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Controller
                    name={`${prefixField}observacoes`}
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <FormLabel className="mt-4 font-medium text-14" component="legend">
                                Observações
                            </FormLabel>
                            <TextField
                                {...field}
                                id={`${prefixField}observacoes`}
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={3}
                                InputProps={{
                                    className: 'max-h-min h-min items-start',
                                    startAdornment: (
                                        <InputAdornment className="mt-16" position="start">
                                            <FuseSvgIcon size={20}>heroicons-solid:menu-alt-2</FuseSvgIcon>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </FormControl>
                    )}
                />
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                <Controller
                    name={`${prefixField}proteseMetalica`}
                    control={control}
                    defaultValue={false}
                    render={({ field: { onChange, value } }) => (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    tabIndex={-1}
                                    title={'Prótese Metálica?'}
                                    id={`${prefixField}proteseMetalica`}
                                    inputProps={{ 'aria-label': 'Prótese Metálica?' }}
                                    checked={proteseMetalica}
                                    onChange={(ev) => {
                                        if(!ev.target.checked) {
                                            setValue(`${prefixField}proteseMetalicaDesc`, '');
                                        }
                                        onChange(ev.target.checked);
                                    }}
                                />}
                            label='Prótese Metálica?'
                        />
                    )}
                />
                </Grid>
                <Grid item xs={9}>
                <Controller
                    name={`${prefixField}proteseMetalicaDesc`}
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            autoFocus
                            disabled={!proteseMetalica}
                            id={`${prefixField}proteseMetalicaDesc`}
                            variant="standard"
                            fullWidth
                        />
                    )}
                />
                </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                <Controller
                    name={`${prefixField}cirurgias`}
                    control={control}
                    defaultValue={false}
                    render={({ field: { onChange, value } }) => (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    tabIndex={-1}
                                    title={'Cirurgias?'}
                                    id={`${prefixField}cirurgias`}
                                    inputProps={{ 'aria-label': 'Cirurgias?' }}
                                    checked={cirurgias}
                                    onChange={(ev) => {
                                        if(!ev.target.checked) {
                                            setValue(`${prefixField}cirurgiasDesc`, '');
                                        }
                                        onChange(ev.target.checked);
                                    }}
                                />}
                            label='Cirurgias?'
                        />
                    )}
                />
                </Grid>
                <Grid item xs={9}>
                <Controller
                    name={`${prefixField}cirurgiasDesc`}
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            autoFocus
                            disabled={!cirurgias}
                            id={`${prefixField}cirurgiasDesc`}
                            variant="standard"
                            fullWidth
                        />
                    )}
                />
                </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                <Controller
                    name={`${prefixField}cirurgiaPlastica`}
                    control={control}
                    defaultValue={false}
                    render={({ field: { onChange, value } }) => (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    tabIndex={-1}
                                    title={'Cirurgia Plástica?'}
                                    id={`${prefixField}cirurgiaPlastica`}
                                    inputProps={{ 'aria-label': 'Cirurgia Plástica?' }}
                                    checked={cirurgiaPlastica}
                                    onChange={(ev) => {
                                        if(!ev.target.checked) {
                                            setValue(`${prefixField}cirurgiaPlasticaDesc`, '');
                                        }
                                        onChange(ev.target.checked);
                                    }}
                                />}
                            label='Cirurgia Plástica?'
                        />
                    )}
                />
                </Grid>
                <Grid item xs={9}>
                <Controller
                    name={`${prefixField}cirurgiaPlasticaDesc`}
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            autoFocus
                            disabled={!cirurgiaPlastica}
                            id={`${prefixField}cirurgiaPlasticaDesc`}
                            variant="standard"
                            fullWidth
                        />
                    )}
                />
                </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                <Controller
                    name={`${prefixField}antecedenteOncologico`}
                    control={control}
                    defaultValue={false}
                    render={({ field: { onChange, value } }) => (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    tabIndex={-1}
                                    title={'Antecedente Oncológico. Qual?'}
                                    id={`${prefixField}antecedenteOncologico`}
                                    inputProps={{ 'aria-label': 'Antecedente Oncológico. Qual?' }}
                                    checked={antecedenteOncologico}
                                    onChange={(ev) => {
                                        if(!ev.target.checked) {
                                            setValue(`${prefixField}antecedenteOncologicoDesc`, '');
                                        }
                                        onChange(ev.target.checked);
                                    }}
                                />}
                            label='Antecedente Oncológico. Qual?'
                        />
                    )}
                />
                </Grid>
                <Grid item xs={9}>
                <Controller
                    name={`${prefixField}antecedenteOncologicoDesc`}
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            autoFocus
                            disabled={!antecedenteOncologico}
                            id={`${prefixField}antecedenteOncologicoDesc`}
                            variant="standard"
                            fullWidth
                        />
                    )}
                />
                </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                <Controller
                    name={`${prefixField}outros`}
                    control={control}
                    defaultValue={false}
                    render={({ field: { onChange, value } }) => (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    tabIndex={-1}
                                    title={'Outros:'}
                                    id={`${prefixField}outros`}
                                    inputProps={{ 'aria-label': 'Outros:' }}
                                    checked={outros}
                                    onChange={(ev) => {
                                        if(!ev.target.checked) {
                                            setValue(`${prefixField}outrosDesc`, '');
                                        }
                                        onChange(ev.target.checked);
                                    }}
                                />}
                            label='Outros:'
                        />
                    )}
                />
                </Grid>
                <Grid item xs={9}>
                <Controller
                    name={`${prefixField}outrosDesc`}
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            autoFocus
                            disabled={!outros}
                            id={`${prefixField}outrosDesc`}
                            variant="standard"
                            fullWidth
                        />
                    )}
                />
                </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default AntSistemicosPat;