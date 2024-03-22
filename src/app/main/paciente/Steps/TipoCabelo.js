import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Checkbox, FormControl, FormControlLabel, FormLabel, Grid, InputAdornment, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import axios from "axios";
import CurrencyFormat from "react-currency-format";
import { Controller, useFormContext } from "react-hook-form";

const opcoesCurvaturaCabelo = [
    'Liso (típicos de etnias mongólicas, orientais, esquimós e indígenas). (Lisotircos)',
    'Ondulados (típicos dos caucasianos, mas podem ser encontrados em diversas etnias). (Sinótricos)',
    'Crespos (comuns na etnia negra, possuem formato elíptico e achatado helicoidal, o que lhe confere aspecto encaracolado). (Ulótricos)'
];

const opcoesDiametroFio = [
    'Grosso (superior a 0,06 mm).',
    ' Médio (entre 0,04 e 0,06 mm).',
    'Fino (abaixo de 0,04 mm).'
];

const opcoesQualidadeHaste = [
    'Tricoptilose',
    'Triconodose',
    'Tricorrece nodosa',
    'Ressecamento',
    'Alterações de cor',
    'Corte químico',
    'Anágenos frouxos',
    'Impenteáveis',
];

const opcoesCouroCabeludo = [
    'Equilibrado (Eudêmico)',
    'Oleoso Liídico',
    'Descamação',
    'Escoriações',
    'Seco Alípico',
    'Misto',
    'Pruído',
    'Eritema',
];

const opcoesProcessosQuimicos = [
    'Sem processo químico',
    'Descoloração/mechas/ reflexos',
    'Permanente',
    'Coloração',
    'Alisamento',
    'Sol,mar ou piscina',
];

