"use client";
import { useEffect, useState } from "react";

const PLATFORMS = [
  { id: "9:16", title: "شارٹ / ریل", sub: "TikTok · Shorts · Reels", size: "1080×1920", box: "h-16 w-9" },
  { id: "16:9", title: "لانگ ویڈیو", sub: "YouTube Long", size: "1920×1080", box: "h-9 w-16" },
  { id: "1:1", title: "اسکوائر", sub: "Instagram Post", size: "1080×1080", box: "h-12 w-12" },
];

export default function VideoStudio() {
  const [aspectRatio, setAspect] = useState(null);
  const [script, setScript] = useState("");
  const [job, setJob] = useState(null); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);

  // resume an in-progress video after refresh
  useEffect(() => { const id = localStorage.getItem("jobId"); if (id) setJob({ id, status: "queued", progress: 0 }); }, []);

  useEffect(() => {
    if (!job || ["done", "failed"].includes(job.status)) return;
    const poll = async () => {
      const r = await fetch("/api/jobs/" + job.id);
      if (r.status === 404) { localStorage.removeItem("jobId"); return setJob(null); }
      if (r.ok) setJob(await r.json());
    };
    poll(); const t = setInterval(poll, 3000);
    return () => clearInterval(t);
  }, [job?.id, job?.status]);

  async function generate() {
    setBusy(true); setErr("");
    const r = await fetch("/api/generate", { method: "POST", body: JSON.stringify({ script, aspect: aspectRatio }) });
    const j = await r.json(); setBusy(false);
    if (!r.ok) return setErr(j.error || "خرابی");
    localStorage.setItem("jobId", j.jobId);
    setJob({ id: j.jobId, status: "queued", progress: 0 });
  }
  async function download() {
    const blob = await (await fetch(job.video_url)).blob();
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `video-${Date.now()}.mp4`; a.click();
  }
  const reset = () => { localStorage.removeItem("jobId"); setJob(null); setScript(""); };

  return (
    <main className="mx-auto max-w-xl space-y-6 p-5 pb-16">
      <header><h1 className="text-2xl font-bold">ویڈیو اسٹوڈیو</h1></header>

      {!aspectRatio && !job && (<section className="space-y-4">
        <h2 className="text-xl">ویڈیو کس کے لیے بنانی ہے؟</h2>
        {PLATFORMS.map((p) => (
          <button key={p.id} onClick={() => setAspect(p.id)} className="flex w-full items-center gap-5 rounded-3xl border border-line bg-panel p-5 text-right active:scale-[.98]">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-ink"><div className={`${p.box} rounded-md border-2 border-saffron`} /></div>
            <div><div className="text-2xl font-bold">{p.title}</div><div dir="ltr" className="text-mist">{p.sub} · {p.size}</div></div>
          </button>))}
      </section>)}

      {aspectRatio && !job && (<section className="space-y-4">
        <button onClick={() => setAspect(null)} className="text-mist underline">← فارمیٹ بدلیں ({aspectRatio})</button>
        <textarea className="input min-h-[260px] text-lg leading-loose" maxLength={2000} value={script} onChange={(e) => setScript(e.target.value)}
          placeholder="اپنی مکمل سکرپٹ یہاں پیسٹ کریں (اردو / ہندی)" />
        {err && <p className="rounded-xl bg-red-500/15 p-3 text-red-300">{err}</p>}
        <button className="btn w-full" disabled={busy || script.trim().length < 10} onClick={generate}>ویڈیو بنائیں</button>
      </section>)}

      {job && !["done", "failed"].includes(job.status) && (<section className="space-y-4 rounded-3xl border border-line bg-panel p-6 text-center">
        <p className="text-xl">ویڈیو بن رہی ہے… {job.progress || 0}%</p>
        <div className="h-3 overflow-hidden rounded-full bg-ink"><div className="h-full bg-saffron transition-all" style={{ width: `${job.progress || 3}%` }} /></div>
        <p className="text-sm text-mist">عموماً 3 سے 8 منٹ لگتے ہیں۔ صفحہ ری فریش ہو جائے تو بھی ویڈیو جاری رہتی ہے۔</p>
      </section>)}

      {job?.status === "failed" && (<section className="space-y-4"><p className="rounded-xl bg-red-500/15 p-4 text-red-300">ویڈیو نہیں بن سکی: {job.error}</p>
        <button className="btn w-full" onClick={reset}>دوبارہ کوشش کریں</button></section>)}

      {job?.status === "done" && (<section className="space-y-4">
        <video src={job.video_url} controls playsInline className="mx-auto max-h-[70vh] w-full rounded-2xl bg-black" />
        <button className="btn w-full py-5 text-2xl" onClick={download}>گیلری میں ڈاؤن لوڈ کریں</button>
        <button className="w-full text-mist underline" onClick={reset}>نئی ویڈیو بنائیں</button>
      </section>)}
    </main>
  );
}
