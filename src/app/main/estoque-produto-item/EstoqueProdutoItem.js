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
import EstoqueProdutoPage from "./EstoqueProdutoItemEdit";
import EstoqueProdutoHeader from "./EstoqueProdutoItemHeader";
import { useThemeMediaQuery } from "@fuse/hooks";
import FusePageCarded from "@fuse/core/FusePageCarded";
import EstoqueProdutoItemEdit from "./EstoqueProdutoItemEdit";
import EstoqueProdutoItemAdd from "./EstoqueProdutoItemAdd";
import moment from "moment";
import { showMessage } from 'app/store/fuse/messageSlice';

const apiURL = getConfigAPI().API_URL;

const schema = yup.object().shape({
    artigo: yup.string().required('Campo Obrigatório'),
  });

function EstoqueProdutoItem() {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [itemEstoque, setItemEstoque] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [itemEstoqueAdd, setItemEstoqueAdd] = useState({});
    const [isChange, setIsChange] = useState(false);
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
    const { idProduto, idItem } = useParams();
    const { user } = useAuth0();

    const methods = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema),
        defaultValues: {
            id: '',
            numTear: 0,
            tipoTear: '',
            numRolo: 0,
            metros: 0,
            revisor: '',
            cliente: '',
            qrCode: null,
            produto: null,
            created_at: '',
            status: 'Em revisão',
            defeito: false,
            data: null,
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
        async function getItemEstoqueProduto() {
            const response = await axios.get(`${apiURL}/estoque-produto/${idProduto}/item/${idItem}`);
            if (response && response.status === 200) {
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
                setValue('created_at', formatData(response.data?.created_at));
                setValue('status', response.data?.status);
                setValue('defeito', response.data?.defeito);
                setValue('data', response.data?.data);
            };
        }
        async function getProduto() {
            const response = await axios.get(`${apiURL}/estoque-produto/${idProduto}`);
            if (response && response.status === 200) {
                response.data.idProduto = response.data.id;
                setItemEstoque(response.data);
                setValue('produto', response.data);
            };
        }
        if (idItem && idItem !== '' && idProduto && idProduto !== '') {
            setIsEdit(true);
            getItemEstoqueProduto();
        } else {
            setIsEdit(false);
            getProduto();
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

    const onChangeItemEstoqueAdd = (itemEstoqueData) => {
        setItemEstoqueAdd(itemEstoqueData);
    }

    const onChange = (changes) => {
        console.log('isChange', changes);
        setIsChange(changes);
    }

    const formatDataObj = (itemEstoqueData) => {
        itemEstoqueData.numTear = itemEstoqueData?.numTear ? parseInt(itemEstoqueData.numTear) : null;
        itemEstoqueData.numRolo = itemEstoqueData?.numRolo ? parseInt(itemEstoqueData.numRolo) : null;
        itemEstoqueData.metros = itemEstoqueData?.metros ? parseFloat(itemEstoqueData.metros) : null;

        return itemEstoqueData;
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

    return(
        <FormProvider {...methods}>
        <FusePageCarded
            header={<EstoqueProdutoHeader props={itemEstoque} handleSave={handleSave} itemEstoqueAddParam={itemEstoqueAdd} isEditParam={isEdit} isChangeForm={isChange} />}
            content={isEdit ? <EstoqueProdutoItemEdit props={itemEstoque} onChange={onChange} handleSave={handleSave} /> : <EstoqueProdutoItemAdd onChangeFields={onChange} produtoParam={itemEstoque} onChangeValues={onChangeItemEstoqueAdd} />}
            scroll={isMobile ? 'normal' : 'content'}
            className="mt-32"
        />
        </FormProvider>
    )
}

export default EstoqueProdutoItem;