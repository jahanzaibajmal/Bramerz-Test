

const express = require('express');
const cheerio = require('cheerio');
const request = require('request');
const _ = require('lodash');

var calls;

var app = express();

app.get('/I/want/title', (req, res) => {
    calls = 0;
    var resHtml = '<html><head></head><body><h1> Following are the titles of given websites: </h1><ul></ul></body></html>'
    if (req.query.address) {
        let address = req.query.address;
        if (_.isArray(address) == false) {
            address = new Array(address);
        }
        function run(callback) {
            for (var i = 0; i < address.length; i++) {
                let url = address[i].slice(0, 4);
                if (url != 'http') {
                    url = `https://${address[i]}`;
                }
                else {
                    url = address[i];
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

                    var list = `<li>${url} - ${title}</li>`;
                    $ = cheerio.load(resHtml);

                    $('ul').append(list);
                    resHtml = $('html').html();
                    if (calls == address.length - 1) {
                        callback($('html').html());
                    }
                    calls++;
                });

            }
        }

        run((html) => {
            res.send(html);
        })

    }
    else {
        res.send('No Parameter Provided');
    }

})



app.get('*', (req, res) => {
    res.status(404).send('404 Not Found')
})

app.listen(3100, () => {
    console.log('Listening to port 3100');
})

module.exports.app = app;

