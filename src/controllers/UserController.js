const Userinfo = require("../models/UserModel");
module.exports.CreateUser = async function (req, res, next) {
    console.log(req.body)
    const newuser = new Userinfo(
        req.body
    )
    const justInserted = await newuser.save();
    res.json(justInserted);
}

module.exports.UpdateUser = async function (req, res, next) {
    const id = req.params.id;
    console.log(id)
    const exstngUser = await Userinfo.updateOne({ _id: id }, req.body)
    res.send(exstngUser)
}

module.exports.LoginUser = async function (req, res, next) {
    const { email, password } = req.body;

    const tryingUser = await Userinfo.findOne({ email });

    if (!tryingUser) {
        res.status(404).json({
            "success": false,
            "reason": "User Not Found"
        })
    }

    res.send(tryingUser)

}