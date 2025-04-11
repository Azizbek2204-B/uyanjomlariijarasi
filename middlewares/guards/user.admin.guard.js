module.exports = function(req, res, next){
    if (!req.user?.is_creator) {
        return res.status(400).send({message:"ruxsat berilmagan foydalanuvchi"})
    }
    next()
}