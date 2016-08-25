'use strict'

const Application = require('spectron').Application
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const path = require('path')

chai.should()
chai.use(chaiAsPromised)

describe('(integration) paper-notes', function () {
  this.timeout(30000)

  let app

  const setupApp = function (app) {
    chaiAsPromised.transferPromiseness = app.transferPromiseness
    return app.client.waitUntilWindowLoaded()
  }

// path: path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'),
// path.join(__dirname, '..', '..', 'app')
  const startApp = function () {
    var electronPath = path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron')
    if (process.platform === 'win32') electronPath += '.cmd'

    app = new Application({
      path: electronPath,
      args: [
        path.join(__dirname, '..', '..', 'app')
      ],
      waitTimeout: 10000
    })
    // console.info('cwd:' + process.cwd())
    // console.info('path:' + path.join(__dirname, '..', '..', 'node_modules', '.bin', 'electron'))
    // console.info('path' + path.join(__dirname, '..', '..', 'app'))

    return app.start().then(setupApp)
  }

  before(function () {
    return startApp()
  })

  after(function () {
    if (app && app.isRunning()) {
      return app.stop()
    }
  })

  it('opens a window displaying the main screen', function () {
    return app.client.getWindowCount().should.eventually.equal(1)
      .browserWindow.isMinimized().should.eventually.be.false
      .browserWindow.isDevToolsOpened().should.eventually.be.false
      .browserWindow.isVisible().should.eventually.be.true
      // .browserWindow.isFocused().should.eventually.be.true
      .browserWindow.getBounds().should.eventually.have.property('width').and.be.above(0)
      .browserWindow.getBounds().should.eventually.have.property('height').and.be.above(0)
      .isVisible('.main').should.eventually.be.true
  })
})
