import FusePageSimple from '@fuse/core/FusePageSimple';
import { FormLabel, Select, MenuItem, Typography, Grid, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
import { useEffect, useState } from 'react';
import axios from 'axios';
import getConfigAPI from 'src/config';
import { useAuth0 } from '@auth0/auth0-react';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';

const Root = styled(FusePageSimple)(({ theme }) => ({
    '& .FusePageSimple-header': {
        backgroundColor: '#f1f5f9!important',
    },
}));

const apiURL = getConfigAPI().API_URL;

const Solicitacao = () => {
    const [checked, setChecked] = useState([]);
    const [total, setTotal] = useState(0);
    const [exames, setExames] = useState([]);
    const [pacientes, setPacientes] = useState([]);
    const [paciente, setPaciente] = useState('');
    const { user } = useAuth0();
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
    useEffect(() => {
        async function getExamesPacientes() {
            const res = await axios.get(`${apiURL}/exames-pacientes`, {
                headers: {
                    UserAuth0Id: user?.sub || '',
                }
            });
            setExames(res.data.exames);
            setPacientes(res.data.pacientes); //
        }

        getExamesPacientes();
    }, []);

    const handleSolicitar = async () => {
        const res = await axios.post(`${apiURL}/solicitacao`, {
            paciente_id: paciente,
            exames: checked
        }, {
            headers: {
                UserAuth0Id: user?.sub || '',
            }
        });
        console.log(res);
    }
    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];


        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }
        if (newChecked.length === 0) {
            setTotal(0);
        } else {
            newChecked.forEach((item) => {
                const exame = exames.find((e) => e.id === item);
                setTotal(total + Number(exame?.valor?.substring(3, exame?.valor?.length).replace(',', '.')));
            });
        }
        setChecked(newChecked);



    };
    return (
        <Root
            header={<div className="flex flex-col p-24 w-full sm:py-32 sm:px-40" style={{ backgroundColor: 'transparent' }}>
                <div className="flex items-center w-full mt-8 -mx-10">
                    <Typography
                        component="h2"
                        className="flex-1 text-3xl md:text-4xl font-extrabold tracking-tight leading-7 sm:leading-10 truncate mx-10"
                    >
                        Solicitação de Exame
                    </Typography>
                </div>
            </div>}
            content={
                <>
                    <Grid container spacing={2} sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        <Grid item xs={12}>
                            <FormLabel className="font-medium text-14" component="legend">
                                Paciente*
                            </FormLabel>
                            <Select value={paciente} onChange={(e) => setPaciente(e.target.value)} required id="paciente" variant="outlined" fullWidth placeholder="Selecione o paciente...">
                                {pacientes?.map((paciente) => (
                                    <MenuItem key={paciente.id} value={paciente.id}>{paciente.nome}</MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12}>
                            <FormLabel className="font-medium text-14" component="legend">
                                Exames*
                            </FormLabel>
                            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                                {exames.map((value) => {
                                    const labelId = `checkbox-list-label-${value.nome}`;
                                    return (
                                        <ListItem
                                            key={value.nome}
                                            secondaryAction={
                                                <IconButton edge="end" aria-label="comments">
                                                    <CommentIcon />
                                                </IconButton>
                                            }
                                            disablePadding
                                        >
                                            <ListItemButton role={undefined} onClick={handleToggle(value.id)} dense>
                                                <ListItemIcon>
                                                    <Checkbox
                                                        edge="start"
                                                        checked={checked.indexOf(value.id) !== -1}
                                                        tabIndex={-1}
                                                        disableRipple
                                                        inputProps={{ 'aria-labelledby': labelId }}
                                                    />
                                                </ListItemIcon>
                                                <ListItemText id={labelId} primary={`${value?.nome} - ${value?.valor}`} />
                                            </ListItemButton>
                                        </ListItem>
                                    );
                                })}
                            </List>
                            <h3>{`Total: ${total}`}</h3>
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                color="primary"
                                variant="contained"
                                size='large'
                                onClick={handleSolicitar}
                            >
                                Solicitar
                            </Button>
                        </Grid>
                    </Grid>
                </>
            }
            scroll={isMobile ? 'normal' : 'content'}
        />

    )
}

export default Solicitacao;