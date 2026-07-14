/**
 * Seed content: The Hunt (Interview Stories + Company Reviews).
 */

export const huntTopics = [
  // ---- Interview Stories ----
  {
    category: 'interview-stories',
    author: 'two_sum_tim',
    title: 'Bombed my Google onsite in the first 10 minutes. AMA I guess.',
    daysAgo: 28,
    content: `Virtual onsite, round 1 of 4. Interviewer pastes the problem. It's a graph problem — my BEST category. I read it, my mind goes completely white, and I hear myself say "so, um, is this... a graph?"

It was, in fact, a graph. The problem statement contained the word "graph."

Spent 10 minutes writing a BFS I've written a hundred times, with a bug I couldn't see because my ears were ringing. Interviewer was kind about it, gave a hint, I recovered maybe 60% by the end. The next three rounds went fine — like, actually fine — but round 1 sat in my chest the whole day.

Rejection came Tuesday. Recruiter said feedback was "mixed, strong in later rounds" and to reapply in a year.

Posting because when I was prepping, all I could find were success stories, and I needed to know normal people faceplant too. AMA about the process, the format, whatever.`,
    replies: [
      { author: 'leetcode_therapist', content: `The white-mind thing in round 1 is a documented phenomenon — your first round is basically an adrenaline dump with a coding exercise attached. Two things that help: book a mock the morning of (sacrifice a fake interview to the nerves gods), and have a scripted first 90 seconds (restate problem, ask 2 clarifying questions, state brute force). Autopilot until the brain comes back online.` },
      { author: 'mia_codes', content: `"is this... a graph?" I'm so sorry but I laughed. thank you for posting a real one. how long did the whole process take start to finish?` },
      { author: 'two_sum_tim', content: `> how long did the whole process take

application to rejection: 9 weeks. recruiter screen → OA → phone screen → 2 weeks of scheduling purgatory → onsite → 5 day wait. the scheduling purgatory was somehow the worst part` },
      { author: 'og_intern', content: `"strong in later rounds" in the feedback is genuinely meaningful btw — Google's reapply-in-a-year isn't a soft no, their internal notes persist and a strong-recovery profile reads well next cycle. Everyone I know who got in took two attempts. Log the pain, run it back.` },
      { author: 'wagie_in_training', content: `the problem statement contained the word graph 💀💀 you're going to make it BECAUSE you can post this publicly. accountability arc` },
    ],
  },
  {
    category: 'interview-stories',
    author: 'segfault_sami',
    title: 'My interviewer fell asleep during my system design round. Not a joke.',
    daysAgo: 44,
    content: `Final round for a mid-size fintech, 5pm slot (mistake #1 was accepting a 5pm Friday slot, that's on me).

I'm 20 minutes into designing a payment notification system, camera on, drawing boxes, narrating like a good boy. I ask "does that tradeoff make sense?" Silence. Look at the video tile. My guy's head is TILTED BACK. Eyes closed. A man at rest.

I said "hello?" twice. Nothing. So — and I stand by this — I kept designing for another few minutes IN CASE IT WAS A TEST. Finished the rate limiter section to an audience of one sleeping senior engineer.

He jolted awake around minute 26, apologized ("long week, new baby"), and to his credit asked me to recap and engaged hard for the rest. I got the offer, declined it for other reasons, but honestly? The recovery interview was the best conversation of my whole cycle. Man asked great questions once conscious.

Anyway: ask for morning slots.`,
    replies: [
      { author: 'caffeine_overflow', content: `"IN CASE IT WAS A TEST" is the most interview-brained sentence ever written. we've all been conditioned into psychological warfare` },
      { author: 'julia_swe', content: `new baby + friday 5pm explains everything, that man was fighting for his life. glad he rallied. but also yes — morning slots, always. you want interviewer #1 coffee energy, not interviewer #5 energy` },
      { author: 'ghosted_again', content: `you got an offer from a man who was unconscious for 20% of the interview and I've been ghosted by 11 companies who were fully awake. there is no meritocracy` },
      { author: 'segfault_sami', content: `> there is no meritocracy

in my defense the rate limiter section was genuinely soothing content` },
    ],
  },
  {
    category: 'interview-stories',
    author: 'return_offer_ray',
    title: 'Amazon SDE intern loop, full timeline + what each stage actually tested',
    daysAgo: 60,
    content: `Documenting my full Amazon intern pipeline since the info out there is scattered. Applied to SDE Intern (US), large state school, one prior small-company internship.

**Week 0:** Application, no referral. Auto-acknowledge email.
**Week 2:** OA invite. Two LC-mediums (grid BFS variant + hashmap counting) and the work-style survey. The survey matters more than people think — answer like an adult with the leadership principles open in another tab, but don't max-slider everything, it flags gaming.
**Week 5:** "Congratulations" → final interview scheduling.
**Week 7:** One 60-min virtual interview (intern loop is short): ~15 min behavioral (two LP stories — "tell me about a time you missed a deadline" and "disagreed with a teammate"), ~40 min coding (design a data structure supporting insert/delete/getRandom in O(1), then a follow-up on duplicates), 5 min my questions.
**Week 8:** Offer. Seattle, standard intern rate (posting exact numbers in Salary Check).

**What actually got tested:** STAR stories with a real "what did YOU do" middle, talking while coding, and edge cases WITHOUT being prompted. The bar isn't genius, it's completeness under narration.

Happy to answer questions. LP prep doc I used is linked from the pinned guide in The Grind.`,
    replies: [
      { author: 'grad_szn_2027', content: `this timeline is gold, thank you. how many LP stories did you have prepped total? and did they let you pick the language?` },
      { author: 'return_offer_ray', content: `> how many LP stories

6 stories covering ~10 principles (stories double up fine). language: yes, any mainstream one — I used Python, nobody blinked.` },
      { author: 'faang_or_bust', content: `can confirm the survey flag thing. buddy of mine max-slidered the whole work simulation and got auto-rejected in 48h with a 4.0 and prior FAANG internship. answer honest-ish, it's calibrated for consistency` },
      { author: 'binarytreehugger', content: `"the bar isn't genius, it's completeness under narration" — this is the whole game in one line. congrats ray` },
    ],
  },
  {
    category: 'interview-stories',
    author: 'deadline_dana',
    title: 'Got asked an LC hard in a 20-minute recruiter "chat"',
    daysAgo: 14,
    content: `Booked what the email called a "20-minute introductory chat with an engineer" at a series B startup (~80 people, dev tools space).

Minute 3: "let's do a quick technical exercise." Screen share opens. It is Trapping Rain Water.

TRAPPING RAIN WATER. In a TWENTY MINUTE INTRO CHAT.

I did the brute force, talked through the two-pointer optimization at a hand-wavy level, and ran out of time mid-implementation. Engineer seemed fine with it? "Great, we'll be in touch." (They were not in touch.)

Is this a startup thing? Do smaller companies just skip the warmup and throw hards at the intro call? Because I was prepped for "tell me about yourself" and got ambushed by the second most famous hard on the site.`,
    replies: [
      { author: 'startup_simp', content: `startups are wildly uncalibrated, yes. no interviewer training, no rubric, just whatever the one engineer with free time feels like asking. I've had an intro chat that was pure vibes and one that was implement-a-bloom-filter. it's a box of chocolates where some chocolates are trapping rain water` },
      { author: 'hashmap_hannah', content: `honestly "brute force + articulated the optimal approach + ran out of time" in 17 effective minutes is a fine performance and any decent rubric scores it. the no-response says more about their process than your solve.` },
      { author: 'anon_quant', content: `fwiw trapping rain water in a screen is standard at trading firms, but they TELL you it's technical. springing it inside a "chat" is bait. name of company? (respect the rules, but industry at least — checking if it's who I think it is)` },
      { author: 'deadline_dana', content: `> industry at least

dev tools, that's all I'll say lol. and thanks hannah, needed the reframe — I walked out of that call feeling robbed and in hindsight I performed fine into a void` },
    ],
  },
  {
    category: 'interview-stories',
    author: 'imposter_synd_dev',
    title: "The 'tell me about a conflict' question dismantled me and I need to talk about it",
    daysAgo: 8,
    content: `Meta E3 behavioral round last week. Coding rounds went genuinely well. Then: "tell me about a time you had a conflict with a teammate and how you resolved it."

And I just. Have never had one? Or I have, but my honest answer is "we disagreed in the group chat, I said 'yeah fair enough,' and did it their way because I didn't care enough to fight about a CSS framework."

So I panicked and inflated a mild git-merge disagreement into a Netflix drama, and I could HEAR myself lying badly — the interviewer asked two follow-ups ("what exactly did you say to them?") and the story fell apart like wet cardboard because there was no real memory underneath it.

How do you answer this honestly when your actual conflicts are boring? What are they even looking for?`,
    replies: [
      { author: 'julia_swe', content: `They're not looking for drama — they're looking for "can this person disagree without being a hazard." Your BORING story is the right story, told with structure: what the disagreement was, how you understood their side, what you decided, what you learned. "I caved on the CSS framework because I didn't care" can honestly become "I realized the decision was reversible and low-stakes, so I optimized for team speed over being right" — that's not spin, that's just noticing what you actually did.` },
      { author: 'og_intern', content: `Interviewer-side view (my mentor calibrates behaviorals): follow-ups like "what exactly did you say" are specifically designed to detect inflation. Real memories have texture — you remember the room, the exact dumb sentence someone typed. Fabricated stories are smooth. A small TRUE story with texture outperforms a big smooth one every time.` },
      { author: 'leetcode_therapist', content: `also, gently: "I've never had conflict" usually means "I avoid conflict," which IS a story. "Early on I'd go along with everything; here's the time that bit me and what I do differently now" is self-aware and interviewers eat it up. Your flaw is an asset if you can narrate it.` },
      { author: 'imposter_synd_dev', content: `> real memories have texture

this thread is better than the $40 behavioral prep course I bought. writing down my three boring true stories tonight. thank you all, genuinely` },
    ],
  },
  {
    category: 'interview-stories',
    author: 'julia_swe',
    title: 'Stripe interview was actually... pleasant? A positive story for balance',
    daysAgo: 50,
    content: `This board radicalized me into expecting every interview to be a hostile deposition, so posting the counterexample.

Stripe new grad loop, four rounds. No leetcode-style algorithm round AT ALL:

1. **Practical coding:** extend a small existing codebase (add a feature to an HTTP client wrapper). Real editor, real tests, could Google. Felt like a normal Tuesday.
2. **Debugging:** here's a repo with a failing test, find it. The bug was a timezone thing (it's always a timezone thing).
3. **Integration round:** build against a mock API from docs. They graded reading-the-docs-carefully, which, fair.
4. **Manager chat:** actual conversation, asked what I want to learn, told me honestly what the team's on-call is like.

Every interviewer was on time, prepared, and told me what the round was measuring UP FRONT. Got the offer, took it. Interviews don't have to be adversarial theater — some companies just check if you can do the job.`,
    replies: [
      { author: 'sarah.builds', content: `the "extend real code with tests and Google allowed" format is SO much more signal than whiteboard trivia and I will never understand why it isn't standard. congrats julia!!` },
      { author: 'sysdesign_sam', content: `stripe's process is famously well-engineered — they treat interview design like product design. the "we tell you what we're measuring" part is the tell. companies that hide the rubric usually don't have one.` },
      { author: 'ghosted_again', content: `reading this like a fantasy novel. "the interviewers were... on time?" incredible worldbuilding, unrealistic though` },
      { author: 'mango_db', content: `> it's always a timezone thing

the bug was DST wasn't it. it's always DST.` },
    ],
  },
  {
    category: 'interview-stories',
    author: 'ghosted_again',
    title: 'Ghosted after a FINAL round. Six weeks of silence. A timeline of my descent.',
    daysAgo: 17,
    content: `**Day 0:** Final round (5 hours, virtual) at a company I will describe only as "a well-known consumer app you have deleted and reinstalled at least twice." Went well. Recruiter: "you'll hear from us early next week!"

**Day 7:** Nothing. Polite follow-up email. Nothing.
**Day 12:** Second follow-up. Auto-reply: recruiter is out of office. Returning date: 3 days prior. The machines are gaslighting me.
**Day 19:** LinkedIn shows the recruiter has a NEW JOB at a different company. Interesting!
**Day 24:** Email the hiring manager directly (last resort etiquette). Read receipt on. It was read in 11 minutes. No response, day 41 now.
**Day 33:** The role is reposted. New posting. Same req number.
**Day 41 (today):** I'm told I remain "in their talent community." So we're all in a community together. Wonderful.

I've stopped being sad and entered my documentation era. Post your ghosting records below, misery census time. My previous record was 4 weeks post-onsite (broken today, new PR).`,
    replies: [
      { author: 'wagie_in_training', content: `"the machines are gaslighting me" — day 12 is where the timeline achieves literature. my record is 9 weeks post-FINAL, then a rejection email addressed to a different first name. you'll get there champ` },
      { author: 'binarytreehugger', content: `recruiter leaving mid-process explains 90% of these — your file is orphaned in a greenhouse queue nobody owns. it's not personal, it's worse: it's nobody's job. still completely unacceptable that the HM read and ignored though.` },
      { author: 'hashmap_hannah', content: `the reposted req is your actual answer, brutal as it is — close the loop mentally and spend the energy elsewhere. and log the company in your personal "never again without a signed offer first" list. mine has 3 entries and I honor it.` },
      { author: 'ghosted_again', content: `> a rejection email addressed to a different first name

I bow to the record holder. updating the leaderboard. hannah you're right, mentally closed, next.` },
      { author: 'og_intern', content: `mod note since this thread is heating up: venting yes, naming-and-shaming with unverifiable claims no (that's why the consumer app stays nameless, thank you for playing it right). carry on with the misery census.` },
    ],
  },
  {
    category: 'interview-stories',
    author: 'cracked_freshman',
    title: 'Choked on a Two Sum variant after 400 solved problems. Post-mortem inside.',
    daysAgo: 36,
    content: `Freshman, first ever real interview (a HFT firm's early-talent screen, so admittedly hard mode). 400+ problems solved, contest rating decent. Confidence: unearned.

Problem: Two Sum, except the array is sorted, read-only, and they want O(1) space — so, two pointers, a problem I have solved dozens of times.

What happened: I heard "Two Sum," my brain auto-loaded the HASHMAP solution, and I could not unload it. Interviewer says "can you do it without extra space?" and I — this is real — said "we could make the hashmap... smaller?"

**Post-mortem, actual lessons:**
1. Pattern-matching on the problem NAME instead of the constraints is a real failure mode of over-grinding. The constraints ARE the problem.
2. I never practiced having my first idea rejected. That interaction ("no, without extra memory") was somehow new to me after 400 solo solves.
3. Freshman year interviews are free XP. This loss cost me nothing and taught me the two things above.

Back to the queue. 401.`,
    replies: [
      { author: 'anon_quant', content: `"we could make the hashmap smaller" is getting screenshotted into my group chat, thank you for your service. but genuinely — the constraints-not-names lesson at freshman year puts you years ahead. HFT screens as free XP is also correct and slightly psychotic. you'll be fine.` },
      { author: 'leetcode_therapist', content: `#2 is the underrated one. solo grinding never trains "your first idea is wrong, adapt live." that's a mock-interview-only muscle. everyone reading: this is why you mock.` },
      { author: 'two_sum_tim', content: `a two sum failure post-mortem. my username's origin story is healing reading this. 401 🫡` },
    ],
  },
  {
    category: 'interview-stories',
    author: 'faang_or_bust',
    title: 'Meta E3 loop breakdown: what each round actually grades (from someone who passed)',
    daysAgo: 68,
    content: `Signed E3 last month. Info out there is 60% accurate, here's the corrected version.

**Format:** 2 coding + 1 behavioral, 45 min each. (No system design at E3, ignore anyone prepping you for it.)

**Coding rounds:** two problems per round is the target pace — that's the part nobody internalizes. They're mediums, but the bar is TWO in 35 effective minutes. One perfect solve with great narration reads as "borderline." Speed comes from instant pattern recognition, which is the one place where volume grinding actually pays off. My rounds: (1) merge intervals variant + binary search on answer, (2) BST validation + a string sliding window.

**Behavioral ("Jedi" round internally):** graded harder than people think and fails real candidates. They want: a conflict with texture, a failure with actual consequences you owned, and growth-over-time evidence. E3 expectation is "coachable and self-aware," not "led a team of 40."

**Signals that matter:** dry-run your code on an example before saying done (they literally track this), state complexity unprompted, and when they hint, TAKE the hint fast — resisting hints is graded as a negative signal, not persistence.

Questions welcome. Comp numbers are in my Salary Check post.`,
    replies: [
      { author: 'neetcode_disciple', content: `"two problems is the pace" needs to be in every prep guide, the number of people who walk in calibrated for one thorough solve... confirming the same from my loop last year. also +1 on hint-taking being graded — my interviewer told me afterward it's an explicit rubric line.` },
      { author: 'mia_codes', content: `wait they track whether you dry-run before saying done?? that's… actually a great habit to be forced into. noted. congrats on signing!` },
      { author: 'imposter_synd_dev', content: `the jedi round failing real candidates is real — a friend crushed both coding rounds and got dinged purely on behavioral (his failure story had no actual failure in it, classic). prep it like a technical round.` },
    ],
  },
  {
    category: 'interview-stories',
    author: 'mango_db',
    title: 'My interviewer turned out to be my TA from sophomore year',
    daysAgo: 2,
    content: `Phone screen with a logistics-tech company this morning. Interviewer joins. We stare at each other. It's my data structures TA from two years ago. The one whose office hours I attended approximately 40 times because I could NOT understand AVL rotations.

Him: "wait. red-black trees guy?"
Me: "AVL, but yes."

The interview itself was completely professional (he flagged the conflict to the recruiter after, apparently they just have him do a written eval and someone else makes the call — which honestly, good process). The problem was an interval scheduling thing, I did fine.

But there was a 15-second moment where he watched me balance a binary search structure in my head and we both KNEW. We both remembered the whiteboard. Character development is real.

He said, and I quote, "you got better." Might frame that instead of the diploma.`,
    replies: [
      { author: 'binarytreehugger', content: `"you got better" from the person who witnessed the before-times is worth more than the offer honestly. this is the best thing I've read all week` },
      { author: 'csmajor4life', content: `40 office hours to interval scheduling on demand... posting this on my wall as motivation. also props to the company for the conflict-of-interest process, most places would just wing it` },
      { author: 'two_sum_tim', content: `plot twist: he still thinks about the whiteboard too. TAs remember the ones who kept showing up. rooting for this offer specifically` },
    ],
  },

  // ---- Company Reviews ----
  {
    category: 'company-reviews',
    author: 'return_offer_ray',
    title: 'Amazon SDE intern (Seattle) — honest review after 12 weeks',
    daysAgo: 39,
    content: `Finished the summer, accepted the return. Balanced review, nobody paid me (they did the opposite, technically).

**The good:**
- Real work, shockingly fast. Committed to production week 2. My project (an internal migration tool) shipped and a real team uses it.
- Intern pay is real money (numbers in Salary Check thread).
- The bar-raiser culture means your mentor actually mentors — my feedback doc was specific and useful, not vibes.
- Seattle summer is a cheat code. It rains 9 months so nobody tells you June-August is perfect.

**The bad:**
- Oncall culture is real and you FEEL it even as an intern. My team's pager went off during my midpoint presentation and half the room left.
- "Frugality" is a leadership principle and it means the office coffee is bad. Bring-your-own-monitor-cable energy at a trillion dollar company.
- Return offer anxiety is engineered. The whole summer is an extended interview and everyone knows it, which colors every interaction ~10% performative.

**The verdict:** great first-brand-name, real engineering culture, would recommend the internship even if you don't return. Ask me anything, but I won't name my exact team.`,
    replies: [
      { author: 'grad_szn_2027', content: `how much did the return offer decision depend on the midpoint vs final review? and was the migration tool your idea or assigned?` },
      { author: 'return_offer_ray', content: `> midpoint vs final

midpoint is the warning system, final is the decision. if midpoint has no red flags and you don't set anything on fire after, you're basically fine. project was assigned, but the scope-up (adding the dry-run mode) was mine and that's what got specifically flagged in the return packet. find the scope-up, it's everything.` },
      { author: 'faang_or_bust', content: `"the whole summer is an extended interview" — this is every FAANG internship and freshmen deserve to hear it plainly. good honest review` },
      { author: 'embedded_emily', content: `the pager going off during your presentation and HALF THE ROOM LEAVING is the most amazon sentence ever typed` },
    ],
  },
  {
    category: 'company-reviews',
    author: 'sarah.builds',
    title: 'Startup internship review: 10 engineers, no tests, learned more than 3 years of school',
    daysAgo: 52,
    content: `Interned at a ~10 person seed-stage startup (B2B SaaS, staying vague). Everyone told me to take the bigger company's offer instead. I didn't. Review:

**Week 1:** "Here's the repo. There are no tests. We know. Your onboarding buddy is the CTO because there is no one else."

**What I actually did in 12 weeks:** built a customer-facing feature end to end (design doc → API → frontend → deploy), was on a real incident call at 11pm (our one big customer's webhook queue backed up — I found it, felt like a superhero), wrote the company's FIRST integration tests, and sat in on two sales calls to hear users complain about the thing I was building. That last one changed how I think about engineering more than any class.

**The tradeoffs, honestly:** no mentorship structure (the CTO is brilliant but has 90 seconds at a time), pay was ~60% of big tech intern rates, zero brand name for the resume filter, and if the company dies my "return offer" dies with it.

**Who should do this:** people who learn by ownership. Who shouldn't: people who need structure or are optimizing for the FAANG resume ladder — both totally valid, know which one you are.`,
    replies: [
      { author: 'startup_simp', content: `"sat in on sales calls and heard users complain about my feature" — this is the single highest-value intern experience that big tech structurally cannot give you. great review. did you get equity btw or intern-cash-only?` },
      { author: 'sarah.builds', content: `> equity

intern was cash only, but the return offer has 0.2% at a seed valuation which is either a future used car or nothing, ask me in 6 years lol` },
      { author: 'hashmap_hannah', content: `the balanced take on who SHOULDN'T do this is what makes this review trustworthy. the startup-vs-bigtech question has no universal answer, only a know-yourself answer.` },
      { author: 'nyc_or_nothing', content: `respect the honesty on pay. 60% of big tech intern rate in a cheap city is livable; people should just walk in with eyes open instead of discovering it at offer time` },
    ],
  },
  {
    category: 'company-reviews',
    author: 'mia_codes',
    title: 'Google STEP: overhyped or actually worth it? (finished mine, verdict inside)',
    daysAgo: 71,
    content: `Just wrapped STEP (the first/second-year program). The internet treats it like a golden ticket so here's the calibrated version.

**Worth the hype:**
- The conversion path is real: STEP → SWE intern → new grad is a documented pipeline and your host writes an internal packet that follows you.
- Pair-programming with another STEP intern on a real (if contained) project — I did an internal dashboard, my friend did a testing tool for an actual product team.
- The mentorship is structured HARD. Weekly 1:1s, a host, a co-host, an official "how are you actually doing" person. Opposite of startup chaos.

**Overhyped parts:**
- The project is deliberately small. You will not ship to a billion users, you will ship to 40 internal SREs and that's by design.
- "Googley" culture polish means real feedback comes wrapped in three layers of bubble wrap — I had to explicitly ask "what would you have done differently" to get actual criticism.
- It does NOT auto-convert. People in my cohort got no-offers. The bar at the end is a real bar.

**Verdict:** if you're a freshman/sophomore, apply, it's the best structured on-ramp in the industry. Just don't believe the "STEP = guaranteed Google career" tiktoks.`,
    replies: [
      { author: 'csmajor4life', content: `applying this fall 🙏 how much did your interviewer care about the ONE project on my resume being a class project? that's all I have` },
      { author: 'mia_codes', content: `> class project

STEP interviews are calibrated for people with almost nothing — they care about how you think through the (easier than normal) problems and whether you communicate. a class project you can discuss deeply beats a fake startup. go for it.` },
      { author: 'og_intern', content: `co-sign all of this from friends' experiences. adding: the no-convert rate spooks people but a STEP-no-offer with the brand on your resume still outperforms most sophomore summers. asymmetric bet, take it.` },
    ],
  },
  {
    category: 'company-reviews',
    author: 'nyc_or_nothing',
    title: 'Big bank tech (JPMC) — the good, the bad, and the COBOL-adjacent',
    daysAgo: 25,
    content: `Summer analyst (tech track) review, NYC. This board is FAANG-brained so here's the other universe.

**The good, and I'm serious:**
- 9-5:30 is REAL. My FAANG friends' "unlimited PTO" is a psyop; my hours were contractual. I had a summer AND a salary.
- NYC without needing a car. The intern class is enormous (hundreds), so the social layer is basically camp.
- Job security culture — the bank has existed for 200 years and moves like it, which cuts both ways but sleeps well.
- More engineering than you'd think: my team did real-time risk calc streaming, Kafka and all. Not everyone's maintaining mainframes.

**The bad:**
- SOME people are absolutely maintaining mainframes. Team assignment is a lottery and the variance is enormous — my friend two floors up wrote Excel macros all summer.
- The tech stack has geological layers. I touched a Java 8 service that called a thing that called a thing nobody could explain.
- Process. Deploying my two-line fix took 9 days and 2 approval committees.
- Comp is fine-not-great and the ceiling is visibly lower than tech (numbers in Salary Check).

**Verdict:** underrated for work-life balance and NYC life, overrated if you want to move fast and touch modern infra. Know which lottery you're entering.`,
    replies: [
      { author: 'wagie_in_training', content: `"a thing that called a thing nobody could explain" is enterprise software in one line. the excel macro friend deserves his own review thread` },
      { author: 'embedded_emily', content: `honestly the deploy-committee thing exists at defense contractors too and I've come to weirdly respect it? when the code moves money (or missiles) slow is a feature. different world from move-fast-break-things and both are real engineering.` },
      { author: 'faang_or_bust', content: `fair review. the lower ceiling point is the one people should sit with though — first job trajectory compounds. fine to start at a bank, just don't fall asleep there for 6 years by accident` },
      { author: 'nyc_or_nothing', content: `> don't fall asleep there by accident

agreed and that's exactly how the bank gets you: it's COMFORTABLE. the 401k match is a siren song` },
    ],
  },
  {
    category: 'company-reviews',
    author: 'julia_swe',
    title: 'Meta intern review: rated my summer 8/10, here’s the missing 2 points',
    daysAgo: 84,
    content: `Menlo Park, product team, last summer. Everyone posts the free-food photos so let me do the actual review.

**Why it's an 8:**
- Intern projects ship. Mine (a feed ranking experiment tool feature) hit real internal users by week 8. The "interns do real work" thing is true.
- The internal tooling is from the future. Code search, experiment platform, the monorepo tooling — going back to school git workflows afterward physically hurt.
- Pay and perks are as advertised (Salary Check thread has my numbers).
- Genuinely brilliant teammates who answer questions like teaching is part of the job, because there it culturally is.

**The missing 2 points:**
- PSC (the perf process) shadow: even as an intern you feel the whole org metabolizing around review cycles. My mentor's advice quality visibly dipped the two weeks his packet was due.
- Scope anxiety is the intern meta. Everyone's optimizing their project's "impact narrative" for the return-offer packet by week 6, and hallway conversations turn into scope negotiations. I caught myself doing it too and didn't love who I became lol.

**Return offer:** got it, still deciding (the deciding thread is in Salary Check). Would do the internship again 10/10 — the 8 is for the summer as lived, not the opportunity.`,
    replies: [
      { author: 'imposter_synd_dev', content: `"didn't love who I became" is the most honest sentence in any intern review on this board. the scope-narrative meta is real everywhere but meta named it and made it a sport` },
      { author: 'sysdesign_sam', content: `the internal tooling withdrawal is REAL. after my summer I tried to recreate half of it in my dotfiles like a person keeping hotel toiletries` },
      { author: 'ref_pls', content: `great review. when you say ship by week 8 — how much was mentor-carried vs yours? trying to calibrate what "real work" means for interns there` },
      { author: 'julia_swe', content: `> mentor-carried vs yours

design was collaborative (60% me after the first draft got redirected), implementation ~90% me, code review carried by the whole team as normal. nobody ghost-wrote it, but nobody let me walk off a cliff either. that ratio IS the product they're selling you.` },
    ],
  },
  {
    category: 'company-reviews',
    author: 'segfault_sami',
    title: 'Unpaid "internship" offers: red flags checklist (name-and-shame free edition)',
    daysAgo: 11,
    content: `Three people in my discord got baited by variations of the same scam-adjacent "opportunity" this month, so here's the pattern-matching guide. Not naming companies (mod rules + these outfits rename themselves quarterly anyway).

**Automatic no's:**
- Unpaid AND for-credit-optional. Real unpaid internships route through your school's credit system because that's the legal fig leaf. "You can get credit if you want!" means their lawyer said the fig leaf is your problem.
- "Equity compensation" at a company with no funding, no product, and a founder whose LinkedIn says "visionary." That's not equity, that's a group project with extra steps.
- You'd be intern #1 through #6 with zero full-time engineers. Who exactly is mentoring whom?
- Asked to do a "trial project" that is suspiciously... a complete deliverable. Congratulations, you're doing free client work.
- WhatsApp-only communication. I don't make the rules, it's just always WhatsApp.

**Sometimes fine:**
- Unpaid at a genuine nonprofit with structure, references, and scoped work. Still think hard, but it's a different animal.

**The rule:** if the value flows one direction and it's away from you, it's not an internship, it's donated labor with a title.`,
    replies: [
      { author: 'lockedin_lena', content: `Mod note: this is exactly how to do a warning thread within the rules — patterns, not accusations. Pinning a link to this from the welcome post. The WhatsApp detail is hilariously accurate and I wish I knew why.` },
      { author: 'gpa_2_9_no_hope', content: `needed this two years ago. did one of these (the "trial project" flavor) for 6 weeks. they shipped my trial project. I have receipts and no recourse and a great story for the conflict behavioral question I guess` },
      { author: 'startup_simp', content: `as this board's resident startup defender: co-signed completely. real early-stage startups PAY interns, even if it's modest. "we pay in experience" from a funded company is a choice, and it's telling you the culture.` },
      { author: 'binarytreehugger', content: `"a group project with extra steps" 😭 sending this thread to my entire junior class channel` },
    ],
  },
  {
    category: 'company-reviews',
    author: 'embedded_emily',
    title: 'Defense contractor new grad review: the clearance golden handcuffs, explained',
    daysAgo: 58,
    content: `Took a new grad offer at a large defense contractor (embedded/simulation work, that's as specific as I'll get for obvious reasons). Six months in. This path is invisible on this board so, review:

**The deal:**
- They sponsor your security clearance (took 7 months of waiting — you do unclassified work in purgatory meanwhile). Once cleared, you're suddenly worth a LOT more, but disproportionately to OTHER cleared employers. These are the golden handcuffs: leaving the ecosystem resets your value, staying in it caps your ceiling below big tech but well above median.
- Stability that tech people can't imagine. Programs run for DECADES. Layoff anxiety approaches zero.
- 40 hours means 40. My badge literally won't let me in at weird hours without paperwork.

**The tradeoffs:**
- The tech is old ON PURPOSE (certified toolchains move glacially). I write C for a compiler from 2011 and it's not changing.
- No WFH for classified work, ever, obviously. The SCIF does not have windows.
- Comp: solid base, small bonus, no equity concept (numbers in Salary Check). The cleared premium kicks in at year 2-3 when you can shop yourself around the ecosystem.
- You can't talk about your work. At parties I say "simulation software" and change the subject. Some people hate this more than they expect.

**Who it's for:** people who value sleep, stability, and stateside citizenship requirements they meet. It's a genuinely different optimization function and nobody on this board talks about it.`,
    replies: [
      { author: 'hashmap_hannah', content: `"the SCIF does not have windows" — the single most information-dense review sentence this board has produced. thank you for covering the invisible path, half of CS twitter doesn't know this sector employs armies of SWEs` },
      { author: 'grad_szn_2027', content: `wait, 7 months of clearance purgatory — were you getting paid full salary that whole time to do unclassified work? that's... kind of amazing actually?` },
      { author: 'embedded_emily', content: `> paid full salary to wait

yes. I refactored internal tooling and did trainings for 7 months at full pay. the government's inefficiency giveth. (it also taketh: my laptop takes 11 minutes to boot because of the security stack.)` },
      { author: 'terminal_velociraptor', content: `C for a 2011 compiler with decades-long program stability is honestly the most based tech stack on this board. no dependency updates. no framework churn. just you and the ICD. (I'm only half joking)` },
    ],
  },
];
