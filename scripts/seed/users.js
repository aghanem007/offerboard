/**
 * Seed users. Handles are the kind CS students actually pick; each has a
 * loose persona so their posts stay in character across threads.
 * Emails live on a reserved domain so the wipe step can find them.
 */

export const SEED_DOMAIN = 'seed.offerboard.local';

export const users = [
  // staff
  { handle: 'og_intern',            role: 'moderator', color: 'green',  daysAgo: 210, online: true  }, // 3x intern, seen everything
  { handle: 'lockedin_lena',        role: 'moderator', color: 'purple', daysAgo: 195, online: false }, // organized, posts guides

  // heavy posters
  { handle: 'faang_or_bust',        role: 'member', color: 'red',    daysAgo: 180, online: true  }, // TC-obsessed, blunt
  { handle: 'two_sum_tim',          role: 'member', color: 'blue',   daysAgo: 174, online: false }, // self-deprecating grinder
  { handle: 'neetcode_disciple',    role: 'member', color: 'teal',   daysAgo: 168, online: true  }, // pattern evangelist
  { handle: 'dp_hater_9000',        role: 'member', color: 'orange', daysAgo: 150, online: false }, // hates dynamic programming, funny
  { handle: 'return_offer_ray',     role: 'member', color: 'green',  daysAgo: 160, online: false }, // got the return offer, helpful
  { handle: 'ghosted_again',        role: 'member', color: 'pink',   daysAgo: 140, online: true  }, // perpetually ghosted, gallows humor
  { handle: 'hashmap_hannah',       role: 'member', color: 'yellow', daysAgo: 132, online: false }, // pragmatic, gives good advice
  { handle: 'anon_quant',           role: 'member', color: 'purple', daysAgo: 120, online: false }, // numbers guy, slightly smug

  // regulars
  { handle: 'sarah.builds',         role: 'member', color: 'blue',   daysAgo: 118, online: false }, // projects over leetcode
  { handle: 'sysdesign_sam',        role: 'member', color: 'teal',   daysAgo: 115, online: false }, // reads papers for fun
  { handle: 'caffeine_overflow',    role: 'member', color: 'red',    daysAgo: 110, online: true  }, // chaotic, posts at 3am
  { handle: 'gpa_2_9_no_hope',      role: 'member', color: 'orange', daysAgo: 104, online: false }, // low GPA anxiety, underdog
  { handle: 'bigO_bob',             role: 'member', color: 'green',  daysAgo: 100, online: false }, // pedantic about complexity
  { handle: 'mia_codes',            role: 'member', color: 'pink',   daysAgo: 96,  online: false }, // sophomore, asks good questions
  { handle: 'embedded_emily',       role: 'member', color: 'yellow', daysAgo: 92,  online: false }, // hardware-adjacent, practical
  { handle: 'startup_simp',         role: 'member', color: 'blue',   daysAgo: 88,  online: true  }, // equity dreamer
  { handle: 'nyc_or_nothing',       role: 'member', color: 'purple', daysAgo: 84,  online: false }, // location snob
  { handle: 'binarytreehugger',     role: 'member', color: 'teal',   daysAgo: 80,  online: false }, // wholesome, encouraging
  { handle: 'segfault_sami',        role: 'member', color: 'red',    daysAgo: 76,  online: false }, // C++ person, war stories
  { handle: 'julia_swe',            role: 'member', color: 'green',  daysAgo: 72,  online: false }, // already signed, pays it forward
  { handle: 'mango_db',             role: 'member', color: 'orange', daysAgo: 66,  online: false }, // pun account, decent takes
  { handle: 'leetcode_therapist',   role: 'member', color: 'pink',   daysAgo: 62,  online: true  }, // talks people off ledges
  { handle: 'wagie_in_training',    role: 'member', color: 'yellow', daysAgo: 58,  online: false }, // ironic doomer
  { handle: 'offszn_arc',           role: 'member', color: 'blue',   daysAgo: 54,  online: false }, // gym + grind metaphors
  { handle: 'terminal_velociraptor',role: 'member', color: 'teal',   daysAgo: 50,  online: false }, // vim zealot
  { handle: 'deadline_dana',        role: 'member', color: 'purple', daysAgo: 46,  online: false }, // always behind, relatable
  { handle: 'ref_pls',              role: 'member', color: 'red',    daysAgo: 42,  online: false }, // referral hunter (polite about it)
  { handle: 'quietgrinder',         role: 'member', color: 'green',  daysAgo: 38,  online: false }, // lurker who finally posts
  { handle: 'csmajor4life',         role: 'member', color: 'orange', daysAgo: 34,  online: false }, // enthusiastic freshman energy
  { handle: 'imposter_synd_dev',    role: 'member', color: 'pink',   daysAgo: 30,  online: false }, // capable but doubts everything
  { handle: 'topofstack',           role: 'member', color: 'yellow', daysAgo: 24,  online: true  }, // confident, sometimes wrong
  { handle: 'cracked_freshman',     role: 'member', color: 'blue',   daysAgo: 18,  online: false }, // scary-good first year
  { handle: 'grad_szn_2027',        role: 'member', color: 'teal',   daysAgo: 10,  online: false }, // brand new, nervous
];

export function emailFor(handle) {
  return handle.replace(/[^a-z0-9_]/gi, '_') + '@' + SEED_DOMAIN;
}
