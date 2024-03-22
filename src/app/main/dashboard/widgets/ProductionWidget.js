import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useEffect, useState } from 'react';

function ProductionWidget({props}) {
  const theme = useTheme();
  const [data, setData] = useState(props);

  useEffect(() => {
    setData(props);
  }, [props]);

  const chartOptions = {
    chart: {
      animations: {
        enabled: false,
      },
      fontFamily: 'inherit',
      foreColor: 'inherit',
      height: '100%',
      type: 'area',
      sparkline: {
        enabled: true,
      },
    },
    colors: [theme.palette.secondary.main],
    fill: {
      colors: [theme.palette.secondary.light],
      opacity: 0.5,
    },
    stroke: {
      curve: 'smooth',
    },
    tooltip: {
      followCursor: true,
      theme: 'dark',
    },
    xaxis: {
      type: 'category',
      categories: data?.productions?.labels,
    },
  };

  return (
    <Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden">
      <div style={{flexDirection: 'column'}} className="flex items-start justify-between m-24 mb-0">
        <Typography className="text-lg font-medium tracking-tight leading-6 truncate">
          {`${data?.artigo}`}
        </Typography>
        <div className="mt-2">
          <Chip size="small" className="font-medium text-sm" label="30 dias" />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row lg:items-center mx-24 mt-12">
        <Typography className="text-4xl font-bold tracking-tighter leading-tight">
          {`${data?.metrosTotal.toLocaleString('pt-BR')}m`}
        </Typography>
        <div className="flex lg:flex-col lg:ml-12">
          {
            data?.percentage && (
              <>
                <FuseSvgIcon size={20} className={data.classIcon}>
                  {data.icon}
                </FuseSvgIcon>
                <Typography
                  className="flex items-center ml-4 lg:ml-0 lg:mt-2 text-md leading-none whitespace-nowrap"
                  color="text.secondary"
                >
                  <span className={data.classPercentage}>{`${data.percentage}%`}</span>
                  <span className="ml-4"></span>
                </Typography>
              </>
            )
          }
        </div>
      </div>
      <div className="flex flex-col flex-auto h-80">
        <ReactApexChart
          options={chartOptions}
          series={data?.productions?.series}
          type={chartOptions.chart.type}
          height={chartOptions.chart.height}
        />
      </div>
    </Paper>
  );
}

export default ProductionWidget;