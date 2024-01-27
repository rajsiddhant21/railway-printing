const mongoose = require('mongoose');
const userinfo = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    createdAt: Date,
    passwordLastModified: Date,
    lastModified: Date,
    role: {
        type: String,
        enum: ['admin', 'customer', 'user'],
        default: 'customer'
    }
});
const Userinfo = mongoose.model('Userinfo', userinfo);


function pwdHash(pwd) {
    const hash = bcrypt.hashSync(pwd, 6);
    return hash;
}

userinfo.pre('save', function (next) {
    if (!this.lastModified) {
        this.password = pwdHash(this.password);
        this.createdAt = new Date();
    }
    this.lastModified = new Date();
    next();
})

userinfo.methods.verifyPassword = function (userInputPassword) {
    console.log(this)
}

module.exports = Userinfo;