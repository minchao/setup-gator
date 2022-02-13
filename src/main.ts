import * as core from '@actions/core'
import * as io from '@actions/io'
import {download, getLatestVersion} from './util'
import cp from 'child_process'

const toolName = 'gator'

async function run(): Promise<void> {
  try {
    let version = core.getInput('version', {required: true})
    if (version.toLocaleLowerCase() === 'latest') {
      version = await getLatestVersion()
    }

    const cachedPath = await download(toolName, version)
    core.addPath(cachedPath)

    core.info(
      `${toolName} version: '${version}' has been installed at ${cachedPath}`
    )
    core.setOutput(`${toolName}-path`, cachedPath)

    const toolPath = await io.which(toolName)
    const toolVersion = (cp.execSync(`${toolPath} --version`) || '').toString()
    core.info(toolVersion)
  } catch (error) {
    core.setFailed(error as Error)
  }
}

run()
