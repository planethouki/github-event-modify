function eventParse(event) {
    let description = "";
    switch (event.type) {
        case "CheckRunEvent":
        case "CheckSuiteEvent":
        case "CommitCommentEvent":
        case "ContentReferenceEvent":
        description = "未対応イベント：" + event.type;
        break;
        case "CreateEvent":
        description = `${event.payload.ref_type}が作成されました `;
        description += event.repo.url.replace("api.github.com/repos", "github.com");
        break;
        case "DeleteEvent":
        case "DeploymentEvent":
        case "DeploymentStatusEvent":
        case "DownloadEvent":
        case "FollowEvent":
        case "ForkEvent":
        case "ForkApplyEvent":
        case "GitHubAppAuthorizationEvent":
        case "GistEvent":
        case "GollumEvent":
        case "InstallationEvent":
        case "InstallationRepositoriesEvent":
        description = "未対応イベント：" + event.type;
        break;
        case "IssueCommentEvent":
        description = "イシューにコメントがありました ";
        description += event.payload.comment.user.login + " ";
        description += event.payload.comment.html_url;
        break;
        case "IssuesEvent":        
        description = `イシューが${event.payload.action}されました `;
        description += event.payload.issue.user.login + " ";
        if (event.payload.action === "opened") {
            description += "\"" + event.payload.issue.title + "\" ";
        }
        description += event.payload.issue.html_url;
        break;
        case "LabelEvent":
        case "MarketplacePurchaseEvent":
        case "MemberEvent":
        case "MembershipEvent":
        case "MilestoneEvent":
        case "OrganizationEvent":
        case "OrgBlockEvent":
        case "PageBuildEvent":
        case "ProjectCardEvent":
        case "ProjectColumnEvent":
        case "ProjectEvent":
        case "PublicEvent":
        description = "未対応イベント：" + event.type;
        break;
        case "PullRequestEvent":
        description = "プルリクがありました ";
        description += event.payload.pull_request.user.login + " ";
        description += event.payload.pull_request.html_url;
        break;
        case "PullRequestReviewEvent":
        description = "プルリクのレビューがありました ";
        description += event.payload.pull_request.user.login + " ";
        description += event.payload.pull_request.html_url;
        break;
        case "PullRequestReviewCommentEvent":
        description = "プルリクのレビューコメントがありました ";
        description += event.payload.pull_request.user.login + " ";
        description += event.payload.pull_request.html_url;
        break;
        case "PushEvent":
        if (event.payload.size === 1) {
            description = "コミットがありました ";
            const commit = event.payload.commits[0];
            description += commit.author.name + " ";
            description += "\"" + commit.message + "\" ";
            description += commit.url.replace("api.github.com/repos", "github.com").replace("commits", "commit");
        } else if (event.payload.size > 1) {
            description = "複数のコミットがありました ";
            description += event.repo.url.replace("api.github.com/repos", "github.com");
        } else {
            description = "プッシュがありました ";
            description += event.repo.url.replace("api.github.com/repos", "github.com");
        }
        break;
        case "ReleaseEvent":
        description = "【重要】バージョンアップがありました ";
        description += event.payload.release.html_url + " ";
        break;
        case "RepositoryEvent":
        case "RepositoryImportEvent":
        case "RepositoryVulnerabilityAlertEvent":
        case "SecurityAdvisoryEvent":
        case "StatusEvent":
        case "TeamEvent":
        case "TeamAddEvent":
        case "WatchEvent":
        description = "未対応イベント：" + event.type;
        break;
    }
    return description;
}

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    
    const date = new Date(Date.now() - 3600*1000);
    const prefix = date.getUTCFullYear() + "-" + 
        (date.getUTCMonth() + 1) + "-" + 
        date.getUTCDate() + "T" + 
        "0".concat(date.getUTCHours()).substr(-2);

    if (req.body && req.body.length > 0) {
        const events = req.body;
        context.res = {
            // status: 200, /* Defaults to 200 */
            headers: {
                'Content-Type': 'application/json'
            },
            // body: events.map(eventParse)
            body: events.filter(event => event.created_at.startsWith(prefix)).map(eventParse)
        };
    } else {
        context.res = {
            status: 400,
            body: "Please pass body"
        };
    }
};