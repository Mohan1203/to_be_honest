import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export const getDataFromToken = async (req: NextRequest) => {
    try {
        const token = await req.cookies.get('token')?.value || "";
        const decodedToken = await jwt.verify(token, process.env.TOKEN_SECRET!)
        return decodedToken?.id
    } catch (error: any) {
        console.log(error.message)
    }

}
