import * as Yup from 'yup';
import Houser from '../models/House';
import Use from '../models/User';

class HouseController {
    async index(req, res) {
        const { status } = req.query;

        const houses = await Houser.find({ status });

        return res.json(houses);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            description: Yup.string().required(),
            price: Yup.number().required(),
            location: Yup.string().required(),
            status: Yup.boolean().required(),
        });

        const { filename } = req.file;
        const { description, price, location, status } = req.body;
        const { user_id } = req.headers;

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Falha na validação!' });
        }

        const house = await Houser.create({
            user: user_id,
            thumbnail: filename,
            description,
            price,
            location,
            status,
        });

        return res.json(house);
    }

    async update(req, res) {
        const schema = Yup.object().shape({
            description: Yup.string().required(),
            price: Yup.number().required(),
            location: Yup.string().required(),
            status: Yup.boolean().required(),
        });

        const { filename } = req.file;
        const { house_id } = req.params;
        const { description, price, location, status } = req.body;
        const { user_id } = req.headers;

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Falha na validação!' });
        }

        const user = await Use.findById(user_id);
        const houses = await Houser.findById(house_id);

        if (String(user._id) !== String(houses.user)) {
            return res.status(401).json({ error: ' Não autorizado' });
        }

        await Houser.updateOne(
            { _id: house_id },
            {
                user: user_id,
                thumbnail: filename,
                description,
                price,
                location,
                status,
            }
        );

        return res.send();
    }

    async destroy(req, res) {
        const { house_id } = req.body;
        const { user_id } = req.headers;

        const user = await Use.findById(user_id);
        const houses = await Houser.findById(house_id);

        if (String(user._id) !== String(houses.user)) {
            return res.status(401).json({ error: ' Não autorizado' });
        }

        await Houser.findByIdAndDelete({ _id: house_id });

        return res.json({ message: 'Excluida com sucesso!' });
    }
}

export default new HouseController();
