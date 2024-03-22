import FusePageSimple from '@fuse/core/FusePageSimple';
import { useEffect, useRef, useState } from 'react';
import FusePageCarded from '@fuse/core/FusePageCarded';
import { CheckCircle, CloseFullscreenRounded, CloseOutlined, CloseRounded, DoNotDisturb, Error, ErrorOutlineOutlined, HighlightOff } from '@mui/icons-material';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import getConfigAPI from 'src/config';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import HeaderCliente from './ClienteHeader';
import ClientePageEdit from './ClientePageEdit';
import ClientePageAdd from './ClientePageAdd';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

const Root = styled(FusePageSimple)(({ theme }) => ({
    '& .FusePageSimple-header': {
        backgroundColor: '#f1f5f9!important',
    },
}));

const apiURL = getConfigAPI().API_URL;

const schema = yup.object().shape({
    razao_social: yup.string().required('Campo Obrigatório'),
    cnpj: yup.string().required('Campo Obrigatório'),
    email: yup.string().email('Formato de email inválido'),
    dermoterapeuta: yup.object().shape({
        nome: yup.string().required('Campo Obrigatório'),
        login: yup.object().shape({
            email: yup.string().required('Campo Obrigatório').email('Formato de email inválido'),
            senha: yup.string().required('Campo Obrigatório').min(8, 'A senha deve conter 8 caracteres ou mais'),
            confirmaSenha: yup.string().required('Campo Obrigatório').min(8, 'A senha deve conter 8 caracteres ou mais').equals([yup.ref('senha'), null], 'As senhas devem ser iguais'),
        }),
    }),
});

function Cliente(props) {
    const dispatch = useDispatch();
    const pageLayout = useRef(null);
    const routeParams = useParams();
    const [cliente, setCliente] = useState({});
    const [clienteEdit, setClienteEdit] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
    const [isChange, setIsChange] = useState(false);
    const [clienteAdd, setClienteAdd] = useState({});
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
    const { id } = useParams();
    const methods = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema),
        defaultValues: {
            razao_social: '',
            cnpj: '',
            telefone: '',
            celular: '',
            email: '',
            endereco: '',
            numero: '',
            complemento: '',
            bairro: '',
            cidade: '',
            estado: '',
            cep: '',
            formulario: '',
            conjunto_pacientes: [],
            dermoterapeuta: {
                nome: '',
                cpf: '',
                rg: '',
                telefone: '',
                celular: '',
                email: '',
                endereco: '',
                numero: '',
                complemento: '',
                bairro: '',
                cidade: '',
                estado: '',
                cep: '',
                login: {
                    email: '',
                    senha: '',
                    confirmaSenha: '',
                },
                ativo: true
            },
            ativo: true,
        }
    });
    const { watch, setValue, formState } = methods;
    const form = watch();

    console.log('form watch', form);
    const handleSave = () => {

        if (isEdit) {
            const clienteData = formatClienteObj(form);
            axios.put(`${apiURL}/cliente/${id}`, {...clienteData}).then((response) => {
                if (response && response.status === 200) {
                    setIsSaveClick(true);
                    setIsChange(false);
                }
            });
        }
    }

    useEffect(() => {
        async function getCliente() {
            const response = await axios.get(`${apiURL}/cliente/${id}`);
            if (response && response.status === 200) {
                setCliente(response.data);
                setValue('nome', response.data.nome);
                setValue('descricao', response.data.descricao);
                setValue('tipo', response.data.tipo);
                setValue('valor', response.data.valor);
                setValue('resultado_em', response.data.resultado_em);
                setValue('formulario', response.data.formulario);
                setValue('conjunto_pacientes', response.data.conjunto_pacientes);
                setValue('ativo', response.data.ativo);
            };
        }
        if (id && id !== '') {
            setIsEdit(true);
            getCliente();
        }
    }, []);

    const onChangeClienteAdd = (clienteData) => {
        if (clienteData?.keywords?.length > 0) {
            clienteData.keywords = clienteData.keywords.join(',');
        }

        setClienteAdd(clienteData);
    }

    const onChange = (changes) => {
        console.log('isChange', changes);
        setIsChange(changes);
    }

    console.log('isValid param:', formState);
    
    return (
        <FormProvider  {...methods}>
        <FusePageCarded
            header={<HeaderCliente props={cliente} isValid={formState?.isValid} handleSave={handleSave} clienteAddParam={clienteAdd} isEditParam={isEdit} isChangeForm={isChange} />}
            content={isEdit ? <ClientePageEdit props={cliente} onChange={onChange} /> : <ClientePageAdd onChangeFields={onChange} onChangeValues={onChangeClienteAdd} />}
            scroll={isMobile ? 'normal' : 'content'}
            className="mt-32"
        />
        </FormProvider>
    );
}

export default Cliente;
