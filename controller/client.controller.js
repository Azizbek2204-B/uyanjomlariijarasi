const { errorHandler } = require("../helpers/error_handler");
const Clients = require("../models/client.model");
const bcrypt = require("bcrypt");
const jwtService = require("../services/jwtclient.service");
const config = require("config");
const { clientValidation } = require("../validation/client.validation");
const mailService = require("../services/mail.service");
const uuid = require('uuid');

const addClient = async (req, res) => {
    try {
        const {error, value} = clientValidation(req.body)
        if (error) {
            return errorHandler(error, res)
        }
        const {
            username, password_hash, email,
            first_name,
            last_name,
            passport,
            contact_phone,
            joined_date,
            is_verified,
            hash_token,
            refresh_token,
            is_active
        } = value;

        const password_hashed = bcrypt.hashSync(password_hash, 7);
        const activation_link = uuid.v4()
        const newClient = await Clients.create({
            username,
            password_hash: password_hashed,
            email,
            first_name,
            last_name,
            passport,
            contact_phone,
            joined_date,
            is_verified,
            hash_token,
            refresh_token,
            is_active,
            activation_link
        });
        await mailService.sendActivationMail(newClient.email, `${config.get("api_url")}/api/client/activate/${activation_link}`)

        res.status(201).send({ message: "New Client added", newClient });
    } catch (error) {
        errorHandler(error, res);
    }
};

const activationLink = async(req, res)=>{
    try {
        const {link} = req.params
        const client = await Clients.findOne({where:{activation_link:link}})
        if (!client) {
            return res.status(400).send({message:"Link eskirgan yoki topilmadi"})
        }
        client.is_active = true
        client.activation_link = null
        await client.save()
        res.status(200).send({message:"Account faollashtrildi"})
    } catch (error) {
        errorHandler(error, res)
    }
}

const getAllClients = async (req, res) => {
    try {
        const clients = await Clients.findAll();
        res.status(200).send({ clients });
    } catch (error) {
        errorHandler(error, res);
    }
};

const getClientById = async (req, res) => {
    try {
        const { id } = req.params;
        const client = await Clients.findByPk(id);

        if (!client) {
            return res.status(404).send({ message: "Client not found" });
        }

        res.status(200).send({ client });
    } catch (error) {
        errorHandler(error, res);
    }
};

const updateClientById = async (req, res) => {
    try {
        const { id } = req.params;
        const {error, value} = clientValidation(req.body)
        if (error) {
            return errorHandler(error, res)
        }
        let {
            username,
            password_hash,
            email,
            first_name,
            last_name,
            passport,
            contact_phone,
            joined_date,
            is_verified,
            hash_token,
            refresh_token
        } = value;

        if (password_hash) {
            password_hash = bcrypt.hashSync(password_hash, 7);
        }

        const [rowsUpdated, updatedClient] = await Clients.update(
            {
                username,
                password_hash,
                email,
                first_name,
                last_name,
                passport,
                contact_phone,
                joined_date,
                is_verified,
                hash_token,
                refresh_token
            },
            {
                where: { id },
                returning: true
            }
        );

        if (rowsUpdated === 0) {
            return res.status(404).send({ message: "Client not found" });
        }

        res.status(200).send({ updatedClient });
    } catch (error) {
        errorHandler(error, res);
    }
};

const deleteClientById = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Clients.destroy({ where: { id } });

        if (!deleted) {
            return res.status(404).send({ message: "Client not found" });
        }

        res.status(200).send({ message: "Client deleted" });
    } catch (error) {
        errorHandler(error, res);
    }
};

const loginClient = async (req, res) => {
    try {
        const { email, password_hash } = req.body;

        const client = await Clients.findOne({ where: { email } });

        if (!client) {
            return res.status(400).send({ message: "Email yoki parol noto'g'ri" });
        }

        const isPasswordValid = bcrypt.compareSync(password_hash, client.password_hash);
        if (!isPasswordValid) {
            return res.status(400).send({ message: "Parol noto‘g‘ri" });
        }

        const payload = { id: client.id, email: client.email };
        const tokens = jwtService.generateTokens(payload);

        await client.update({ refresh_token: tokens.refreshToken });

        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: config.get("refresh_cookie_time")
        });

        res.status(200).send({
            message: "Tizimga xush kelibsiz!",
            accessToken: tokens.accessToken,
            client: {
                id: client.id,
                username: client.username,
                email: client.email,
                first_name: client.first_name,
                last_name: client.last_name,
                is_verified: client.is_verified
            }
        });
    } catch (error) {
        res.status(500).send({ message: "Serverda xatolik", error });
    }
};

const logoutClient = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(400).send({ message: "Refresh token cookie orqali topilmadi" });
        }

        const client = await Clients.findOne({ where: { refresh_token: refreshToken } });
        if (!client) {
            return res.status(400).send({ message: "Token mos client topilmadi" });
        }

        await client.update({ refresh_token: null });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        });

        res.status(200).send({ message: "Client tizimdan chiqdi" });
    } catch (error) {
        res.status(500).send({ message: "Serverda xatolik", error });
    }
};

const changeIsActiveClient = async (req, res) => {
    try {
        const clientId = req.params.id;
        const { is_active } = req.body;
        const requere = req.user;

        if (requere.id == clientId) {
            return res.status(400).send({ message: "O'zingizni holatingizni o'zgartira olmaysiz" });
        }

        const client = await Clients.findByPk(clientId);

        if (!client) {
            return res.status(404).send({ message: "Client topilmadi" });
        }

        client.is_active = is_active;
        await client.save();

        res.status(200).send({
            message: `Client holati ${is_active ? "aktivlashtirildi" : "bloklandi"}`,
            client,
        });
    } catch (error) {
        errorHandler(error, res);
    }
};

const refreshClientToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Avval tizimga kirishingiz kerak",
            });
        }

        const decoded = jwtService.verifyRefreshToken(refreshToken);
        if (!decoded) {
            return res.status(403).json({
                success: false,
                message: "Yaroqsiz token",
            });
        }

        const client = await Clients.findOne({ where: { refresh_token: refreshToken } });

        if (!client) {
            return res.status(404).json({
                success: false,
                message: "Foydalanuvchi topilmadi yoki tizimdan chiqilgan",
            });
        }

        const payload = {
            id: client.id,
            email: client.email,
        };

        const tokens = jwtService.generateTokens(payload);
        await client.update({ refresh_token: tokens.refreshToken });

        res.cookie("refreshToken", tokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: config.get("refresh_cookie_time"),
        });

        res.status(200).json({
            success: true,
            message: "Tokenlar muvaffaqiyatli yangilandi",
            accessToken: tokens.accessToken,
            client: {
                id: client.id,
                username: client.username,
                email: client.email,
            },
        });
    } catch (error) {
        errorHandler(error, res);
    }
};


module.exports = {
    addClient,
    getAllClients,
    getClientById,
    updateClientById,
    deleteClientById,
    loginClient,
    logoutClient,
    activationLink,
    changeIsActiveClient,
    refreshClientToken
};
