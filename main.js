//Module
//express module
const express = require('express');
const app = express();
const logger = require('morgan');
app.use(logger('dev', {}));
app.use(express.json()); 
app.use(express.urlencoded( {extended : false } ));

//crawling module
const axios = require("axios");
const cheerio = require("cheerio");
const log = console.log;
const url = require('url');

//mySQL
const mysql = require('mysql');
const cn = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '4321',
    database : 'esys_mailer'
});

//nodemailer
const nodemailer = require("nodemailer");
const secret = require('./secret')


// //crawling
// const getHtml = async () => {
//     try {
//         return await axios.get("http://ese.cau.ac.kr/wordpress/?page_id=226");
//     } catch (error) {
//         console.error(error);
//     }
// };


// getHtml()
//     .then(html => {
//         let ulList = [];
//         const $ = cheerio.load(html.data);
//         const $bodyList = $("div.row div.row.blog-list").children("article");

//         $bodyList.each(function(i, elem) {
//             ulList[i] = {
//                 title: $(this).find('div.blog-top a.blog-title').text().trim(),
//                 url: $(this).find('div.blog-top a').attr('href'),
//                 summary: $(this).find('div.blog-content').text().trim(),
//                 date: $(this).find('div.blog-details span').text().substr(0, $(this).find('div.blog-details span').text().length-10),
//                 id: url.parse($(this).find('div.blog-top a').attr('href')).query.slice(2),
//             };
//     });

//     const data = ulList.filter(n => n.title);
//     return data;
// })
// .then(result => {
//     log(result)
// });


//mailer
async function main() {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.naver.com",
        
        secure: true, // true for 465, false for other ports
        auth: {
        user: secret.myEM, // generated ethereal user
        pass: secret.myPW, // generated ethereal password
        },
    });

    // send mail with defined transport object
    
    let info = await transporter.sendMail({
      from: secret.myEM, // sender address
      to: "nyyni@naver.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?dsfasefsaefd", // plain text body
    //   html: "<b>Hello world? haha</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);


app.listen(3000);