import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_ACCESS_TOKEN } from '../configs/index.js'
const accountSchema = new mongoose.Schema({
    username: {
        type: String,
        required: "Your username is required",
        max: 255,
    },
    password: {
        type: String,
        required: "Your password is required",
        max: 255,
    },
    role: {
        type: String,
        required: "Your role is required",
        max: 25,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,

    }
})

accountSchema.pre("save", function (next) {
    const user = this;

    if (!user.isModified("password")) return next();
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});


accountSchema.methods.generateAccessJWT = function () {
    let payload = {
        id: this._id,
    };
    return jwt.sign(payload, SECRET_ACCESS_TOKEN, {
        expiresIn: '20m',
    });
};

const accountModel = mongoose.models.account || mongoose.model("account", accountSchema);

export default accountModel;