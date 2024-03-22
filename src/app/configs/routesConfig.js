import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';
import { Navigate } from 'react-router-dom';
import settingsConfig from 'app/configs/settingsConfig';
import Error404Page from '../main/404/Error404Page';
import PacientesConfig from '../main/pacientes/PacientesConfig';
import LogoutLoading from '../main/logout/Logout';
import MinhaContaConfig from '../main/minha-conta/profileAppConfig';
import PacienteConfig from '../main/paciente/PacienteConfig';
import Checkout from '../main/checkout';
import CheckoutConfig from '../main/checkout/config';
import SolicitacaoConfig from '../main/solicitacao-exame/SolicitacaoConfig';
import ProdutoConfig from '../main/produto/ProdutoConfig';
import ProdutosConfig from '../main/produtos/ProdutosConfig';
import EstoqueListConfig from '../main/estoque-list/EstoqueListConfig';
import EstoqueConfig from '../main/estoque/EstoqueConfig';
import EstoqueProdutoItemConfig from '../main/estoque-produto-item/EstoqueProdutoItemConfig';
import PedidosConfig from '../main/pedidos/PedidosConfig';
import PedidoConfig from '../main/pedido/PedidoConfig';


const routeConfigs = [PedidosConfig, PedidoConfig, ProdutoConfig, ProdutosConfig, EstoqueListConfig, EstoqueConfig, EstoqueProdutoItemConfig, PacientesConfig, PacienteConfig, MinhaContaConfig, CheckoutConfig, SolicitacaoConfig];

const routes = [
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs, settingsConfig.defaultAuth),
  {
    path: '/',
    element: <Navigate to="/estoque" />,
    auth: settingsConfig.defaultAuth,
  },
  {
    path: 'loading',
    element: <FuseLoading />,
  },
  {
    path: '404',
    element: <Error404Page />,
  },
  {
    path: '/logout',
    element: <LogoutLoading />,
  },
  {
    path: '*',
    element: <Navigate to="404" />,
  },
];

export default routes;
