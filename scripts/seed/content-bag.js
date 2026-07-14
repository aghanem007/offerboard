/**
 * Seed content: The Bag (Salary Check + Finally Got One).
 * Numbers are 2026-plausible US figures.
 */

export const bagTopics = [
  // ---- Salary Check ----
  {
    category: 'salary-check',
    author: 'lockedin_lena',
    title: 'How to post numbers: the format (read before posting)',
    daysAgo: 117,
    pinned: true,
    content: `Numbers help everyone negotiate. Vague numbers help no one. The format:

**Role / Level:** (e.g. SWE new grad, L3 / E3 / SDE1)
**Location:** city matters more than company for calibration
**Base:** annual
**Stock:** total grant value / vesting years (say the schedule — 4yr even? front-loaded?)
**Bonus:** signing (one-time!) and target annual %
**TC year 1:** base + (stock ÷ vest years) + amortized signing + expected bonus

**Also useful:** competing offers y/n, negotiated y/n and by how much, YOE if not new grad.

**House expectations:**
- No trolling with fake numbers. This data gets used for real decisions.
- Screenshots not required (don't dox yourself) but keep it honest.
- No dunking on people's numbers. A 90k offer in Ohio is not a tragedy, and someone's first offer is someone's finish line.

Anonymity note: it is completely fine to make a throwaway for this. Several of the most useful posts here are throwaways.`,
    replies: [
      { author: 'anon_quant', content: `Adding one: say if numbers are FIRST offer or POST-negotiation. Half the "is this lowball?" confusion on this board is comparing someone's opener to someone else's final.` },
      { author: 'faang_or_bust', content: `> A 90k offer in Ohio is not a tragedy

thank you for this line specifically, the coastal TC-brain on this site needed it in writing` },
    ],
  },
  {
    category: 'salary-check',
    author: 'quietgrinder',
    title: 'Google L3 new grad offer — is this standard? (185 TC, Mountain View)',
    daysAgo: 13,
    content: `First real offer, want a sanity check before I respond. Using the pinned format:

**Role:** SWE new grad, L3
**Location:** Mountain View
**Base:** 133k
**Stock:** 138k / 4 years (even vest) = ~34.5k/yr
**Bonus:** 15% target annual (~20k), no signing offered initially
**TC year 1:** ~187k

Recruiter said "this is a strong offer" (they always say that, right?). No competing offers YET — Amazon loop finishes next week.

Questions: is the no-signing-bonus thing normal now? And is it dumb to ask for more without a competing offer in hand?`,
    replies: [
      { author: 'faang_or_bust', content: `Numbers are standard-good for L3 MTV right now — base is right at band, stock is middle. Signing bonus absolutely exists at Google for new grads, they just don't offer it unprompted anymore. Ask for 15-25k signing, cite relocation. Worst case is no.` },
      { author: 'anon_quant', content: `Do NOT respond before the Amazon loop finishes. "I'm finishing another process, can I have until [date]" is completely normal and recruiters expect it. Even a paper Amazon offer moves Google 10-20k. The market rewards the mildly patient.` },
      { author: 'julia_swe', content: `+1 wait for amazon. also: negotiation on a first offer feels terrifying and is completely expected — the comp team literally holds back room for it. the recruiter is not your friend but they're also not your enemy, they just want to close. politely ask, cite the pending loop, and let the machine do its thing.` },
      { author: 'quietgrinder', content: `update for posterity: asked for time (granted instantly, you were right), amazon offer landed, google came back with +20k signing and +10k stock. TC ~195. signing thread coming to Finally Got One 🎉` },
      { author: 'binarytreehugger', content: `> update for posterity

this thread is why this forum exists. congrats!!` },
    ],
  },
  {
    category: 'salary-check',
    author: 'return_offer_ray',
    title: 'Amazon SDE1 Seattle: my return offer breakdown (176k TC)',
    daysAgo: 37,
    content: `Promised numbers in my internship review thread, delivering. Return offer post-internship:

**Role:** SDE1 (L4), return offer
**Location:** Seattle
**Base:** 110k
**Signing:** 55k year 1 / 35k year 2 (Amazon's famous weird structure)
**Stock:** 48k / 4 years, back-loaded vest (5/15/40/40 — read that twice, new people)
**TC year 1:** ~176k | **TC year 2:** ~157k | then stock catches up years 3-4

**The Amazon asterisks everyone should understand:**
- The back-loaded vest + front-loaded signing means years 1-2 are cash-heavy and if you leave before year 3 you never see most of the stock. It's retention engineering and it works.
- Intern return offers are barely negotiable (they know you have no leverage and the band is tight). I asked anyway, got +5k on signing. Ask anyway.

**Also:** my intern rate for reference was $50/hr + housing stipend ($3,200/mo, Seattle summer).`,
    replies: [
      { author: 'wagie_in_training', content: `the 5/15/40/40 vest is genuinely diabolical and every amazon new grad discovers it AFTER signing. posting it plainly like this is a public service` },
      { author: 'nyc_or_nothing', content: `for calibration: my bank's return offer was 112k base NYC, 10k signing, no stock, ~25% less TC — but the hours delta is real. there's no free lunch, only different lunches` },
      { author: 'grad_szn_2027', content: `$50/hr intern + housing stipend... meanwhile my hometown internship paid $19/hr and I was grateful lol. the range in this industry is insane. thanks for posting real numbers ray` },
    ],
  },
  {
    category: 'salary-check',
    author: 'startup_simp',
    title: 'Startup offered 130k + 0.15% equity — how do I even value this??',
    daysAgo: 22,
    content: `Series A startup (~40 people, infra tooling, decent investors), new grad offer:

**Base:** 130k (remote-friendly, I'd be in Denver)
**Equity:** 0.15% in options, 4yr vest / 1yr cliff, strike at last 409A
**Bonus:** none, "we're pre-bonus" (incredible phrase)
**TC:** ...130k? 130k + lottery ticket?

My other offer is a boring-but-stable 155k TC at a big non-FAANG tech co. The startup work is genuinely more interesting and the team is cracked. But how do I think about 0.15% like an adult instead of a lottery player?

The founder said "at our Series C valuation that's worth 400k." Sure it is, man.`,
    replies: [
      { author: 'anon_quant', content: `Adult math: 0.15% of a Series A infra startup, AFTER dilution (expect your % to halve by exit through future rounds), times maybe a 10-15% chance of an exit that beats preferences... expected value is real but small — think "10-25k/yr equivalent," not 400k. So the real comparison is 130k + interesting work + ~15k lottery EV vs 155k stable. That's a lifestyle choice, not a math problem, and both answers are defensible.` },
      { author: 'sarah.builds', content: `the non-money part matters at your age though: 40-person startups hand you scope that big cos gate behind 3 promo cycles. if the team is actually cracked, the learning compounds into your NEXT job's comp. I'd at least counter — ask for 145k base OR double the equity, watch which one they flinch at, that tells you what they think it's worth` },
      { author: 'faang_or_bust', content: `"we're pre-bonus" is an all-time phrase lmao. one hard question to ask them: what are the preference stacks? 0.15% of a company with 2x participating preferred is worth dramatically less than the same % clean. if the founder gets cagey about the cap table, that's your answer about everything` },
      { author: 'startup_simp', content: `> watch which one they flinch at

asked for 145 OR 0.3%. they came back with 142k + 0.2% within a day, no flinching, cap table is clean (asked). taking it. see you all in the "startup regrets" thread in two years or the yacht, no in between` },
    ],
  },
  {
    category: 'salary-check',
    author: 'hashmap_hannah',
    title: 'Midwest reality check: 95k in Columbus is not a lowball, coastal friends',
    daysAgo: 45,
    content: `Watching this board talk someone out of a good offer last week because "under 150 is criminal" radicalized me into making this thread.

My offer: 95k base, 8k signing, 5% bonus, Columbus OH. Insurance company tech division (yes, they have real engineering — 400 SWEs, modern stack, my team does event streaming).

**The math coastal people refuse to do:** my rent for a genuinely nice 1BR is $1,150. My friend's SF studio is $3,400. After tax and rent, my monthly leftover is within a few hundred dollars of her L3 Google leftover. Then factor: I'm 15 min from family, zero state tax on the difference... okay Ohio has income tax, but you get the point.

Is the CEILING lower here? Absolutely, and that's a real consideration for a 10-year plan. But "95k Columbus" as a FIRST job is not a tragedy requiring intervention, and the reflexive coastal dunking makes people feel bad about objectively livable, wealth-building offers.

Post your non-coastal numbers below. Normalize the whole map.`,
    replies: [
      { author: 'embedded_emily', content: `92k + clearance path, Huntsville AL. my mortgage — MORTGAGE, at 24 — is less than my friend's SF parking spot. the ceiling argument is real but the floor argument never gets airtime. good thread` },
      { author: 'nyc_or_nothing', content: `as this board's most location-snob poster: fair thread, honest math, I respect it. my one pushback stands though — early career optionality clusters coastal (or did; remote shifted it some). it's a real tradeoff in BOTH directions and pretending either side is obvious is the actual mistake` },
      { author: 'gpa_2_9_no_hope', content: `thank you for this. I've got a 78k offer from a logistics company in Indianapolis and this board almost had me feeling like it was a failure. it's more money than anyone in my family has made. taking it proudly.` },
      { author: 'hashmap_hannah', content: `> more money than anyone in my family has made

that's the whole point of the thread right there. congrats, genuinely — go sign it.` },
      { author: 'binarytreehugger', content: `this thread is the best of this board. also can confirm insurance/logistics/retail tech divisions are the hidden middle of this industry — hundreds of thousands of solid SWE jobs nobody on CS twitter acknowledges exist` },
    ],
  },
  {
    category: 'salary-check',
    author: 'julia_swe',
    title: 'Negotiated +22k on my new grad offer with one email. The exact script.',
    daysAgo: 76,
    content: `Since three people DMed asking: yes I negotiated, no it wasn't scary (it was terrifying, but scripted terror is manageable). The verbatim structure:

**Setup:** Stripe offer in hand, Meta offer arriving 3 days later at higher TC. Told each recruiter about the other's existence early — this is expected and they move faster when they know.

**The email (structure, not verbatim, adapt):**
1. Enthusiasm first, and it was real: "Stripe is my first choice for [specific team reason]."
2. The fact: "I've received another offer at [number]TC. I don't want to make this decision on comp alone, but the gap is significant."
3. The ask: "If you can get closer to [number], I'm ready to sign this week."
4. NOTHING ELSE. No apology, no justification paragraph, no "I know this is a big ask." Two short paragraphs total.

**Result:** +14k base equivalent... they moved stock +32k/4yr and signing +6k = ~+22k year-1 TC. Took 4 days and one phone call where I mostly said "mhm."

**What I learned:** "ready to sign this week" is the sentence that moves money. Recruiters are graded on close rate. Give them a reason to fight comp committee for you.`,
    replies: [
      { author: 'quietgrinder', content: `> scripted terror is manageable

used a version of this script on my google offer this week (thread nearby) and it WORKED. the "nothing else" rule is the hard part — I deleted four apology sentences from my draft` },
      { author: 'imposter_synd_dev', content: `the "mostly said mhm" phone call is real. silence is a negotiation tool and it costs nothing. great writeup` },
      { author: 'ref_pls', content: `what would you have done with NO competing offer though? that's the situation most of us are actually in` },
      { author: 'julia_swe', content: `> no competing offer

weaker but not powerless: cite the level's public band data (levels.fyi), a specific comp component ("the signing bonus is below what I understood the band offers"), and the same "ready to sign" energy. moves 5-10k instead of 20. the pinned thread's advice stands: the best negotiation tool is a second loop, even at a company you don't want.` },
    ],
  },
  {
    category: 'salary-check',
    author: 'imposter_synd_dev',
    title: 'Two offers, please help me stop spiraling: 168 stable vs 195 at a wobbly Series B',
    daysAgo: 6,
    content: `Decision paralysis, day 4. The pinned format, twice:

**Offer A:** big healthcare-tech co (public, boring, profitable). 168k TC new grad (128 base / 28k stock/yr / 12k signing). Team does internal platform stuff. Recruiter, engineers, everyone: pleasant, unhurried. WLB reportedly excellent.

**Offer B:** Series B startup (~120 people, AI-adjacent infra). 195k TC (150 base / 45k in options priced generously by them). Raised 18 months ago. Two friends there say "intense but incredible." Glassdoor has some spicy recent reviews about runway rumors.

The spiral: B is more money, more interesting, more risk. A is the safe compounding path. Every hour I flip. My gut says B, my parents' entire immigrant experience says A, and my rent says either is fine.

Someone give me a framework that isn't a coin flip.`,
    replies: [
      { author: 'anon_quant', content: `Correct the numbers first: startup options aren't stock. Priced honestly, offer B is ~150-160 real TC with a call option attached. So the actual choice is "168 liquid + calm" vs "~155 + intensity + lottery ticket + runway risk." Framed that way, A is more money AND more sleep. B's case rests entirely on the learning/trajectory argument — which can be legitimately worth it! But make the choice with real numbers.` },
      { author: 'leetcode_therapist', content: `the fact that you listed "my parents' immigrant experience" as a decision input tells me the spiral isn't about comp at all. both offers are objectively good. the question underneath is whose definition of risk you're living by — and there's no wrong answer, but that's the actual thing to sit with, not the TC delta.` },
      { author: 'sarah.builds', content: `one concrete de-spiraling question: which codebase do you want to explain in interviews in 3 years? "internal platform at big health co" and "core infra at an AI startup" open different doors. neither is wrong. but you probably FELT something reading one of those phrases just now.` },
      { author: 'imposter_synd_dev', content: `> you probably FELT something

I did and it was B and I hate that you did that to me. update: asked B straight questions about runway (18+ months, verified-ish), taking the weekend, deciding monday. thank you all for the sanity, this thread got screenshot into my family group chat` },
      { author: 'faang_or_bust', content: `for the record whatever you pick: a 27k paper gap at YEAR ONE is noise over a career. the trajectory and the people are the signal. good luck monday 🫡` },
    ],
  },
  {
    category: 'salary-check',
    author: 'grad_szn_2027',
    title: 'Intern hourly rates 2026 — the census thread (post yours)',
    daysAgo: 4,
    content: `The old thread's numbers are stale, starting fresh for this cycle. Format: **company type / location / hourly (or monthly) / housing y/n**

I'll go first with my (humble) one:

**Regional logistics co / Indianapolis / $24/hr / no housing** — and honestly happy with it as a sophomore.

Known reference points from friends + verified posts around the board this cycle:
- Google STEP: ~$47/hr + housing stipend
- Amazon SDE intern: ~$50/hr + $3.2k/mo housing (per ray's thread)
- Meta: ~$8,500/mo + corporate housing option
- Jane Street: $125/hr (not a typo, quant is a different sport)
- Mid-size unicorns: $40-55/hr, housing varies wildly
- Banks: $38-45/hr NYC, no housing usually
- Defense: $28-36/hr, LCOL cities

Drop yours, anonymity encouraged, this thread becomes the reference.`,
    replies: [
      { author: 'csmajor4life', content: `**university IT dept / campus / $15.50/hr / I live in the dorms lol** — it's on my resume as linux sysadmin experience and I stand by it` },
      { author: 'mia_codes', content: `**Google STEP / MTV / $47/hr + $9k housing stipend for the summer** — confirming the reference point with my actual numbers` },
      { author: 'anon_quant', content: `**prop shop / Chicago / $110/hr + corporate housing** — posting to keep the quant number honest. before anyone spirals: they interview 60 people for each seat, the hourly is priced for the funnel` },
      { author: 'startup_simp', content: `**seed startup / remote / $32/hr / no housing but they sent me a monitor** — the monitor was load-bearing for morale` },
      { author: 'wagie_in_training', content: `**family friend's company / hometown / $0 in money but "great exposure"** — posting so the bottom of the distribution is represented. (I quit after 3 weeks and found the $22/hr one, read segfault_sami's red flags thread, children)` },
    ],
  },

  // ---- Finally Got One ----
  {
    category: 'finally-got-one',
    author: 'ghosted_again',
    title: 'AFTER 847 APPLICATIONS. I GOT ONE. (the spreadsheet is free to a good home)',
    daysAgo: 1,
    content: `**EIGHT HUNDRED AND FORTY SEVEN.** I counted, because of course I counted, the spreadsheet has conditional formatting and a pivot table and at some point around #500 it became load-bearing for my sanity.

**The stats, because I know this board:**
- 847 applications over 14 months
- 31 OAs → 11 phone screens → 4 onsites → 3 ghostings-post-onsite (documented in my Interview Stories thread) → **1 offer**
- Mid-size fintech, backend SWE, 118k base + 10k signing, Midwest office + hybrid
- The application that worked: #791. A Tuesday. I almost didn't send it.

**What actually changed in the last 100:** rewrote resume per the roast board (thank you hannah + lena), stopped mass-applying to FAANG-only, started applying within 48h of posting, wrote 2-sentence genuinely-specific cover notes only when the box existed.

To everyone at application #400 reading this in the dark: the number doesn't mean anything is wrong with you. The funnel is just brutal and the funnel only has to work ONCE.

I signed this morning. My mom cried. I'm going to sleep for a week. The spreadsheet template is going in a reply because 4 people already asked.`,
    replies: [
      { author: 'binarytreehugger', content: `**847.** the persistence in this post should be studied. congratulations, genuinely, this is the best post this board has ever had. sleep well champion` },
      { author: 'leetcode_therapist', content: `"the funnel only has to work once" is going on the pinned welcome post if lena lets me. from your ghosting-census thread to this — the full character arc, in public, in writing. this is why the forum exists. CONGRATS` },
      { author: 'ghosted_again', content: `spreadsheet template as promised: columns for company / date / source / status / days-since-touch, conditional formatting turns rows red at 21 days silent (the Wall of Shame view). someone host it properly, I'm going to bed for the aforementioned week` },
      { author: 'gpa_2_9_no_hope', content: `I'm at 412 and this post physically recharged me. see you on this board from the other side eventually. WAGMI` },
      { author: 'og_intern', content: `847 applications and the winner was a tuesday you almost skipped. absurd, perfect, congratulations. (mod note: pinning this for a week, it's earned it)` },
      { author: 'two_sum_tim', content: `MY MOM CRIED is the TC that matters. congrats!!! 🎉` },
    ],
  },
  {
    category: 'finally-got-one',
    author: 'neetcode_disciple',
    title: 'Signed with Datadog today. The 8-week plan thread has a happy ending.',
    daysAgo: 27,
    content: `Follow-through post — my study plan thread in The Grind ended with "4 onsites, offer breakdown coming when I stop being paranoid." I stopped being paranoid. **Signed: Datadog, new grad SWE, NYC.**

**Numbers (pinned format):** 135k base / 55k stock over 4 (even vest) / 10k signing → **~162k TC yr 1**, negotiated up from 150 flat using julia's script (cited my Amazon offer, "ready to sign this week," they moved in 3 days).

**The four onsites, resolved:** Amazon (offer, declined), Google (reject after team match purgatory — 5 weeks in the pool, never matched, brutal system), Ramp (reject, fair loss, their bar round smoked me), Datadog (offer, signed).

**What I'd tell January me:** the 8-week plan worked but the two things that actually converted offers were (1) the discord bot with real users — EVERY interviewer asked about it, and (2) mock interviews with humans. The 150 problems were table stakes, not the differentiator.

NYC in September. The grind thread stays open for the next cohort — pay it forward, that's the whole culture here.`,
    replies: [
      { author: 'offszn_arc', content: `the full arc: study plan thread → fear zone → 4 onsites → signed. new members should read your post history like a textbook. congrats disciple, NYC won` },
      { author: 'julia_swe', content: `the script works!! 🎉 congrats — and "the problems were table stakes, not the differentiator" should be tattooed on this board's homepage` },
      { author: 'nyc_or_nothing', content: `DATADOG NYC LETS GOOO. their office is 3 blocks from mine, the new grad class does trivia thursdays. welcome to the correct coast` },
      { author: 'deadline_dana', content: `currently in week 7 of your plan (the simulation weeks). this post is the motivation injection I needed. see you on the other side` },
    ],
  },
  {
    category: 'finally-got-one',
    author: 'quietgrinder',
    title: 'From community college to Google. The long road, written down.',
    daysAgo: 10,
    content: `Signed my Google L3 offer yesterday (negotiation thread in Salary Check, 195 TC, still doesn't feel real). But the offer isn't the story. The road is, and I want it written down for whoever needs it:

**2022:** community college, because money. Everyone online said CC-to-tech was fantasy.
**2023:** transferred to state school on the CC pathway program. First CS course that used the word "runtime." Felt behind everyone who'd coded since age 12.
**2024:** applied to 60 internships, got zero. Not a low number — ZERO. Spent the summer working retail and doing CS50 + a personal project at night.
**2025:** the project (a scheduling tool my old CC's tutoring center still uses — 30 real users) got me ONE interview at a local company. Converted it. That internship got me real bullets.
**Early 2026:** this forum's roast fixed my resume (0→5 OAs thread is mine). The grind threads fixed my patterns. 5 OAs → 2 onsites → 1 offer.
**Yesterday:** signed.

Four years, zero shortcuts, one forum. The people who said CC-to-tech was fantasy were wrong, it's just slow. Slow is fine. Slow compounds.

(And to the tutoring center that still runs my janky scheduling tool: you were the resume bullet that started everything. 30 users. That's all it took.)`,
    replies: [
      { author: 'binarytreehugger', content: `"slow is fine. slow compounds." — I need this framed. from lurker to 0→5 OAs thread to THIS. congratulations doesn't cover it. this post is going to get someone through their zero-internship summer and they don't know it yet` },
      { author: 'gpa_2_9_no_hope', content: `the 2024 line — sixty applications, ZERO internships, and you just... kept going. as the board's other underdog account: thank you for writing the whole thing down, dark parts included. framing this one` },
      { author: 'lockedin_lena', content: `Pinning alongside the 847 post. Between the two of them the whole truth is covered: it's brutal, it's slow, and it works. Congratulations — the tutoring center detail is the best resume origin story this board has.` },
      { author: 'mia_codes', content: `crying at the tutoring center still using your tool. 30 users >>> everything. CONGRATS 🎉🎉` },
      { author: 'cracked_freshman', content: `the "felt behind everyone who coded since 12" line, as someone who coded since 12: the gap you felt was real but it closes HARD at exactly the point you got to. respect, this arc is cracked` },
    ],
  },
  {
    category: 'finally-got-one',
    author: 'segfault_sami',
    title: 'Rejected by 14 companies. Accepted by the 15th. The rejections were the curriculum.',
    daysAgo: 42,
    content: `Signed with a robotics company (C++ infra, my actual dream domain) last week. But I keep thinking about the 14 rejections that came first, because — and I'm only half joking — they were a better education than my degree:

- **Rejections 1-3:** resume auto-filters. Curriculum: my resume was bad (roast board fixed it).
- **4-6:** OA failures. Curriculum: I couldn't code under time pressure yet. Grind thread, 90 days.
- **7-9:** phone screen chokes. Curriculum: I'd never narrated code aloud. Mocks fixed it.
- **10-12:** onsite losses on system-ish questions. Curriculum: "how would you test this" and "what breaks at scale" are ANSWERABLE skills, I just hadn't studied them.
- **13:** lost on behavioral. Curriculum: wrote six real STAR stories (the conflict thread on this board, you know the one).
- **14:** lost fair and square to a better candidate. Curriculum: sometimes it's not a lesson, it's just a queue.
- **15:** every previous failure mode came up. Every single one. Passed them all, because I'd already paid the tuition.

The system tells you rejection is a verdict. It's not. It's the syllabus, delivered one failure at a time, and nobody shows you the whole thing up front.

Robotics. C++. Dream domain. Fifteen tries. Worth it.`,
    replies: [
      { author: 'leetcode_therapist', content: `"it's not a verdict, it's the syllabus" — I say a version of this to people weekly and never this well. also the honesty of #14 ("sometimes it's just a queue") is the mentally healthiest line on this board. congrats sami, go segfault professionally now` },
      { author: 'embedded_emily', content: `robotics C++ infra is the good stuff. congrats!! the 10-12 lesson (testing/scale questions are studiable) deserves its own guide thread when you have the energy` },
      { author: 'imposter_synd_dev', content: `needed the #14 one today specifically. "sometimes it's just a queue." okay. back to it.` },
    ],
  },
  {
    category: 'finally-got-one',
    author: 'offszn_arc',
    title: 'RETURN OFFER SECURED — and the one thing I did differently this summer',
    daysAgo: 31,
    content: `Got the return offer email this morning (big tech, won't specify which — numbers will go in Salary Check once I stop refreshing the email to make sure it's real).

Everyone asks interns "how do I get the return." I got a no-offer LAST summer at a different company, so I'm qualified to answer with a before/after:

**Last year (no offer):** I optimized for looking busy. Said yes to everything, asked zero "dumb" questions, hid every struggle until it became a missed deadline, and my mentor found out about blockers at standup like everyone else. Looked great for 8 weeks. Week 10 review: "we never really knew where things stood with you."

**This year (offer):** one change — I made my status IMPOSSIBLE to misread. Fifteen-minute weekly doc to my mentor: done / in progress / blocked / what I need. Raised blockers within a DAY, with what I'd already tried. Asked the dumb questions in week 1 (when they're free) instead of week 6 (when they're expensive).

That's it. That's the whole difference. The work quality was honestly similar both summers. **Legibility got the offer, not brilliance.**

Off-season arc complete. Lifting heavy tonight.`,
    replies: [
      { author: 'return_offer_ray', content: `"legibility got the offer, not brilliance" — as the other return-offer haver on this board: co-signed at full volume. my scope-up got flagged in my packet BECAUSE the weekly doc made it visible. hidden work is unpaid work. congrats arc 🫡` },
      { author: 'og_intern', content: `three internships and I endorse every word. the week-1-dumb-questions-are-free economics especially — that window closes silently and nobody tells you. great post, congrats` },
      { author: 'grad_szn_2027', content: `saving this for next summer. the before/after format makes it actually believable instead of generic advice. also "refreshing the email to make sure it's real" lmaooo real` },
    ],
  },
  {
    category: 'finally-got-one',
    author: 'wagie_in_training',
    title: 'tiny startup. tiny pay. first offer ever. posting through the tears (happy ones, mostly)',
    daysAgo: 19,
    content: `it's not FAANG. it's not 150k. it's not even 100k.

it's a 9-person company in a city you've never thought about, building software for dental labs (DENTAL LABS), paying 72k, and the "office" is the founder's second garage which has been renovated exactly enough to be legal.

and it's MINE. eleven months. 340 applications (the spreadsheet gang knows). one offer.

the interview was 45 minutes of talking through a CSV importer bug they actually had. no leetcode. the founder said "you debug out loud the way we work" and called me the next morning while I was in line at a grocery store. I said yes before he finished the sentence and then had to ask him to repeat the sentence.

my username was ironic when I made it. it's aspirational now. wagie ACHIEVED. training COMPLETE (beginning, whatever).

to the double digits club still grinding: your dental lab garage is out there. it counts. it all counts.`,
    replies: [
      { author: 'binarytreehugger', content: `"I said yes before he finished the sentence and then had to ask him to repeat the sentence" is the happiest sentence structure ever posted here. IT ALL COUNTS. congrats wagie 🎉🎉🎉` },
      { author: 'hashmap_hannah', content: `9-person company = you'll touch everything = in 18 months you'll have more real scope than most big-co juniors. the dental lab garage is a career cheat code wearing a disguise. thrilled for you` },
      { author: 'ghosted_again', content: `340 apps gang 🤝 847 apps gang. the spreadsheet people always make it eventually. CONGRATS` },
      { author: 'startup_simp', content: `dental lab software is unironically a great niche — boring industries with money and no software competition. garage phase is the best phase. congrats!!` },
    ],
  },
  {
    category: 'finally-got-one',
    author: 'two_sum_tim',
    title: "One year ago I couldn't reverse a linked list. Signed at Microsoft today.",
    daysAgo: 48,
    content: `Timestamp receipts: my first post on this board was 11 months ago asking why my linked list reversal "worked but only sometimes" (it was never working, a kind stranger explained I was returning the wrong node, that stranger was binarytreehugger, this board remembers).

Today I signed: **Microsoft, new grad SWE, Redmond. 122k base / 80k stock over 4 / 15k signing / ~10% bonus target. ~160k TC.**

The Google bomb thread? Mine. The failed-merge-intervals-twice saga? Also mine. The username? Earned, twice, in production (in interviews).

I don't have a system to share that others haven't posted better. What I have is a post history that goes: confused → grinding → failing publicly → failing more specifically → offer. In that order, with no steps skipped, over 11 months.

If you're in the "confused" chapter right now: the only thing I did that mattered was posting the embarrassing questions instead of lurking with them. Every failure thread got answers that became the next small win.

Thanks for everything, you absolute degenerates. Salary Check thread with the full breakdown tomorrow. First round of virtual coffee is on me.`,
    replies: [
      { author: 'binarytreehugger', content: `THE LINKED LIST GUY MADE IT. I remember that post — you were SO close, just returning head instead of prev. from that to Microsoft in 11 months. proudest moment of my posting career. CONGRATS TIM 🎉` },
      { author: 'leetcode_therapist', content: `"posting the embarrassing questions instead of lurking with them" — the single highest-ROI habit on this forum, now with documented proof. congrats tim, the arc is complete. (the username stays forever though, them's the rules)` },
      { author: 'ghosted_again', content: `no steps skipped, all of it in public. legend behavior. see you in salary check 🫡` },
      { author: 'csmajor4life', content: `as someone currently in the confused chapter with a linked list problem open in another tab RIGHT NOW: message received. posting it after I finish crying. congrats!!!` },
      { author: 'og_intern', content: `11 months of post history as a resume. congratulations tim — this thread and the 847 thread and quietgrinder's are getting a "hall of fame" section in the welcome post, it's time.` },
    ],
  },
];
