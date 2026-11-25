'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import qrcode from 'qrcode-generator';
import { PC_SUBJECTS, type PcSubject } from '@/lib/pc-access/catalog';
import './pc-plan.css';

type Pairing = { token: string; expiresAt: string; image: string };
type Status = 'waiting' | 'approved' | 'expired' | 'linked';

async function webRequest(body: object) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  const fallback = '구매 연동 서버에 연결하지 못했어요. 잠시 뒤에 다시 시도해 주세요.';
  const response = await fetch('/api/pc-access/web', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    signal: controller.signal,
  }).then(async result => ({ ok: result.ok, data: await result.json() }))
    .catch(() => null)
    .finally(() => clearTimeout(timeout));
  if (!response || !response.data || typeof response.data !== 'object') throw new Error(fallback);
  if (!response.ok) throw new Error(typeof response.data.error === 'string' ? response.data.error : fallback);
  return response.data;
}

export default function PcLecturePlan({ subject, loggedIn, account, pro, linkingAvailable }: {
  subject: PcSubject; loggedIn: boolean; account: string | null; pro: boolean; linkingAvailable: boolean;
}) {
  const name = PC_SUBJECTS[subject].title;
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const [pairing, setPairing] = useState<Pairing | null>(null);
  const [status, setStatus] = useState<Status>('waiting');
  const [now, setNow] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const requestVersion = useRef(0);

  async function start() {
    const version = ++requestVersion.current;
    setBusy(true);
    setError('');
    setPairing(null);
    setStatus('waiting');
    try {
      const data = await webRequest({ action: 'start', subject });
      if (requestVersion.current !== version) {
        void webRequest({ action: 'cancel', token: data.token }).catch(() => {});
        return;
      }
      const qr = qrcode(0, 'M');
      qr.addData(`bomgichul:pc-pro:v1:${data.token}`);
      qr.make();
      setNow(Date.now());
      setPairing({ ...data, image: qr.createDataURL(6, 24) });
    } catch (cause) {
      if (requestVersion.current === version) setError((cause as Error).message);
    } finally {
      if (requestVersion.current === version) setBusy(false);
    }
  }

  function onClose() {
    requestVersion.current += 1;
    if (pairing && status !== 'linked') void webRequest({ action: 'cancel', token: pairing.token }).catch(() => {});
    setPairing(null);
    setBusy(false);
  }

  const token = pairing?.token;
  const deadline = pairing?.expiresAt;
  useEffect(() => {
    if (!token || !deadline || status !== 'waiting') return;
    let closed = false;
    let inFlight = false;
    const poll = async () => {
      if (inFlight) return;
      inFlight = true;
      try {
        const data = await webRequest({ action: 'status', token });
        if (!closed) { setStatus(data.status); setError(''); }
      } catch (cause) {
        if (!closed) setError((cause as Error).message);
      } finally { inFlight = false; }
    };
    const timer = window.setInterval(() => void poll(), 3000);
    return () => { closed = true; window.clearInterval(timer); };
  }, [token, deadline, status]);

  useEffect(() => {
    if (!deadline || status === 'expired' || status === 'linked') return;
    const timer = window.setInterval(() => {
      const time = Date.now();
      setNow(time);
      if (time >= Date.parse(deadline)) setStatus(value => value === 'linked' ? value : 'expired');
    }, 1000);
    return () => window.clearInterval(timer);
  }, [deadline, status]);

  async function finish() {
    const version = ++requestVersion.current;
    setBusy(true);
    setError('');
    try {
      await webRequest({ action: 'finish', token });
      if (requestVersion.current === version) { setStatus('linked'); router.refresh(); }
    } catch (cause) {
      if (requestVersion.current === version) setError((cause as Error).message);
    } finally {
      if (requestVersion.current === version) setBusy(false);
    }
  }

  const seconds = deadline ? Math.max(0, Math.ceil((Date.parse(deadline) - now) / 1000)) : 0;
  const login = `/login?next=${encodeURIComponent(`/police/lectures/${subject}#police-pc-plan`)}`;
  return <section id="police-pc-plan" className="pc-plan" aria-labelledby="pc-plan-title">
    <div className="pc-plan-top">
      <h2 id="pc-plan-title">{name} 이용 플랜</h2>
      {account && <p>{account} {pro && <span className="pc-plan-badge">✓ Pro 이용 중</span>}</p>}
    </div>
    <div className="pc-plan-options">
      <div className={!pro ? 'pc-plan-option is-current' : 'pc-plan-option'}>
        <div><h3>기본</h3>{!pro && <span>현재</span>}</div>
        <p>첫 3강 무료 수강</p>
      </div>
      <div className={pro ? 'pc-plan-option is-current' : 'pc-plan-option'}>
        <div><h3>Pro</h3>{pro && <span>현재</span>}</div>
        <p>전체 강의와 {name} Pro 기능</p>
      </div>
    </div>
    {!pro && <div className="pc-plan-bottom">
      <p>경찰 앱에서 구매한 과목을 연결하면 PC에서도 Pro를 이용할 수 있어요.</p>
      {linkingAvailable && (loggedIn
        ? <button type="button" className="pc-plan-primary" onClick={() => { dialog.current?.showModal(); void start(); }}>앱 구매 연동</button>
        : <Link className="pc-plan-primary" href={login}>로그인하고 앱 구매 연동</Link>)}
      {!linkingAvailable && <span>앱 구매 연동 준비 중</span>}
    </div>}
    <dialog ref={dialog} className="pc-plan-dialog" aria-labelledby="pc-qr-title" onClose={onClose}>
      <div className="pc-plan-dialog-content">
        <header><div><p>{name} · Pro</p><h2 id="pc-qr-title">앱 구매 연동</h2></div>
          <button type="button" className="pc-plan-close" aria-label="닫기" onClick={() => dialog.current?.close()}>×</button></header>
        {status === 'linked' ? <>
          <p role="status">연결했어요. 홈페이지에서 {name} Pro 기능을 이용할 수 있어요.</p>
          <button type="button" className="pc-plan-primary" onClick={() => dialog.current?.close()}>강의 보기</button>
        </> : status === 'approved' ? <>
          <p role="status">앱에서 구매를 확인했어요. {account}에 연결을 완료하세요.</p>
          <button type="button" className="pc-plan-primary" disabled={busy} onClick={() => void finish()}>연결 완료</button>
        </> : status === 'expired' ? <p role="status">QR이 만료됐어요. 새 QR을 만들어 주세요.</p>
          : pairing ? <>
            <p>경찰 앱에서 같은 과목을 열고 <strong>QR 연동</strong>을 눌러 찍어 주세요.</p>
            {/* Generated locally from the one-time token. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="pc-plan-qr" src={pairing.image} alt={`${name} Pro 연결 QR 코드`} width={232} height={232}/>
            <p className="pc-plan-clock" aria-label="QR 유효 시간">{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</p>
          </> : busy ? <p role="status">QR을 만드는 중이에요…</p> : null}
        {error && <p className="pc-plan-error" role="alert">{error}</p>}
        {!busy && (status === 'expired' || (error && status !== 'linked')) &&
          <button type="button" className="pc-plan-secondary" onClick={() => void start()}>새 QR 만들기</button>}
      </div>
    </dialog>
  </section>;
}
