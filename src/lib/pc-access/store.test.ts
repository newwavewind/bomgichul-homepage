import { generateKeyPairSync } from 'node:crypto';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
import { digest, pcTesterAllowed, verifyStorePurchase } from './store';

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe('과목별 스토어 구매 확인', () => {
  it('앱, 과목, 실서버, 거래 번호와 환불 상태가 맞는 Apple 구매만 인정한다', async () => {
    const { privateKey } = generateKeyPairSync('ec', { namedCurve: 'P-256' });
    vi.stubEnv('POLICE_APPLE_IAP_ISSUER_ID', 'test-issuer');
    vi.stubEnv('POLICE_APPLE_IAP_KEY_ID', 'test-key');
    vi.stubEnv('POLICE_APPLE_IAP_PRIVATE_KEY', privateKey.export({ type: 'pkcs8', format: 'pem' }).toString().replaceAll('\n', '\\n'));
    const original = {
      transactionId: '12345', originalTransactionId: '99999', bundleId: 'com.sanghyun.police',
      productId: 'premium_unlock_constitution', environment: 'Production', type: 'Non-Consumable',
      inAppOwnershipType: 'PURCHASED',
    };
    const response = (override = {}) => {
      const body = Buffer.from(JSON.stringify({ ...original, ...override })).toString('base64url');
      return Response.json({ signedTransactionInfo: `header.${body}.signature` });
    };
    const fetchStore = vi.fn()
      .mockImplementationOnce(async () => response())
      .mockImplementationOnce(async () => response({ environment: 'Sandbox' }))
      .mockImplementationOnce(async () => response({ revocationDate: 1500000000000 }))
      .mockImplementationOnce(async () => response({ productId: 'premium_unlock_criminal_law' }))
      .mockImplementationOnce(async () => Response.json({}, { status: 503 }));
    vi.stubGlobal('fetch', fetchStore);
    const verify = () => verifyStorePurchase('ios', '12345', 'constitution');
    await expect(verify()).resolves.toEqual({ key: digest('com.sanghyun.police:ios:99999'), platform: 'ios', proof: '12345' });
    await expect(verify()).resolves.toBeNull();
    await expect(verify()).resolves.toBeNull();
    await expect(verify()).resolves.toBeNull();
    await expect(verify()).rejects.toThrow('App Store verification unavailable');
    expect(fetchStore.mock.calls[0][0]).toBe('https://api.storekit.apple.com/inApps/v1/transactions/12345');
    expect(fetchStore.mock.calls[0][1].headers.Authorization).toMatch(/^Bearer [^.]+\.[^.]+\.[^.]+$/);
  });

  it('실결제 완료된 Google Play 과목만 인정한다', async () => {
    const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
    vi.stubEnv('POLICE_PLAY_SERVICE_ACCOUNT_JSON', JSON.stringify({
      client_email: 'test@example.invalid', private_key: privateKey.export({ type: 'pkcs8', format: 'pem' }),
    }));
    const proof = '12345678901234567890.test-token';
    const active = {
      orderId: 'example-order', purchaseStateContext: { purchaseState: 'PURCHASED' },
      productLineItem: [{ productId: 'premium_unlock_police_science' }],
    };
    vi.stubGlobal('fetch', vi.fn()
      .mockImplementationOnce(async () => Response.json({ access_token: 'test', expires_in: 3600 }))
      .mockImplementationOnce(async () => Response.json(active))
      .mockImplementationOnce(async () => Response.json({ ...active, testPurchaseContext: {} }))
      .mockImplementationOnce(async () => Response.json({ ...active, purchaseStateContext: { purchaseState: 'PENDING' } })));
    const verify = () => verifyStorePurchase('android', proof, 'police-science');
    await expect(verify()).resolves.toEqual({ key: digest(`com.sanghyun.police:android:${proof}`), platform: 'android', proof });
    await expect(verify()).resolves.toBeNull();
    await expect(verify()).resolves.toBeNull();
  });

  it('지정한 확인된 계정의 TestFlight 구매를 공인중개사 과목과 분리된 키로 검증한다', async () => {
    const email = 'qa@example.invalid';
    vi.stubEnv('BOMGICHUL_PC_TEST_EMAIL_SHA256', digest(email));
    expect(pcTesterAllowed({ email })).toBe(false);
    expect(pcTesterAllowed({ email: 'other@example.invalid', email_confirmed_at: '2026-11-25' })).toBe(false);
    expect(pcTesterAllowed({ email: email.toUpperCase(), email_confirmed_at: '2026-11-25' })).toBe(true);

    const { privateKey } = generateKeyPairSync('ec', { namedCurve: 'P-256' });
    vi.stubEnv('POLICE_APPLE_IAP_ISSUER_ID', 'test-issuer');
    vi.stubEnv('POLICE_APPLE_IAP_KEY_ID', 'test-key');
    vi.stubEnv('POLICE_APPLE_IAP_PRIVATE_KEY', privateKey.export({ type: 'pkcs8', format: 'pem' }).toString());
    const original = {
      transactionId: '12345', originalTransactionId: '99999', bundleId: 'com.sanghyun.civillaw',
      productId: 'premium_unlock', environment: 'Sandbox', type: 'Non-Consumable', inAppOwnershipType: 'PURCHASED',
    };
    const fetchStore = vi.fn(async (_url: string) => Response.json({
      signedTransactionInfo: `header.${Buffer.from(JSON.stringify(original)).toString('base64url')}.signature`,
    }));
    vi.stubGlobal('fetch', fetchStore);
    await expect(verifyStorePurchase('ios', '12345', 'civillaw')).resolves.toBeNull();
    await expect(verifyStorePurchase('ios', '12345', 'constitution', 'sandbox')).resolves.toBeNull();
    await expect(verifyStorePurchase('ios', '12345', 'civillaw', 'sandbox')).resolves.toEqual({
      key: digest('com.sanghyun.civillaw:ios:sandbox:99999'), platform: 'ios', proof: '12345', environment: 'sandbox',
    });
    expect(fetchStore.mock.calls.at(-1)?.[0]).toBe('https://api.storekit-sandbox.apple.com/inApps/v1/transactions/12345');
  });
});
