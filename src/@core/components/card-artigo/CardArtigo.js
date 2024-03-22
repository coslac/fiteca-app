import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Add, AddAPhotoRounded, CheckCircle, CleaningServices, CloseOutlined, CreateOutlined, DoNotDisturb, Error, ErrorOutlineOutlined, HighlightOff, Label, PlusOne, Title } from '@mui/icons-material';
import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import getConfigAPI from 'src/config';
import axios from 'axios';
import CustomizedTable from 'src/@core/components/customized-table';
import { width } from '@mui/system';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Controller, useForm, useFormContext } from 'react-hook-form';
import Divider from '@mui/material/Divider';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const headCellsRolos = [
    {
        id: 'numRolo',
        numeric: false,
        disablePadding: false,
        label: 'Nº',
        textAlign: 'left',
        width: '10%',
    },
    {
        id: 'metros',
        numeric: false,
        disablePadding: true,
        label: 'METROS',
        textAlign: 'left',
        width: '90%',
    }
];

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
}));

const apiURL = getConfigAPI().API_URL;

export default function CardArtigo({props, rolosSel}) {
    const [expanded, setExpanded] = React.useState(true);
    const [produto, setProduto] = React.useState(props);
    const [rolos, setRolos] = React.useState([]);
    const [idsRolosSelected, setIdsRolosSelected] = React.useState([]);
    const [rolosSelected, setRolosSelected] = React.useState([]);
    const methods = useFormContext();
    const { control, setValue, formState, watch, getValues } = methods;

    React.useEffect(() => {
        if(rolosSel && rolosSel?.rolos?.length > 0) {
            const rolosAux = [];
            for(let i = 0; i < rolosSel.rolos.length; i++) {
                rolosAux.push(rolosSel.rolos[i]);
            }
            setRolosSelected(rolosAux);
        }
    }, [rolosSel]);

    React.useEffect(() => {
        setProduto(props);
    }, [props]);

    React.useEffect(() => {
        setProduto({...produto, romaneio: rolosSelected?.map((item) => {
            const romaneio = {
                metros: item?.metros,
                rolo: item
            };
            return romaneio;
        })});
        const produtosPedido = control?._formValues?.produtosPedido;
        for(let i = 0; i < produtosPedido.length; i++) {
            if(produtosPedido[i].produto.id === produto.id) {
                produtosPedido[i].romaneio = rolosSelected?.map((item) => {
                    const romaneio = {
                        metros: item?.metros,
                        rolo: item
                    };
                    return romaneio;
                })
            }
        }

        setValue('produtosPedido', produtosPedido);
    }, [rolosSelected]);

    React.useEffect(() => {
        async function listRolos() {
            try {
                const response = await axios.get(`${apiURL}/romaneio/artigo/${produto?.id}/rolos`);

                if(response && response.status === 200) {
                    setRolos(response.data);
                }
            } catch (err) {
                console.error('Error: ', err);
            }
        }

        if(produto && produto?.id) {
            listRolos();
        }
    }, [produto]);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleChangeRolos = (event, newValue) => {
        console.log('rolos', event);
        console.log('newValue', newValue);
        let duplicates = [];
        for(let i = 0; i < newValue.length; i++) {
            for(let j = 0; j < newValue.length; j++) {
                if(i !== j && newValue[i]?.id === newValue[j]?.id) {
                    duplicates.push({item: newValue[i], index: j});
                }
            }
        }

        if(duplicates.length > 0) {
            for(let i = 0; i < duplicates.length; i++) {
                newValue.splice(duplicates[i].index, 1);
            }
        }
        setRolosSelected(newValue);
    }

    console.log('produto romaneio: ', produto);
    return(
        <Card sx={{ maxWidth: '100%' }}>
            <CardHeader
                avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    {produto?.artigo?.substring(0,2)}
                </Avatar>
                }
                action={
                <IconButton aria-label="settings">
                    <MoreVertIcon />
                </IconButton>
                }
                title={produto?.artigo}
                subheader={`Estoque: ${produto?.metrosTotal}m`}
            />
            <img style={{
                height: '20rem',
                width: '100%',
                objectFit: produto?.imagem ? 'cover' : 'contain',
            }} src={produto?.imagem ? produto.imagem : 'assets/images/no-image.jpg'} alt={produto?.artigo} />
            <CardContent>
                
            </CardContent>
            <CardActions disableSpacing>
                {/* <IconButton aria-label="add">
                <Add />
                </IconButton>
                <IconButton aria-label="delete">
                <CloseOutlined />
                </IconButton> */}
                <FormLabel className="font-medium text-14" component="legend">
                    {`ROMANEIO ${produto?.artigo}`}
                </FormLabel>
                <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
                >
                <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
            <Divider />
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                <Grid container spacing={2}>
                        <Grid item xs={12}>
                        <FormControl fullWidth>
                                    <FormLabel className="font-medium text-14" component="legend">
                                        Rolos
                                    </FormLabel>
                                    <Autocomplete
                                        id="country-select-demo"
                                        fullWidth
                                        options={rolos}
                                        autoHighlight
                                        multiple
                                        onChange={handleChangeRolos}
                                        value={rolosSelected}
                                        getOptionLabel={(option) => {
                                            return option?.numRolo;
                                        }}
                                        renderOption={(props, option) => (
                                            <Box key={option.id} value={option.id} component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                            {`Nº: ${option?.numRolo} | METROS: ${option?.metros}`}
                                            </Box>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                            {...params}
                                            label={rolosSelected?.length === 0 ? 'Selecione...' : ''}
                                            inputProps={{
                                                ...params.inputProps,
                                                autoComplete: 'new-password', // disable autocomplete and autofill
                                            }}
                                            />
                                        )}
                                    />
                                    {/* <Select id="rolos" variant="outlined" fullWidth defaultValue="" value={idsRolosSelected} defaultChecked displayEmpty multiple onChange={handleChangeRolos}
                                    input={<OutlinedInput label="Tag" />}
                                    renderValue={(selected) => {
                                        console.log('selected', selected);
                                        return selected.map((value) => {
                                            const rolo = rolos?.find((item) => item.id === value);
                                            return rolo?.numRolo;
                                        }).join(', ');
                                    }}
                                    MenuProps={MenuProps}>
                                        {
                                            rolos?.map((item, index) => (
                                                <MenuItem key={`${item?.id}-${index}`} value={item?.id}>
                                                    <Checkbox checked={idsRolosSelected.indexOf(item?.id) > -1} />
                                                    <ListItemText primary={`Nº: ${item?.numRolo} | METROS: ${item?.metros}`} />
                                                </MenuItem>
                                            ))
                                        }
                                    </Select> */}
                                </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            {
                                rolosSelected?.length > 0 && (
                                    <CustomizedTable titleParam={''} columnsParam={headCellsRolos} data={rolosSelected} showToolbar={false} showSelectRow={false} />
                                )
                            }
                                    
                        </Grid>
                    </Grid>
                </CardContent>
            </Collapse>
        </Card>
    );
}