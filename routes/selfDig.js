const puppeteer = require('puppeteer');
const express = require('express');
const router = express.Router();
const uuid = require('uuid').v4

/* GET users listing. */
router.get('/', function (req, res, next) {
    (async () => {
        let firstCount = 0
        let secondCount = 0
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--ignore-certificate-errors',
                '--no-sandbox']
        });
        const page = await browser.newPage();
        await page.goto('https://eduro.pen.go.kr/stv_cvd_co00_002.do', {waitUntil: "networkidle2"});
        await page.type('input#schulNm', '부산고등학교')
        await page.type('input#pName', '강현승')
        await page.keyboard.press('Tab')
        await page.type('input#frnoRidno', '020513')
        while (page.url() === 'https://eduro.pen.go.kr/stv_cvd_co00_002.do') {
            // firstCount++
            // if (firstCount > 1000) {
            //     res.send('error')
            //     throw console.log('too many tries')
            // }
            try {
                await page.click('button#btnConfirm')
                await page.on('dialog', async dialog => {
                    console.log(dialog.message());
                    await dialog.dismiss();
                    await browser.close();
                });
            } catch (e) {
                if (page.url() !== 'https://eduro.pen.go.kr/stv_cvd_co00_000.do') {
                    res.send('error')
                    throw console.error(e)
                }
            }
        }
        await page.click('input#rspns011')
        await page.click('input#rspns02')
        await page.click('input#rspns070')
        await page.click('input#rspns080')
        await page.click('input#rspns090')
        while (page.url() === 'https://eduro.pen.go.kr/stv_cvd_co00_000.do') {
            // secondCount++
            // if (secondCount > 1000) {
            //     res.send('error')
            //     throw console.log('too many tries')
            // }
            try {
                await page.click('button#btnConfirm')
                await page.on('dialog', async dialog => {
                    console.log(dialog.message());
                    await dialog.dismiss();
                    await browser.close();
                });
            } catch (e) {
                if (page.url() !== 'https://eduro.pen.go.kr/stv_cvd_co02_000.do') {
                    res.send('error')
                    throw console.error(e)
                }
            }
        }
        const token = uuid()
        await page.screenshot({
            path: `./public/images/results/${token}.png`
        }).then(r => {
            res.render('self', {
                token: token + '.png'
            })
        })
        await browser.close();
    })();
});

module.exports = router;
