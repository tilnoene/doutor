const Database = require('@replit/database');
const db = new Database();
var nodemailer = require('nodemailer');

const getStatusEncomenda = require('./getStatusEncomenda');

module.exports = async ( user, codigo ) => {
  let status = await getStatusEncomenda(codigo);
  
  if (status === '')
    return;
  
  db.get(`${user.id}_${codigo}_status`).then(value => {
    if (value !== status) {
      user.send(status);

      /*const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD
        }
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: 'kathiareginabrito@gmail.com',
        subject: 'Rastreamento',
        text: status
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });*/
      
      db.set(`${user.id}_${codigo}_status`, status);
    }
  });
}