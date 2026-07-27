# Prompt สำหรับ Claude อีกตัว — วิเคราะห์โอกาสทางธุรกิจของ "จ่าใหญ่"

> **วิธีใช้:** เปิด Claude session ใหม่ → แนบไฟล์ `docs/PRODUCT-FEATURES.md` → คัดลอกข้อความในกรอบด้านล่างทั้งหมดไปวาง
> **หมายเหตุ:** ห้ามแนบ `docs/FEATURES.md` (เอกสารเทคนิค 727 บรรทัด) เพราะจะทำให้ analyst หลงไปกับรายละเอียดโค้ด — `PRODUCT-FEATURES.md` คือไฟล์ที่ตัดมาให้แล้ว

---

## 📋 คัดลอกตั้งแต่บรรทัดนี้ลงไป

---

You are a **startup strategy consultant** specializing in B2B SaaS and RegTech in the Thai market. I need you to analyze the commercial opportunity for a product I've built, and I need rigorous thinking — not a generic business-plan template.

## Context

I built a working prototype called **"จ่าใหญ่" (Ja Yai)** — a PDPA (Thai Personal Data Protection Act) tool — for PDPA Hackathon 2026. The full feature inventory is in the attached document **`PRODUCT-FEATURES.md`**. Read it carefully before answering; every capability claim in your analysis must trace back to something actually in that document.

**Current stage:** Working prototype. No backend, no authentication, no real integrations, no paying customers, no users yet.

## ⚠️ Critical distinction you must hold throughout — "Customer" vs "User"

These two are **different people** and I need them analyzed **separately**. Do not merge them.

| Term | นิยาม (ภาษาไทย — ใช้ตามนี้เท่านั้น) | English |
|---|---|---|
| **Customer** | **คนซื้อ solution เราไปใส่แอปเขา** | The firm that buys our solution and embeds/integrates it into their own product. They pay us. |
| **User** | **คนใช้ platform ของ customer** | The end user of our customer's app — the data subject whose personal data is at stake. They do not pay us. |

Every time you discuss a "flow," a "journey," a "need," or a "pain point," **state explicitly whether you mean the Customer or the User.** If a claim applies to both, say so and explain how it differs for each.

## The central strategic tension (I want your honest read on this)

**I want to build a B2B business.** But read the feature doc closely: the prototype as built is shaped like a **consumer-facing app** — an individual opens it and sees their own personal data across many organizations. Meanwhile, some features (particularly the consent card deck in Feature 5, and the DSR tracking in Feature 4) are things an **organization** needs in order to comply with the law.

So the features do not all point at the same buyer. I need you to resolve this, not paper over it. Be direct if you think part of the product doesn't fit a B2B model, or if the strongest opportunity is a subset of the features rather than all six.

---

## Your tasks

### Task 1 — Opportunity assessment

- What is the actual, specific problem being solved, and **whose** problem is it — the Customer's or the User's? (These may be different problems entirely.)
- How urgent and how expensive is that problem for a Thai organization today? What makes an organization act *now* rather than later? (PDPA enforcement reality, penalties, complaints, audits, reputational events, procurement requirements.)
- Market context in Thailand: who else solves this, what do they charge, what do they not do? Include both direct competitors (consent management platforms, PDPA compliance vendors) and the status-quo alternative (in-house build, law firm, doing nothing).
- What is genuinely differentiated here versus what is table stakes? Be honest — call out anything that is easily copied.

### Task 2 — Target customer definition (B2B)

- **Which specific firms should we sell to?** Not "companies that handle personal data" — I need real segmentation: industry, company size, tech maturity, and *why that segment specifically*.
- Rank the segments and justify the ranking. Which is the **beachhead** — the first segment to win — and why that one before the others?
- For the top segments, identify:
  - **Who is the economic buyer** (who controls budget)
  - **Who is the champion** (who feels the pain daily — DPO? Legal? CTO? Head of Product? Compliance?)
  - **Who can block the deal** (Security? Legal? Procurement?)
- What does this segment's existing tech stack look like, and where would our product have to fit into it?
- Which segments should we explicitly **not** pursue, and why?

### Task 3 — Business model

- What are the realistic model options, and what are the trade-offs of each? Consider at minimum: per-seat SaaS, usage-based (per DSR request / per consent captured / per data subject), platform licensing, white-label, API-metered, revenue share, and hybrid.
- **Recommend one primary model** and defend it against the alternatives you rejected.
- How should pricing be structured, and what should it be *anchored to* — a metric the Customer already understands and can predict? (Cost avoided? Requests processed? Users covered? Seats?)
- What does the packaging look like (tiers / editions), and what feature goes in which tier? Map this to actual features from the document.
- Where does the model break? Name the failure conditions.

### Task 4 — Revenue flow

- **Trace the money end to end:** who pays, to whom, how often, triggered by what event.
- What are the revenue streams, ranked by size and by how soon they can realistically start?
- What is the expected shape of a deal — contract length, upfront versus recurring, expansion path over time?
- What are the cost drivers on our side that scale with revenue (LLM inference for risk analysis, storage of consent records, support, integration/onboarding labor, compliance/audit obligations)? Which of these are dangerous at scale?
- Where is the margin, and where does it leak?
- What are the leading indicators that revenue is working, before revenue actually shows up?

### Task 5 — Customer flow (the buying firm's journey)

