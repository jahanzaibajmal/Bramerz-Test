

const Bacon = require('baconjs');

const express = require('express');
const cheerio = require('cheerio');
const request = require('request');
const _ = require('lodash');

var calls;

var app = express();

module.exports = app.get('/I/want/title', (req, res) => {
    calls = 0;
    var resHtml = '<html><head></head><body><h1> Following are the titles of given websites: </h1><ul></ul></body></html>'
    if (req.query.address) {
        let address = req.query.address;
        if (_.isArray(address) == false) {
            address = new Array(address);
        }
        Bacon.fromArray(address)
            .map((v) => {
                let url = v.slice(0, 4);
                if (url != 'http') {
                    url = `https://${v}`;
                }
                else {
                    url = v;
                }

                request(url, function (err, resp, body) {
                    var title;
                    if (body != null) {
                        var $ = cheerio.load(body);
                        title = $('title').text();
                    }
                    else {
                        title = "No Response";
                    }

                    var list = `<li>${v} - ${title}</li>`;
                    $ = cheerio.load(resHtml);

                    $('ul').append(list);
                    resHtml = $('html').html();
                    //console.log(resHtml);
                    if (calls == address.length - 1) {
                        res.send(resHtml);
                    }
                    calls++;
                });
            }).onEnd(() => {

            });







    }
    else {
        res.send('No Parameter Provided');
    }

})



app.get('*', (req, res) => {
    res.status(404).send('404 Not Found')
})

app.listen(3400, () => {
    console.log('Listening to port 3400');
})

module.exports.app = app;