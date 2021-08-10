//Module

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
        console.log(error);
    }
};


getHtml()
.then(html => {
    let ulList = [];
    const $ = cheerio.load(html.data);
    const $bodyList = $("div.row div.row.blog-list").children("article");

    $bodyList.each(function(i, elem) {
        ulList[i] = {
            "title": $(this).find('div.blog-top a.blog-title').text().trim(),
            "url": $(this).find('div.blog-top a').attr('href'),
            "id": url.parse($(this).find('div.blog-top a').attr('href')).query.slice(2),
        };
    });
    return ulList;
})
.then(ulList => {
    let filtered=[];


    cn.query(`select ud.id from ud`, (err, result)=>{
        if (err) console.log(err);
        for (let ele in ulList){
            if (ulList[ele].id>result[0].id){
                filtered.push(ulList[ele])
            }
        }
        if (filtered){
            filtered.forEach(element => {
                try{
                    
                    let getHtml2 = async () => {
                        try {
                            return await axios.get(`${element.url}`);
                        } catch (error) {
                            console.log(error);
                        }
                    };
                    getHtml2()
                    .then(html => {
                        const $ = cheerio.load(html.data);

                        let new_data= $('article').html();
                        let mailData= [element.title,new_data];
                        return mailData;
                    })
                    .then(mailData => {
                        transporter.sendMail({
                            from: secret.myID+"@naver.com" , // sender address
                            to: "nyyni@naver.com", // list of receivers
                            subject: mailData[0], // Subject line
                            html: mailData[1]
                        });
                    });
                    
                }catch(err){
                    console.log(err);
                }
            });
            cn.query(`update ud set id="${filtered[0].id}";`)
        }
    })
})

// const max = filtered.reduce(function(prev, current) {
//     return (prev.id > current.id) ? prev.id : current.id
// })
// console.log(max);
