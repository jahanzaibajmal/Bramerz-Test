

const appCallback = require('supertest');

const app = new Array();

app.push(require('./app-callback').app);
app.push(require('./app-async').app);
app.push(require('./app-promises').app);
app.push(require('./app-streams').app);
app.push(require('./app-generator').app);

app.forEach(app => {

    it('should expect a list of web url and their titles | can give error in case of (callback,stream,generator) cause expected output varies on response', function (done) {
        this.timeout(15000)
        appCallback(app)
            .get('/I/want/title/?address=http://google.com&address=facebook.com&address=youtub.com')
            .expect('<head></head><body><h1> Following are the titles of given websites: </h1><ul><li>http://google.com - Google</li><li>facebook.com - &#x627;&#x67E;&#x646;&#x6D2; &#x628;&#x631;&#x627;&#x624;&#x632;&#x631; &#x6A9;&#x6CC; &#x62A;&#x62C;&#x62F;&#x6CC;&#x62F; &#x6A9;&#x631;&#x6CC;&#x6BA; | Facebook</li><li>youtub.com - No Response</li></ul></body>')
            .end(done);
    })

    it('should expect a single web url and its title', function (done) {
        this.timeout(15000)
        appCallback(app)
            .get('/I/want/title/?address=http://google.com')
            .expect('<head></head><body><h1> Following are the titles of given websites: </h1><ul><li>http://google.com - Google</li></ul></body>')
            .end(done);
    })

    it('should expect a list of web url with No Response', function (done) {
        this.timeout(15000)
        appCallback(app)
            .get('/I/want/title/?address=http://youtub.com')
            .expect('<head></head><body><h1> Following are the titles of given websites: </h1><ul><li>http://youtub.com - No Response</li></ul></body>')
            .end(done);
    })

    it('should expect No Parameter Provided', function (done) {
        this.timeout(15000)
        appCallback(app)
            .get('/I/want/title/')
            .expect('No Parameter Provided')
            .end(done);
    })

    it('should expect 404 Not found', function (done) {
        this.timeout(15000)
        appCallback(app)
            .get('/I/want/title/wfpwejf')
            .expect('404 Not Found')
            .end(done);
    })

});