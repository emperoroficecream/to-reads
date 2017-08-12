const app = require('express')()
const Webtask = require('webtask-tools')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  console.log('Welcome to serverless-task-management')
})

// Github webhooks send POST request to the provided URL
app.post('/reading', (req, res) => {
  const { GITHUB_ACCESS_TOKEN, ZENHUB_ACCESS_TOKEN } = req.webtaskContext.secrets
  if (req && req.body && req.body.payload) {
    const { action, issue } = req.body.payload
    const { url, html_url, number, title } = issue

    console.log(`Issue "${title}" was ${action}`)

    if (action === 'opened') {
      fetch(`${url}?access_token=${GITHUB_ACCESS_TOKEN}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestone: 1})
      }).then(
        () => {
          console.log('Milestoned issue')
          res.send('Milestoned issue')
        },
        (e) => console.error(e)
      )
    }
  }
  res.send('something happened!')
})

module.exports = Webtask.fromExpress(app)
