import nodemailer from 'nodemailer';

const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function generateOTP() {
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += numbers[Math.floor(Math.random() * numbers.length)];
  }
  return otp;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "tomato22520060@gmail.com",
    pass: "rlfjzbbdnxkwqftz"
  }
});

const sendMail = async (mailOptions) => {
  try {
    // Gửi email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (err) {
    console.error('Error sending email:', err);
  } finally {
    transporter.close();
  }
};

export { sendMail, generateOTP };