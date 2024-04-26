import { NextRequest, NextResponse } from 'next/server';
import connection from '@/DBconnection/dbconnection';
import UserModel from '@/models/user.model';
import { mailSender } from '@/utils/emailSender';

connection();

export const POST = async (req: NextRequest, res: NextResponse) => {
    try {
        const { userName, email, password } = await req.json();
        const userAlreadyExist = await UserModel.findOne({ email })
        if (userAlreadyExist) {
            return NextResponse.json({ message: 'User already exist please login' }, { status: 403 })
        }

        const user = new UserModel({
            userName,
            email,
            password
        })

        const savedUser = await user.save();
        await mailSender({ email: email, emailType: "VERIFY", userId: savedUser._id })
        console.log("Mail send succesfully")
        return NextResponse.json({ message: 'Verification Email send on your email id please verify' }, { status: 200 })
    } catch (error: any) {
        console.log(error)
        return NextResponse.json({ message: error.message }, { status: 500 })
    }

}