/*
Copyright 2020 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const AsyncCryptoStore = require('../src/storage/AsyncCryptoStore');

class MockAsyncStore {
    static data = {};

    static clear() {
        data = {};
    }

    static setItem(k, v) {
        data[k] = v;
        return Promise.resolve();
    }

    static getItem(k) {
        return Promise.resolve(data[k] || null);
    }

    static getAllKeys() {
        return Promise.resolve(Object.keys(data));
    }

    static removeItem(k) {
        delete data[k];
        return Promise.resolve();
    }
}

let asyncCryptoStore;

/*
 * NB. these tests apply equally to any crypto store and could be ported into the js-sdk
 * in general, except for the fact that these tests rely on the functions returning promises
 * thay resolve when they're done. This allows the tests to fail in a sensible way if the
 * impl doesn't call the callback at all.
 */

beforeEach(async () => {
    MockAsyncStore.clear();
    asyncCryptoStore = new AsyncCryptoStore(MockAsyncStore);
});

test('counts number of end to end sessions', async () => {
    await asyncCryptoStore.doTxn('', [], txn => {
        asyncCryptoStore.storeEndToEndSession('adevicekey', 'sess1', 'somedata', txn);
    });

    await asyncCryptoStore.doTxn('', [], txn => {
        asyncCryptoStore.storeEndToEndSession('adevicekey', 'sess2', 'moredata', txn);
    });

    await asyncCryptoStore.doTxn('', [], txn => {
        asyncCryptoStore.countEndToEndSessions(txn, count => {
            expect(count).toEqual(2);
        });
    });
});

test('stores & retrieves end to end sessions', async () => {
    await asyncCryptoStore.doTxn('', [], txn => {
        asyncCryptoStore.storeEndToEndSession('adevicekey', 'sess1', {session: 'somedata'}, txn);
    });

    await asyncCryptoStore.doTxn('', [], txn => {
        asyncCryptoStore.getEndToEndSession('adevicekey', 'sess1', txn, sessionData => {
            expect(sessionData).toEqual({
                deviceKey: 'adevicekey',
                sessionId: 'sess1',
                session: 'somedata',
            });
        });
    });
});

test('stores & retrieves multiple end to end sessions', async () => {
    await asyncCryptoStore.doTxn('', [], txn => {
        asyncCryptoStore.storeEndToEndSession('dev1', 'sess1', {session: 'thisissess1'}, txn);
        asyncCryptoStore.storeEndToEndSession('dev1', 'sess2', {session: 'thisissess2'}, txn);
        asyncCryptoStore.storeEndToEndSession('dev2', 'sess1', {session: 'thisissess1dev2'}, txn);
    });

    await asyncCryptoStore.doTxn('', [], txn => {
        asyncCryptoStore.getEndToEndSessions('dev1', txn, sessions => {
            expect(sessions['sess1']).toEqual({
                deviceKey: 'dev1',
                sessionId: 'sess1',
                session: 'thisissess1',
            });
            expect(sessions['sess2']).toEqual({
                deviceKey: 'dev1',
                sessionId: 'sess2',
                session: 'thisissess2',
            });
            expect(Object.keys(sessions).length).toEqual(2);
        });
    });
});

test('addEndToEndInboundGroupSession adds only the first', async () => {
    await asyncCryptoStore.doTxn('', [], txn => {
        asyncCryptoStore.addEndToEndInboundGroupSession('senderkey1', 'sessid1', 'manydata', txn);
    });
    await asyncCryptoStore.doTxn('', [], txn => {
        asyncCryptoStore.addEndToEndInboundGroupSession('senderkey1', 'sessid1', 'differentdata', txn);
    });

    await asyncCryptoStore.doTxn('', [], txn => {
        asyncCryptoStore.getEndToEndInboundGroupSession('senderkey1', 'sessid1', txn, (sessiondata, withheld) => {
            expect(sessiondata).toEqual('manydata');
        });
    });
});

