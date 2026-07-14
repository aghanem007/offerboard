/**
 * Seed content: The Prep (The Grind + Resume Roast).
 * daysAgo = topic age. Reply timestamps get spread out by seed.js.
 */

export const prepTopics = [
  // ---- The Grind ----
  {
    category: 'the-grind',
    author: 'lockedin_lena',
    title: 'START HERE: The Grind survival guide',
    daysAgo: 120,
    pinned: true,
    content: `New to the grind? Read this before you burn out by week two.

**The short version:**

- Pick ONE list. NeetCode 150 or Blind 75. Doing both is procrastination with extra steps.
- 1-2 problems a day, every day, beats 10 on Sunday. Consistency is the whole game.
- After 25 minutes stuck, read the solution. Staring longer doesn't build character, it builds resentment.
- Redo every problem you failed 3 days later. If you can't solve it the second time, that's your weak pattern. Drill it.
- Track your misses in a spreadsheet. Mine had a column called "why did I fumble this" and it was the most useful thing I made all year.

**What actually matters by level:**

- Screens/OAs: arrays, strings, hashmaps, two pointers
- Onsites: trees, graphs, heaps, intervals
- The scary stuff (DP, tries, union find): maybe 15% of interviews, but everyone spends 50% of their time on it out of fear

Post your study plans and misses here. Nobody is judging, we have all failed Two Sum under pressure at least once.`,
    replies: [
      { author: 'two_sum_tim', content: `> we have all failed Two Sum under pressure at least once

I feel personally attacked and also seen. Thank you for this.` },
      { author: 'csmajor4life', content: `Saving this. Started NeetCode 150 yesterday, day 1 of the rest of my life or whatever` },
      { author: 'bigO_bob', content: `Good list. One addition: when you review a miss, write down the time AND space complexity from memory. Half of "I know this pattern" is actually "I recognize this pattern but can't analyze it," and interviewers can smell the difference.` },
      { author: 'quietgrinder', content: `Lurked here for two months, this post is what finally got me on a schedule. 40 days streak now.` },
    ],
  },
  {
    category: 'the-grind',
    author: 'two_sum_tim',
    title: "Day 200 of leetcode and I still can't do DP without looking at the solution",
    daysAgo: 9,
    content: `Not a shitpost, genuine question.

I've done 380 problems total. Arrays, graphs, trees — fine. I can bang out Number of Islands variants in my sleep. But every single DP problem, my brain just refuses. I see "Coin Change" and I know it's DP, I know there's a subproblem, and then I sit there like a golden retriever looking at a chessboard.

Yesterday I spent 90 minutes on House Robber II. HOUSE ROBBER TWO. The one that's just House Robber with a haircut.

Is there a point where it clicks or are some brains just not wired for this?`,
    replies: [
      { author: 'neetcode_disciple', content: `DP didn't click for me until I stopped trying to "see the answer" and started writing the recurrence in plain english first. Literally: "the best I can do at house i is max(rob it + best at i-2, skip it + best at i-1)." Say it out loud. THEN code it. The code is the easy part, the sentence is the hard part.` },
      { author: 'dp_hater_9000', content: `200 days is rookie numbers, I've hated DP for two full years. Real answer though: do the MIT 6.006 DP lectures, then redo the same 10 problems (climbing stairs, house robber, coin change, LIS, edit distance) five times each. Repetition on a SMALL set. It's boring and it works, unfortunately.` },
      { author: 'two_sum_tim', content: `> Repetition on a SMALL set

ok this is the opposite of what I've been doing (panic-solving random DP problems from the problem list roulette). Will report back in 30 days.` },
      { author: 'leetcode_therapist', content: `380 problems and fluent in graphs means your brain is fine. DP is genuinely a different skill — it's math induction cosplaying as programming. Also: House Robber II humbles everyone the first time, the circular constraint is a legit trick. Be nicer to yourself.` },
      { author: 'cracked_freshman', content: `have you tried drawing the recursion tree by hand? sounds tedious but I couldn't do DP either until I drew like 20 of them and started seeing the overlapping subproblems visually` },
    ],
  },
  {
    category: 'the-grind',
    author: 'mia_codes',
    title: 'Is NeetCode 150 actually enough for FAANG in 2026?',
    daysAgo: 21,
    content: `Sophomore here, aiming for summer 2027 internships. Everyone on this board swears by NeetCode 150 but I keep seeing people on other sites saying you need 500+ problems now because the market is brutal and companies are asking harder questions.

For people who interviewed recently: was 150 well-understood problems enough, or is the inflation real?`,
    replies: [
      { author: 'return_offer_ray', content: `Did ~170 problems total, got Amazon and a Google onsite last cycle. The count matters way less than whether you can solve an UNSEEN medium in 25 minutes while talking. I know people with 600+ solved who freeze the second the problem isn't one they've memorized.` },
      { author: 'faang_or_bust', content: `The inflation is semi-real but it's in OAs, not interviews. OAs have gotten nastier (looking at you, capital one). Actual interviews are still 90% classic patterns. NeetCode 150 + your school's DSA course + mock interviews > 500 problems solo in silence.` },
      { author: 'hashmap_hannah', content: `Enough for the interview? yes. Enough to GET the interview? different problem entirely, and no amount of leetcode fixes a weak resume. Make sure you're not optimizing the wrong funnel stage.` },
      { author: 'mia_codes', content: `> Make sure you're not optimizing the wrong funnel stage

oof. okay yeah I have 0 projects. heading to Resume Roast, thanks everyone` },
    ],
  },
  {
    category: 'the-grind',
    author: 'topofstack',
    title: 'Hot take: grinding leetcode hards is a complete waste of time',
    daysAgo: 15,
    content: `Fight me.

I've done every FAANG loop except Netflix this cycle. Total hards asked across 14 rounds: **one** (Median of Two Sorted Arrays at Google, and honestly it's the most famous hard in existence).

Everything else was mediums with follow-ups. The follow-ups are where they grade you: "what if the input doesn't fit in memory," "what if it's streaming," "make it thread safe."

If you can do every NeetCode medium AND handle three follow-up escalations, you're better prepared than the guy with 90 hards solved who's never been asked "and how would you test this?"`,
    replies: [
      { author: 'anon_quant', content: `Mostly true for big tech, completely false for trading firms. Citadel and HRT asked me hards in every round, sometimes two. Know your target.` },
      { author: 'bigO_bob', content: `Half agree. Hards are bad interview prep but a small dose is good training — they force you to combine two patterns, which is exactly what a mean medium follow-up does. 10-15 famous hards (LRU Cache if you count it, Trapping Rain Water, Word Ladder, Merge k Lists) covers it. 90 is definitely masochism.` },
      { author: 'topofstack', content: `> Know your target

fair, quant is its own planet. big tech + unicorns, my take stands` },
      { author: 'segfault_sami', content: `The "how would you test this" follow-up has ended more of my interviews than any hard problem ever did lol. Nobody prepares for it and it's asked constantly.` },
    ],
  },
  {
    category: 'the-grind',
    author: 'neetcode_disciple',
    title: 'My 8-week study plan that got me 4 onsites (steal it)',
    daysAgo: 33,
    content: `By request from the discord — the exact plan. Context: junior, mid-tier state school, one previous internship at a no-name company.

**Weeks 1-2: foundations**
- Arrays, strings, hashmaps, two pointers, sliding window
- ~25 problems. If any of these take >20 min you're not ready to move on

**Weeks 3-4: the money patterns**
- Trees (BFS/DFS/BSTs), then graphs. ~30 problems
- Started 1 timed mock per week here (pramp, or a friend + a whiteboard)

**Weeks 5-6: the fear zone**
- Heaps, intervals, backtracking, intro DP (1D only)
- This is where everyone quits. ~25 problems, lots of re-dos

**Weeks 7-8: simulation mode**
- 2 timed mocks per week, full 45-min format, talking out loud
- Re-solved every problem I'd ever missed, nothing new
- Behavioral prep: 6 STAR stories written down (conflict, failure, leadership, deadline, ambiguity, proudest work)

Results: Amazon, Google, Datadog, Ramp onsites. Signed with one of them (offer breakdown coming to Salary Check when I stop being paranoid about doxxing myself).

The re-dos matter more than the first solves. That's the whole secret.`,
    replies: [
      { author: 'offszn_arc', content: `"the fear zone" is so real. week 5-6 is where the gym gets empty, same energy` },
      { author: 'deadline_dana', content: `me, currently on week 5 of this exact arc, feeling extremely called out. the backtracking problems are eating me alive` },
      { author: 'julia_swe', content: `+1 on writing the STAR stories DOWN. everyone thinks they can wing behavioral. you cannot wing "tell me about a time you disagreed with a teammate" at 9am with an L6 staring at you.` },
      { author: 'imposter_synd_dev', content: `4 onsites from a mid-tier school is genuinely impressive, the resume had to be doing some work too. what did your projects look like?` },
      { author: 'neetcode_disciple', content: `> what did your projects look like

nothing crazy — a discord bot with actual users (~2k servers) and a compiler class project I extended. the bot got asked about in literally every interview. one real project with real users >>> five tutorial clones.` },
    ],
  },
  {
    category: 'the-grind',
    author: 'caffeine_overflow',
    title: "anyone else physically incapable of doing leetcode after 9pm",
    daysAgo: 5,
    content: `daytime me: solves mediums, understands amortized analysis, functional human being

9:47pm me: reads "given an array of integers" and my eyes slide off the screen like it's written in aramaic. spent 40 minutes on a problem tonight before realizing I'd misread the constraints THREE times.

is night grinding a myth or is my brain just built different (worse)`,
    replies: [
      { author: 'terminal_velociraptor', content: `opposite for me, I can only focus after midnight when the group chat dies. brains are just different. stop fighting yours and schedule around it` },
      { author: 'leetcode_therapist', content: `this is just circadian rhythm, not a personal failing. working memory tanks when you're tired and LC is basically pure working memory. morning problems, evening review — reviewing old solutions is way more tolerant of a tired brain.` },
      { author: 'caffeine_overflow', content: `> morning problems, evening review

tried this for 3 days and I hate how well it works. username no longer accurate` },
    ],
  },
  {
    category: 'the-grind',
    author: 'offszn_arc',
    title: 'Sliding window finally clicked and I feel like I unlocked a cheat code',
    daysAgo: 26,
    content: `For months I treated sliding window problems as "two pointer problems that hate me." Longest Substring Without Repeating Characters took me 50 minutes the first time.

Then someone here (I think it was neetcode_disciple?) said: "the window is a promise — everything inside it is always valid, and your only job is to restore the promise when it breaks."

That one sentence rewired me. Now every window problem is the same three lines of logic: expand right, check if the promise broke, shrink left until it's fixed. Did Minimum Window Substring — a HARD — in 25 minutes yesterday.

Whoever needs to hear it: the patterns really do click eventually, and it happens all at once.`,
    replies: [
      { author: 'binarytreehugger', content: `"the window is a promise" is going in my notes verbatim. congrats on the click, the first hard solve is a milestone fr` },
      { author: 'neetcode_disciple', content: `wasn't me but I'm stealing it too lmao. that's a genuinely great mental model` },
      { author: 'mia_codes', content: `ok but can someone do this for backtracking. what's the one sentence. I need the one sentence` },
      { author: 'dp_hater_9000', content: `> what's the one sentence

"try it, and if the universe collapses, untry it." that's literally all backtracking is — choose, explore, unchoose.` },
    ],
  },
  {
    category: 'the-grind',
    author: 'bigO_bob',
    title: 'Graph problems: my BFS vs DFS decision cheat sheet',
    daysAgo: 41,
    content: `Wrote this for a study group, posting since the question comes up weekly.

**Reach for BFS when:**
- Shortest path in an UNWEIGHTED graph (the big one — "minimum number of steps" is a BFS bat-signal)
- Level-by-level anything (level order traversal, rot the oranges, word ladder)
- The answer is "closest" or "fewest"

**Reach for DFS when:**
- Exhaustive exploration (count islands, flood fill, connected components)
- Path existence, cycle detection, topological sort (Course Schedule and friends)
- Backtracking is involved
- Tree problems, basically always (recursion is free DFS)

**Either works:** plain connectivity checks. Pick DFS, it's less code.

**Neither:** weighted shortest path. That's Dijkstra and if a new grad interview asks for Dijkstra beyond "name it," they're hazing you.

Corrections welcome, I will defend every line in the replies.`,
    replies: [
      { author: 'sysdesign_sam', content: `Solid. One nitpick: 0-1 BFS with a deque covers "weighted but weights are only 0 or 1" and it shows up in OAs more than it should. Niche but real.` },
      { author: 'bigO_bob', content: `> 0-1 BFS

acceptable nitpick. added to my notes with a citation to you.` },
      { author: 'grad_szn_2027', content: `"recursion is free DFS" just fixed trees for me. why did nobody phrase it like this in class` },
      { author: 'segfault_sami', content: `they're hazing you LMAO. got asked to implement A* in a game company interview once. I named it and left (they did not call back, worth it)` },
    ],
  },
  {
    category: 'the-grind',
    author: 'ghosted_again',
    title: 'Failed the SAME question at two different companies. Universe is bullying me',
    daysAgo: 3,
    content: `Three weeks ago, Meta phone screen: Merge Intervals variant. Fumbled the sorting comparator, ran out of time on the follow-up. Rejected in 48 hours.

So obviously I drilled intervals for a week straight. Insert Interval, Non-overlapping Intervals, Meeting Rooms I and II, all of it. Cold.

Yesterday, Uber phone screen. Interviewer shares the doc. It's Merge Intervals. I laughed out loud, which the interviewer probably interpreted as confidence.

Reader, I fumbled a DIFFERENT part this time. Overcorrected so hard on the comparator that I wrote the merge condition backwards and debugged it for 15 minutes.

Anyway. Meeting Rooms III just dropped on my study list. See you all in the trenches.`,
    replies: [
      { author: 'leetcode_therapist', content: `Failing a drilled problem is almost always nerves, not knowledge — your hands knew the answer, your adrenaline didn't. Have you tried mocks with a real human watching? The exposure therapy aspect matters more than the problems.` },
      { author: 'two_sum_tim', content: `the universe said "you will learn intervals in ALL their forms" 💀 respect the grind, this post is both tragic and extremely funny` },
      { author: 'wagie_in_training', content: `overcorrecting on the exact thing you failed last time and breaking a new thing is the most relatable content on this entire site` },
      { author: 'ghosted_again', content: `> mocks with a real human watching

booked two pramp sessions. if I fail merge intervals a THIRD time I'm framing it` },
    ],
  },
  {
    category: 'the-grind',
    author: 'anon_quant',
    title: 'LC contest rating vs actual interview performance — weak correlation, here is my theory',
    daysAgo: 55,
    content: `Data point from my (small, biased, whatever) circle of 11 people who interviewed last cycle:

- Highest contest rating (2100+, knight): 1 offer from 6 loops
- Guy who has never done a contest: 4 offers from 5 loops

The contest grinder is genuinely better at algorithms. But contests train you to solve in SILENCE at maximum speed with zero communication. Interviews grade you on narrating your uncertainty, asking clarifying questions, and taking hints gracefully — skills contests actively punish.

The 4-offer guy talks through problems like a cooking show host. "Right now I'm noticing the array is sorted, which makes me want to binary search, but let me check the edge case first..."

If you're contest-pilled and failing interviews, the missing skill is narration, not algorithms. Practice being interruptible.`,
    replies: [
      { author: 'hashmap_hannah', content: `"contests train skills interviews punish" is the sharpest thing posted here this month. the taking-hints-gracefully part especially — I've watched a mock partner ignore three hints because acknowledging them felt like losing points.` },
      { author: 'cracked_freshman', content: `as a contest person: painfully accurate. my first mock interview the guy said "walk me through your thinking" and I realized I had never once thought in words` },
      { author: 'faang_or_bust', content: `counterpoint: contest rating gets you PAST the OA which is where 70% of applicants die. both matter, different stages` },
      { author: 'anon_quant', content: `> both matter, different stages

agreed actually — contests for OAs, narration for humans. the mistake is training only one.` },
    ],
  },

  // ---- Resume Roast ----
  {
    category: 'resume-roast',
    author: 'lockedin_lena',
    title: 'How to get roasted (and not get doxxed): read before posting',
    daysAgo: 118,
    pinned: true,
    content: `Welcome to the roast. The feedback here is blunt because sugarcoating costs you interviews. Rules:

**Before you post:**
- REDACT: name, phone, email, address, LinkedIn URL, school name if you want (city + "large state school" is fine)
- Export as text or describe your bullets — no photo uploads of your full unredacted resume, we can't unsee your phone number
- Say your target: intern vs new grad, and what kind of company

**What good feedback looks like here:**
- "Bullet 2 says 'helped with backend' — helped how? what did YOU build, what did it handle?"
- Not "this is bad lol"

**The three sins we roast hardest:**
1. Bullets with no numbers ("improved performance" — by how much? measured how?)
2. Tech-stack soup ("used React, Node, Express, MongoDB, Docker, K8s, AWS" on a todo app)
3. Course projects dressed up as startups

Roast hard, roast kind. The resume is the target, never the person.`,
    replies: [
      { author: 'og_intern', content: `Pinning this. Also a reminder from the mod side: anyone being cruel instead of useful collects a warning. There's a difference and you know what it is.` },
      { author: 'ref_pls', content: `> course projects dressed up as startups

"Co-Founder & CEO, three-person class project that disbanded in December" lives in my head rent free` },
    ],
  },
  {
    category: 'resume-roast',
    author: 'gpa_2_9_no_hope',
    title: 'Roast me: 2.9 GPA, zero internships, graduating in May. Full honesty mode.',
    daysAgo: 12,
    content: `The username is the situation. Large state school, CS major, 2.9 GPA (bad sophomore year, long story, mostly my fault). Zero internships — got close twice, never converted. Graduating May 2027.

What I have:
- A self-hosted media server project (Docker, runs on a homelab, my whole family uses it, survived 3 "production incidents" caused by my brother)
- A Chrome extension with 900 users that auto-formats citations (real reviews, 4.6 stars)
- TA for intro programming, 2 semesters
- Random hackathon projects of varying embarrassment levels

Current resume has GPA on it because I read leaving it off looks worse. Bullets are honestly kind of soft. Should I lead with projects? Do I mention the extension user count? Is 2.9 + no internships just cooked for new grad SWE or is there a real path here?`,
    replies: [
      { author: 'hashmap_hannah', content: `Drop the GPA. "Leaving it off looks worse" is a myth below 3.0 — leaving it ON guarantees the filter, leaving it off at least gets you to a human. Lead with the extension: 900 users and 4.6 stars is real adoption, that's more than most people with 3.8s have. "Built and shipped a Chrome extension used by 900+ people (4.6★)" is your top bullet, full stop.` },
      { author: 'return_offer_ray', content: `You're not cooked but your path is different: mid-size companies and startups who interview on projects, not resume-screen-by-GPA. The homelab thing is a sleeper hit for infra/devops-flavored roles btw — "survived 3 production incidents" is unironically the energy of a good SRE bullet if you write up what broke and how you fixed it.` },
      { author: 'faang_or_bust', content: `real talk: big tech new grad is a longshot this cycle with those stats, apply anyway but don't emotionally invest. 6 months into a first job somewhere normal, none of this matters anymore. the first job is the hard one, the GPA expires immediately after.` },
      { author: 'gpa_2_9_no_hope', content: `> the GPA expires immediately after

needed to hear that today, thanks. rewriting bullets tonight — extension first, homelab as "self-hosted infrastructure project" with the incident stories. will repost next week for round 2.` },
      { author: 'binarytreehugger', content: `also: TA for 2 semesters is being slept on in this thread. teaching intro programming = communication skills + patience + explaining code to confused humans, which is literally the job. give it a real bullet with section sizes.` },
    ],
  },
  {
    category: 'resume-roast',
    author: 'deadline_dana',
    title: "Recruiter told me my resume 'reads like AI wrote it.' It didn't. Now what?",
    daysAgo: 19,
    content: `Career fair last week. Handed my resume to a recruiter at a mid-size company, she skimmed it and said — nicely! — "tip: this reads like ChatGPT wrote it, you should make it sound more like you."

I wrote every word myself over like six painful evenings.

Looking at it again with fresh eyes... every bullet starts with "Spearheaded," "Orchestrated," or "Leveraged." Everything "resulting in a 40% improvement." I did use one of those resume guides with the "action verbs" list, and I guess the whole internet used the same list, and now human-written resumes and AI resumes have converged on the same beige dialect.

How do you write bullets that sound like a person without sounding unprofessional?`,
    replies: [
      { author: 'julia_swe', content: `The fix that worked for me: say the thing you'd say OUT LOUD if a friend asked "so what did you actually do?" Then tighten it. "Spearheaded development of caching layer" → "Built the cache that cut page loads from 3s to 800ms." Verbs like Built, Wrote, Fixed, Shipped, Cut, Found. Boring verbs + specific results = human.` },
      { author: 'og_intern', content: `Recruiter perspective from my mentor: "orchestrated" for a solo class project is an instant tell, because no human describes their own work that way. The word choice isn't the crime, the mismatch between word and scope is. "Leveraged" a hackathon? No. You USED it.` },
      { author: 'wagie_in_training', content: `"the same beige dialect" is poetry. also lol at 40% — every resume improvement is 40% because 40% is the most believable fake number. if it's real, say how you measured it, that's the credibility signal` },
      { author: 'deadline_dana', content: `rewrote 8 bullets with the "say it out loud" test and the difference is embarrassing. "Spearheaded implementation of automated testing infrastructure" was, in reality, "Wrote the CI pipeline so tests run on every PR." posting the before/after when done.` },
    ],
  },
  {
    category: 'resume-roast',
    author: 'nyc_or_nothing',
    title: 'One page vs two: settling the eternal war (spoiler: one, and here is when it isn’t)',
    daysAgo: 47,
    content: `This argument breaks out in every thread so let's contain it here.

**One page if:** student, new grad, or under ~4 years of experience. This is 99% of this board. Every recruiter survey, every hiring manager AMA, every mentor I've asked: one page. They spend 15-30 seconds. Page two of a student resume contains, at best, a second hackathon and your Spotify wrapped.

**Two pages defensible if:** actual industry experience past 4-5 years, or academic CV (different genre entirely), or government roles that legally require your life story.

The REAL problem isn't the page count, it's that cutting to one page forces the question you're avoiding: which of these things actually matters? If you can't cut it, you don't know your own value prop yet — and that shows up in interviews too.`,
    replies: [
      { author: 'embedded_emily', content: `agree for SWE. small caveat for hardware-adjacent roles: a short "relevant coursework + lab skills" block matters more and space gets tight, but the answer is still cut a project, not add a page` },
      { author: 'topofstack', content: `"page two contains your spotify wrapped" ok this one got me. one page gang, but I'll die on the hill that a github link with actual pinned repos is worth more than half the bullets anyway` },
      { author: 'mango_db', content: `me reading this with my 1.15 page resume where the .15 is one orphaned bullet about excel: I'm in danger` },
    ],
  },
  {
    category: 'resume-roast',
    author: 'startup_simp',
    title: 'Put my Minecraft server on my resume as "distributed systems experience" — got 3 callbacks',
    daysAgo: 30,
    content: `Half confession, half data point.

I ran a modded Minecraft server for 4 years. Peak 300 concurrent players, custom plugins, a proxy layer across three machines because one JVM couldn't take it, automated backups after The Great Corruption of 2023, even a little status dashboard.

For years I left it off my resume because it felt unserious. Last month I rewrote it in grown-up words:

- "Operated a game server community for 4 years; scaled to 300 concurrent users across 3 hosts behind a proxy"
- "Wrote 12 Java plugins (custom economy, anti-cheat heuristics, event scheduling)"
- "Built monitoring dashboard + automated backup/restore after a data-loss incident"

Three callbacks in two weeks, and TWO interviewers asked about it first. One said "this is more real ops experience than most interns have." The anti-cheat heuristics discussion carried a whole behavioral round.

Lesson: you probably have experience you're hiding because it doesn't feel corporate. Translate it, don't bury it.`,
    replies: [
      { author: 'sarah.builds', content: `THIS. the "unserious" projects with real users teach you things tutorials can't: users lie, backups matter, everything breaks on saturday. my discord bot got me my internship. post your weird projects, people.` },
      { author: 'sysdesign_sam', content: `a minecraft proxy layer is unironically a load balancer with extra steps. you've dealt with state sync, connection handoff, and capacity planning. that IS distributed systems, no scare quotes needed.` },
      { author: 'grad_szn_2027', content: `well now I'm rewriting my "ran a 2k member discord" experience instead of hiding it. "community operations + custom moderation tooling"... it's honest and it sounds real because it is` },
      { author: 'bigO_bob', content: `The Great Corruption of 2023 deserves its own war stories thread honestly` },
    ],
  },
  {
    category: 'resume-roast',
    author: 'quietgrinder',
    title: 'Update: applied this board’s roast advice, went from 0 OAs to 5 in two weeks',
    daysAgo: 7,
    content: `Follow-up to a roast from last month (I was too shy to post the resume publicly, a few regulars roasted it in DMs — thank you, you know who you are).

What changed, in order of impact (my guess):

1. **Killed the objective statement.** Four lines of "passionate self-starter seeking opportunities" replaced with... nothing. Recruiters know why I'm applying. It's a job application.
2. **Numbers on every bullet.** Even small honest ones. "Cut API response time ~200ms by adding an index" beats "optimized database performance." Small and real > big and vague.
3. **Projects section above experience** (my only experience was retail — kept ONE line of it for work-ethic signal, which two people said they actually like seeing).
4. **One page.** RIP my second hackathon and my "proficient in Microsoft Office" line, you will not be missed.

Same applications-per-week, same job boards, same me. 0 → 5 OAs. The resume was the bottleneck the whole time and I spent six months blaming the market.

Not saying the market isn't rough — it is. But test the cheap fix first.`,
    replies: [
      { author: 'hashmap_hannah', content: `"small and real beats big and vague" should be on the pinned post. congrats — now go pass those OAs, the grind thread is thataway` },
      { author: 'ghosted_again', content: `> spent six months blaming the market

calling me out for free like this. fine. FINE. posting mine for roast this weekend` },
      { author: 'lockedin_lena', content: `Love a follow-up post with receipts. This is exactly why the roast exists. Linking this from the pinned guide.` },
    ],
  },
];
