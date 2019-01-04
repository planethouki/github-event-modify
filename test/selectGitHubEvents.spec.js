var assert = require('assert');
var selectGitHubEvents = require('../selectGitHubEvents/index.js');
var MockDate = require('mockdate');

describe('selectGitHubEvents', function() {
    it('select 1 hour before', async function() {
        MockDate.reset();
        const req = {
            body: [
                {"created_at": (new Date(Date.now() + 3600*1000)).toISOString()},
                {"created_at": (new Date()).toISOString()},
                {"created_at": (new Date(Date.now() - 3600*1000)).toISOString()}
            ]
        };
        const context = {
            log: function(str) {
                console.log(str);
            }
        };
        await selectGitHubEvents(context, req);
        assert.equal(context.res.body.length, 1, "1 selection");
    });

    it('padding zero', async function() {
        MockDate.set(1546582671461); // "2019-01-04T06:17:51.461Z"
        const req = {
            body: [
                {"created_at": "2019-01-04T05:08:05Z"}
            ]
        };
        const context = {
            log: function(str) {
                console.log(str);
            }
        };
        await selectGitHubEvents(context, req);
        assert.equal(context.res.body.length, 1, "1 selection");
    });
});