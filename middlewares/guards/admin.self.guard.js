module.exports = function (req, res, next) {
  console.log("1");
  if (!req.user.is_active) {
    return res.status(400).send({message:"Bu admin emas"})
  }
  if (false != req.admin.is_active) {
    return res.status(400).send({
      message: "faqat shaxsiy malumotlarni ko'rishga malumot etiladi",
    });
  }
  next();
};