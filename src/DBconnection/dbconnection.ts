import mongoose from 'mongoose'

const connection = async () => {
    try {
        const connect = await mongoose.connect(process.env.DATABASE_URL!)
        console.log("database connect successfully")
    } catch (error) {
        console.log(error)
    }

}

export default connection