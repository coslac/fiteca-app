import React, { useRef, useEffect, useState } from "react";
import { X } from "react-feather";
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
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';

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


function CanvasFile({props, width, isMobile}) {
    const [data, setData] = useState(props);
    const [contextVal, setContextVal] = useState(null);
    const [fontSize, setFontSize] = useState(0);
  const canvasSurface = useRef();
  const [expanded, setExpanded] = React.useState(false);
    const [widthParam, setWidthParam] = useState(null);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const ref = React.useRef(null);

  React.useEffect(() => {
    setWidthParam(ref.current.offsetWidth - 20);
  }, [ref.current]);

  useEffect(() => {
    if(isMobile) { 
        setFontSize(10);
    } else {
        setFontSize(15);
    }
    console.log('setWidthParam: ', width);
    if(widthParam) {
        const canvasVal = canvasSurface.current;
        canvasVal.width = widthParam;
        canvasVal.height = 165;
        setContextVal(canvasVal.getContext("2d"));
    }
    setData(props);
  }, [props, width, isMobile, widthParam]);

  useEffect(() => {
    if(contextVal && fontSize > 0) {
        contextVal.fillStyle = 'white';
        contextVal.fillRect(0, 0, contextVal.canvas.width, contextVal.canvas.height);
        contextVal.lineWidth = 4;
        contextVal.strokeStyle="#000";
        contextVal.strokeRect(5, 5, (contextVal.canvas.width - 10), (contextVal.canvas.height - 10));
         let xMax = 0;
          addText(
              { text: `ARTIGO: ${data?.produto?.artigo}`, x: 25, y: 25 },
              { fontSize: fontSize, color: "black", textAlign: "left" },
            );

            if((parseFloat(contextVal.measureText(`ARTIGO: ${data?.produto?.artigo}`).width) + 90) > xMax) {
                xMax = parseFloat(contextVal.measureText(`ARTIGO: ${data?.produto?.artigo}`).width) + 40;

                
            }
            addText(
                { text: `LARGURA: ${data?.produto?.largura ? parseFloat(data?.produto?.largura)?.toFixed(2) : ''}`, x: xMax, y: 25 },
                { fontSize: fontSize, color: "black", textAlign: "left" },
              );
            
            addText(
                { text: `Nº TEAR: ${data?.numTear ? data.numTear : ''}`, x: 25, y: 50 },
                { fontSize: fontSize, color: "black", textAlign: "left" },
              );

              if((parseFloat(contextVal.measureText(`TIPO TEAR: ${data?.tipoTear ? data.tipoTear : ''}`).width) + 90) > xMax) {
                xMax = parseFloat(contextVal.measureText(`TIPO TEAR: ${data?.tipoTear ? data.tipoTear : ''}`).width) + 40;
            }
              addText(
                { text: `TIPO TEAR: ${data?.tipoTear ? data.tipoTear : ''}`, x: xMax, y: 50 },
                { fontSize: fontSize, color: "black", textAlign: "left" },
              );    
              addText(
                { text: `Nº ROLO: ${data?.numRolo ? data.numRolo : ''}`, x: 25, y: 75 },
                { fontSize: fontSize, color: "black", textAlign: "left" },
              );

              addText(
                { text: `METROS: ${data?.metros ? data.metros : ''}`, x: xMax, y: 75 },
                { fontSize: fontSize, color: "black", textAlign: "left" },
              );
              addText(
                { text: `DATA: ${data?.created_at ? data.created_at : ''}`, x: 25, y: 100 },
                { fontSize: fontSize, color: "black", textAlign: "left" },
              );
              addText(
                { text: `REVISOR: ${data?.revisor ? data.revisor : ''}`, x: xMax, y: 100 },
                { fontSize: fontSize, color: "black", textAlign: "left" },
              );
              addText(
                { text: `CLIENTE: ${data?.cliente ? data.cliente : ''}`, x: 25, y: 125 },
                { fontSize: fontSize, color: "black", textAlign: "left" },
              );
    }
    
  }, [contextVal, fontSize]);

  function handlePrint() {
    const div = document.getElementById('print-content');
    const img = contextVal?.canvas?.toDataURL({
        format: 'jpeg',
        quality: 0.75
    });
    const imgDiv = document.getElementById('image-print-content');
    imgDiv.setAttribute('src', img);

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
    let canvas1 = document.getElementById("canvasEtiqueta");
    let url = canvas1.toDataURL("image/png");
    let link = document.createElement('a');
    link.download = `etiqueta-${data?.produto?.artigo}-${new Date()}.png`;
    link.href = url;
    link.click();
}

  const addText = (data, style = {}) => {
    const { text, x, y } = data;
    const {
      fontSize = 15,
      fontFamily = "Verdana",
      color,
      textAlign,
      textBaseline = "top",
    } = style;
    console.log('text: ', text);
    console.log('fontSize: ', fontSize);
    contextVal.beginPath();
    contextVal.textAlign = textAlign;
    contextVal.fillStyle = color;
    contextVal.textBaseline = textBaseline;
    contextVal.font = fontSize.toString() + "px " + fontFamily;
    contextVal.fillText(text, x, y);
    
    console.log('contextVal: ', contextVal);
    contextVal.stroke();
  };

  return (
    <div>
        <Card sx={{ maxWidth: (width + 100) }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            E
          </Avatar>
        }
        // action={
        //   <IconButton aria-label="settings">
        //     <MoreVertIcon />
        //   </IconButton>
        // }
        title="ETIQUETA"
        subheader={`Imagem com todas as informações deste item. Você pode salvar ou imprimir esta imagem nos botões abaixo.`}
      />
      <CardContent ref={ref}>
      <canvas id={'canvasEtiqueta'} ref={canvasSurface}></canvas>
      <div id="print-content" style={{display: 'none'}}>
        <img src="" id='image-print-content' alt="img-print" />
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
    </div>
  );
}
export default CanvasFile;