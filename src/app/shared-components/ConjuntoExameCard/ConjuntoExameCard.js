import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Button, Card, CardActions, CardContent, TextField, Typography, lighten } from '@mui/material';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

function ConjuntoExameCard({ conjuntoExame, handleChange, className, handleDelete, hasErrorParam, temNomeIgual }) {
    const [hasError, setHasError] = useState(hasErrorParam);
    const [isNomeIgual, setIsNomeIgual] = useState(temNomeIgual);

    useEffect(() => {
        setHasError(hasErrorParam);
        setIsNomeIgual(temNomeIgual);
    }, [hasErrorParam, temNomeIgual]);
    
    return (
        <Card className="flex flex-col shadow" sx={{border: hasError ? '2px solid red' : conjuntoExame.nome === '' ? '2px solid red' : ''}}>
            <CardContent className="flex flex-col flex-auto p-24">
                <div className={clsx('w-full flex justify-content-end', className)}>
                    <div onClick={() => handleDelete(conjuntoExame.id)} style={{cursor: 'pointer'}}>
                        <FuseSvgIcon className="text-red-600" size={35}>
                            heroicons-solid:x-circle
                        </FuseSvgIcon>
                    </div>
                </div>
                <TextField
                    label="Nome do Exame"
                    autoFocus
                    id="nome"
                    name="nome"
                    value={conjuntoExame.nome}
                    onChange={(e) => handleChange(e, conjuntoExame.id)}
                    variant="standard"
                    required
                    error={conjuntoExame.nome === '' ? true : isNomeIgual ? true : false}
                    fullWidth
                />
                {conjuntoExame.nome === '' ? (
                    <Typography className="text-red-600 text-xs mt-1">Campo obrigatório</Typography>
                ) : (
                    <>
                        {isNomeIgual && (
                            <Typography className="text-red-600 text-xs mt-1">
                                Já existe um exame no conjunto com esse nome
                            </Typography>
                        )}
                    </>
                )}
                
                <TextField
                    label="Descrição"
                    className="mt-5"
                    id="descricao"
                    name="descricao"
                    value={conjuntoExame.descricao}
                    onChange={(e) => handleChange(e, conjuntoExame.id)}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={5}
                />
            </CardContent>
        </Card>
    );
}

export default ConjuntoExameCard;