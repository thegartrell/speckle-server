/* eslint-disable no-undef */
'use strict'

const express = require('express')
const router = express.Router()
const puppeteer = require('puppeteer')
const { logger } = require('../observability/logging')

async function pageFunction(objectUrl) {
  waitForAnimation = async (ms = 70) =>
    await new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  const ret = {
    duration: 0,
    mem: 0,
    scr: {}
  }

  const t0 = Date.now()

  await window.v.init()

  try {
    await window.v.loadObjectAsync(objectUrl)
  } catch (error) {
    // Main call failed. Wait some time for other objects to load inside the viewer and generate the preview anyway
    await waitForAnimation(1000)
  }
  window.v.zoom(undefined, 0.95, false)
  await waitForAnimation(100)

  for (let i = 0; i < 24; i++) {
    window.v.setView({ azimuth: Math.PI / 12, polar: 0 }, false)
    window.v.getRenderer().resetPipeline(true)
    /** Not sure what the frame time when running pupeteer is, but it's not 16ms.
     *  That's why we're allowing more time between frames than probably needed
     *  In a future update, we'll have the viewer signal when convergence is complete
     *  regradless of how many frames/time that takes
     */
    /** 22.11.2022 Alex: Commenting this out for now */
    // await waitForAnimation(2500)
    await waitForAnimation()
    ret.scr[i + ''] = await window.v.screenshot()
  }

  ret.duration = (Date.now() - t0) / 1000
  ret.mem = {
    total: performance.memory.totalJSHeapSize,
    used: performance.memory.usedJSHeapSize
  }
  ret.userAgent = navigator.userAgent
  return ret
}

async function getScreenshot(objectUrl, boundLogger = logger) {
  const launchParams = {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  }
  // if ( process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD === 'true' ) {
  //   launchParams.executablePath = 'chromium'
  // }
  const browser = await puppeteer.launch(launchParams)
  const page = await browser.newPage()

  const wrapperPromise = (async () => {
    await page.goto('http://127.0.0.1:3001/render/')

    boundLogger.info('Page loaded')

    // Handle page crash (oom?)
    page.on('error', (err) => {
      throw err
    })
    return await page.evaluate(pageFunction, objectUrl)
  })()

  let ret = null
  try {
    ret = await wrapperPromise
  } catch (err) {
    boundLogger.error(err, 'Error generating preview.')
    ret = {
      error: err
    }
  }

  // Don't await for cleanup
  browser.close()

  if (ret.error) {
    return null
  }

  boundLogger.info(
    {
      durationSeconds: ret.duration,
      totalMemoryMB: ret.mem.total / 1000000
    },
    `Generated preview.`
  )
  return ret.scr

  // return `
  // <html><body>
  // <div>Generated by: ${ret.userAgent}</div>
  // <div>Duration in seconds: ${ret.duration}</div>
  // <div>Memory in MB: ${ret.mem.total / 1000000}</div>
  // <div>Used Memory in MB: ${ret.mem.used / 1000000}</div>
  // <img height="200px" src="${ret.scr['-2']}" /><br />
  // <img height="200px" src="${ret.scr['-1']}" /><br />
  // <img height="200px" src="${ret.scr['0']}" /><br />
  // <img height="200px" src="${ret.scr['1']}" /><br />
  // <img height="200px" src="${ret.scr['2']}" /><br />
  // </body></html>
  // `

  // const imageBuffer = new Buffer.from(
  //   b64Image.replace(/^data:image\/\w+;base64,/, ''),
  //   'base64'
  // )

  // // await page.waitForTimeout(500);
  // //var response = await page.screenshot({
  // //  type: 'png',
  // //  clip: {x: 0, y: 0, width: 800, height: 800}
  // //});

  // return imageBuffer
}

router.get('/:streamId/:objectId', async function (req, res) {
  const safeParamRgx = /^[\w]+$/i
  const { streamId, objectId } = req.params || {}
  const boundLogger = logger.child({ streamId, objectId })
  if (!safeParamRgx.test(streamId) || !safeParamRgx.test(objectId)) {
    return res.status(400).json({ error: 'Invalid streamId or objectId!' })
  }

  const objectUrl = `http://127.0.0.1:3001/streams/${req.params.streamId}/objects/${req.params.objectId}`
  /*
  let authToken = ''
  let authorizationHeader = req.header( 'Authorization' )
  if ( authorizationHeader && authorizationHeader.toLowerCase().startsWith( 'bearer ' ) ) {
    authToken = authorizationHeader.Substring( 'Bearer '.Length ).Trim()
  }
  // useful for testing (not the recommended way of passing the auth token)
  if ( req.query.authToken ) {
    authToken = req.query.authToken
  }
  */

  boundLogger.info('Requesting screenshot.')

  const scr = await getScreenshot(objectUrl, boundLogger)

  if (!scr) {
    return res.status(500).end()
  }

  // res.setHeader( 'content-type', 'image/png' )
  res.send(scr)
})

module.exports = router
