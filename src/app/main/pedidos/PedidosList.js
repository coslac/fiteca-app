/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
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
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import axios from 'axios';
import { AddCircleOutline, CheckCircle, CheckCircleOutline, CloseOutlined, DoNotDisturb, EditRounded, ErrorOutlineOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@mui/base';
import CloseIcon from 'src/assets/icons/js/closeIcon';
import getConfigAPI from 'src/config';
import { Button, Dialog } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseSuspense from '@fuse/core/FuseSuspense';
import CustomizedTable from 'src/@core/components/customized-table';
import { textAlign } from '@mui/system';

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
        id: 'cliente',
        numeric: false,
        disablePadding: true,
        label: 'CLIENTE',
        textAlign: 'left'
    },
    {
        id: 'created_at',
        numeric: false,
        disablePadding: false,
        label: 'DATA',
        textAlign: 'left'
    }
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
            navigate(`/pedidos/${selected[0]}`);
        }
    }

    const handleExcluir = async () => {
        try {
            setOpen(false);
            if (numSelected > 1) {
                const res = await axios.delete(`${apiURL}/pedidos`, { ids: selected });

                if (res && res.status === 200) {
                    dispatch(
                        showMessage({
                            message: 'Pedidos excluídos com sucesso!',
                            autoHideDuration: 6000,
                            anchorOrigin: {
                                vertical: 'top',
                                horizontal: 'right',
                            },
                            variant: 'success'
                        })
                    );

                    props.handleDeleted(res.data.pedidos);
                } else {
                    dispatch(
                        showMessage({
                            message: 'Erro ao excluir pedidos!',
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
                const res = await axios.delete(`${apiURL}/pedidos/${selected[0]}`);

                if (res && res.status === 200) {
                    dispatch(
                        showMessage({
                            message: 'Pedidos excluído com sucesso!',
                            autoHideDuration: 6000,
                            anchorOrigin: {
                                vertical: 'top',
                                horizontal: 'right',
                            },
                            variant: 'success'
                        })
                    );

                    props.handleDeleted(res.data.pedidos);
                } else {
                    dispatch(
                        showMessage({
                            message: 'Erro ao excluir pedidos!',
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
                    message: 'Erro ao excluir pedidos!',
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
                        {numSelected > 1 ? `${numSelected} pedidos selecionados` : `${numSelected} pedidos selecionado`}
                    </Typography>
                ) : (
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        Lista de Pedidos
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
                        <Tooltip title="Cadastrar Pedidos" onClick={() => navigate('/pedidos')}>
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
                <DialogTitle>{`Tem certeza que deseja excluir ${numSelected > 1 ? 'os pedidos' : 'o pedidos'}?`}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {numSelected > 1 ? `${numSelected} pedidos selecionados. Ao excluir os pedidos, você não poderá mais recuperá-los.` : '1 pedidos selecionado. Ao excluir o pedidos, você não poderá mais recuperá-lo.'}
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

export default function EnhancedTable() {
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [rows, setRows] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const navigate = useNavigate();
    console.log('selected: ', selected);
    React.useEffect(() => {
        async function listPedidos() {
            try {
                setIsLoading(true);
                const res = await axios.get(`${apiURL}/pedidos`);
                setIsLoading(false);
                console.log('res pedidos: ', res);
                if (res && res.status === 200) {
                    setRows(res.data)
                };
            } catch (error) {
                setIsLoading(false);
                console.log('error: ', error);
            }
        }

        listPedidos();
    }, []);
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

    const handleDeleted = (pedidos) => {
        setSelected([]);
        setRows(pedidos);
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

    console.log('visibleRows', visibleRows);
    console.log('rows', rows);
    console.log('apiURL', apiURL);

    function handleClickRow(rowId) {
        navigate(`/pedidos/${rowId}`);
    }
    return (
        <Box sx={{ width: '100%', padding: '2rem' }}>
            <Paper sx={{ width: '100%', mb: 2, padding: '2rem' }}>
                {isLoading ? (
                    <FuseSuspense />
                ) : (
                    <>
                        <CustomizedTable columnsParam={headCells} data={rows} handleClickRow={handleClickRow} showSelectRow={false} showToolbar={false}/>
                    </>
                )}
            </Paper>
        </Box>
    );
}
