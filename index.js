import express from 'express';
import fetch from 'node-fetch';
import cheerio from 'cheerio';

class imageSearch {
    constructor() {
        const app = express();

        app.get('/', (req, res) => {
            res.header("Content-Type", "application/json; charset=utf-8");
            let query = req.query.text;
            if (query === undefined) {
                res.send(JSON.stringify([]));
            }
            else {
                this.fetchYahooImg(query)
                    .then(text => this.parseYahooImg(text))
                    .then((val) => {
                        let json = JSON.stringify(val);
                        res.send(json);
                    });
            }
        })

        app.listen(5050);
        console.log("server 5050 started");
    }
    fetchYahooImg(query) {
        return new Promise((resolve) => {
            fetch('https://search.yahoo.co.jp/image/search?p=' + encodeURIComponent(query))
                .then(e => e.text())
                .then((text) => {
                    resolve(text);
                });
        });
    }
    parseYahooImg(text) {
        return new Promise((resolve) => {
            const $ = cheerio.load(text);
            let urls = [];
            $('#gridlist a').map((i, element) => {
                urls.push(element.attribs.href);
            });
            resolve(urls);
        });

    }

}

const imagesearch = new imageSearch();
