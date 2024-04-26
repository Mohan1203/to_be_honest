import { NextRequest, NextResponse } from "next/server";
import connection from "@/DBconnection/dbconnection";
import UserModel from "@/models/user.model"
import jwt from 'jsonwebtoken'


connection()


// interface userExist {
//     userName: string,
//     email: string,
//     password: string
// }

export const POST = async (req: NextRequest, res: NextResponse, next: any) => {
    try {
        const { email, password } = await req.json();
        const userExist = await UserModel.findOne({ email })
        if (!userExist) {
            return NextResponse.json({ message: "user not found" }, { status: 404 })
        }
        const validUser = await userExist.isValidPassword(password.toString())
        if (!validUser) {
            return NextResponse.json({ message: 'Invalid creditianls' }, { status: 400 })
        }
        const jwtToken = jwt.sign({ id: userExist._id }, process.env.TOKEN_SECRET!)

        const response = NextResponse.json({ message: 'User login succesfully', success: true }, { status: 200 })
        response.cookies.set("token", jwtToken, { httpOnly: true })
        return response
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}