const { useMemo, useEffect } = require("react");
const { default: ProductionWidget } = require("./widgets/ProductionWidget");
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import FusePageSimple from '@fuse/core/FusePageSimple';
import axios from "axios";
import getConfigAPI from 'src/config';

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

    useEffect(() => {
        async function getDataWidgets() {
            const res = await axios.get(`${apiURL}/dashboard/production`);
            console.log('res: ', res);
        }
        getDataWidgets();
    }, []);
    
    const widgets = [];

    return (
        <FusePageSimple
            content={
                <motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-32 w-full p-24 md:p-32"
                            variants={container}
                            initial="hidden"
                            animate="show"
                        >
                            <motion.div variants={item} className="sm:col-span-2 lg:col-span-1 ">
                                <ProductionWidget props={dataWidget} />
                            </motion.div>

                        </motion.div>
            }
        />
    );
}

export default Dashboard;