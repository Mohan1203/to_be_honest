import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
    userName: {
        type: String,
        unique: [true, 'User Name must unique'],
        trim: true,
        require: [true, 'User Name is required']
    },
    email: {
        type: String,
        unique: [true, "Email alredy exist"],
        lowercase: true,
        require: [true, 'Email is required']
    },
    password: {
        type: String,
        require: [true, 'Password must required'],
        minLength: [6, 'Password is too short']
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    userVerificationToken: String,
    userVerificationTokenExpiry: Date,
    forgetPasswordToken: String,
    forgetPasswordTokenExpiry: Date

}, { timestamps: true })

userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    const hashedPassword = bcrypt.hashSync(user.password, 8)
    user.password = hashedPassword;
    next();
})

userSchema.method('isValidPassword', async function (password) {
    const user = this;
    console.log(user)
    const isValid = await bcrypt.compare(password, user.password)
    return isValid;
})

const UserModel = mongoose.models.user || new mongoose.model('user', userSchema)

export default UserModel;