test('storeEndToEndInboundGroupSession overwrites', async () => {
    await asyncCryptoStore.doTxn('', [], txn => {
        asyncCryptoStore.storeEndToEndInboundGroupSession('senderkey1', 'sessid1', 'manydata', txn);
        asyncCryptoStore.storeEndToEndInboundGroupSession('senderkey1', 'sessid1', 'differentdata', txn);
    });

    await asyncCryptoStore.doTxn('', [], txn => {
        asyncCryptoStore.getEndToEndInboundGroupSession('senderkey1', 'sessid1', txn, (sessiondata, withheld) => {
            expect(sessiondata).toEqual('differentdata');
        });
    });
});

test('getAllEndToEndInboundGroupSessions gets all end to end sessions', async () => {
    await asyncCryptoStore.doTxn('', [], txn => {
        asyncCryptoStore.storeEndToEndInboundGroupSession('senderkey1', 'sessid1', 'beep', txn);
        asyncCryptoStore.storeEndToEndInboundGroupSession('senderkey1', 'sessid2', 'boop', txn);
        asyncCryptoStore.storeEndToEndInboundGroupSession('senderkey2', 'sessid1', 'burp', txn);
    });

    const cb = jest.fn();

    await asyncCryptoStore.doTxn('', [], txn => {
        asyncCryptoStore.getAllEndToEndInboundGroupSessions(txn, cb);
    });

    expect(cb.mock.calls.length).toEqual(4);
    // technically these don't need to be in order
    expect(cb.mock.calls[0][0]).toEqual({senderKey: 'senderkey1', sessionId: 'sessid1', sessionData: 'beep'});
    expect(cb.mock.calls[1][0]).toEqual({senderKey: 'senderkey1', sessionId: 'sessid2', sessionData: 'boop'});
    expect(cb.mock.calls[2][0]).toEqual({senderKey: 'senderkey2', sessionId: 'sessid1', sessionData: 'burp'});
    expect(cb.mock.calls[3][0]).toEqual(null);
});

test('end to end group session keys and values can contain slashes', async () => {
    await asyncCryptoStore.doTxn('', [], txn => {
        asyncCryptoStore.storeEndToEndInboundGroupSession('this/that', 'here/there', 'now/then', txn);
    });

    const cb = jest.fn();
    await asyncCryptoStore.doTxn('', [], txn => {
        asyncCryptoStore.getAllEndToEndInboundGroupSessions(txn, cb);
    });

    expect(cb.mock.calls[0][0]).toEqual({senderKey: 'this/that', sessionId: 'here/there', sessionData: 'now/then'});

    await asyncCryptoStore.doTxn('', [], txn => {
        asyncCryptoStore.getEndToEndInboundGroupSession('this/that', 'here/there', txn, (sessiondata, withheld) => {
            expect(sessiondata).toEqual('now/then');
        });
    });
});

test('stores witheld session data', async () => {
    await asyncCryptoStore.doTxn('', [], txn => {
        asyncCryptoStore.storeEndToEndInboundGroupSession('senderkey1', 'sessid1', 'manydata', txn);
        asyncCryptoStore.storeEndToEndInboundGroupSessionWithheld(
            'senderkey1', 'sessid1', 'withheld_because_i_just_cant_even', txn,
        );
    });

    await asyncCryptoStore.doTxn('', [], txn => {
        asyncCryptoStore.getEndToEndInboundGroupSession('senderkey1', 'sessid1', txn, (sessiondata, withheld) => {
            expect(sessiondata).toEqual('manydata');
            expect(withheld).toEqual('withheld_because_i_just_cant_even');
        });
    });
});

test('stores device data', async () => {
    const theData = {data1: 'suchdata', data2: 'manydata'};

    await asyncCryptoStore.doTxn('', [], txn => {
        asyncCryptoStore.storeEndToEndDeviceData(theData, txn);
    });

    await asyncCryptoStore.doTxn('', [], txn => {
        asyncCryptoStore.getEndToEndDeviceData(txn, devData => {
            expect(devData).toEqual(theData);
        });
    });
});

test('stores end to end rooms', async () => {
    await asyncCryptoStore.doTxn('', [], txn => {
        asyncCryptoStore.storeEndToEndRoom('5', {info: 'bleep'}, txn);
        asyncCryptoStore.storeEndToEndRoom('101', {info: 'bloop'}, txn);
    });

    const cb = jest.fn();
    await asyncCryptoStore.doTxn('', [], txn => {
        asyncCryptoStore.getEndToEndRooms(txn, cb);
    });

    expect(cb.mock.calls[0][0]).toEqual({
        '5': {info: 'bleep'},
        '101': {info: 'bloop'},
    });
});

