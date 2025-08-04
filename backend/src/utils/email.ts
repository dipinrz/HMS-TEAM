import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
})


export const sendEmail = async (
    to: string,
    subject: string,
    text: string,
    html: string
) => {

    const mailOptions = {
        from: `HMS <${process.env.SMTP_USER}>`,
        to,
        subject,
        text,
        html
    }


    try {
        console.log("sending mail");
        
        const info = await transporter.sendMail(mailOptions)

        return info
    } catch (error) {
        console.log("Error sending email: ", error);
        throw error

    }
}