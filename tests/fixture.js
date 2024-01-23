export const TEXT_NOT_AUTH =
    `{
        "message":"NOT_AUTHORIZED",
        "hosts":[]
    }`

export const TEXT_OK =
    `{
        "message":"",
        "hosts":[
            {"id":2,"hostname":"192.168.1.1","description":"Router-1","status":1},
            {"id":3,"hostname":"192.168.1.2","description":"Router-2","status":1},
            {"id":6,"hostname":"192.168.1.3","description":"Switch-1","status":3}
        ]
    }`

export const HOSTS = [{
    "id": "2",
    "hostname": "192.168.1.1",
    "description": "Router-3",
    "status": "1"
},
{
    "id": "3",
    "hostname": "192.168.1.2",
    "description": "Router-2",
    "status": "3"
},
{
    "id": "6",
    "hostname": "192.168.1.3",
    "description": "Router-1",
    "status": "3"
}
]

export const TEXT_SUCCESS_LOGIN =
    `{
        "message":"",
        "token":"test_token"
    }`

export const TEXT_LOGIN_FAILED =
    `{
        "message":"NOT_AUTHORIZED",
        "token":""
    }`
    
export const FAKE_TOKEN = 'test_token'
