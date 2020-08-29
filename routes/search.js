const express = require('express')
const router = express.Router()
const axios = require('axios')
const async = require('async')
const neisRegistry = {
    KEY: 'b89cb58a6f0c431faa0686db9e63adcc',
    ATPT_OFCDC_SC_CODE: 'C10'
}

router.get('/:SCHOOL_NAME', (req, res, next) => {
    async.waterfall([
        (callback) => {
            axios.get('https://open.neis.go.kr/hub/schoolInfo?' +
                'KEY=' + neisRegistry.KEY + '&' +
                'Type=json&pIndex=1&pSize=100&' +
                'ATPT_OFCDC_SC_CODE=' + neisRegistry.ATPT_OFCDC_SC_CODE + '&' +
                'SCHUL_NM=' + encodeURIComponent(req.params['SCHOOL_NAME']))
                .then(r => {
                    callback(null, r.data)
                }, e => {
                    callback(e)
                })
        }
    ]).then(
        r => {
            res.json(r)
        }, e => {
            res.json(e)
        }
    )
})

module.exports = router
