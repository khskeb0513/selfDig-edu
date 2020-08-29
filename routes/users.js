const puppeteer = require('puppeteer');
const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/:school_code', function (req, res, next) {
    (async () => {
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--ignore-certificate-errors']
        });
        const page = await browser.newPage();
        await page.goto('http://damoa.pen.go.kr/bbs/login.php', {waitUntil: "networkidle2"});
        await page.type('input#login_id', '0516000700')
        await page.type('input#login_pw', 'a123456')
        await page.click('input#login_pw')
        await page.keyboard.press('Enter')
        await page.waitForNavigation({waitUntil: 'networkidle0'})
        let data = []
        const loop_function = async (i) => {
            await page.goto(
                'https://damoa.pen.go.kr/_monitor/school_center_detail_p.php?sc_code=' + req.params['school_code'] + '&e=&st=&sv=&ap=&page=' + i,
                {waitUntil: "networkidle2"}
            )
            let croll = []
            for (let i = 0; i < 55; i++) {
                let story = {}
                story['name'] = await page.evaluate((data) => {
                    try {
                        return data.textContent
                    } catch {
                        return ''
                    }
                }, await page.$('#main-wrap > div > div > div > div.row > div > div > table > tbody > tr:nth-child(' + (i + 1) + ') > td:nth-child(1) > center'))
                story['ph0'] = await page.evaluate((data) => {
                    try {
                        return data.textContent
                    } catch {
                        return ''
                    }
                }, await page.$('#main-wrap > div > div > div > div.row > div > div > table > tbody > tr:nth-child(' + (i + 1) + ') > td:nth-child(2) > center'))
                story['ph1'] = await page.evaluate((data) => {
                    try {
                        return data.textContent
                    } catch {
                        return ''
                    }
                }, await page.$('#main-wrap > div > div > div > div.row > div > div > table > tbody > tr:nth-child(' + (i + 1) + ') > td:nth-child(3) > center'))
                story['ph2'] = await page.evaluate((data) => {
                    try {
                        return data.textContent
                    } catch {
                        return ''
                    }
                }, await page.$('#main-wrap > div > div > div > div.row > div > div > table > tbody > tr:nth-child(' + (i + 1) + ') > td:nth-child(4) > center'))
                if (story.name.length === 0) {
                    break
                } else {
                    croll[i] = story
                }
            }
            if (croll.length !== 0) {
                for (let i = 0; i < 55; i++) {
                    await data.push(croll[i])
                }
                await loop_function(i + 1)
            }
        }
        await loop_function(1)
        data = await data.splice(1, data.length - 2)
        await res.send(JSON.stringify(data).split('\\n').join('').split('\\t').join(''))
        await browser.close()
    })();
});

router.get('/getUser/:SCHOOL_CODE', (req, res, next) => {
    if (req.params['SCHOOL_CODE'].splice(0,3) === 'C10') {
        res.redirect('/users/' + req.params['SCHOOL_CODE'])
    } else {
        res.redirect('/users/C10' + req.params['SCHOOL_CODE'])
    }
})

module.exports = router;
