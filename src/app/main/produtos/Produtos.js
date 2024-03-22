import FusePageSimple from '@fuse/core/FusePageSimple';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import HeaderProdutos from './HeaderProdutos';
import ProdutosList from './ProdutosList';
import { useAuth0 } from '@auth0/auth0-react';
import FuseLoading from '@fuse/core/FuseLoading';

const Root = styled(FusePageSimple)(({ theme }) => ({
    '& .FusePageSimple-header': {
        backgroundColor: '#f1f5f9!important',
    },
}));

function Produtos(props) {
    const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0();
    const dispatch = useDispatch();
    const pageLayout = useRef(null);
    const routeParams = useParams();
    const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

    useEffect(() => {
        if(isLoading) {
            return;
        }
        if (!isAuthenticated) {
            loginWithRedirect();
        }
    }, [isLoading, isAuthenticated]);

    console.log('isLoaaaading: ', isLoading);
    
    return (
        <>
            {isLoading ? (
                <FuseLoading />    
            ) : (
                <Root
                    header={<HeaderProdutos />}
                    content={<ProdutosList />}
                    scroll={isMobile ? 'normal' : 'content'}
                />
            )}
        </>
    );
}

export default Produtos;
