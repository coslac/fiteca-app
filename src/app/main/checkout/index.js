import axios from "axios";
import { useEffect, useState } from "react";
import CurrencyFormat from "react-currency-format";
import { useParams } from 'react-router-dom';
import getConfigAPI from 'src/config';

const apiURL = getConfigAPI().API_URL;

const Checkout = () => {
    const [numCartao, setNumCartao] = useState('');
    const [exp, setExp] = useState('');
    const [cvc, setCVC] = useState('');
    const { id } = useParams();
    const [solicitacao, setSolicitacao] = useState({});
    const [total, setTotal] = useState(0);

    useEffect(() => {
        async function getSolicitacao() {
            const res = await axios.get(`${apiURL}/solicitacao/${id}`);

            let totalExames = 0;
            res.data.exames.map((item) => {
                const valor = parseFloat(item.exame.valor.substring(3, item.exame.valor.length).replace(',', '.'));
                console.log(valor);
                totalExames += valor;
            });

            setTotal(totalExames);
            setSolicitacao(res.data);
        }

        getSolicitacao();
    }, []);

    console.log(solicitacao);
    return (
        <div class="container d-flex justify-content-center mt-5 mb-5">
            <div class="row g-3">
              <div class="col-md-6">  
                <span>Método de Pagamento</span>
                <div class="card">
                  <div class="accordion" id="accordionExample">
                    <div class="card">
                      <div class="card-header p-0">
                        <h2 class="mb-0">
                          <button class="btn btn-light btn-block text-left p-3 rounded-0" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            <div class="d-flex align-items-center justify-content-between">

                              <span>Cartão de Crédito</span>
                              <div class="icons">
                                <img src="https://i.imgur.com/2ISgYja.png" width="30"/>
                                <img src="https://i.imgur.com/W1vtnOV.png" width="30"/>
                              </div>
                              
                            </div>
                          </button>
                        </h2>
                      </div>

                      <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                        <div class="card-body payment-card-body">
                        <span class="font-weight-normal card-text">Nome do Titular</span>
                          <div class="input">
                            <input className="form-control" type="text" placeholder="Nome do Titular" />
                          </div> 
                          <div class="row mt-3 mb-3">
                          <div class="col-12">
                          <span class="font-weight-normal card-text">Número do Cartão</span>
                          <div class="input">

                            <i class="fa fa-credit-card"></i>
                            <CurrencyFormat
                                            id='numCartao'
                                            value={numCartao}
                                            onChange={e => setNumCartao(e.target.value)}
                                            class="form-control"
                                            format="#### #### #### ####"
                                            mask="_"
                                        />
                            </div>
                          </div> 
                          </div> 
                          <div class="row mt-3 mb-3">

                            <div class="col-md-6">

                              <span class="font-weight-normal card-text">Data de Expiração</span>
                              <div class="input">

                                <i class="fa fa-calendar"></i>
                                <CurrencyFormat
                                            id='exp'
                                            value={exp}
                                            placeholder="MM/AAAA"
                                            onChange={e => setExp(e.target.value)}
                                            class="form-control"
                                            format="##/####"
                                            mask="_"
                                        />
                              </div> 
                              
                            </div>


                            <div class="col-md-6">

                              <span class="font-weight-normal card-text">CVC/CVV</span>
                              <div class="input">

                                <i class="fa fa-lock"></i>
                                <CurrencyFormat
                                            id='cvc'
                                            value={cvc}
                                            placeholder="000"
                                            onChange={e => setCVC(e.target.value)}
                                            class="form-control"
                                            format="###"
                                            mask="_"
                                        />
                              </div> 
                              
                            </div>
                            

                          </div>

                          <span class="text-muted certificate-text"><i class="fa fa-lock"></i> Sua transação está segura com certificado ssl</span>
                         
                        </div>
                      </div>
                    </div>
                    
                  </div>
                  
                </div>

              </div>

              <div class="col-md-6">
                  <span>Resumo do pedido</span>
                  <div class="card">
                  <div class="d-flex justify-content-between p-3">
                    <div class="d-flex flex-column">

                        <span>{`Paciente: ${solicitacao?.paciente?.nome}`}</span>
                    </div>
                    </div>
                    <hr class="mt-0 line"/>
                    {solicitacao?.exames?.map((item) => (
                        <div class="d-flex justify-content-between p-3">

                        <div class="d-flex flex-column">
  
                          <span>{item?.exame?.nome}</span>
                        </div>
  
                        <div class="mt-1">
                          <span class="super-month">{item?.exame?.valor}</span>
                        </div>
                        
                      </div>
                    ))}
                    <hr class="mt-0 line"/>

                    <div class="p-3 d-flex justify-content-between">

                      <div class="d-flex flex-column">

                        <span>Total</span>
                        
                      </div>
                      <span>{`R$ ${total.toFixed(2)}`}</span>

                      

                    </div>

                    <div class="p-3">

                    <button class="btn btn-primary btn-block free-button">Realizar Pagamento</button> 
                      
                    </div>



                    
                  </div>
              </div>
              
            </div>
            

          </div>
    );
}

export default Checkout;