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
import getConfigAPI from 'src/config';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { Link, useParams } from 'react-router-dom';
import ProdutoPageAdd from "./ProdutoPageAdd";
import ProdutoPageEdit from "./ProdutoPageEdit";
import ProdutoHeader from "./ProdutoHeader";
import { useThemeMediaQuery } from "@fuse/hooks";
import FusePageCarded from "@fuse/core/FusePageCarded";
import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch } from 'react-redux';

const apiURL = getConfigAPI().API_URL;
const schema = yup.object().shape({
    artigo: yup.string().required('Campo Obrigatório'),
  });

function Produto() {
    const [isLoading, setIsLoading] = useState(false);
    const [produto, setProduto] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [produtoAdd, setProdutoAdd] = useState({});
    const [isChange, setIsChange] = useState(false);
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
    const { id } = useParams();
    const { user } = useAuth0();
    const dispatch = useDispatch();

    const methods = useForm({
        mode: 'onChange',
        resolver: yupResolver(schema),
        defaultValues: {
            id: '',
            artigo: '',
            descricao: '',
            largura: 0,
            anexos: [],
            imagem: '',
            ativo: true,
            estoque: [],
        }
    });

  const { formState, watch, control, setValue,  } = methods;

  const { isValid, isDirty, errors, dirtyFields } = formState;


    
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
        async function getProduto() {
            const response = await axios.get(`${apiURL}/produto/${id}`);
            if (response && response.status === 200) {
                setProduto(response.data);
                setValue('id', response.data.id);
                setValue('artigo', response.data.artigo);
                setValue('descricao', response.data?.descricao);
                setValue('largura', response.data?.largura);
                setValue('anexos', response.data?.anexos);
                setValue('imagem', response.data?.imagem);
                setValue('ativo', response.data.ativo);
                setValue('estoque', response.data?.estoque);
            };
        }
        if (id && id !== '') {
            setIsEdit(true);
            getProduto();
        }
    }, []);

    useEffect(() => {
        console.log('isDirty: ', isDirty);
        console.log('dirtyFields: ', dirtyFields);
    }, [isDirty, dirtyFields]);
    
    const onChangeProdutoAdd = (produtoData) => {
        setProdutoAdd(produtoData);
    }

    const onChange = (changes) => {
        console.log('isChange', changes);
        setIsChange(changes);
    }

    const handleSave = async () => {
        try {
            if(isEdit) {
                const response = await axios.put(`${apiURL}/produto/${id}`, {
                    artigo: watch('artigo'),
                    descricao: watch('descricao'),
                    largura: watch('largura'),
                    imagem: watch('imagem'),
                });
                if (response && response.status === 200) {
                    setIsChange(false);
                    dispatch(
                        showMessage({
                            message: 'Produto atualizado com sucesso!',
                            autoHideDuration: 6000,
                            anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right',
                            },
                            variant: 'success'
                        })
                    );
                } else {
                    setIsChange(true);
                    dispatch(
                        showMessage({
                            message: 'Erro ao atualizar Produto!',
                            autoHideDuration: 6000,
                            anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right',
                            },
                            variant: 'error'
                        })
                    );
                }
            }
    } catch (error) {
        setIsChange(true);
        dispatch(
            showMessage({
                message: 'Erro ao atualizar Produto!',
                autoHideDuration: 6000,
                anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
                },
                variant: 'error'
            })
        );
    }
    }

    return(
        <FormProvider {...methods}>
        <FusePageCarded
            header={<ProdutoHeader props={produto} handleSave={handleSave} produtoAddParam={produtoAdd} isEditParam={isEdit} isChangeForm={isChange} />}
            content={isEdit ? <ProdutoPageEdit props={produto} onChange={onChange} /> : <ProdutoPageAdd onChangeFields={onChange} onChangeValues={onChangeProdutoAdd} />}
            scroll={isMobile ? 'normal' : 'content'}
            className="mt-32"
        />
        </FormProvider>
    )
}

export default Produto;