Map the **Customer's** full journey — the organization that buys and embeds our solution:

1. **Trigger** — what event makes them start looking for something like this?
2. **Evaluation** — how do they discover us, who gets involved, what do they compare us against, what questions must we survive?
3. **Decision** — what has to be true for them to sign? What kills deals?
4. **Integration** — what does it actually take to embed our solution into their app? Who does the work, how long, what do they need from us?
5. **Go-live** — what does success look like in the first 30/90 days?
6. **Ongoing** — how do they use it month to month? Who logs in? What do they check? What do they report to whom?
7. **Expansion / churn** — what makes them buy more? What makes them leave?

Flag every point in this journey where our product **does not currently have the capability required** (the feature doc's Section 7 lists known gaps — use it, and add any you find yourself).

### Task 6 — User flow (the end user's journey)

Map the **User's** journey — the person whose personal data is at stake, who uses our features inside our Customer's app:

- Where do they first encounter our features? What are they actually trying to do at that moment (they are probably trying to do something else entirely — sign up, check out, use the app)?
- Walk through the realistic end-to-end journey using the features in the document — from first contact through to a completed erasure request.
- Where will they drop off, get confused, or lose trust? Be specific about which feature and which moment.
- **What makes a User come back?** A privacy tool has an obvious retention problem: the better it works, the less reason there is to return. Address this directly.
- **Critically:** the User does not pay us. So explain precisely **how User behavior creates value that the Customer is willing to pay for.** If you cannot draw that line convincingly, say so — that is important information.

---

## Rules for your analysis

1. **Do not invent numbers.** No fabricated market sizes, adoption rates, or competitor pricing presented as fact. If you use a figure, label it clearly as an estimate and show the reasoning or assumption behind it. If you genuinely don't know, say "this needs primary research" and specify exactly what to go find out.
2. **Ground every claim in a real feature.** If your recommendation depends on a capability, point at the feature in the document. If it depends on something we haven't built, say so explicitly and treat it as required investment, not an existing asset.
3. **Separate Customer from User every single time.** See the definition table above.
4. **Disagree with me where you think I'm wrong.** If B2B is the wrong call, if the consumer app is actually the stronger business, if we should cut features, or if this shouldn't be a company at all — say it plainly with your reasoning. I want the honest read, not validation.
5. **Rank and recommend.** Don't hand me five options weighted equally. Pick one, defend it, and note what would change your mind.
6. **Be concrete.** "Target enterprises" is useless. "Thai e-commerce platforms with 1M+ registered users who already have an in-house app team and a named DPO" is useful.

## Output format

Write in **Thai**, using English for business/technical terms where that reads more naturally (SaaS, DSR, ARR, beachhead, etc.) — same convention as the attached document.

Structure your response as:

```
1. บทสรุปผู้บริหาร (Executive Summary)
   — ข้อเสนอแนะหลัก + เหตุผล 3 ข้อ + ความเสี่ยงใหญ่สุด 1 ข้อ (ไม่เกิน 1 หน้า)
2. การประเมินโอกาส (Task 1)
3. ลูกค้าเป้าหมาย (Task 2)
4. โมเดลธุรกิจ (Task 3)
5. กระแสรายได้ (Task 4)
6. Customer Flow (Task 5)
7. User Flow (Task 6)
8. ข้อสมมติที่ต้องพิสูจน์ (Assumptions to validate)
   — เรียงตามความเสี่ยง พร้อมระบุว่าจะพิสูจน์แต่ละข้อยังไง
9. สิ่งที่ต้องทำต่อ 30 / 60 / 90 วัน
```

Start by reading the attached `PRODUCT-FEATURES.md` in full. If anything in it is ambiguous or if you need information that isn't there to answer well, **ask me before you start analyzing** — don't fill the gap with assumptions.

---

## 📋 คัดลอกถึงบรรทัดนี้

---

## หมายเหตุสำหรับผู้ใช้ prompt นี้

**ข้อมูลที่ analyst อาจถามกลับ และคุณควรเตรียมคำตอบไว้:**

| คำถามที่น่าจะโดนถาม | ทำไมถึงสำคัญต่อการวิเคราะห์ |
|---|---|
| ทีมมีกี่คน ทำ full-time หรือไม่ มีเงินทุนเท่าไหร่ | กำหนดว่า go-to-market แบบไหนเป็นไปได้จริง |
| มีคอนเนกชันกับองค์กรไหนอยู่แล้วบ้าง (จากแฮกกาธอน / ที่ทำงาน / สคส.) | เป็นตัวกำหนด beachhead ที่แท้จริง |
| ตั้งใจจะทำต่อหลังแฮกกาธอนจริงไหม หรือแค่ส่งประกวด | เปลี่ยนคำตอบทั้งหมดของการวิเคราะห์ |
| ยอมทำ services/consulting ควบไปด้วยไหม หรืออยากเป็น product ล้วน | มีผลต่อโมเดลรายได้และ margin |
| มีความสัมพันธ์กับหน่วยงานกำกับ (สคส./PDPC) หรือไม่ | RegTech ขายง่ายขึ้นมากถ้ามี endorsement |

**ถ้าอยากได้การวิเคราะห์ที่คมกว่านี้** — ตอบคำถามข้างบนแนบไปกับ prompt ตั้งแต่แรกเลย จะได้ไม่ต้องเสียรอบถาม-ตอบ
