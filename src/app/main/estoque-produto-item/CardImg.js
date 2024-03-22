import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import { saveAs } from 'file-saver';

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

export default function CardImg({props}) {
  const [expanded, setExpanded] = React.useState(false);
    const [data, setData] = React.useState(props);

    React.useEffect(() => {
        setData(props);
    }, [props]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  function handlePrint() {
    const div = document.getElementById('print-content-qrcode');

    const windowUrl = 'about:blank';
    const uniqueName = new Date();
    const windowName = 'Print' + uniqueName.getTime();
    const printWindow = window.open(windowUrl, windowName, 'left=50000,top=50000,width=1000000,height=10000');
    printWindow.document.write(div.innerHTML);

    printWindow.document.close();

    printWindow.onload = function() {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    }
}

  function download(){
    saveAs(data, `qrcode--${new Date()}.jpeg`);
}

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            QR
          </Avatar>
        }
        // action={
        //   <IconButton aria-label="settings">
        //     <MoreVertIcon />
        //   </IconButton>
        // }
        title="QR Code"
        subheader="Imagem do QR Code. Você pode salvar ou imprimir esta imagem nos botões abaixo."
      />
      <CardMedia
        component="img"
        src={data}
        alt="qrCode"
      />
      <CardContent>
        <div id="print-content-qrcode" style={{display: 'none'}}>
            <img src={data} id='image-print-qrcode' alt="image-print-qrcode" />
        </div>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton onClick={download} aria-label="download">
          <DownloadIcon />
        </IconButton>
        <IconButton onClick={handlePrint} aria-label="print">
          <PrintIcon />
        </IconButton>
        {/* <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore> */}
      </CardActions>
      {/* <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
        </CardContent>
      </Collapse> */}
    </Card>
  );
}