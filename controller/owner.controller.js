const { errorHandler } = require("../helpers/error_handler");
const Owners = require("../models/owner.model");
const bcrypt = require("bcrypt");
const jwtService = require("../services/jwtowner.service");
const { ownerValidation } = require("../validation/owner.validation");
const uuid = require('uuid');
const mailService = require("../services/mail.service");
const config = require('config');

const addOwner = async (req, res) => {
  try {
    const {error, value} = ownerValidation(req.body)
    if(error){
      return errorHandler(error, res)
    }
    const {
      username,
      password_hash,
      email,
      company_name,
      contact_phone,
      joined_date,
      is_verified,
      refresh_token,
      is_active
    } = value;
    const activation_link = uuid.v4()
    const hashedPassword = bcrypt.hashSync(password_hash, 7);
    const newOwner = await Owners.create({
      username,
      password_hash: hashedPassword,
      email,
      company_name,
      contact_phone,
      joined_date,
      is_verified,
      refresh_token,
      activation_link,
      is_active
    });
    await mailService.sendActivationMail(newOwner.email, `${config.get("api_url")}/api/owner/activate/${activation_link}`)
    res.status(201).send({ message: "New owner added", newOwner });
  } catch (error) {
    errorHandler(error, res);
  }
};

const activationLink = async(req, res)=>{
    try {
        const {link} = req.params
        console.log("------------");
        console.log(link);
        console.log("------------");
        const client = await Owners.findOne({where:{activation_link:link}})
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

const getAllOwners = async (req, res) => {
  try {
    const owners = await Owners.findAll();
    res.status(200).send({ owners });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getOwnerById = async (req, res) => {
  try {
    const { id } = req.params;
    const owner = await Owners.findByPk(id);

    if (!owner) {
      return res.status(404).send({ message: "Owner not found" });
    }

    res.status(200).send({ owner });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateOwnerById = async (req, res) => {
  try {
    const { id } = req.params;
    const {error, value} = ownerValidation(req.body)
    if(error){
      return errorHandler(error, res)
    }
    const {
      username,
      password_hash,
      email,
      company_name,
      contact_phone,
      joined_date,
      is_verified,
      refresh_token
    } = value;

    const hashedPassword = bcrypt.hashSync(password_hash, 7);

    const [rowsUpdated, updatedOwner] = await Owners.update(
      {
        username,
        password_hash: hashedPassword,
        email,
        company_name,
        contact_phone,
        joined_date,
        is_verified,
        refresh_token
      },
      { where: { id }, returning: true }
    );

    if (rowsUpdated === 0) {
      return res.status(404).send({ message: "Owner not found" });
    }

    res.status(200).send({ updatedOwner });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteOwnerById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Owners.destroy({ where: { id } });

    if (!deleted) {
      return res.status(404).send({ message: "Owner not found" });
    }

    res.status(200).send({ message: "Owner deleted" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const loginOwner = async (req, res) => {
  try {
      const { email, password_hash } = req.body;

      const owner = await Owners.findOne({ where: { email } });

      if (!owner) {
          return res.status(400).send({ message: "Email yoki parol noto'g'ri" });
      }

      const isPasswordValid = bcrypt.compareSync(password_hash, owner.password_hash);
      if (!isPasswordValid) {
          return res.status(400).send({ message: "Parol noto‘g‘ri" });
      }

      const payload = { id: owner.id, email: owner.email, password:owner.password_hash,is_active:owner.is_active };
      const tokens = jwtService.generateTokens(payload);

      await owner.update({ refresh_token: tokens.refreshToken });

      res.cookie("refreshToken", tokens.refreshToken, {
          httpOnly: true,
          maxAge: config.get("refresh_cookie_time")
      });

      res.status(200).send({
          message: "Tizimga xush kelibsiz!",
          accessToken: tokens.accessToken
      });
  } catch (error) {
      res.status(500).send({ message: "Serverda xatolik", error });
  }
};

const logoutOwner = async (req, res) => {
  try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
          return res.status(400).send({ message: "Refresh token cookie orqali topilmadi" });
      }

      const owner = await Owners.findOne({ where: { refresh_token: refreshToken } });
      if (!owner) {
          return res.status(400).send({ message: "Token mos owner topilmadi" });
      }

      await owner.update({ refresh_token: null });

      res.clearCookie("refreshToken", {
          httpOnly: true,
          secure: true,
          sameSite: "strict"
      });

      res.status(200).send({ message: "Owner tizimdan chiqdi" });
  } catch (error) {
      res.status(500).send({ message: "Serverda xatolik", error });
  }
};

const refreshOwnerToken = async (req, res) => {
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

    const owner = await Owners.findOne({
      where: { refresh_token: refreshToken },
    });

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Foydalanuvchi topilmadi yoki avval tizimdan chiqib bo'lingan",
      });
    }

    const payload = {
      id: owner.id,
      email: owner.email,
      role: owner.role,
    };

    const tokens = jwtService.generateTokens(payload);

    await owner.update({ refresh_token: tokens.refreshToken });

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_cookie_time"),
    });

    res.status(200).json({
      success: true,
      message: "Tokenlar muvaffaqiyatli yangilandi",
      accessToken: tokens.accessToken,
      owner: {
        id: owner.id,
        username: owner.username,
        email: owner.email,
      },
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const changeIsActive = async (req, res) => {
  try {
    const ownerId = req.params.id;
    const { is_active } = req.body;
    const requestingOwner = req.user;

    if (requestingOwner.id == ownerId) {
      throw ApiError.badRequest("O'zingizni aktiv holatni o'zgartira olmaysiz");
    }

    const targetOwner = await Owners.findByPk(ownerId);

    if (!targetOwner) {
      throw ApiError.notFound("Owner topilmadi");
    }

    targetOwner.is_active = is_active;
    await targetOwner.save();

    res.json({
      message: `Owner holati ${is_active ? "aktivlashtirildi" : "bloklandi"}`,
      owner: targetOwner,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};


module.exports = {
  addOwner,
  getAllOwners,
  getOwnerById,
  updateOwnerById,
  deleteOwnerById,
  loginOwner,
  logoutOwner,
  activationLink,
  refreshOwnerToken,
  changeIsActive
};