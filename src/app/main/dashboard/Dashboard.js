const { useMemo, useEffect, useState } = require("react");
const { default: ProductionWidget } = require("./widgets/ProductionWidget");
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import FusePageSimple from '@fuse/core/FusePageSimple';
import axios from "axios";
import getConfigAPI from 'src/config';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { usePDF } from 'react-to-pdf';

const apiURL = getConfigAPI().API_URL;

const dataWidget = {
    artigo: 'AMERICANO CRU 2,50',
    metrosTotal: 4125.5,
    conversions: {
        amount: 4123,
        labels: [
            "05 Jan - 12 Jan",
            "13 Jan - 20 Jan",
            "21 Jan - 28 Jan",
            "29 Jan - 05 Feb",
            "06 Feb - 13 Feb",
            "14 Feb - 21 Feb"
        ],
        series: [
            {
                "name": "Total (m)",
                "data": [
                    4412,
                    4345,
                    4541,
                    4677,
                    4322,
                    4123
                ]
            }
        ],
    },
}

const container = {
    show: {
        transition: {
            staggerChildren: 0.06,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
};
const Dashboard = () => {
    const [dataDash, setDataDash] = useState([]);
    const { toPDF, targetRef } = usePDF({filename: 'page.pdf'});

    useEffect(() => {
        async function getDataWidgets() {
            try {
                const res = await axios.get(`${apiURL}/dashboard/production`);
                console.log('res: ', res);
                if(res && res.status === 200) {
                    setDataDash(res.data.daysAgo30);
                }
            } catch(err) {
                console.log(err)
            }
        }
        getDataWidgets();
    }, []);

    const widgets = [];

    return (
        <FusePageSimple
            content={
                <motion.div
                            className="gap-32 w-full p-24 md:p-32"
                            initial="hidden"
                            animate="show"
                            ref={targetRef}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <div className="w-full mt-16 sm:col-span-3">
                                        <Typography className="text-2xl font-semibold tracking-tight leading-6">
                                            DESEMPENHO DE PRODUÇÃO
                                        </Typography>
                                        <Typography className="font-medium tracking-tight" color="text.secondary">
                                            Últimos 30 dias
                                        </Typography>
                                    </div>
                                </Grid>
                                <Grid item xs={12}>
                                    <button onClick={() => toPDF()}>Download PDF</button>
                                </Grid>
                            {
                                dataDash?.map((data, index) => (
                                    <Grid item key={`${data?.artigo}-${index}`} xs={4}>
                                    <motion.div variants={item} className="" style={{opacity: 1, transform: 'none'}}>
                                        <ProductionWidget props={data} />
                                    </motion.div>
                                    </Grid>
                                ))
                            }
                            </Grid>
                        </motion.div>
            }
        />
    );
}

export default Dashboard;