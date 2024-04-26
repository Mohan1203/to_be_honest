import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import connection from "@/DBconnection/dbconnection";

connection();

export const POST = async (req: NextRequest, res: NextResponse) => {
    try {
        const { token } = await req.json();
        console.log(token)
        const userWithToken = await UserModel.findOne({ userVerificationToken: token, userVerificationTokenExpiry: { $gt: Date.now() } })

        if (!userWithToken) {
            return NextResponse.json({ message: "Invalid verification token" }, { status: 400 })
        }
        userWithToken.isVerified = true,
            userWithToken.userVerificationToken = null
        userWithToken.userVerificationTokenExpiry = null
        return NextResponse.json({ message: userWithToken }, { status: 200 })
    } catch (error: any) {
        console.log(error)
        return NextResponse.json({ message: error.message }, { status: 500 })
    }

}
