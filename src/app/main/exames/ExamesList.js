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
        id: 'nome',
        numeric: false,
        disablePadding: true,
        label: 'NOME',
    },
    {
        id: 'tipo',
        numeric: false,
        disablePadding: false,
        label: 'TIPO',
    },
    {
        id: 'valor',
        numeric: false,
        disablePadding: false,
        label: 'VALOR',
    },
    {
        id: 'ativo',
        numeric: false,
        disablePadding: false,
        label: 'STATUS',
    },
    // {
    //     id: 'email',
    //     numeric: false,
    //     disablePadding: false,
    //     label: 'Email',
    // },
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
            navigate(`/exame/${selected[0]}`);
        }
    }

    const handleExcluir = async () => {
        try {
            setOpen(false);
            if (numSelected > 1) {
                const res = await axios.delete(`${apiURL}/exames`, { ids: selected });

                if (res && res.status === 200) {
                    dispatch(
                        showMessage({
                            message: 'Exames excluídos com sucesso!',
                            autoHideDuration: 6000,
                            anchorOrigin: {
                                vertical: 'top',
                                horizontal: 'right',
                            },
                            variant: 'success'
                        })
                    );

                    props.handleDeleted(res.data.exames);
                } else {
                    dispatch(
                        showMessage({
                            message: 'Erro ao excluir exames!',
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
                const res = await axios.delete(`${apiURL}/exame/${selected[0]}`);

                if (res && res.status === 200) {
                    dispatch(
                        showMessage({
                            message: 'Exame excluído com sucesso!',
                            autoHideDuration: 6000,
                            anchorOrigin: {
                                vertical: 'top',
                                horizontal: 'right',
                            },
                            variant: 'success'
                        })
                    );

                    props.handleDeleted(res.data.exames);
                } else {
                    dispatch(
                        showMessage({
                            message: 'Erro ao excluir exame!',
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
                    message: 'Erro ao excluir exames!',
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
                        {numSelected > 1 ? `${numSelected} exames selecionados` : `${numSelected} exame selecionado`}
                    </Typography>
                ) : (
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        Lista de Exames
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
                        <Tooltip title="Criar Exame" onClick={() => navigate('/exame')}>
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
                <DialogTitle>{`Tem certeza que deseja excluir ${numSelected > 1 ? 'os exames' : 'o exame'}?`}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {numSelected > 1 ? `${numSelected} exames selecionados. Ao excluir os exames, você não poderá mais recuperá-los.` : '1 exame selecionado. Ao excluir o exame, você não poderá mais recuperá-lo.'}
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
        async function listExames() {
            try {
                setIsLoading(true);
                const res = await axios.get(`${apiURL}/exames`);
                setIsLoading(false);
                console.log('res exames: ', res);
                if (res && res.status === 200) {
                    setRows(res.data)
                };
            } catch (error) {
                setIsLoading(false);
                console.log('error: ', error);
            }
        }

        listExames();
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

    const handleDeleted = (exames) => {
        setSelected([]);
        setRows(exames);
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
    return (
        <Box sx={{ width: '100%', padding: '2rem' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                {isLoading ? (
                    <FuseSuspense />
                ) : (
                    <>
                        <EnhancedTableToolbar numSelected={selected.length} selected={selected} handleDeleted={handleDeleted} />
                        <TableContainer>
                            <Table
                                sx={{ minWidth: 750 }}
                                aria-labelledby="tableTitle"
                                size={dense ? 'small' : 'medium'}
                            >
                                <EnhancedTableHead
                                    numSelected={selected.length}
                                    order={order}
                                    orderBy={orderBy}
                                    onSelectAllClick={handleSelectAllClick}
                                    onRequestSort={handleRequestSort}
                                    rowCount={rows.length}
                                />
                                <TableBody>
                                    {rows.map((row, index) => {
                                        const isItemSelected = isSelected(row?.id);
                                        const labelId = `enhanced-table-checkbox-${index}`;

                                        return (
                                            <TableRow
                                                hover

                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row?.id}
                                                selected={isItemSelected}
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        onClick={(event) => handleClick(event, row?.id)}
                                                        checked={isItemSelected}
                                                        inputProps={{
                                                            'aria-labelledby': labelId,
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell
                                                    component="th"
                                                    id={labelId}
                                                    scope="row"
                                                    padding="none"
                                                    onClick={() => navigate(`/exame/${row?.id}`)}
                                                >
                                                    {row?.nome}
                                                </TableCell>
                                                <TableCell onClick={() => navigate(`/exame/${row?.id}`)} align="left">{row?.tipo}</TableCell>
                                                <TableCell onClick={() => navigate(`/exame/${row?.id}`)} align="left">{row?.valor}</TableCell>
                                                <TableCell title={row?.ativo} onClick={() => navigate(`/exame/${row?.id}`)} align="left"><Badge style={{ backgroundColor: row?.ativo ? 'green' : 'red' }} className='badge-status-site' badgeContent={row?.ativo ? ' Ativo' : ' Inativo'}>{row?.ativo ? <CheckCircle className='mr-4' /> : <CloseIcon className='mr-4' />}</Badge></TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {emptyRows > 0 && (
                                        <TableRow
                                            style={{
                                                height: (dense ? 33 : 53) * emptyRows,
                                            }}
                                        >
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `mais que ${to}`}`}
                            labelRowsPerPage='Linhas por página'
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </>
                )}
            </Paper>
        </Box>
    );
}
