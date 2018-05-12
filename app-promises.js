
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
        function run() {
            var promise = new Promise(function (resolve, reject) {

                let url = address[calls].slice(0, 4);
                if (url != 'http') {
                    url = `https://${address[calls]}`;
                }
                else {
                    url = address[calls];
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

                    var list = `<li>${address[calls]} - ${title}</li>`;
                    $ = cheerio.load(resHtml);

                    $('ul').append(list);
                    resHtml = $('html').html();
                    if (calls == address.length - 1) {
                        reject(resHtml);
                    }
                    else {
                        resolve();
                        calls++;
                    }
                });




            });

            return promise;
        }
        function repeat() {
            run().then(() => {
                repeat();
            }).catch((html) => {
                res.send(html);
            });
        }

        repeat();


    }
    else {
        res.send('No Parameter Provided');
    }

})



app.get('*', (req, res) => {
    res.status(404).send('404 Not Found')
})

app.listen(3300, () => {
    console.log('Listening to port 3300 Promises');
})

module.exports.app = app;