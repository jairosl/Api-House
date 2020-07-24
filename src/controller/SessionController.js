// metodos: index, show, update, store, destroy
/*
    index: listagem de sessoes;
    
    store: Criar uma sessão;

    show: lista uma unica sessão;

    update: Alterar um sessão;

    destroy: Deletar uma sessão;

*/

import * as Yup from 'yup';
import User from '../models/User';

class SessionController {
    async store(req, res) {
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
        });

        const { email } = req.body;

        if (!(await schema.isValid(req.body))) {
            res.status(400).json({ error: 'Falha na validação' });
        }

        // verificando se o usuario já existe
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({ email });
        }

        return res.json(user);
    }
}

export default new SessionController();
