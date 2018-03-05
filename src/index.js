import express from 'express';
import fetch from 'node-fetch';
import cheerio from 'cheerio';

class imageSearch {
    constructor() {
        const app = express();

        app.get('/', (req, res) => {
            this.fetchYahooImg()
                .then(text => this.parseYahooImg(text))
                .then((val) => {
                    let json = JSON.stringify(val);
                    res.send(json);
                });
        })

        app.listen(5050);
        console.log("server 5050 started");
    }
    fetchYahooImg() {
        return new Promise((resolve) => {
            fetch('https://search.yahoo.co.jp/image/search?p=%E5%B7%9D%E5%B3%B6%E6%B5%B7%E8%8D%B7')
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
