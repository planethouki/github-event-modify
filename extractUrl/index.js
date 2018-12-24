module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.body) {
        
        const mailText = req.body;
        const searchTerm = '<script type="application/ld+json">';
        let output = "";
        if (mailText.includes(searchTerm)) {
            const start = mailText.indexOf(searchTerm);
            const end = mailText.indexOf('</script>', start);
            const json = mailText.substring(start + searchTerm.length, end);
            const obj = JSON.parse(json);
            output = obj[0].potentialAction.url
        }
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: output,
            headers: {
                'Content-Type': 'text/plain'
            }
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
};