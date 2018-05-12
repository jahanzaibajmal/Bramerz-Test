
const express = require('express');
const cheerio = require('cheerio');
const request = require('request');
const _ = require('lodash');
const async = require('async');

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
        async.forever(
            function (next) {
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
                        next($('html').html());
                    }
                    else {
                        calls++;
                        next();
                    }


                });
            },
            function (err) {
                // if next is called with a value in its first parameter, it will appear
                // in here as 'err', and execution will stop.
                res.send(err);
            }
        );


    }

    else {
        res.send('No Parameter Provided');
    }

})



app.get('*', (req, res) => {
    res.status(404).send('404 Not Found')
})

app.listen(3200, () => {
    console.log('Listening to port 3200 Async');
})

module.exports.app = app;
