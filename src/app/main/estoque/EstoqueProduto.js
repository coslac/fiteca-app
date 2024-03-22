import QrCodeWithLogo from "qrcode-with-logos";
import { useEffect, useState } from "react";
import FuseSuspense from '@fuse/core/FuseSuspense';
import FuseLoading from '@fuse/core/FuseLoading';
import { useAuth0 } from '@auth0/auth0-react';
import FusePageSimple from "@fuse/core/FusePageSimple";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
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
import EstoqueProdutoPage from "./EstoqueProdutoPage";
import EstoqueProdutoHeader from "./EstoqueProdutoHeader";
import { useThemeMediaQuery } from "@fuse/hooks";
import FusePageCarded from "@fuse/core/FusePageCarded";
import moment from "moment";

const apiURL = getConfigAPI().API_URL;

const schema = yup.object().shape({
    artigo: yup.string().required('Campo Obrigatório'),
  });

function EstoqueProduto() {
    const [isLoading, setIsLoading] = useState(false);
    const [estoqueProduto, setProduto] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [estoqueProdutoAdd, setProdutoAdd] = useState({});
    const [isChange, setIsChange] = useState(false);
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
    const { id } = useParams();
    const { user } = useAuth0();

    const methods = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema),
        defaultValues: {
            id: '',
            artigo: '',
            descricao: '',
            largura: 0,
            anexos: [],
            ativo: true,
            estoque: [],
            metrosTotal: 0,
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
        function formatData(param) {
            const dateTimeSplit = param.split(', ');
            const momentDate = moment(dateTimeSplit[0], "DD/MM/YYYY").format('DD/MM/YYYY');
            const momentTime = moment(dateTimeSplit[1], "HH:mm:ss").format('HH:mm');
            return `${momentDate} - ${momentTime}`;
        }

        async function getProduto() {
            const response = await axios.get(`${apiURL}/estoque-produto/${id}`);
            if (response && response.status === 200) {
                if(response.data?.estoque?.length > 0) {
                    response.data.estoque.map((estoque, index) => {
                        response.data.estoque[index].data = formatData(estoque.created_at);
                    });
                }
                setProduto(response.data);
                setValue('id', response.data.id);
                setValue('artigo', response.data.artigo);
                setValue('descricao', response.data?.descricao);
                setValue('largura', response.data?.largura);
                setValue('anexos', response.data?.anexos);
                setValue('ativo', response.data.ativo);
                setValue('estoque', response.data?.estoque);
                setValue('metrosTotal', response.data?.metrosTotal ? parseFloat(response.data?.metrosTotal).toFixed(2) : '');
            };
        }
        if (id && id !== '') {
            setIsEdit(true);
            getProduto();
        }
    }, []);

    const onChangeProdutoAdd = (estoqueProdutoData) => {
        setProdutoAdd(estoqueProdutoData);
    }

    const onChange = (changes) => {
        console.log('isChange', changes);
        setIsChange(changes);
    }

    const handleSave = () => {

        // if (isEdit) {
        //     const exameData = formatExameObj(form);
        //     axios.put(`${apiURL}/exame/${id}`, {...exameData}).then((response) => {
        //         if (response && response.status === 200) {
        //             setIsSaveClick(true);
        //             setIsChange(false);
        //         }
        //     });
        // }
    }

    return(
        <FormProvider {...methods}>
        <FusePageCarded
            header={<EstoqueProdutoHeader props={estoqueProduto} handleSave={handleSave} estoqueProdutoAddParam={estoqueProdutoAdd} isEditParam={isEdit} isChangeForm={isChange} />}
            content={<EstoqueProdutoPage props={estoqueProduto} onChange={onChange} />}
            scroll={isMobile ? 'normal' : 'content'}
            className="mt-32"
        />
        </FormProvider>
    )
}

export default EstoqueProduto;