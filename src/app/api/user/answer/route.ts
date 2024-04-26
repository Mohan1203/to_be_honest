import connection from "@/DBconnection/dbconnection";
import { NextRequest, NextResponse } from "next/server"
import questionModel from "@/models/question.model";
import answerModel from "@/models/answer.model";
import { getDataFromToken } from "@/utils/getDataFromToken";
import mongoose from "mongoose";

connection();
export const POST = async (req: NextRequest, res: NextResponse) => {

    try {
        const { questionId, answerMessage } = await req.json();
        const questionObjectId = new mongoose.Types.ObjectId(questionId)
        console.log(questionObjectId)
        const question = await questionModel.findOne({ _id: questionId })
        const answererId = await getDataFromToken(req)
        if (!question) {
            return NextResponse.json({ message: "Answer time is expire" }, { status: 400 })
        }
        const answer = new answerModel({
            question: questionObjectId,
            answer: answerMessage,
            answerer: answererId
        })

        const savedAnswer = await answer.save();
        return NextResponse.json({ message: "Answer saved successfully" }, { status: 200 })
    } catch (error: any) {
        console.log(error)
        return NextResponse.json({ message: error.message }, { status: 500 })
    }

}