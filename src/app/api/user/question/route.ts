import connection from "@/DBconnection/dbconnection";
import questionModel from '@/models/question.model'
import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from '@/utils/getDataFromToken'

connection();

export const POST = async (req: NextRequest, res: NextResponse) => {
    try {
        const { questionMessage } = await req.json();
        const userId = await getDataFromToken(req)
        const question = new questionModel({
            question: questionMessage,
            questioner: userId
        })
        const savedQuestion = await question.save()
        return NextResponse.json({ question: savedQuestion }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 })
    }
}