import nodemailer from "nodemailer";
import bcrypt from 'bcryptjs';
import UserModel from "@/models/user.model";

const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "1f1fc8b25b6ff1",
        pass: "3e2c2829da62a1"
    }
});

export async function mailSender({ email, emailType, userId }: any) {
    try {
        let generatedToken = '';

        if (emailType === "VERIFY") {
            generatedToken = await bcrypt.hashSync(userId.toString(), 8);
            const user = await UserModel.findByIdAndUpdate({ _id: userId }, { userVerificationToken: generatedToken, userVerificationTokenExpiry: Date.now() + 360000000 });
            console.log("user from email sender", user)
        } else if (emailType === "RESET") {
            generatedToken = await bcrypt.hashSync(userId.toString(), 8);
            await UserModel.findByIdAndUpdate({ _id: userId }, { forgetPasswordToken: generatedToken, forgetPasswordTokenExpiry: Date.now() + 360000000 });
        }
        let htmlTemplate = '';
        let subject = '';

        if (emailType === 'VERIFY') {
            subject = "Verify your email ID";
            htmlTemplate = `
                <p>Verify your email address by clicking the button below:</p>
                <a href="http://localhost:3000/verifyemail?token=${generatedToken}"><button>Verify</button></a>
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p>http://localhost:3000/api/user/verifyemail?token=${generatedToken}</p>
            `;
        } else if (emailType === 'RESET') {
            subject = "Reset your password";
            htmlTemplate = `
                <p>You are receiving this email because a password reset request was received for your account.</p>
                <p>If you did not request a password reset, please ignore this email.</p>
                <p>To reset your password, click the link below:</p>
                <a href="http://localhost:3000/api/user/reset-password?token=${generatedToken}">Reset Password</a>
            `;
        }

        const info = await transport.sendMail({
            from: 'mrahir101@gmail.com',
            to: email,
            subject: subject,
            html: htmlTemplate
        });

        console.log(`Email sent to ${email}: ${info.messageId}`);
    } catch (error) {
        console.error("Error sending email:", error);
        return error;
    }
}
