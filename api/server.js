const express = require('express')
const debug = require('debug')
const FlatMultiFileStore = require('rdf-store-fs/FlatMultiFileStore')
const hydraBox = require('hydra-box/middleware')
const Api = require('hydra-box/Api')
const ResourceStore = require('./lib/ResourceStore')

const log = debug('hydra-fullstack')
const defaultIRI = 'http://localhost:9000/'
const baseIRI = process.env.BASE_IRI || defaultIRI
const port = process.env.PORT || 9000

async function main () {
  log('Starting API')

  const store = new FlatMultiFileStore({
    baseIRI,
    path: 'store'
  })

  log('Loading ApiDocumentation')
  const api = await Api.fromFile('api/api.ttl', {
    path: '/api',
    codePath: __dirname
  })

  api.replaceIRI(defaultIRI, baseIRI)

  const app = express()
  app.locals.store = new ResourceStore({ quadStore: store })
  app.use(hydraBox(api, store))
  app.listen(port, '0.0.0.0')

  log(`API listening at port ${port}`)
}

main()
