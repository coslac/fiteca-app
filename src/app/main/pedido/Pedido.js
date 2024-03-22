import QrCodeWithLogo from "qrcode-with-logos";
import { useEffect, useState } from "react";
import FuseSuspense from '@fuse/core/FuseSuspense';
import FuseLoading from '@fuse/core/FuseLoading';
import { useAuth0 } from '@auth0/auth0-react';
import FusePageSimple from "@fuse/core/FusePageSimple";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { useDispatch } from 'react-redux';
import { FormControl, FormLabel, Grid, MenuItem, Select, TextField, Typography } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import axios from "axios";
import CurrencyFormat from "react-currency-format";
import { Controller, useFormContext } from "react-hook-form";
import { FormProvider, useForm } from 'react-hook-form';
import getConfigAPI from 'src/config';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { Link, useParams } from 'react-router-dom';
import EstoqueProdutoPage from "./PedidoEdit";
import PedidoHeader from "./PedidoHeader";
import { useThemeMediaQuery } from "@fuse/hooks";
import FusePageCarded from "@fuse/core/FusePageCarded";
import PedidoEdit from "./PedidoEdit";
import PedidoAdd from "./PedidoAdd";
import moment from "moment";
import { showMessage } from 'app/store/fuse/messageSlice';

const apiURL = getConfigAPI().API_URL;

const schema = yup.object().shape({
    artigo: yup.string().required('Campo Obrigatório'),
  });

function Pedido() {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [pedido, setPedido] = useState({
        produtosPedido: []
    });
    const [isEdit, setIsEdit] = useState(false);
    const [pedidoAdd, setPedidoAdd] = useState({});
    const [isChange, setIsChange] = useState(false);
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
    const { id } = useParams();
    const { user } = useAuth0();

    const methods = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema),
        defaultValues: {
            id: '',
            nome: '',
            endereco: '',
            numero: '',
            complemento: '',
            bairro: '',
            cidade: '',
            estado: '',
            cep: '',
            tel: '',
            cnpjCpf: '',
            inscEst: '',
            condPagamento: '',
            valorTotal: 0,
            status: 'Em andamento',
            produtosPedido: [{
                romaneio: []
            }],
            created_at: '',
        }
    });

  const { formState, watch, control, setValue } = methods;

  const { isValid, isDirty, errors } = formState;


    
    /*useEffect(() => {

        let qrcode = new QrCodeWithLogo({
            //canvas: document.getElementById("canvas"),
            content: "https://fiteca.com.br",
            width: 480,
            //download: true,
            image: document.getElementById("image"),
            logo: {
              src: "https://i.ibb.co/PCxKNmv/fiteca-logo.jpg",
            }
          });
    });*/

    useEffect(() => {
        async function getPedido() {
            const response = await axios.get(`${apiURL}/pedido/${id}`);
            if (response && response.status === 200) {
                setPedido(response.data);
                setValue('id', response.data.id);
                setValue('nome', response.data?.nome);
                setValue('endereco', response.data?.endereco);
                setValue('numero', response.data?.numero);
                setValue('complemento', response.data?.complemento);
                setValue('bairro', formatData(response.data?.bairro));
                setValue('cidade', response.data?.cidade);
                setValue('estado', response.data?.estado);
                setValue('cep', response.data?.cep);
                setValue('tel', response.data?.tel);
                setValue('cnpjCpf', response.data?.cnpjCpf);
                setValue('inscEst', response.data?.inscEst);
                setValue('condPagamento', response.data?.condPagamento);
                setValue('valorTotal', response.data?.valorTotal);
                setValue('status', response.data?.status);
                setValue('produtosPedido', response.data?.produtosPedido);
                setValue('created_at', formatData(response.data?.created_at));
            };
        }

        if (id && id !== '') {
            setIsEdit(true);
            getPedido();
        } else {
            setIsEdit(false);
        }
    }, []);

    const metros = watch('metros');

    function formatData(param) {
        console.log("param data: ", param)
        const dateTimeSplit = param.split(', ');
        const momentDate = moment(dateTimeSplit[0], "DD/MM/YYYY").format('DD/MM/YYYY');
        const momentTime = moment(dateTimeSplit[1], "HH:mm:ss").format('HH:mm');
        return `${momentDate} - ${momentTime}`;
    }

    const onChangePedidoAdd = (pedidoData) => {
        setPedidoAdd(pedidoData);
    }

    const onChange = (changes) => {
        console.log('isChange', changes);
        setIsChange(changes);
    }

    const formatDataObj = (pedidoData) => {
        pedidoData.valorTotal = pedidoData?.valorTotal ? parseFloat(pedidoData.valorTotal) : null;

        return pedidoData;
    }

    const updateFormValues = (response) => {
        setItemEstoque(response.data);
        setValue('id', response.data.id);
        setValue('numTear', response.data?.numTear ? response.data?.numTear.toString() : 0);
        setValue('tipoTear', response.data?.tipoTear);
        setValue('numRolo', response.data?.numRolo ? response.data?.numRolo.toString() : 0);
        setValue('metros', response.data?.metros ? response.data?.metros.toString() : 0);
        setValue('revisor', response.data.revisor);
        setValue('cliente', response.data?.cliente);
        setValue('produto', response.data?.produto);
        setValue('qrCode', response.data?.qrCode);
        setValue('defeito', response.data?.defeito);
        setValue('status', response.data?.status);
        setValue('created_at', formatData(response.data?.created_at));
        setValue('data', response.data?.data);
    }

    const handleSave = () => {
         if (isEdit) {
            const data = formatDataObj(control._formValues);
            
            axios.put(`${apiURL}/item-estoque/${idItem}`, {...data}).then((response) => {
                if (response && response.status === 200) {
                    updateFormValues(response);
                    setIsChange(false);
                    dispatch(
                        showMessage({
                            message: `Item atualizado com sucesso!`,
                            autoHideDuration: 6000,
                            anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right',
                            },
                            variant: 'success'
                        })
                    );
                } else {
                    dispatch(
                        showMessage({
                            message: `Erro ao atualizar este item!`,
                            autoHideDuration: 6000,
                            anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right',
                            },
                            variant: 'error'
                        })
                    );
                }
            });
         }
    }

    function formatData(param) {
        console.log("param data: ", param)
        const dateTimeSplit = param.split(', ');
        const momentDate = moment(dateTimeSplit[0], "DD/MM/YYYY").format('DD/MM/YYYY');
        const momentTime = moment(dateTimeSplit[1], "HH:mm:ss").format('HH:mm');
        return `${momentDate} - ${momentTime}`;
    }

    return(
        <FormProvider {...methods}>
        <FusePageCarded
            header={<PedidoHeader props={pedido} handleSave={handleSave} pedidoAddParam={pedidoAdd} isEditParam={isEdit} isChangeForm={isChange} />}
            content={isEdit ? <PedidoEdit props={pedido} onChange={onChange} handleSave={handleSave} /> : <PedidoAdd onChangeFields={onChange} pedidoParam={pedido} onChangeValues={onChangePedidoAdd} />}
            scroll={isMobile ? 'normal' : 'content'}
            className="mt-32"
        />
        </FormProvider>
    )
}

export default Pedido;