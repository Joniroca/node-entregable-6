const catchError = require("../utils/catchError");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");

const getAll = catchError(async (req, res) => {
  const results = await User.findAll();
  return res.json(results);
});

const create = catchError(async (req, res) => {
  const hashedPw = await bcrypt.hash(req.body.password, 10);
  const result = await User.create({ ...req.body, password: hashedPw });
  // Enviando emails de bienvenida
  await sendEmail({
    to: result.email, // Email del receptor
    subject: "¡Saludos!", // asunto
    html: `
        <h1>¡¡¡BIENVENIDO ${result.firstName}!!!</h1>
    `, // texto
  });
  return res.status(201).json(result);
});

const getOne = catchError(async (req, res) => {
  const { id } = req.params;
  const result = await User.findByPk(id);
  if (!result) return res.sendStatus(404);
  return res.json(result);
});

const remove = catchError(async (req, res) => {
  const { id } = req.params;
  await User.destroy({ where: { id } });
  return res.sendStatus(204);
});

const update = catchError(async (req, res) => {
  const { id } = req.params;
  // No se permite el update de email ni phone
  const { firstName, lastName, phone } = req.body;
  const result = await User.update(
    { firstName, lastName, phone },
    {
      where: { id },
      returning: true,
    }
  );
  if (result[0] === 0) return res.sendStatus(404);
  return res.json(result[1][0]);
});

const login = catchError(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json("invalid credentials");
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json("invalid credentials");
  // crear TOKEN
  const token = jwt.sign(
    { user }, // PAYLOAD
    process.env.TOKEN_SECRET, // Clave secreta
    { expiresIn: "1d" }
  );

  return res.json({ user, token });
});

const getMe = catchError(async (req, res) => {
  const user = req.user;
  return res.json(user);
});

module.exports = {
  getAll,
  create,
  getOne,
  remove,
  update,
  login,
  getMe,
};