const TipoCabelo = () => {

    const methods = useFormContext();

    const { control, clearErrors, setError, setValue, formState, watch, getValues } = methods;



    const { isValid, dirtyFields, errors, touchedFields } = formState;

    const curvatura = watch('ficha_anamnese.tipoCabelo.curvatura');
    const processosQuimicosExistentes = watch('ficha_anamnese.tipoCabelo.processosQuimicosExistentes');
    const outrosProcessosQuimicos = watch('ficha_anamnese.tipoCabelo.outrosProcessosQuimicos');
    const usoSecadores = watch('ficha_anamnese.tipoCabelo.usoSecadores');
    const usoPranchas = watch('ficha_anamnese.tipoCabelo.usoPranchas');
    const usoModeladores = watch('ficha_anamnese.tipoCabelo.usoModeladores');

    const prefixField = 'ficha_anamnese.tipoCabelo.';
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h6">Curvatura dos cabelos:</Typography>
            </Grid>
            <Grid item xs={12}>
                <Controller
                    name={`${prefixField}curvatura`}
                    control={control}
                    render={({ field }) => (
                        <FormControl>
                            <RadioGroup
                                {...field}
                                aria-labelledby={`${prefixField}curvatura`}
                                id={`${prefixField}curvatura`}
                            >
                                {opcoesCurvaturaCabelo.map((opcao) => (
                                    <FormControlLabel key={opcao} value={opcao} control={<Radio />} label={opcao} />
                                ))}
                            </RadioGroup>
                        </FormControl>
                    )}
                />
            </Grid>
            <Grid item xs={12} className="mt-4">
                <Typography variant="h6">Diâmetro do fio:
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Controller
                    name={`${prefixField}diametroFio`}
                    control={control}
                    render={({ field }) => (
                        <FormControl>
                            <RadioGroup
                                {...field}
                                aria-labelledby={`${prefixField}diametroFio`}
                                id={`${prefixField}diametroFio`}
                            >
                                {opcoesDiametroFio.map((opcao) => (
                                    <FormControlLabel key={opcao} value={opcao} control={<Radio />} label={opcao} />
                                ))}
                            </RadioGroup>
                        </FormControl>
                    )}
                />
            </Grid>
            <Grid item xs={12} className="mt-4">
                <Typography variant="h6">Densidade:
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Controller
                    name={`${prefixField}densidade`}
                    control={control}
                    render={({ field }) => (
                        <FormControl>
                            <RadioGroup
                                {...field}
                                aria-labelledby={`${prefixField}densidade`}
                                id={`${prefixField}densidade`}
                            >
                                <FormControlLabel value="Denso" control={<Radio />} label="Denso." />
                                <FormControlLabel value="Esparso" control={<Radio />} label="Esparso." />
                            </RadioGroup>
                        </FormControl>
                    )}
                />
            </Grid>
            <Grid item xs={12} className="mt-4">
                <Typography variant="h6">Qualidade da haste capilar (displasias): Patologias do fio:
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Controller
                    name={`${prefixField}qualidadeHasteCapilar`}
                    control={control}
                    render={({ field }) => (
                        <FormControl>
                            <RadioGroup
                                {...field}
                                row
                                aria-labelledby={`${prefixField}qualidadeHasteCapilar`}
                                id={`${prefixField}qualidadeHasteCapilar`}
                            >
                                {opcoesQualidadeHaste.map((opcao) => (
                                    <FormControlLabel key={opcao} value={opcao} control={<Radio />} label={opcao} />
                                ))}
                            </RadioGroup>
                        </FormControl>
                    )}
                />
            </Grid>
            <Grid item xs={12} className="mt-4">
                <Typography variant="h6">Couro Cabeludo:
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Controller
                    name={`${prefixField}couroCabeludo`}
                    control={control}
                    render={({ field }) => (
                        <FormControl>
                            <RadioGroup
                                {...field}
                                row
                                aria-labelledby={`${prefixField}couroCabeludo`}
                                id={`${prefixField}couroCabeludo`}
                            >
                                {opcoesCouroCabeludo.map((opcao) => (
                                    <FormControlLabel key={opcao} value={opcao} control={<Radio />} label={opcao} />
                                ))}
                            </RadioGroup>
                        </FormControl>
                    )}
                />
            </Grid>
            <Grid item xs={12} className="mt-4">
                <Typography variant="h6">Processos Químicos Existentes:
                </Typography>
            </Grid>
            {opcoesProcessosQuimicos.map((opcao) => (
                <Grid item xs={4} key={opcao}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                tabIndex={-1}
                                title={opcao}
                                inputProps={{ 'aria-label': opcao }}
                                checked={processosQuimicosExistentes ? processosQuimicosExistentes.includes(opcao) : false}
                                onChange={(ev) => {
                                    if (!processosQuimicosExistentes) {
                                        setValue(`${prefixField}processosQuimicosExistentes`, []);
                                    }
                                    if (!ev.target.checked) {
                                        if (processosQuimicosExistentes.includes(opcao)) {
                                            const newValues = processosQuimicosExistentes.filter((value) => value !== opcao);
                                            setValue(`${prefixField}processosQuimicosExistentes`, newValues);
                                        }
                                    } else {
                                        if (!processosQuimicosExistentes.includes(opcao)) {
                                            setValue(`${prefixField}processosQuimicosExistentes`, [...processosQuimicosExistentes, opcao]);
                                        }
                                    }
                                }}
                            />}
                        label={opcao}
                    />
                </Grid>
            ))}
            <Grid item xs={12} >
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <Controller
                            name={`${prefixField}outrosProcessosQuimicos`}
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            tabIndex={-1}
                                            inputProps={{ 'aria-label': 'Outros:' }}
                                            checked={outrosProcessosQuimicos}
                                            onChange={(ev) => {
                                                if (!ev.target.checked) {
                                                    setValue(`${prefixField}outrosProcessosQuimicosDesc`, '');
                                                }
                                                field.onChange(ev.target.checked);
                                            }}
                                        />}
                                    label='Outros:'
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={10}>
                        <Controller
                            name={`${prefixField}outrosProcessosQuimicosDesc`}
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    autoFocus
                                    disabled={!outrosProcessosQuimicos}
                                    id={`${prefixField}outrosProcessosQuimicosDesc`}
                                    variant="standard"
                                    fullWidth
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Controller
                    name={`${prefixField}usoAparelhos`}
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <FormLabel className="font-medium text-14" component="legend">
                                Uso de Aparelhos
                            </FormLabel>
                            <TextField
                                {...field}
                                id={`${prefixField}usoAparelhos`}
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
                <Typography variant="h6">Quadro Clínico:</Typography>
            </Grid>
            <Grid item xs={12}>
                <Controller
                    name={`${prefixField}sinaisClinicos`}
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <FormLabel className="font-medium text-14" component="legend">
                                Sinais Clínicos
                            </FormLabel>
                            <TextField
                                {...field}
                                id={`${prefixField}sinaisClinicos`}
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
                    name={`${prefixField}sintomas`}
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <FormLabel className="font-medium text-14" component="legend">
                                Sintomas
                            </FormLabel>
                            <TextField
                                {...field}
                                id={`${prefixField}sintomas`}
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
                    name={`${prefixField}biotipoCutaneo`}
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <FormLabel className="font-medium text-14" component="legend">
                                Biotipo Cutâneo
                            </FormLabel>
                            <TextField
                                {...field}
                                id={`${prefixField}biotipoCutaneo`}
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
                    name={`${prefixField}achadosDermatoscopia`}
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <FormLabel className="font-medium text-14" component="legend">
                                Achados da Dermatoscopia
                            </FormLabel>
                            <TextField
                                {...field}
                                id={`${prefixField}achadosDermatoscopia`}
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
                <Typography variant="h6">Patologias:</Typography>
            </Grid>
            <Grid item xs={12}>
                <Controller
                    name={`${prefixField}alopecia`}
                    control={control}
                    render={({ field }) => (
                        <FormControl>
                            <FormLabel className="font-medium text-14" component="legend">
                                Alopecia
                            </FormLabel>
                            <RadioGroup
                                {...field}
                                row
                                aria-labelledby={`${prefixField}alopecia`}
                                id={`${prefixField}alopecia`}
                            >
                                <FormControlLabel value={'Cicatricial'} control={<Radio />} label={'Cicatricial'} />
                                <FormControlLabel value={'Não Cicatricial'} control={<Radio />} label={'Não Cicatricial'} />
                            </RadioGroup>
                        </FormControl>
                    )}
                />
            </Grid>
            <Grid item xs={12}>
                <Controller
                    name={`${prefixField}forma`}
                    control={control}
                    render={({ field }) => (
                        <FormControl>
                            <FormLabel className="font-medium text-14" component="legend">
                                Forma
                            </FormLabel>
                            <RadioGroup
                                {...field}
                                row
                                aria-labelledby={`${prefixField}forma`}
                                id={`${prefixField}forma`}
                            >
                                <FormControlLabel value={'Difusa'} control={<Radio />} label={'Difusa'} />
                                <FormControlLabel value={'Focal'} control={<Radio />} label={'Focal'} />
                            </RadioGroup>
                        </FormControl>
                    )}
                />
            </Grid>
            <Grid item xs={12}>
                <Controller
                    name={`${prefixField}diagnostico`}
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <FormLabel className="font-medium text-14" component="legend">
                                Diagnóstico
                            </FormLabel>
                            <TextField
                                {...field}
                                id={`${prefixField}diagnostico`}
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
                <Typography variant="h6">Uso de Aparelhos Térmicos:</Typography>
            </Grid>
            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Controller
                            name={`${prefixField}usoSecadores`}
                            control={control}
                            defaultValue={false}
                            render={({ field: { onChange, value } }) => (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            tabIndex={-1}
                                            id={`${prefixField}usoSecadores`}
                                            inputProps={{ 'aria-label': 'Secadores? Frequência:' }}
                                            checked={usoSecadores}
                                            onChange={(ev) => {
                                                if (!ev.target.checked) {
                                                    setValue(`${prefixField}usoSecadoresFrequencia`, '');
                                                }
                                                onChange(ev.target.checked);
                                            }}
                                        />}
                                    label='Secadores? Frequência:'
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <Controller
                            name={`${prefixField}usoSecadoresFrequencia`}
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    autoFocus
                                    disabled={!usoSecadores}
                                    id={`${prefixField}usoSecadoresFrequencia`}
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
                    <Grid item xs={4}>
                        <Controller
                            name={`${prefixField}usoPranchas`}
                            control={control}
                            defaultValue={false}
                            render={({ field: { onChange, value } }) => (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            tabIndex={-1}
                                            id={`${prefixField}usoPranchas`}
                                            inputProps={{ 'aria-label': 'Pranchas? Frequência:' }}
                                            checked={usoPranchas}
                                            onChange={(ev) => {
                                                if (!ev.target.checked) {
                                                    setValue(`${prefixField}usoPranchasFrequencia`, '');
                                                }
                                                onChange(ev.target.checked);
                                            }}
                                        />}
                                    label='Pranchas? Frequência:'
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <Controller
                            name={`${prefixField}usoPranchasFrequencia`}
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    autoFocus
                                    disabled={!usoPranchas}
                                    id={`${prefixField}usoPranchasFrequencia`}
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
                    <Grid item xs={4}>
                        <Controller
                            name={`${prefixField}usoModeladores`}
                            control={control}
                            defaultValue={false}
                            render={({ field: { onChange, value } }) => (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            tabIndex={-1}
                                            id={`${prefixField}usoModeladores`}
                                            inputProps={{ 'aria-label': 'Modeladores? Frequência:' }}
                                            checked={usoModeladores}
                                            onChange={(ev) => {
                                                if (!ev.target.checked) {
                                                    setValue(`${prefixField}usoModeladoresFrequencia`, '');
                                                }
                                                onChange(ev.target.checked);
                                            }}
                                        />}
                                    label='Modeladores? Frequência:'
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={8}>
                        <Controller
                            name={`${prefixField}usoModeladoresFrequencia`}
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    autoFocus
                                    disabled={!usoModeladores}
                                    id={`${prefixField}usoModeladoresFrequencia`}
                                    variant="standard"
                                    fullWidth
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Controller
                    name={`${prefixField}usoCosmeticosFrequencia`}
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <FormLabel className="font-medium text-14" component="legend">
                            Utilização de cosméticos / frequência
                            </FormLabel>
                            <TextField
                                {...field}
                                id={`${prefixField}usoCosmeticosFrequencia`}
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
                    name={`${prefixField}observacoesGerais`}
                    control={control}
                    render={({ field }) => (
                        <FormControl fullWidth>
                            <FormLabel className="font-medium text-14" component="legend">
                            Observações Gerais
                            </FormLabel>
                            <TextField
                                {...field}
                                id={`${prefixField}observacoesGerais`}
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

export default TipoCabelo;