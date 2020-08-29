const puppeteer = require('puppeteer');
const express = require('express');
const router = express.Router();
const uuid = require('uuid').v4

const browser = puppeteer.launch({
    headless: true,
    args: ['--ignore-certificate-errors', '--no-sandbox'],
    slowMo: '250ms'
});
let chain = Promise.resolve();

/* GET users listing. */
router.get('/', async function (req, res, next) {
    let firstCount = 0
    let secondCount = 0
    const schoolName = req.query['school']
    const Name = req.query['name']
    const Birth = req.query['birth']
    chain = chain.then(async () => {
        browser.then(async r => {
            const page = await r.newPage()
            await page.goto('https://eduro.pen.go.kr/stv_cvd_co00_002.do', {waitUntil: "networkidle2"});
            await page.type('input#schulNm', schoolName)
            await page.type('input#pName', Name)
            await page.keyboard.press('Tab')
            await page.type('input#frnoRidno', Birth)
            while (page.url() === 'https://eduro.pen.go.kr/stv_cvd_co00_002.do') {
                // firstCount++
                // if (firstCount > 1000) {
                //     res.send('에러발생, F5 및 위로 끌어당겨 새로고침 바람.')
                //     throw console.log('too many tries')
                // }
                try {
                    await page.click('button#btnConfirm')
                } catch (e) {
                    if (page.url() !== 'https://eduro.pen.go.kr/stv_cvd_co00_000.do') {
                        res.send('에러발생, F5 및 위로 끌어당겨 새로고침 바람.')
                        throw console.error(e)
                    }
                }
                // await page.on('dialog', async dialog => {
                //     console.log(dialog.message());
                //     await dialog.dismiss();
                //     await browser.close();
                // });
            }
            await page.click('input#rspns011')
            await page.click('input#rspns02')
            await page.click('input#rspns070')
            await page.click('input#rspns080')
            await page.click('input#rspns090')
            while (page.url() === 'https://eduro.pen.go.kr/stv_cvd_co00_000.do') {
                // secondCount++
                // if (secondCount > 1000) {
                //     res.send('에러발생, F5 및 위로 끌어당겨 새로고침 바람.')
                //     throw console.log('too many tries')
                // }
                try {
                    await page.click('button#btnConfirm')
                } catch (e) {
                    if (page.url() !== 'https://eduro.pen.go.kr/stv_cvd_co02_000.do') {
                        res.send('에러발생, F5 및 위로 끌어당겨 새로고침 바람.')
                        throw console.error(e)
                    }
                }
                // await page.on('dialog', async dialog => {
                //     console.log(dialog.message());
                //     await dialog.dismiss();
                //     await browser.close();
                // });
            }
            const token = uuid()
            await page.screenshot({
                path: `./public/images/results/${token}.png`
            }).then(r => {
                res.render('self', {
                    token: token + '.png',
                })
            })
            await page.close();
        })
    })
});

module.exports = router;
