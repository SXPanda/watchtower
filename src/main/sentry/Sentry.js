import curl from 'curl-cmd';
import { exec } from 'child_process';

export default class Sentry {
  authToken = '72ff3fe2c789499d8afdcd9d86bb21770eae367ac2f240caa7cf9ff7647c1026';
  baseUrl = 'sentry.io';

  organization = false;
  projects = false;
  project = false;
  issues = {};
  users = {};

  listIssuesPerUser() {
    return new Promise((resolve) => {
      this.listIssuesPerProject().then((issues) => {
        Object.keys(issues).forEach((project) => {
          const perProjectIssues = issues[project];

          for (let i = 0, l = perProjectIssues.length; i < l; ++i) {
            const issue = perProjectIssues[i];
            const assignedUser = issue.assignedTo;
            if (typeof this.users[assignedUser.id] === 'undefined') {
              this.users[assignedUser.id] = assignedUser;
              this.users[assignedUser.id].count = 0;
            }
            this.users[assignedUser.id].count += 1;
          }
        });
        resolve(this.users);
      });
    });
  }

  listIssuesPerProject() {
    return new Promise((resolve) => {
      this.listProjects().then((projects) => {
        this.projects = projects;

        for (let i = 0, l = this.projects.length; i < l; ++i) {
          this.project = this.projects[i].slug;
          // eslint-disable-next-line
          const project = this.project;
          this.listIssues().then((issues) => {
            this.issues[project] = issues;
            if (Object.keys(this.issues).length === l) {
              resolve(this.issues);
            }
          });
        }
      });
    });
  }

  listIssues() {
    return this.executeQuery('/api/0/projects/{organization-slug}/{project-slug}/issues/?query=is:unresolved is:assigned');
  }

  listProjects() {
    this.organization = 'teemill-tech-ltd';
    return this.executeQuery('/api/0/organizations/{organization-slug}/projects/');
  }

  executeQuery(requestPath) {
    requestPath = this.formatUrl(requestPath);

    const options = {
      hostname: this.baseUrl,
      port: 443,
      path: requestPath,
      mehod: 'GET',
      headers: {
        Authorization: `Bearer ${this.authToken}`,
      },
    };
    const command = curl.cmd(options, { ssl: true }).replace(/'/g, '"');
    console.log(command);

    return new Promise((resolve, reject) => {
      exec(command, (error, stdout) => {
        if (error) {
          reject(error);
        }

        resolve(JSON.parse(stdout));
      });
    });
  }

  formatUrl(url) {
    return url.replace(/{organization-slug}/, this.organization)
      .replace(/{project-slug}/, this.project);
  }
}
