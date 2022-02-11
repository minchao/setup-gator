import * as core from '@actions/core'
import * as path from 'path'

import {download, getLatestVersion} from './util'

const toolName = 'gator'

async function run(): Promise<void> {
  let version = core.getInput('version', {required: true})
  if (version.toLocaleLowerCase() === 'latest') {
    version = await getLatestVersion()
  }

  const cachePatch = await download(toolName, version)
  core.addPath(path.dirname(cachePatch))

  core.debug(`gator version: '${version}' has been installed at ${cachePatch}`)
  core.setOutput('gator-path', cachePatch)
}

run()
