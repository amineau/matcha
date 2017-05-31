'use strict'


exports.online = (req, res) => {
  const id = Number(req.params.userId)
  const users = req.app.get('users')

  new Promise(resolve => {
    for (let i in users) {
      if (users[i].id === id) {
        return resolve({id, status: users[i].status})
      }
    }
    resolve({id, status: 0})
  }).then(data => {
    res.json({
      data,
      success: true
    })
  })
}
