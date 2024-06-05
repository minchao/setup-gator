import * as core from '@actions/core'
import * as httpm from '@actions/http-client'
import * as os from 'os'
import * as tc from '@actions/tool-cache'

export async function download(
  toolName: string,
  version: string
): Promise<string> {
  let cachedPath = tc.find(toolName, version)
  if (cachedPath) {
    core.info(`Found in cache ${cachedPath}`)
    return cachedPath
  }

  core.info(`Attempting to download ${version}`)
  const downloadURL = getDownloadURL(toolName, version)
  core.info(`Downloading ${downloadURL}`)

  const downloadPath = await tc.downloadTool(downloadURL)
  core.info(`Downloaded to ${downloadPath}`)

  const extractedDir = await extractArchive(downloadPath)
  core.info(`Extracted to ${extractedDir}`)

  core.info('Adding to the cache')
  cachedPath = await tc.cacheDir(extractedDir, toolName, version)

  core.info(`Cached to ${cachedPath}`)
  return cachedPath
}

function getArchitecture(): string {
  const arch = os.arch()
  switch (arch) {
    case 'arm64': {
      return arch
    }
    case 'x64': {
      return 'amd64'
    }
    default: {
      throw new Error(`Unsupported architecture: ${arch}`)
    }
  }
}

function getDownloadURL(toolName: string, version: string): string {
  const baseURL =
    'https://github.com/open-policy-agent/gatekeeper/releases/download/'
  const arch = getArchitecture()

  switch (os.type()) {
    case 'Darwin':
      return `${baseURL}${version}/${toolName}-${version}-darwin-${arch}.tar.gz`
    case 'Linux':
      return `${baseURL}${version}/${toolName}-${version}-linux-${arch}.tar.gz`
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
