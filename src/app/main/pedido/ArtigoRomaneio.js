import { useEffect, useState, forwardRef } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import CustomizedTable from 'src/@core/components/customized-table';
import Slide from '@mui/material/Slide';

const headCells = [
    {
        id: 'numRolo',
        numeric: false,
        disablePadding: false,
        label: 'Nº ROLO',
    },
    {
        id: 'numTear',
        numeric: false,
        disablePadding: true,
        label: 'Nº TEAR',
    },
    {
        id: 'tipoTear',
        numeric: false,
        disablePadding: false,
        label: 'TIPO TEAR',
    },
    {
        id: 'metros',
        numeric: false,
        disablePadding: false,
        label: 'METROS (m)',
    },
];

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function ArtigoRomaneio({props}) {
    const [data, setData] = useState({});
    const [open, setOpen] = useState(false);
    const [selectedAdd, setSelectedAdd] = useState([]);

    useEffect(() => {
        setData(props);
    }, [props]);

    const handleClickRowItem = (id) => {
        console.log('id: ', id);
    }

    const handleClickAdd = () => {
        handleOpen();
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleOpen = () => {
        setOpen(true);
    }

    const handleAddItemsArtigo = () => {
        const itemsAdd = [];
        
        for(let i = 0; i < selectedAdd.length; i++) {
            for(let j = 0; j < data?.produto?.estoque.length; j++) {
                if(data?.produto?.estoque[j].id === selectedAdd[i]) {
                    itemsAdd.push(data?.produto?.estoque[j]);
                }
            }
        }
        setData({...data, romaneio: itemsAdd})
        setOpen(false);
    }

    const onChangeSelected = (ids) => {
        setSelectedAdd(ids);
    }

    console.log('data artigo: ', data);
    return (
        <Box>
            <CustomizedTable titleParam={data?.produto?.artigo} handleClickRow={handleClickRowItem} columnsParam={headCells} handleClickAdd={handleClickAdd} data={data?.romaneio} showToolbar={true} showSelectRow={true} />
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
                fullWidth
            >
                <DialogTitle>ADICIONAR ROLO</DialogTitle>
                <DialogContent>
                <CustomizedTable onChangeSelected={onChangeSelected} titleParam={`Estoque`} handleClickRow={handleClickRowItem} columnsParam={headCells} handleClickAdd={handleClickAdd} data={data?.produto?.estoque} showToolbar={true} showSelectRow={true} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleAddItemsArtigo}>Adicionar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}