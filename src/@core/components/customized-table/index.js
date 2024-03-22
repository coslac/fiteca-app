import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import { Badge } from '@mui/base';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Add, CheckCircle, CleaningServices, CloseOutlined, CreateOutlined, DoNotDisturb, Error, ErrorOutlineOutlined, HighlightOff, Label, PlusOne, Title, AddCircleOutline } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Button, Dialog, Checkbox } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function EnhancedTableToolbar({handleClickAdd, titleParam}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [title, setTitle] = React.useState('');
    // const onClickEdit = () => {
    //     console.log('selected: ', selected);
    //     if (selected && selected.length === 1) {
    //         navigate(`/estoque/${selected[0]}`);
    //     }
    // }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    React.useEffect(() => {
        setTitle(titleParam);
    }, [titleParam]);

    return (
        <>
            <Toolbar
                sx={{
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                    // ...(numSelected > 0 && {
                    //     bgcolor: (theme) =>
                    //         alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                    // }),
                }}
            >
                {/* {numSelected > 0 ? (
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
                    </Typography>
                )} */}
                <Typography
                        sx={{ flex: '1 1 100%' }}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        {title}
                    </Typography>
                {/* {numSelected === 1 && (
                    <Tooltip title="Editar" onClick={onClickEdit}>
                        <IconButton color='primary'>
                            <EditRounded />
                        </IconButton>
                    </Tooltip>
                )} */}
                {/* {numSelected > 0 ? (
                    <Tooltip title="Excluir">
                        <IconButton onClick={handleClickOpen} color='error'>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <>
                        <Tooltip title={`Cadastrar ${title ? title : ''}`} onClick={handleClickAdd}>
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
                )} */}
                    <>
                        <Tooltip title={`Cadastrar ${title ? title : ''}`} onClick={handleClickAdd}>
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
            </Toolbar>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{`Tem certeza que deseja excluir ?`}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {'1 estoque selecionado. Ao excluir o estoque, você não poderá mais recuperá-lo.'}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button>Ok, excluir</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default function CustomizedTable({ columnsParam, data, handleClickRow, handleClickAdd, showToolbar, titleParam, showSelectRow, onChangeSelected }) {
    const [rows, setRows] = React.useState([]);
    const [columns, setColumns] = React.useState([]);
    const [isShowToolbar, setIsShowToolbar] = React.useState(true);
    const [isShowSelectRow, setIsShowSelectRow] = React.useState(false);
    const [title, setTitle] = React.useState(titleParam);
    const [selected, setSelected] = React.useState([]);
    const [numSelected, setNumSelected] = React.useState(0);

    React.useEffect(() => {
        setColumns(columnsParam);
    }, [columnsParam]);

    React.useEffect(() => {
        setIsShowToolbar(showToolbar);
    }, [showToolbar]);

    React.useEffect(() => {
        setIsShowSelectRow(showSelectRow);
    }, [showSelectRow]);

    React.useEffect(() => {
        setRows(data);
    }, [data]);

    React.useEffect(() => {
        setTitle(titleParam);
    }, [titleParam]);

    function handleClickAdd2() {
        handleClickAdd();
    }

    function getValueRow(attribute, row) {
        console.log('attribute: ', attribute);
        console.log('row: ', row);
        if(attribute.id === 'status') {
            if(attribute?.width) {
                return <StyledTableCell width={attribute.width} key={`${row?.id}-${attribute.id}`} align={attribute?.textAlign ? attribute.textAlign : 'center'}><Badge style={{ backgroundColor: row?.status === 'Em revisão' ? 'orange' : 'green' }} className='badge-status-site' badgeContent={row?.status}></Badge></StyledTableCell>
            } else {
                return <StyledTableCell key={`${row?.id}-${attribute.id}`} align={attribute?.textAlign ? attribute.textAlign : 'center'}><Badge style={{ backgroundColor: row?.status === 'Em revisão' ? 'orange' : 'green' }} className='badge-status-site' badgeContent={row?.status}></Badge></StyledTableCell>
            }
        } else {
            if(attribute?.width) {
                return <StyledTableCell width={attribute.width} key={`${row?.id}-${attribute.id}`} align={attribute?.textAlign ? attribute.textAlign : 'center'}>{row[attribute.id]}</StyledTableCell>
            } else {
                return <StyledTableCell key={`${row?.id}-${attribute.id}`} align={attribute?.textAlign ? attribute.textAlign : 'center'}>{row[attribute.id]}</StyledTableCell>
            }
        }
    }

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const handleClickCheckRow = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
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

        onChangeSelected(newSelected);
    };

    return (
        <>
        {
            isShowToolbar && (
            <EnhancedTableToolbar titleParam={title} handleClickAdd={handleClickAdd2}/>
            )
        }
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
            <TableRow>
                {
                    isShowSelectRow && (
                        <StyledTableCell align={'center'}>
                            <Checkbox
                                color="primary"
                                indeterminate={numSelected > 0 && numSelected < rows?.length}
                                checked={rows?.length > 0 && numSelected === rows?.length}
                                inputProps={{
                                    'aria-label': 'select all desserts',
                                }}
                            />
                        </StyledTableCell>
                    )
                }
                {
                    columns?.map((row, index) => (
                        <StyledTableCell width={row?.width ? row.width : ''} key={`${row?.label}-${index}`} align={row?.textAlign ? row.textAlign : 'center'}>{row?.label}</StyledTableCell>
                    ))
                }
            </TableRow>
            </TableHead>
            <TableBody>
            {rows?.map((row, indexRow) => {
                const isItemSelected = isSelected(row?.id);
                const labelId = `enhanced-table-checkbox-${indexRow}`;

                return(
                <StyledTableRow onClick={() => {
                    handleClickRow(row.id);
                }} key={row?.id} sx={{ cursor: 'pointer' }}>
                    {
                        isShowSelectRow && (
                            <StyledTableCell align={'center'}>
                                <Checkbox
                                    color="primary"
                                    onClick={(event) => handleClickCheckRow(event, row?.id)}
                                    checked={isItemSelected}
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </StyledTableCell>
                        )
                    }
                    {
                        columns.map((column, index) => (
                            getValueRow(column, row)
                        ))
                    }
                </StyledTableRow>
            )})}
            </TableBody>
        </Table>
        </TableContainer>
        </>
    );
}