import * as core from '@actions/core'
import * as fs from 'fs'
import * as httpm from '@actions/http-client'
import * as os from 'os'
import * as path from 'path'
import * as tc from '@actions/tool-cache'

export async function download(
  toolName: string,
  version: string
): Promise<string> {
  let cachedToolPath = tc.find(toolName, version)
  let downloadPath = ''
  let filePath = ''
  if (cachedToolPath === '') {
    try {
      const source = getDownloadURL(toolName, version)
      core.info(`Downloading ${source}`)

      downloadPath = await tc.downloadTool(source)
      core.info(`Downloaded to ${downloadPath}`)

      const extDirPath = await extractArchive(downloadPath)
      core.info(`Extracted to ${extDirPath}`)

      filePath = `${filePath}/${toolName}`
    } catch (e) {
      throw new Error('Failed to download')
    }

    cachedToolPath = await tc.cacheFile(filePath, toolName, toolName, version)
  }

  const toolPath = path.join(cachedToolPath, toolName)
  fs.chmodSync(toolPath, '777')
  return toolPath
}

function getDownloadURL(toolName: string, version: string): string {
  const baseURL =
    'https://github.com/open-policy-agent/gatekeeper/releases/download/'

  const arch = os.arch()
  if (arch !== 'x64') {
    throw new Error(`Unsupported architecture: ${arch}`)
  }

  switch (os.type()) {
    case 'Darwin':
      return `${baseURL}${version}/${toolName}-${version}-darwin-amd64.tar.gz`
    case 'Linux':
      return `${baseURL}${version}/${toolName}-${version}-linux-amd64.tar.gz`
    default:
      throw new Error(`Unsupported OS: ${os.type()}`)
  }
}

export async function getLatestVersion(): Promise<string> {
  const res = await new httpm.HttpClient('setup-gator').get(
    'https://api.github.com/repos/open-policy-agent/gatekeeper/releases/latest'
  )
  if (res.message.statusCode !== 200) {
    throw new Error(`Failed to get latest version: ${res.message.statusCode}`)
  }

  const body = await res.readBody()
  let releases: {tag_name: string}
  try {
    releases = JSON.parse(body)
  } catch (e) {
    throw new Error(`Failed to parse latest version: ${e}`)
  }
  if (!releases.tag_name.startsWith('v')) {
    throw new Error(
      `Latest version is not a valid version: ${releases.tag_name}`
    )
  }

  return releases.tag_name
}

async function extractArchive(archivePath: string): Promise<string> {
  return await tc.extractTar(archivePath)
}
