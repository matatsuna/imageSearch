const express = require('express');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 80;

app.get('/', (req, res) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    let query = req.query.text;
    if (query === undefined) {
        res.send(JSON.stringify([]));
    }
    else {
        fetchYahooImg(query)
            .then(text => parseYahooImg(text))
            .then((val) => {
                let json = JSON.stringify(val);
                res.send(json);
            });
    }
})

app.listen(PORT, function () {
    console.log('Example app listening on port ' + PORT.toString());
})

function fetchYahooImg(query) {
    return new Promise((resolve) => {
        fetch('https://search.yahoo.co.jp/image/search?p=' + encodeURIComponent(query))
            .then(e => e.text())
            .then((text) => {
                resolve(text);
            });
    });
}
function parseYahooImg(text) {
    return new Promise((resolve) => {
        const $ = cheerio.load(text);
        let urls = [];
        $('#gridlist img').map((i, element) => {
            let url = element.attribs.rel.split('|')[0];
            urls.push(url);
        });
        resolve(urls);
    });

}

