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
    maxConnections: 1,
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
            let date = $(this).find('div.blog-details span').text().substr(0, $(this).find('div.blog-details span').text().length-10);
            date = new Date(date);
            
            ulList[i] = {
                "url": $(this).find('div.blog-top a').attr('href'),
                "date": date,
            };
            
    });
    let wk_ago= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const liData = ulList.filter(n => n.date>wk_ago);
    return liData;
    
})
.then(liData => {
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
                        subject: `에시공 새글 알림(${i+1})`, // Subject line
                        html: new_data
                        });
                    });
                    
            }catch(err){
                console.error(error);
            }
        }
})


