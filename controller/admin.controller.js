const ApiError = require("../helpers/api.error");
const { errorHandler } = require("../helpers/error_handler")
const Admins = require("../models/admin.model");
const jwtService = require("../services/jwtadmin.service");
const { adminValidation } = require("../validation/admin.validation")
const bcrypt = require('bcrypt');
const config = require('config');

const addAdmin = async (req, res)=>{
    try {
        const {error, value} = adminValidation(req.body)
        if (error) {
            return errorHandler(error, res)
        }
        const {username, password_hash, email, is_active, last_login, refresh_token, is_creator} = value
        const password_hashed = bcrypt.hashSync(password_hash, 7)
        const newAdmin = await Admins.create({username, password_hash:password_hashed, email,is_creator, is_active, last_login, refresh_token})
        res.status(201).send({message:"New Admin added:",newAdmin})
    } catch (error) {
        errorHandler(error,  res)
    }
}

const getAllAdmin = async(req, res)=>{
    try {
        const admins = await Admins.findAll()
        res.status(200).send({admins})
    } catch (error) {
        errorHandler(error, res)
    }
}

const updateAdminById = async(req, res)=>{
    try {
        const { id } = req.params;
        const {error, value} = adminValidation(req.body)
        if (error) {
            return errorHandler(error, res)
        }
        const { username, password_hash, email, is_active, is_creator,last_login, refresh_token } = value;
        const password_hashed = bcrypt.hashSync(password_hash, 7);
        const [rowsUpdated, updatedAdmin] = await Admins.update(
            { username, password_hash:password_hashed, email, is_active,is_creator, last_login, refresh_token },
            { where: { id }, returning: true }
        );

        if (rowsUpdated === 0) {
            return res.status(404).send({ message: "Admin not found" });
        }

        res.status(200).send({ updatedAdmin });
    } catch (error) {
        errorHandler(error, res)
    }
}

const deleteAdminById = async(req, res)=>{
    try {
        const { id } = req.params;
        const deleted = await Admins.destroy({ where: { id } });

        if (!deleted) {
            return res.status(404).send({ message: "Admin not found" });
        }

        res.status(200).send({ message: "Admin deleted" });
    } catch (error) {
        errorHandler(error, res)
    }
}

const getAdminById = async(req, res)=>{
    try {
        const { id } = req.params;
        const admin = await Admins.findByPk(id);
        if (!admin) {
            return res.status(404).send({ message: "Admin not found" });
        }
        res.status(200).send({ admin });
    } catch (error) {
        errorHandler(error, res)
    }
}

const loginAdmin = async (req, res) => {
    const { email, password_hash } = req.body;

    const admin = await Admins.findOne({
        where: { email }
    });

    if (!admin) {
        return res.status(400).send({ message: "Email yoki parol xato" });
    }

    const validPassword = await bcrypt.compare(password_hash, admin.password_hash);

    if (!validPassword) {
        return res.status(400).send({ message: "Parol yoki password noto'g'ri" });
    }

    const payload = { id: admin.id, email:admin.email,is_creator: admin.is_creator, is_active:admin.is_active };
    const tokens = jwtService.generateTokens(payload);

    admin.update({refresh_token:tokens.refreshToken})

    res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        maxAge: config.get("refresh_cookie_time")
    });

    res.send({
        message: "Tizimga xush kelibsiz",
        accessToken: tokens.accessToken
    });
};

const logoutAdmin = async(req, res)=>{
    const {refreshToken} = req.cookies
    console.log(refreshToken);
    if (!refreshToken) {
        return res.status(400).send({message:"Cookie da refresh token topilmadi"})
    }
    const admin = await Admins.findOne({
        where: { refresh_token:refreshToken }
    });

    if(!admin){
        return res
        .status(400)
        .send({ message: "Bunday Tokenli Admin topilmadi" });
    }
    await admin.update({ refresh_token: "" });
    res.clearCookie('refreshToken')
    res.send({message:"Admin logout seccessfully", admin})
}

const refreshAdmintToken = async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: "Avval tizimga kirishingiz kerak",
        });
      }

      const decodedToken = await jwtService.verifyRefreshToken(refreshToken);
      if (!decodedToken) {
        return res.status(403).json({
          success: false,
          message: "Yaroqsiz token",
        });
      }

      const client = await Admins.findOne({
        where: { refresh_token: refreshToken },
      });

      if (!client) {
        return res.status(404).json({
          success: false,
          message: "Foydalanuvchi topilmadi yoki avval tizimdan chiqib bo'lingan",
        });
      }

      const payload = {
        id: client.id,
        phone: client.phone,
        email: client.email,
        role: client.is_creator,
      };

      const tokens = jwtService.generateTokens(payload);

      await client.update({ refresh_token: tokens.refreshToken });

      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        maxAge: config.get("refresh_cookie_time"),
      });

      res.status(200).json({
        success: true,
        message: "Tokenlar muvaffaqiyatli yangilandi",
        accessToken: tokens.accessToken,
        client: {
          id: client.id,
          first_name: client.first_name,
          last_name: client.last_name,
          phone: client.phone,
          email: client.email,
        },
      });
    } catch (error) {
      errorHandler(error, res);
    }
};


module.exports = {
    addAdmin,
    getAllAdmin,
    updateAdminById,
    deleteAdminById,
    getAdminById,
    loginAdmin,
    logoutAdmin,
    refreshAdmintToken
}