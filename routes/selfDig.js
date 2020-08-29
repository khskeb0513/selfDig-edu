const puppeteer = require('puppeteer');
const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    (async () => {
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--ignore-certificate-errors']
        });
        const page = await browser.newPage();
        await page.goto('https://eduro.pen.go.kr/stv_cvd_co00_002.do', {waitUntil: "networkidle2"});
        await page.type('input#schulNm', '부산고등학교')
        await page.keyboard.press('Tab')
        await page.evaluate((sel) => {
            const elements = document.querySelectorAll(sel);
            for (let i = 0; i < elements.length; i++) {
                elements[i].parentNode.removeChild(elements[i]);
            }
        }, 'div.blockUI')
        await page.type('input#pName', '강현승')
        await page.type('input#frnoRidno', '020513')
        await page.click('button#btnConfirm')
        await page.on('dialog', async dialog => {
            await dialog.dismiss();
        });
        await page.click('button#btnConfirm')
        await page.on('dialog', async dialog => {
            await dialog.dismiss();
        });
        await page.click('button#btnConfirm')
        await page.waitForNavigation({waitUntil: "networkidle2"})
        await page.click('input#rspns011')
        await page.click('input#rspns02')
        await page.click('input#rspns070')
        await page.click('input#rspns080')
        await page.click('input#rspns090')
        await page.click('button#btnConfirm')
        await page.waitForNavigation({waitUntil: "networkidle2"})
        await page.select('div.content_box').content().then(
            async r => {
                await res.send(r);
                await page.close();
            }
        )
    })();
});

module.exports = router;
