module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if ((req.body && req.body.name)) {
        
        const mailText = req.body.mailBody;
        const searchTerm = '<script type="application/json" data-scope="inboxmarkup">';
        let output = "";
        if (mailText.includes(searchTerm)) {
            const start = mailText.indexOf(searchTerm);
            const end = mailText.indexOf('</script>', start);
            const json = mailText.substring(start + searchTerm.length, end);
            const obj = JSON.parse(json);
            output = obj.updates.action.url;

        }
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: output
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
};