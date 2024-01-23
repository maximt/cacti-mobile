import { LocalStorageMock, CactiMock } from './mocks'
import { FAKE_TOKEN, HOSTS } from './fixture'
import createApp from "../src/app"
import { STATUS_ERROR_NO, STATUS_NETWORK_ERROR, HOST_UP, HOST_DOWN } from '../src/constants'


test('Test App update method', async () => {
    const storageMock = new LocalStorageMock()
    storageMock.setItem('token', FAKE_TOKEN)

    const cactiMock = new CactiMock()
    cactiMock.setFakeResponse({
        message: STATUS_ERROR_NO,
        'hosts': HOSTS
    })

    const app = createApp(cactiMock, storageMock)
    await app.update()

    const HOSTS_COUNT = 3
    const HOSTS_UP_COUNT = 2
    const HOSTS_DOWN_COUNT = 1

    expect(app.message).toEqual('')
    expect(app.hosts).toHaveLength(HOSTS_COUNT)
    expect(app.countTotalHosts).toEqual(HOSTS_COUNT)
    expect(app.countUpHosts).toEqual(HOSTS_UP_COUNT)
    expect(app.countDownHosts).toEqual(HOSTS_DOWN_COUNT)
})

test('Test App no data received', async () => {
    const storageMock = new LocalStorageMock()
    storageMock.setItem('token', FAKE_TOKEN)

    const cactiMock = new CactiMock()
    cactiMock.setFakeResponse(null)

    const app = createApp(cactiMock, storageMock)
    await app.update()

    expect(app.message).toEqual(STATUS_NETWORK_ERROR)
})

test('Test App sorting', async () => {
    const storageMock = new LocalStorageMock()
    storageMock.setItem('token', FAKE_TOKEN)

    const cactiMock = new CactiMock()
    cactiMock.setFakeResponse({
        message: STATUS_ERROR_NO,
        'hosts': HOSTS
    })

    const app = createApp(cactiMock, storageMock)
    await app.update()
    app.sort('description')

    const HOSTS_COUNT = 3

    expect(app.message).toEqual('')
    expect(app.hosts).toHaveLength(HOSTS_COUNT)

    expect(app.hosts[0].status).toBe(HOST_DOWN)
    expect(app.hosts[0].description).toEqual('Router-3')

    expect(app.hosts[1].status).toBe(HOST_UP)
    expect(app.hosts[1].description).toEqual('Router-1')

    expect(app.hosts[2].status).toBe(HOST_UP)
    expect(app.hosts[2].description).toEqual('Router-2')
})

test('Test App filtering by query', async () => {
    const storageMock = new LocalStorageMock()
    storageMock.setItem('token', FAKE_TOKEN)

    const cactiMock = new CactiMock()

    cactiMock.setFakeResponse({
        message: STATUS_ERROR_NO,
        'hosts': HOSTS
    })

    const app = createApp(cactiMock, storageMock)
    await app.update()
    app.hostFilterQuery = 'Router-2'
    const filtered = app.filterHosts()

    const HOSTS_COUNT = 3
    const HOSTS_COUNT_FILTERED = 1

    expect(app.message).toEqual('')
    expect(app.hosts).toHaveLength(HOSTS_COUNT)
    expect(filtered).toHaveLength(HOSTS_COUNT_FILTERED)
    expect(app.countTotalHosts).toEqual(HOSTS_COUNT)
    expect(app.countFilteredHosts).toEqual(HOSTS_COUNT_FILTERED)
})

test('Test App filtering by downOnly ', async () => {
    const storageMock = new LocalStorageMock()
    storageMock.setItem('token', FAKE_TOKEN)

    const cactiMock = new CactiMock()
    cactiMock.setFakeResponse({
        message: STATUS_ERROR_NO,
        'hosts': HOSTS
    })

    const app = createApp(cactiMock, storageMock)
    await app.update()
    app.hostDownOnly = true
    const filtered = app.filterHosts()

    const HOSTS_COUNT = 3
    const HOSTS_COUNT_FILTERED = 1

    expect(app.message).toEqual('')
    expect(app.hosts).toHaveLength(HOSTS_COUNT)
    expect(filtered).toHaveLength(HOSTS_COUNT_FILTERED)
    expect(filtered[0].status).toEqual(HOST_DOWN)
    expect(app.countTotalHosts).toEqual(HOSTS_COUNT)
    expect(app.countFilteredHosts).toEqual(HOSTS_COUNT_FILTERED)
})
