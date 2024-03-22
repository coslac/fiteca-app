import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { FormControl, FormControlLabel, FormLabel, Grid, InputAdornment, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from "@mui/material";
import { getValue } from "@mui/system";
import { DateTimePicker } from "@mui/x-date-pickers";
import axios from "axios";
import CurrencyFormat from "react-currency-format";
import { Controller, useFormContext } from "react-hook-form";

const HabitosVidaDiaria = () => {

    const methods = useFormContext();

    const { control, clearErrors, setError, setValue, formState, watch, getValues } = methods;



    const { isValid, dirtyFields, errors, touchedFields } = formState;

    const estiloVida = watch('ficha_anamnese.habitosVidaDiaria.estiloVida');
    const gestante = watch('ficha_anamnese.habitosVidaDiaria.gestante');
    const gravidezAnterior = watch('ficha_anamnese.habitosVidaDiaria.gravidezAnterior');
    const usuAnticoncepcional = watch('ficha_anamnese.habitosVidaDiaria.usoAnticoncepcional');

    const prefixField = 'ficha_anamnese.habitosVidaDiaria.';

    console.log('gestante: ', gestante)

    const setValueRadio = (field, value) => {
        if(value === "") {
            setValue(field, null);
        } else {
            setValue(field, value === "true");
        }
    }
    
    return (
        <Grid container spacing={3}>
            <Grid item xs={4}>
                <Controller
                    name={`${prefixField}estiloVida`}
                    control={control}
                    render={({ field }) => (
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">Estilo de vida</FormLabel>
                            <RadioGroup
                                {...field}
                                aria-labelledby={`${prefixField}estiloVida`}
                                id={`${prefixField}estiloVida`}
                            >
                                <FormControlLabel value="Sedentário" control={<Radio />} label="Sedentário" />
                                <FormControlLabel value="Ativo" control={<Radio />} label="Ativo" />
                            </RadioGroup>
                        </FormControl>
                    )}
                />
                {estiloVida && estiloVida !== '' && (
                    <Controller
                        name={`${prefixField}estiloVidaTipoFrequencia`}
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                size="small"
                                autoFocus
                                label="Tipo/Frequência"
                                placeholder="Tipo/Frequência"
                                id={`${prefixField}estiloVidaTipoFrequencia`}
                                variant="outlined"
                                fullWidth
                            />
                        )}
                    />
                )}
            </Grid>
            <Grid item xs={4}>
                <Controller
                    name={`${prefixField}fumante`}
                    control={control}
                    render={({ field }) => (
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">Fumante</FormLabel>
                            <RadioGroup
                                {...field}
                                aria-labelledby={`${prefixField}fumante`}
                                id={`${prefixField}fumante`}
                                onChange={(e) => setValueRadio(`${prefixField}fumante`, e.target.value)}
                            >
                                <FormControlLabel value={true} control={<Radio />} label="Sim" />
                                <FormControlLabel value={false} control={<Radio />} label="Não" />
                            </RadioGroup>
                        </FormControl>
                    )}
                />
            </Grid>
            <Grid item xs={4}>
                <Controller
                    name={`${prefixField}etilista`}
                    control={control}
                    render={({ field }) => (
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">Etilista</FormLabel>
                            <RadioGroup
                                {...field}
                                aria-labelledby={`${prefixField}etilista`}
                                id={`${prefixField}etilista`}
                                onChange={(e) => setValueRadio(`${prefixField}etilista`, e.target.value)}
                            >
                                <FormControlLabel value={true} control={<Radio />} label="Sim" />
                                <FormControlLabel value={false} control={<Radio />} label="Não" />
                            </RadioGroup>
                        </FormControl>
                    )}
                />
            </Grid>
            <Grid item xs={4}>
                <Controller
                    name={`${prefixField}trabalho`}
                    control={control}
                    render={({ field }) => (
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">Trabalho</FormLabel>
                            <RadioGroup
                                {...field}
                                aria-labelledby={`${prefixField}trabalho`}
                                id={`${prefixField}trabalho`}
                            >
                                <FormControlLabel value="Ar Livre" control={<Radio />} label="Ar livre" />
                                <FormControlLabel value="Ar condicionado" control={<Radio />} label="Ar condicionado" />
                            </RadioGroup>
                        </FormControl>
                    )}
                />
            </Grid>
            <Grid item xs={4}>
                <Controller
                    name={`${prefixField}qualidadeSono`}
                    control={control}
                    render={({ field }) => (
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">Qualidade do Sono</FormLabel>
                            <RadioGroup
                                {...field}
                                aria-labelledby={`${prefixField}qualidadeSono`}
                                id={`${prefixField}qualidadeSono`}
                            >
                                <FormControlLabel value="Bom" control={<Radio />} label="Bom" />
                                <FormControlLabel value="Ruim" control={<Radio />} label="Ruim" />
                            </RadioGroup>
                        </FormControl>
                    )}
                />
            </Grid>
            <Grid item xs={4}>
                <Controller
                    name={`${prefixField}funcionamentoIntestinal`}
                    control={control}
                    render={({ field }) => (
                        <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">Funcionamento Intestinal</FormLabel>
                            <RadioGroup
                                {...field}
                                aria-labelledby={`${prefixField}funcionamentoIntestinal`}
                                id={`${prefixField}funcionamentoIntestinal`}
                            >
                                <FormControlLabel value="Bom" control={<Radio />} label="Bom" />
                                <FormControlLabel value="Ruim" control={<Radio />} label="Ruim" />
                            </RadioGroup>
                        </FormControl>
                    )}
                />
            </Grid>
            {getValues('sexo') !== 'Masculino' && (
                <>
                    <Grid item xs={4}>
                        <Controller
                            name={`${prefixField}gestante`}
                            control={control}
                            render={({ field }) => (
                                <FormControl>
                                    <FormLabel id="demo-row-radio-buttons-group-label">Gestante</FormLabel>
                                    <RadioGroup
                                        {...field}
                                        aria-labelledby={`${prefixField}gestante`}
                                        id={`${prefixField}gestante`}
                                        onChange={(e) => setValueRadio(`${prefixField}gestante`, e.target.value)}
                                    >
                                        <FormControlLabel value={true} control={<Radio />} label="Sim" />
                                        <FormControlLabel value={false} control={<Radio />} label="Não" />
                                    </RadioGroup>
                                </FormControl>
                            )}
                        />
                        {gestante && (
                            <Controller
                                name={`${prefixField}periodoGestacional`}
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        autoFocus
                                        size="small"
                                        label="Periodo Gestacional"
                                        placeholder="Periodo Gestacional"
                                        id={`${prefixField}periodoGestacional`}
                                        variant="outlined"
                                        fullWidth
                                    />
                                )}
                            />
                        )}
                    </Grid>
                    <Grid item xs={4}>
                        <Controller
                            name={`${prefixField}gravidezAnterior`}
                            control={control}
                            render={({ field }) => (
                                <FormControl>
                                    <FormLabel id="demo-row-radio-buttons-group-label">Gravidez Anterior</FormLabel>
                                    <RadioGroup
                                        {...field}
                                        aria-labelledby={`${prefixField}gravidezAnterior`}
                                        id={`${prefixField}gravidezAnterior`}
                                        onChange={(e) => setValueRadio(`${prefixField}gravidezAnterior`, e.target.value)}
                                    >
                                        <FormControlLabel value={true} control={<Radio />} label="Sim" />
                                        <FormControlLabel value={false} control={<Radio />} label="Não" />
                                    </RadioGroup>
                                </FormControl>
                            )}
                        />
                        {gravidezAnterior && (
                            <>
                                <Controller
                                    name={`${prefixField}filhos`}
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            autoFocus
                                            className="mb-2"
                                            size="small"
                                            label="Filhos"
                                            type="number"
                                            placeholder="Filhos"
                                            id={`${prefixField}filhos`}
                                            variant="outlined"

                                        />
                                    )}
                                />
                                <Controller
                                    name={`${prefixField}partos`}
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            size="small"
                                            label="Partos"
                                            type="number"
                                            placeholder="Partos"
                                            id={`${prefixField}partos`}
                                            variant="outlined"

                                        />
                                    )}
                                />
                            </>
                        )}
                    </Grid>
                    <Grid item xs={4}>
                        <Controller
                            name={`${prefixField}cicloMenstrual`}
                            control={control}
                            render={({ field }) => (
                                <FormControl>
                                    <FormLabel id="demo-row-radio-buttons-group-label">Ciclo Menstrual</FormLabel>
                                    <RadioGroup
                                        {...field}
                                        aria-labelledby={`${prefixField}cicloMenstrual`}
                                        id={`${prefixField}cicloMenstrual`}
                                    >
                                        <FormControlLabel value={'Regular'} control={<Radio />} label="Regular" />
                                        <FormControlLabel value={'Irregular'} control={<Radio />} label="Irregular" />
                                        <FormControlLabel value={'Menopausa'} control={<Radio />} label="Menopausa" />
                                    </RadioGroup>
                                </FormControl>
                            )}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Controller
                            name={`${prefixField}dum`}
                            control={control}
                            render={({ field }) => (
                                <FormControl>
                                    <FormLabel className="font-medium text-14" component="legend">
                                        DUM
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
                                                id: `${prefixField}dum`,
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
                    <Grid item xs={4}>
                        <Controller
                            name={`${prefixField}usoAnticoncepcional`}
                            control={control}
                            render={({ field }) => (
                                <FormControl>
                                    <FormLabel id="demo-row-radio-buttons-group-label">Uso de Anticoncepcional</FormLabel>
                                    <RadioGroup
                                        {...field}
                                        row
                                        aria-labelledby={`${prefixField}usoAnticoncepcional`}
                                        id={`${prefixField}usoAnticoncepcional`}
                                        onChange={(e) => setValueRadio(`${prefixField}usoAnticoncepcional`, e.target.value)}
                                    >
                                        <FormControlLabel value={true} control={<Radio />} label="Sim" />
                                        <FormControlLabel value={false} control={<Radio />} label="Não" />
                                    </RadioGroup>
                                </FormControl>
                            )}
                        />
                        {usuAnticoncepcional && (
                            <Controller
                                name={`${prefixField}tipoAnticoncepcional`}
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        autoFocus
                                        size="small"
                                        label="Qual"
                                        placeholder="Qual"
                                        id={`${prefixField}tipoAnticoncepcional`}
                                        variant="outlined"

                                    />
                                )}
                            />
                        )}
                    </Grid>
                </>
            )}
            <Grid item xs={4}>
                <Controller
                    name={`${prefixField}ingestaoAgua`}
                    control={control}
                    render={({ field }) => (
                        <FormControl>
                            <FormLabel>Ingestão de Água</FormLabel>
                            <TextField
                                {...field}
                                autoFocus
                                id={`${prefixField}ingestaoAgua`}
                                variant="outlined"
                            />
                        </FormControl>
                    )}
                />
            </Grid>
            <Grid item xs={12} md={8}>
                <Controller
                    name={`${prefixField}medicamentos`}
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <FormLabel>Medicamentos</FormLabel>
                            <TextField
                                {...field}
                                autoFocus
                                id={`${prefixField}medicamentos`}
                                variant="outlined"
                                fullWidth
                            />
                        </FormControl>
                    )}
                />
            </Grid>
            <Grid item xs={12} md={4}>
            <Controller
                            name={`${prefixField}exposicaoSol`}
                            control={control}
                            render={({ field }) => (
                                <FormControl>
                                    <FormLabel id="demo-row-radio-buttons-group-label">Exposição ao Sol</FormLabel>
                                    <RadioGroup
                                        {...field}
                                        row
                                        aria-labelledby={`${prefixField}exposicaoSol`}
                                        id={`${prefixField}exposicaoSol`}
                                    >
                                        <FormControlLabel value={'Diária'} control={<Radio />} label="Diária" />
                                        <FormControlLabel value={'Esporádica'} control={<Radio />} label="Esporádica" />
                                    </RadioGroup>
                                </FormControl>
                            )}
                        />
            </Grid>
        </Grid>
    );
};

export default HabitosVidaDiaria;