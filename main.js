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
let transporter = nodemailer.createTransport({
    host: "smtp.naver.com",
    port:465,
    secure: true, // true for 465, false for other ports
    pool: true,
    auth: {
    user: secret.myID, // generated ethereal user
    pass: secret.myPW, // generated ethereal password
    },
});

//crawling
const getHtml = async () => {
    try {
        return await axios.get("http://ese.cau.ac.kr/wordpress/?page_id=226");
    } catch (error) {
        console.error(error);
    }
};


getHtml()
    .then(html => {
        let ulList = [];
        const $ = cheerio.load(html.data);
        const $bodyList = $("div.row div.row.blog-list").children("article");

        $bodyList.each(function(i, elem) {
            ulList[i] = {
                url: $(this).find('div.blog-top a').attr('href'),
                id: url.parse($(this).find('div.blog-top a').attr('href')).query.slice(2),
            };
    });
    
    const liData = ulList.filter(n => 6005);
    return liData;
    
})
.then(liData=>{log(liData)})
.then(liData => {
    log(liData)
    if(liData.length<4){
        for(let i=0; i<liData.length; i++){
            try{
                let getHtml2 = async () => {
                    try {
                        return await axios.get(`${liData[i].url}`);
                    } catch (error) {
                        console.error(error);
                    }
                };
                getHtml2()
                .then(html => {
                    const $ = cheerio.load(html.data);
                    const new_data = $('article').html();
                    return new_data;
                })
                .then(new_data => {
                    transporter.sendMail({
                        from: secret.myID+"@naver.com" , // sender address
                        to: "nyyni@naver.com", // list of receivers
                        subject: `에시공 새글 알림(${i})`, // Subject line
                        html: new_data
                        });
                    });
                
            }catch(err){
                console.error(error);
            }
        }
    } else {
        for(let i=0; i<3; i++){
            try{
                let getHtml2 = async () => {
                    try {
                        return await axios.get(`${liData[i].url}`);
                    } catch (error) {
                        console.error(error);
                    }
                };
                getHtml2()
                .then(html => {
                    const $ = cheerio.load(html.data);
                    const new_data = $('article').html();
                    return new_data;
                })
                .then(new_data => {
                    transporter.sendMail({
                        from: secret.myID+"@naver.com" , // sender address
                        to: "nyyni@naver.com", // list of receivers
                        subject: `에시공 새글 알림(${i})`, // Subject line
                        html: new_data
                        });
                    });
                
            }catch(err){
                console.error(error);
            }
        }
        for(let i=3; i<liData.length; i++){
            try{
                let getHtml = async () => {
                    try {
                        return await axios.get(`${liData[i].url}`);
                    } catch (error) {
                        console.error(error);
                    }
                };
                getHtml()
                .then(html => {
                    const $ = cheerio.load(html.data);
                    const new_data = $('article').html();
                    return new_data;
                })
                .then(new_data => {
                    transporter.sendMail({
                        from: secret.myID+"@naver.com", // sender address
                        to: "nyyni@naver.com", // list of receivers
                        subject: `에시공 새글 알림(${i})`, // Subject line
                        html: new_data
                        });
                    });
                
            }catch(err){
                console.error(error);
            }
        }
    }

});


//mailer

Generate test SMTP service account from ethereal.email
Only needed if you don't have a real mail account for testing

create reusable transporter object using the default SMTP transport






app.listen(3000);