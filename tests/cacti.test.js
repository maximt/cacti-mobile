import fetchMock from "jest-fetch-mock"
import {
    TEXT_OK,
    TEXT_NOT_AUTH,
    FAKE_TOKEN,
    TEXT_LOGIN_FAILED,
    TEXT_SUCCESS_LOGIN
} from './fixture'
import Cacti from "../src/cacti"
import { STATUS_ERROR_NO, STATUS_NETWORK_ERROR, STATUS_NOT_AUTHORIZED } from "../src/constants"


fetchMock.enableMocks()

beforeEach(() => {
    fetch.mockClear()
})

afterAll(() => {
    jest.restoreAllMocks();
});

test('Test fetching good data from server', async () => {
    fetch.mockResponseOnce(TEXT_OK)

    const cacti = new Cacti()
    cacti.setUrl('foo')
    cacti.setToken('bar')

    const data = await cacti.getHosts()

    expect(fetch).toHaveBeenCalled()
    expect(data.message).toEqual(STATUS_ERROR_NO)
    expect(data.hosts).toHaveLength(3);
})

test('Test fetching bad auth', async () => {
    fetch.mockResponseOnce(TEXT_NOT_AUTH)

    const cacti = new Cacti()
    cacti.setUrl('foo')
    cacti.setToken('bar')

    const data = await cacti.getHosts()

    expect(fetch).toHaveBeenCalled()
    expect(data.message).toEqual(STATUS_NOT_AUTHORIZED)
})

test('Test no data from server', async () => {
    fetch.mockResponseOnce('')

    const cacti = new Cacti()
    cacti.setUrl('foo')
    cacti.setToken('bar')

    const data = await cacti.getHosts()

    expect(fetch).toHaveBeenCalled()
    expect(data.message).toEqual(STATUS_NETWORK_ERROR)
})

test('Test success login', async () => {
    fetch.mockResponseOnce(TEXT_SUCCESS_LOGIN)

    const cacti = new Cacti()
    cacti.setUrl('foo')

    const data = await cacti.login('bar', 'baz')

    expect(fetch).toHaveBeenCalled()
    expect(data.token).toEqual(FAKE_TOKEN)
})

test('Test login failed', async () => {
    fetch.mockResponseOnce(TEXT_LOGIN_FAILED)

    const cacti = new Cacti()
    cacti.setUrl('foo')

    const data = await cacti.login('bar', 'baz')

    expect(fetch).toHaveBeenCalled()
    expect(data.message).toEqual(STATUS_NOT_AUTHORIZED)
    expect(data.token).toBeFalsy()
})

test('Test login no response', async () => {
    fetch.mockResponseOnce('')

    const cacti = new Cacti()
    cacti.setUrl('foo')

    const data = await cacti.login('bar', 'baz')

    expect(fetch).toHaveBeenCalled()
    expect(data.message).toEqual(STATUS_NETWORK_ERROR)
    expect(data.token).toBeFalsy()
})