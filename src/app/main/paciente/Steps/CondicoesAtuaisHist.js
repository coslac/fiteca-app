import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { FormControl, FormLabel, Grid, InputAdornment, MenuItem, Select, TextField, Typography } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import axios from "axios";
import CurrencyFormat from "react-currency-format";
import { Controller, useFormContext } from "react-hook-form";

const CondicoesAtuaisHist = () => {

    const methods = useFormContext();

    const { control, clearErrors, setError, setValue, formState, watch, getValues } = methods;



    const { isValid, dirtyFields, errors, touchedFields } = formState;

    const prefixField = 'ficha_anamnese.condicoesAtuaisHistorico.';
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Controller
                    name={`${prefixField}queixaPrincipal`}
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <FormLabel className="font-medium text-14" component="legend">
                                Queixa principal
                            </FormLabel>
                            <TextField
                                {...field}
                                placeholder="(Questiona-se o motivo da consulta, ou seja, o profissional entende o que o paciente busca com os seus serviços de Dermoterapia Capilar)."
                                id={`${prefixField}queixaPrincipal`}
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={5}
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
                <Controller
                    name={`${prefixField}historicoAfeccaoAtual`}
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <FormLabel className="font-medium text-14" component="legend">
                                História da afecção atual
                            </FormLabel>
                            <TextField
                                {...field}
                                placeholder="(Registra-se tudo que se relaciona com a queixa supracitada: sintomatologia, início, história da evolução, entre outros)."
                                id={`${prefixField}historicoAfeccaoAtual`}
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={5}
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
                <Controller
                    name={`${prefixField}antecedentesPessoaisSaude`}
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <FormLabel className="font-medium text-14" component="legend">
                                Antecedentes pessoais de saúde
                            </FormLabel>
                            <TextField
                                {...field}
                                placeholder="(Histórico de saúde do paciente, mesmo das condições que não estejam relacionadas diretamente com a afecção que será tratada)."
                                id={`${prefixField}antecedentesPessoaisSaude`}
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={5}
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
                <Controller
                    name={`${prefixField}historicoFamiliarSaude`}
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <FormLabel className="font-medium text-14" component="legend">
                                Histórico familiar de saúde
                            </FormLabel>
                            <TextField
                                {...field}
                                placeholder="(Buscar relações de hereditariedade que podem de alguma forma interferir no plano de tratamento)."
                                id={`${prefixField}historicoFamiliarSaude`}
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={5}
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
        </Grid>
    );
};

export default CondicoesAtuaisHist;