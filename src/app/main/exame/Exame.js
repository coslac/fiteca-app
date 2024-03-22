import FusePageSimple from '@fuse/core/FusePageSimple';
import { useEffect, useRef, useState } from 'react';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { CheckCircle, CloseFullscreenRounded, CloseOutlined, CloseRounded, DoNotDisturb, Error, ErrorOutlineOutlined, HighlightOff } from '@mui/icons-material';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import getConfigAPI from 'src/config';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import HeaderExame from './ExameHeader';
import ExamePageEdit from './ExamePageEdit';
import ExamePageAdd from './ExamePageAdd';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

const Root = styled(FusePageSimple)(({ theme }) => ({
    '& .FusePageSimple-header': {
        backgroundColor: '#f1f5f9!important',
    },
}));

const apiURL = getConfigAPI().API_URL;

function Exame(props) {
    const dispatch = useDispatch();
    const pageLayout = useRef(null);
    const routeParams = useParams();
    const [exame, setExame] = useState({});
    const [exameEdit, setExameEdit] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
    const [isChange, setIsChange] = useState(false);
    const [exameAdd, setExameAdd] = useState({});
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
    const { id } = useParams();
    const methods = useForm({
        mode: 'onChange',
        defaultValues: {
            nome: '',
            descricao: '',
            tipo: 'Individual',
            valor: '',
            resultado_em: '',
            formulario: '',
            conjunto_exames: [],
            ativo: true,
        }
    });
    const { watch, setValue } = methods;
    const form = watch();

    console.log('form watch', form);
    const handleSave = () => {

        if (isEdit) {
            const exameData = formatExameObj(form);
            axios.put(`${apiURL}/exame/${id}`, {...exameData}).then((response) => {
                if (response && response.status === 200) {
                    setIsSaveClick(true);
                    setIsChange(false);
                }
            });
        }
    }

    useEffect(() => {
        async function getExame() {
            const response = await axios.get(`${apiURL}/exame/${id}`);
            if (response && response.status === 200) {
                setExame(response.data);
                setValue('nome', response.data.nome);
                setValue('descricao', response.data.descricao);
                setValue('tipo', response.data.tipo);
                setValue('valor', response.data.valor);
                setValue('resultado_em', response.data.resultado_em);
                setValue('formulario', response.data.formulario);
                setValue('conjunto_exames', response.data.conjunto_exames);
                setValue('ativo', response.data.ativo);
            };
        }
        if (id && id !== '') {
            setIsEdit(true);
            getExame();
        }
    }, []);

    const onChangeExameAdd = (exameData) => {
        if (exameData?.keywords?.length > 0) {
            exameData.keywords = exameData.keywords.join(',');
        }

        setExameAdd(exameData);
    }

    const onChangeValues = (values) => {
        console.log('valuesss', values);
        setExameEdit(values);
    }

    const onChange = (changes) => {
        console.log('isChange', changes);
        setIsChange(changes);
    }

    console.log('isEdit:', isEdit);
    return (
        <FormProvider {...methods}>
        <FusePageCarded
            header={<HeaderExame props={exame} handleSave={handleSave} exameAddParam={exameAdd} isEditParam={isEdit} isChangeForm={isChange} />}
            content={isEdit ? <ExamePageEdit props={exame} onChange={onChange} /> : <ExamePageAdd onChangeFields={onChange} onChangeValues={onChangeExameAdd} />}
            scroll={isMobile ? 'normal' : 'content'}
            className="mt-32"
        />
        </FormProvider>
    );
}

export default Exame;
