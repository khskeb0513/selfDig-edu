const puppeteer = require('puppeteer');
const express = require('express');
const router = express.Router();

const _password = {
    id: 'entrolink',
    password: 'password'
}

/* GET users listing. */
router.get('/', function (req, res, next) {
    (async () => {
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--ignore-certificate-errors']
        });
        const open_page = {}
        const page = []
        for (let i = 111; i < 131; i++) {
            page[i] = await browser.newPage();
            await page[i].goto('http://192.168.114.' + i, {waitUntil: "networkidle2"});
            await page[i].type('#username', _password.id)
            await page[i].type('#password', _password.password)
            await page[i].click('#bodyblock > table > tbody > tr:nth-child(4) > td > table > tbody > tr > td.spacer100Percent.topAlign > table > tbody > tr:nth-child(2) > td.spacer100Percent.paddingsubSectionBodyLogin > table > tbody > tr:nth-child(3) > td > input[type=image]:nth-child(1)')
        }
    })();
});

module.exports = router;
