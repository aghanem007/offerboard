/**
 * Seed content: Community (General) + the staff-only Mod Lounge.
 */

export const communityTopics = [
  // ---- General ----
  {
    category: 'general',
    author: 'og_intern',
    title: 'Welcome to Offerboard — read this first',
    daysAgo: 121,
    pinned: true,
    content: `Welcome. This is a forum for CS students in the hunt for their first offer — internships, new grad, and everything around them.

**The map:**
- **The Grind** — leetcode, study plans, patterns. The pinned survival guide is genuinely good.
- **Resume Roast** — post it, get honest feedback. Read the pinned rules first (redaction matters).
- **Interview Stories** — wins, disasters, and everything ghosted in between.
- **Company Reviews** — what it's actually like inside, from interns and new grads.
- **Salary Check** — real numbers in a fixed format. This data helps everyone negotiate.
- **Finally Got One** — offer celebrations. The hall of fame lives here.
- **General** — you are here.

**The culture, in four lines:**
1. Real numbers, real stories. Fabrication poisons the data everyone relies on.
2. Roast the resume, never the person.
3. Anonymize interviewers; respect NDAs. Companies are fair game as patterns, not as unverifiable accusations.
4. We were all confused once. The embarrassing question you're sitting on is the next person's search result.

Warnings are real (three = automatic ban) but you have to try pretty hard. Post something. Lurking is allowed but posting is how this place pays you back.

— the mod team (me + lockedin_lena — blue badges, we bite gently)`,
    replies: [
      { author: 'lockedin_lena', content: `The other blue badge waving hello. One addition: the search bar works and your question has probably been asked — but ask it anyway if the existing thread doesn't fit. Duplicate questions with new context are welcome; this isn't stack overflow, nobody's closing your post.` },
      { author: 'grad_szn_2027', content: `joined this week, this post + the hall of fame threads sold me instantly. "the embarrassing question you're sitting on is the next person's search result" ok ok I'll post it` },
    ],
  },
  {
    category: 'general',
    author: 'deadline_dana',
    title: "is anyone else's entire personality just 'job search' now",
    daysAgo: 16,
    content: `roommate: "want to watch a movie?"
me: "can't, behavioral prep"
roommate: "it's saturday"
me: "tell me about a time you faced a conflict on a saturday"

I caught myself evaluating a DINNER PARTY conversation for STAR format last week. someone told a story about their flight getting cancelled and my brain went "good situation, clear task, but the action section rambled."

my camera roll is leetcode screenshots. my youtube recommendations are system design videos and one lonely cooking video fighting for its life. I had a DREAM about hashmaps. not a nightmare. a regular dream where I was just... using a hashmap. it worked fine. that's the whole dream.

genuinely asking: how do you people maintain a personality during this. asking for me. I'm the friend group's "how's the job stuff going" person now and I want to talk about literally anything else but also I have nothing else`,
    replies: [
      { author: 'leetcode_therapist', content: `the fact that you can write this post this funny means the personality survived, it's just buried under the prep. practical answer though: schedule ONE non-negotiable normal-person block per week (movie, sport, anything) and defend it like an interview slot. the grind actually improves when it has edges — burnout-you solves fewer problems than saturday-movie-you.` },
      { author: 'offszn_arc', content: `"tell me about a time you faced a conflict on a saturday" LMAO. but real: the gym is my personality escape hatch, an hour where the only complexity analysis is plates on the bar. find your version` },
      { author: 'caffeine_overflow', content: `a dream where the hashmap just worked fine is honestly aspirational, mine would've had a collision at the worst moment` },
      { author: 'julia_swe', content: `from the other side: it comes BACK, I promise. three weeks after signing I remembered I like drawing. the job search compresses you but it doesn't delete you. (also your roommate sounds patient, watch the movie)` },
      { author: 'deadline_dana', content: `> watch the movie

we watched the movie. I only thought about my pending OA twice (twenty times). progress. thanks for this thread, it helped more than it had any right to` },
    ],
  },
  {
    category: 'general',
    author: 'csmajor4life',
    title: 'CS minor vs major for SWE jobs — my advisor said something that surprised me',
    daysAgo: 35,
    content: `Context: I'm CS major obviously (username), but my roommate is math major + CS minor and panicking that recruiters auto-reject minors.

His advisor told him: "nobody hiring SWEs has ever checked whether it said major or minor. They check: can you code, do you have projects, did you pass the interview."

That felt... too reassuring? So I'm crowdsourcing: has anyone here actually seen major-vs-minor matter in recruiting? OA invites, resume screens, anything?`,
    replies: [
      { author: 'hashmap_hannah', content: `advisor is ~90% right. the degree line is a checkbox ("technical degree y/n") for most filters — math + CS minor passes basically everywhere CS major does. where it CAN matter: a few big-co new grad postings literally list acceptable majors (math is virtually always on the list), and some visa-related credential evaluations get picky. for a domestic student: it's the projects and interviews, full stop.` },
      { author: 'anon_quant', content: `funny enough in quant, math major + CS minor often screens BETTER than pure CS. it's all about what the role prices. tell your roommate to stop panicking and start grinding stochastic processes` },
      { author: 'sarah.builds', content: `hiring-adjacent anecdote: my internship manager didn't know MY major until my last week. he knew my github cold though. the ratio of attention is not what students think it is` },
      { author: 'csmajor4life', content: `roommate has been informed and has ceased panicking (about this specifically, he found new things). thanks all — "the degree line is a checkbox" is the takeaway` },
    ],
  },
  {
    category: 'general',
    author: 'mia_codes',
    title: 'How do you deal with friends getting offers before you? (honest thread)',
    daysAgo: 7,
    content: `Serious one, be gentle.

My best friend in the major signed at a great company last week. I am genuinely, actually happy for her — she worked incredibly hard and earned every bit of it. I helped her mock interview. I was the second person she called.

And also I went home and felt like absolute garbage about myself for two days, and then felt like garbage ABOUT feeling like garbage, because what kind of friend does that.

We started at the same time. Same classes, similar grades, similar prep. Her funnel converted and mine hasn't yet. The rationally-correct thoughts ("different timelines," "the funnel is random," ghosted_again literally needed 847) are all installed in my brain and none of them are load-bearing at 1am.

How do you all actually handle this? Not the logic — I have the logic. The feeling.`,
    replies: [
      { author: 'leetcode_therapist', content: `the feeling-garbage-about-feeling-garbage loop is the actual trap — the envy itself is just proof you want something, aimed at someone nearby. it says nothing about your friendship or character. what helped me: say a version of it OUT LOUD to the friend ("so proud of you, also being honest that it stings a little from where I'm standing"). real friendships hold that easily, and secrets metastasize. also: 1am thoughts get a blanket veto, that's policy.` },
      { author: 'binarytreehugger', content: `you mock-interviewed her and were the second phone call. that's the friendship data. the 2-day garbage feeling is the completely normal tax on wanting things. it passes faster when you don't prosecute yourself for it 💚` },
      { author: 'ghosted_again', content: `as the 847 guy: every single one of my close friends signed before me. every one. it stung every time AND their referrals/mock help/offer intel materially shortened my road. both things were true the whole time. your turn is in the queue, and when it comes, someone will feel this way about YOU and still love you. that's just how the whole thing works` },
      { author: 'mia_codes', content: `> say a version of it out loud to the friend

did this today. she said "oh thank GOD, you've been weird all week, I thought you were mad at me." we got food. I'm fine. the secret was the heavy part, you were all right. leaving this thread up for the next person at 1am 💙` },
      { author: 'lockedin_lena', content: `threads like this are why General exists. proud of this board today.` },
    ],
  },
  {
    category: 'general',
    author: 'terminal_velociraptor',
    title: 'The group project is preparing me for nothing except crime documentaries',
    daysAgo: 23,
    content: `Team of four. Week 9 of the semester. A status report:

**Member 1 (me):** has written 71% of the code by git blame, which I checked, because I've become the kind of person who checks
**Member 2:** writes genuinely good code when located. last located: 11 days ago. phone goes straight to voicemail like a missing persons case
**Member 3:** contributes exclusively via 2am messages saying "we should refactor this" with no elaboration, no follow-up, and no commits. a refactoring poltergeist
**Member 4:** made the slides. the slides are, I must admit, gorgeous. font choices? impeccable. has never opened the repository. I checked that too

The professor says group projects "simulate industry." Industry has: managers, performance reviews, the ability to be fired, and salaries. We have: a shared google doc titled "FINAL final schedule (REAL)" and my slowly eroding will to live.

Interviewers: when I answer the conflict question, this is the story now. Member 2, if you're reading this — the presentation is thursday. THURSDAY.`,
    replies: [
      { author: 'wagie_in_training', content: `"a refactoring poltergeist" — I know this man. every team has this man. he will get an A alongside you and feel nothing` },
      { author: 'og_intern', content: `unironically though: "I checked git blame and then set up a weekly 15-min sync to redistribute work" is a genuinely strong conflict-question answer if you actually do the second part. the group project simulates industry in exactly one way: legibility and paper trails win. (also good luck thursday lmao)` },
      { author: 'sarah.builds', content: `member 4 has a future in devrel and doesn't know it yet. the slides ARE the deliverable to 80% of the graders. it's cynical but you should absolutely study how gorgeous slides launder a project's actual state — that's a real industry lesson too` },
      { author: 'terminal_velociraptor', content: `UPDATE: member 2 emerged wednesday 11:58pm with 900 lines of shockingly good code and the message "sorry, rough month." presentation went fine. member 4's slides carried. professor called us "a well-oiled team." I have aged forty years. thank you all for witnessing` },
      { author: 'deadline_dana', content: `> "sorry, rough month" + 900 good lines at midnight

member 2 is all of us at our worst and somehow also our best. iconic ending. congrats on surviving` },
    ],
  },
  {
    category: 'general',
    author: 'imposter_synd_dev',
    title: "Professors who haven't touched industry since 1998: a loving complaint",
    daysAgo: 53,
    content: `My software engineering professor — tenured, brilliant, published, genuinely kind man — this week:

- Told us the industry standard for version control is "keeping dated zip files, though some companies now use Subversion"
- Graded a rubric line: "code compiles" (30 points). the language was PYTHON
- Referred to the cloud, in the year 2026, as "someone else's mainframe" (okay this one is honestly kind of correct)
- Said whiteboard interviews test "your penmanship under pressure" (also... increasingly not wrong?)

Meanwhile his ALGORITHMS material is immaculate. The man can prove amortized complexity bounds from memory that I've watched senior engineers on youtube get wrong. His recurrence relation lectures are the reason I pass OAs.

Conclusion I've landed on: take the theory from academia and the tooling from the internet, and never confuse the two channels. The professors teaching 1998 tooling are often teaching immortal theory. The youtubers with current tooling often can't prove anything terminates.

(But "code compiles: 30 points" for python is still going in my memoir)`,
    replies: [
      { author: 'bigO_bob', content: `"immortal theory, mortal tooling" is exactly the right split. my DB professor last used SQL in anger before I was born and his relational algebra lectures are why I can actually reason about query plans while my peers copy-paste ORMs and pray. take the eternal stuff, source the tools elsewhere.` },
      { author: 'segfault_sami', content: `"someone else's mainframe" and "penmanship under pressure" — the man is accidentally landing direct hits from 1998. broken clock or secret sage, impossible to tell` },
      { author: 'csmajor4life', content: `python compiles to bytecode so TECHNICALLY— (I'll see myself out)` },
      { author: 'terminal_velociraptor', content: `> dated zip files

project_final_v2_REAL_fixed.zip is version control with extra steps and honestly it's the version control your group project deserves (source: my thread nearby)` },
    ],
  },
  {
    category: 'general',
    author: 'caffeine_overflow',
    title: "what's your 'I'm done for the day' ritual? (trying to build one that isn't doomscrolling)",
    daysAgo: 29,
    content: `problem: I "stop working" at 9pm which means I close the laptop and then lie in bed doing the exact same anxiety in app form until 1am. the grind never ends because it never officially ENDS, there's no whistle, no commute, no door that closes.

people who have figured this out: what's the ritual? what actually tells your brain "the day is submitted, no further edits accepted"?

(asking in general instead of the grind because this is a life problem wearing a leetcode costume)`,
    replies: [
      { author: 'offszn_arc', content: `evening lift, non-negotiable. the last set is the whistle. brain gets it now — bar goes down, day is over. any physical thing works (walk, run, cooking a real dinner), the body ends the day when the mind won't` },
      { author: 'hashmap_hannah', content: `boring and life-changing: a paper notebook. last 5 minutes of work I write tomorrow's first task + anything open-loop. the anxiety at 1am is mostly unclosed loops — writing them down is telling your brain "it's stored, you can drop it." I sleep 40 min faster since. paper specifically. the phone is lava after 10.` },
      { author: 'terminal_velociraptor', content: `\`git commit -m "eod"\` and the laptop physically goes in a drawer. the drawer is the door that closes. ritual needs a PHYSICAL component or the brain doesn't file it` },
      { author: 'leetcode_therapist', content: `all three above are the same answer wearing different clothes: the ritual needs a body, an artifact, or a location — something outside the skull. pure willpower rituals fail because the anxiety lives where the willpower does. +1 notebook, +1 drawer, +1 whistle.` },
      { author: 'caffeine_overflow', content: `week 1 report: notebook + laptop drawer combo. slept before midnight 5 of 7 nights, which is a personal record since sophomore year. the loops really do quiet down when they're on paper. thread delivered, thanks nerds 🧡` },
    ],
  },
  {
    category: 'general',
    author: 'grad_szn_2027',
    title: 'Fall recruiting opens in ~6 weeks. The checklist thread (add yours)',
    daysAgo: 3,
    content: `New here, type-A, coping with a checklist. Fall internship apps open mid-August for a lot of the big ones (some FAANG postings drop even earlier and fill FAST). Six-ish weeks out. My list — tear it apart or add to it:

**Now (weeks 1-2):**
- Resume through the Roast board (doing this tonight, pray for me)
- One project README actually written like a human will read it
- LinkedIn/GitHub cleanup — pinned repos, real descriptions, no "my-first-repo"

**Weeks 3-4:**
- NeetCode core patterns refresher (not new grinding — REVIEW, per the survival guide)
- 2 mock interviews with humans booked
- The 6 STAR stories written DOWN (this board is very insistent about the writing down part)

**Weeks 5-6:**
- Target list of ~40 companies in a tracker, sorted by posting date last year
- referral asks drafted (politely, ref_pls style)
- OA environment check: quiet room, working webcam, chrome profile without 40 tabs of shame

**Ongoing:** apply within 48h of postings dropping. this board's data says it matters.

what am I missing?`,
    replies: [
      { author: 'lockedin_lena', content: `this is a genuinely excellent list for someone who joined a week ago. two additions from the mod desk: (1) school career fair date goes ON the calendar now — the good companies' lines cap out in the first hour, (2) transcript/enrollment verification docs located BEFORE a recruiter asks, not during the 24h window they give you. otherwise: you're ahead of 95% of your class.` },
      { author: 'ref_pls', content: `> referral asks drafted (politely, ref_pls style)

I've been made into an adjective and I accept it. the polite formula: specific role link + 2-line why-me + "totally fine if not!" escape hatch. sent early — referrals die when the req is already flooded` },
      { author: 'return_offer_ray', content: `missing item: email address that isn't xXgamertagXx@ — you'd be shocked. and the 48h thing is real, amazon's intern postings last fall hit capacity in under 2 weeks` },
      { author: 'grad_szn_2027', content: `list updated with all three. career fair was NOT on my calendar and it's in week 5, so this thread already paid for itself. see you all in the OA trenches in august 🫡` },
    ],
  },

  // ---- Mod Lounge (staff-only visibility) ----
  {
    category: 'mod-lounge',
    author: 'og_intern',
    title: 'Mod handbook v1 — how we do things',
    daysAgo: 115,
    pinned: true,
    content: `Keeping this short and living. Lena and I wrote v1, edit suggestions in replies.

**Warning policy:**
- Warnings are for: personal attacks, fabricated numbers/stories, doxxing-adjacent posts, recruiter spam, repeated self-promo.
- Three warnings = automatic ban (system-enforced). Use them deliberately.
- Always include a reason — it's visible to staff and it's our paper trail.

**What is NOT warnable:** being wrong, being new, hot takes about companies (patterns yes, unverifiable accusations no — nudge those threads, don't nuke them), and colorful language that isn't aimed at a person.

**Soft deletes:** members see a removal notice, we see the content faded. Use for rule-breaking content; use LOCKS for threads that were fine but went feral.

**Salary Check integrity:** this is our crown jewel. Fabricated numbers get one warning and the post removed, no second chances on this specific thing — the data being trustworthy is the whole value.

**Bans:** mods can't ban mods or admins (system-enforced, don't try, it logs). Appeals go through the contact page for now.`,
    replies: [
      { author: 'lockedin_lena', content: `v1 approved. one addition for v1.1: when the hall-of-fame threads (847, tim, quietgrinder) get big incoming traffic, pre-emptively watch them — big threads attract the spam wave ~24h after they peak. learned this the fun way.` },
      { author: 'og_intern', content: `> the spam wave ~24h after they peak

added to the doc. also noting here for the log: pinned the 847 thread for a week per the announcement, unpin reminder set.` },
    ],
  },
  {
    category: 'mod-lounge',
    author: 'lockedin_lena',
    title: 'Weekly mod sync notes — rolling thread',
    daysAgo: 20,
    content: `Rolling notes thread so decisions have a home. This week:

- **Volume:** healthy growth week. Finally Got One had its biggest thread ever (the 847 post) — watched for the spam wave, caught two drive-by link droppers, warned one, banned zero.
- **Salary Check:** one suspicious post (numbers didn't add up, account 2 days old) — asked for clarification in-thread, poster corrected honestly (typo'd their stock grant). No action. The format works.
- **Resume Roast:** reminder given on one thread that got too personal. De-escalated fine.
- **Open question for next sync:** do we want a monthly "intro thread" in General for new members? The welcome post replies are becoming an accidental one anyway.

Add items below as they come up.`,
    replies: [
      { author: 'og_intern', content: `+1 on the monthly intro thread — the welcome post replies hit 40 this week, it's clearly wanted. I'll spin up "Introduce yourself — July" as a test and we'll see if it sustains. logging the two warnings from the spam wave in the action log for the record.` },
    ],
  },
];
