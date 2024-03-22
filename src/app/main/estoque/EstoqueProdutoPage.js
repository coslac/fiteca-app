/* eslint-disable import/no-duplicates */
import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import { ReactFormBuilder } from 'react-form-builder2';
import 'react-form-builder2/dist/app.css';
import { Add, CheckCircle, CleaningServices, CloseOutlined, CreateOutlined, DoNotDisturb, Error, ErrorOutlineOutlined, HighlightOff, Label, PlusOne, Title, AddCircleOutline } from '@mui/icons-material';
import FilterListIcon from '@mui/icons-material/FilterList';
import Typography from '@mui/material/Typography';
import getConfigAPI from 'src/config';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import { Autocomplete, Badge, Button, Card, CardContent, CardHeader, CardMedia, CircularProgress, Divider, FormControl, FormHelperText, FormLabel, Grid, MenuItem, Select, Tab, Tabs, TextField, Checkbox } from '@mui/material';
import { Dialog } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { motion } from 'framer-motion';
import { uuid } from 'uuidv4';
import { Controller, useForm, useFormContext } from 'react-hook-form';
import ColorPicker from 'app/shared-components/ColorPicker/ColorPicker';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import CurrencyFormat from 'react-currency-format';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CustomizedTable from 'src/@core/components/customized-table';
import { id } from 'date-fns/locale';

const apiURL = getConfigAPI().API_URL;

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

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
    {
        id: 'revisor',
        numeric: false,
        disablePadding: false,
        label: 'REVISOR',
    },
    {
        id: 'status',
        numeric: false,
        disablePadding: false,
        label: 'STATUS',
    },
    {
        id: 'data',
        numeric: false,
        disablePadding: false,
        label: 'DATA',
    },
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
    console.log('numSelected: ', numSelected);
    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            'aria-label': 'select all desserts',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function EnhancedTableToolbar(props) {
    const dispatch = useDispatch();
    const { numSelected, selected } = props;
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const onClickEdit = () => {
        console.log('selected: ', selected);
        if (selected && selected.length === 1) {
            navigate(`/estoque/${selected[0]}`);
        }
    }

    const handleExcluir = async () => {
        try {
            setOpen(false);
            if (numSelected > 1) {
                const res = await axios.delete(`${apiURL}/estoque`, { ids: selected });

                if (res && res.status === 200) {
                    dispatch(
                        showMessage({
                            message: 'Estoque excluídos com sucesso!',
                            autoHideDuration: 6000,
                            anchorOrigin: {
                                vertical: 'top',
                                horizontal: 'right',
                            },
                            variant: 'success'
                        })
                    );

                    //props.handleDeleted(res.data.estoque);
                } else {
                    dispatch(
                        showMessage({
                            message: 'Erro ao excluir estoque!',
                            autoHideDuration: 6000,
                            anchorOrigin: {
                                vertical: 'top',
                                horizontal: 'right',
                            },
                            variant: 'error'
                        })
                    );
                }
            } else {
                const res = await axios.delete(`${apiURL}/estoque/${selected[0]}`);

                if (res && res.status === 200) {
                    dispatch(
                        showMessage({
                            message: 'Estoque excluído com sucesso!',
                            autoHideDuration: 6000,
                            anchorOrigin: {
                                vertical: 'top',
                                horizontal: 'right',
                            },
                            variant: 'success'
                        })
                    );

                    //props.handleDeleted(res.data.estoque);
                } else {
                    dispatch(
                        showMessage({
                            message: 'Erro ao excluir estoque!',
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
            console.log('error: ', error);
            dispatch(
                showMessage({
                    message: 'Erro ao excluir estoque!',
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

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Toolbar
                sx={{
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                    ...(numSelected > 0 && {
                        bgcolor: (theme) =>
                            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                    }),
                }}
            >
                {numSelected > 0 ? (
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        color="inherit"
                        variant="subtitle1"
                        component="div"
                    >
                        {numSelected > 1 ? `${numSelected} estoque selecionados` : `${numSelected} estoque selecionado`}
                    </Typography>
                ) : (
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        Itens
                    </Typography>
                )}
                {numSelected === 1 && (
                    <Tooltip title="Editar" onClick={onClickEdit}>
                        <IconButton color='primary'>
                            <EditRounded />
                        </IconButton>
                    </Tooltip>
                )}
                {numSelected > 0 ? (
                    <Tooltip title="Excluir">
                        <IconButton onClick={handleClickOpen} color='error'>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <>
                        <Tooltip title="Cadastrar Estoque" onClick={() => navigate('/estoque')}>
                            <IconButton color='primary'>
                                <AddCircleOutline />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Filtros">
                            <IconButton>
                                <FilterListIcon />
                            </IconButton>
                        </Tooltip>
                    </>
                )}
            </Toolbar>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{`Tem certeza que deseja excluir ${numSelected > 1 ? 'os estoque' : 'o estoque'}?`}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {numSelected > 1 ? `${numSelected} estoque selecionados. Ao excluir os estoque, você não poderá mais recuperá-los.` : '1 estoque selecionado. Ao excluir o estoque, você não poderá mais recuperá-lo.'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleExcluir}>Ok, excluir</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
    selected: PropTypes.array,
    handleDeleted: PropTypes.func
};

export default function ProdutoPageEdit({ props, onChange, onChangeFields, onChangeValues }) {
    const methods = useFormContext();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [rows, setRows] = React.useState([]);
    const navigate = useNavigate();

    const { control, setValue, formState, watch, getValues } = methods;

    const { isValid, dirtyFields, errors, touchedFields } = formState;

    React.useEffect(() => {
        setRows(control?._formValues?.estoque);
    }, [control?._formValues?.estoque]);

    function handleTabChange(event, value) {
        setTabValue(value);
    }

    function genId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    function handleClickAdd() {
        console.log('handleClickAdd');
        navigate(`/estoque/${control?._formValues?.id}/item`);
    }

    const handleClickRowItem = (idItem) => {
        navigate(`/estoque/${control?._formValues?.id}/item/${idItem}`);
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const handleDeleted = (estoque) => {
        setSelected([]);
        setRows(estoque);
    }

    const isSelected = (name) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = React.useMemo(
        () =>
            stableSort(rows, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [order, orderBy, page, rowsPerPage],
    );

    console.log('control formvalues', control._formValues)
    return (
        <>
            <div className="p-16 sm:p-24">
                <div className={'mb-32'}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Controller
                                name="artigo"
                                control={control}
                                render={({ field }) => (
                                    <FormControl error={!!errors.nome} fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            {`ARTIGO: ${field.value}`}
                                        </FormLabel>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="largura"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                            {`LARGURA (m): ${field.value}`}
                                        </FormLabel>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller
                                name="metrosTotal"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <FormLabel className="font-medium text-14" component="legend">
                                        {`TOTAL EM ESTOQUE (m): ${field.value}`}
                                        </FormLabel>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <>
                                <CustomizedTable titleParam={'ROLOS'} handleClickRow={handleClickRowItem} columnsParam={headCells} handleClickAdd={handleClickAdd} data={control?._formValues?.estoque} showToolbar={true} showSelectRow={false} />
                            </>         
                        </Grid>
                    </Grid>
                </div>
            </div>
        </>
    );
}