test('marks and unmarks sessions needing backup', async () => {
    await asyncCryptoStore.doTxn('', [], txn => {
        asyncCryptoStore.storeEndToEndInboundGroupSession('bob', 'one', 'data', txn);
        asyncCryptoStore.storeEndToEndInboundGroupSession('bob', 'two', 'data', txn);
    });

    {
        const numSessionsNeedingBackup = await asyncCryptoStore.countSessionsNeedingBackup();
        expect(numSessionsNeedingBackup).toEqual(0);
        const sessionsNeedingBackup = await asyncCryptoStore.getSessionsNeedingBackup();
        expect(sessionsNeedingBackup).toEqual([]);
    }

    await asyncCryptoStore.markSessionsNeedingBackup([{
        senderKey: 'bob',
        sessionId: 'one',
    }]);

    {
        const numSessionsNeedingBackup = await asyncCryptoStore.countSessionsNeedingBackup();
        expect(numSessionsNeedingBackup).toEqual(1);
        const sessionsNeedingBackup = await asyncCryptoStore.getSessionsNeedingBackup();
        expect(sessionsNeedingBackup).toEqual([{
            senderKey: 'bob',
            sessionId: 'one',
            sessionData: 'data',
        }]);
    }

    await asyncCryptoStore.unmarkSessionsNeedingBackup([{
        senderKey: 'bob',
        sessionId: 'one',
    }]);

    {
        const numSessionsNeedingBackup = await asyncCryptoStore.countSessionsNeedingBackup();
        expect(numSessionsNeedingBackup).toEqual(0);
        const sessionsNeedingBackup = await asyncCryptoStore.getSessionsNeedingBackup();
        expect(sessionsNeedingBackup).toEqual([]);
    }
});

test('stores & retrieves account', async () => {
    await asyncCryptoStore.doTxn('', [], txn => {
        asyncCryptoStore.storeAccount(txn, {thingy: 'thingamabob'});
    });

    const cb = jest.fn();
    await asyncCryptoStore.doTxn('', [], txn => {
        asyncCryptoStore.getAccount(txn, cb);
    });
    expect(cb.mock.calls[0][0]).toEqual({thingy: 'thingamabob'});
});

test('stores & retrieves cross signing keys', async () => {
    await asyncCryptoStore.doTxn('', [], txn => {
        asyncCryptoStore.storeCrossSigningKeys(txn, {thingy: 'thingamabob'});
    });

    const cb = jest.fn();
    await asyncCryptoStore.doTxn('', [], txn => {
        asyncCryptoStore.getCrossSigningKeys(txn, cb);
    });
    expect(cb.mock.calls[0][0]).toEqual({thingy: 'thingamabob'});
});

test('stores & retrieves secret store keys', async () => {
    await asyncCryptoStore.doTxn('', [], txn => {
        asyncCryptoStore.storeSecretStorePrivateKey(txn, 'thekey', 'thesecret');
    });

    const cb = jest.fn();
    await asyncCryptoStore.doTxn('', [], txn => {
        asyncCryptoStore.getSecretStorePrivateKey(txn, cb, 'thekey');
    });
    expect(cb.mock.calls[0][0]).toEqual('thesecret');
});

test('deleteAllData deletes only E2E data', async () => {
    await asyncCryptoStore.doTxn('', [], txn => {
        asyncCryptoStore.storeEndToEndSession('adevicekey', 'sess1', 'somedata', txn);
    });
    await MockAsyncStore.setItem('someOtherData', 'preciousData');

    await asyncCryptoStore.deleteAllData();

    const cb = jest.fn();
    await asyncCryptoStore.doTxn('', [], txn => {
        asyncCryptoStore.getEndToEndSession('adevicekey', 'sess1', txn, cb);
    });
    expect(cb.mock.calls[0][0]).toEqual(null);

    const otherData = await MockAsyncStore.getItem('someOtherData');
    expect(otherData).toEqual('preciousData');
});
