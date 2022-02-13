import nock from 'nock'

import {getLatestVersion} from '../src/util'

describe('get the latest version', () => {
  let mock: nock.Interceptor

  beforeEach(() => {
    mock = nock('https://api.github.com').get(
      '/repos/open-policy-agent/gatekeeper/releases/latest'
    )
  })

  it('should be ok', async () => {
    mock.reply(200, {
      tag_name: 'v3.7.1'
    })

    const version = await getLatestVersion()

    expect(version).toBe('v3.7.1')
  })

  it('should throw an error if github response invalid json', async () => {
    mock.reply(200, 'invalid-json')

    await expect(getLatestVersion()).rejects.toThrow(
      'Failed to parse latest version'
    )
  })

  it('should throw an error if github response invalid version', async () => {
    mock.reply(200, {tag_name: 'invalid-version'})

    await expect(getLatestVersion()).rejects.toThrow(
      'Latest version is not a valid version'
    )
  })

  it('should throw an error if github response 404', async () => {
    mock.reply(404, {})

    await expect(getLatestVersion()).rejects.toThrow(
      'Failed to get latest version'
    )
  })
})
