const express = require('express');
const cheerio = require('cheerio');
const request = require('co-request');
const co = require('co');
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
        address.forEach(addres => {

            co(function* () {
                let url = addres.slice(0, 4);
                if (url != 'http') {
                    url = `https://${addres}`;
                }
                else {
                    url = addres;
                }
                var title;
                var body = null;
                const response = yield request(url).then((res) => {
                    if (res.body != null) {
                        var $ = cheerio.load(res.body);
                        title = $('title').text();
                    }
                }).catch((err) => {
                    title = "No Response";

                });
            
                
               
                

                var list = `<li>${addres} - ${title}</li>`;
                $ = cheerio.load(resHtml);

                $('ul').append(list);
                resHtml = $('html').html();
                if (calls == address.length - 1) {
                    res.send(resHtml);
                }
                calls++;
            });

        });



    }
    else {
        res.send('No Parameter Provided');
    }

})



app.get('*', (req, res) => {
    res.status(404).send('404 Not Found')
})

app.listen(3500, () => {
    console.log('Listening to port 3500 Generator');
})

module.exports.app = app;

