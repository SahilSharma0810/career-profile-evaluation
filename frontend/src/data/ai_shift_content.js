const AI_SHIFT_COMPANIES = [
  {
    company: 'Google',
    quote: 'In 2026, 25% of all new code at Google was written by AI — then reviewed and shipped by engineers.',
    attribution: 'Sundar Pichai confirmed this at Google I/O 2024.',
    context: 'The engineers reviewing that code are still employed; the ones who can\'t are not.',
    bullets: [
      'L4/L5 interviews now include dedicated AI code review rounds.',
      'Output is measured by AI-augmented velocity.'
    ],
    stats: [
      { value: '25%', label: 'of new code written by AI', source: 'Google I/O 2024' },
      { value: '12K', label: 'roles cut in 2023', source: 'Reuters, Jan 2023' }
    ]
  },
  {
    company: 'Amazon',
    quote: 'Amazon Q saved 4,500 developer-years of migration work — in just a few months.',
    attribution: 'Amazon Q migrated 30,000 production Java apps autonomously.',
    context: 'A team of 5 now ships like a team of 15. Headcount isn\'t coming back.',
    bullets: [
      'Backend JDs now require AI-assisted development experience.'
    ],
    stats: [
      { value: '4.5K', label: 'developer-years saved', source: 'AWS re:Invent 2024' },
      { value: '27K', label: 'roles cut 2022–2024', source: 'Bloomberg, 2024' }
    ]
  },
  {
    company: 'Meta',
    quote: 'In 2025, AI will write code at the level of a mid-level engineer.',
    attribution: 'Zuckerberg said this on the Joe Rogan podcast (Jan 2025). Meta restructured around AI-augmented teams.',
    context: 'The "Year of Efficiency" — mid-level engineers now need to lead, not implement.',
    bullets: [
      'New hires are screened for AI-system design from day one.'
    ],
    stats: [
      { value: '21K', label: 'roles cut in "Year of Efficiency"', source: 'Meta earnings, layoffs.fyi' },
      { value: '3×', label: 'productivity target for AI teams', source: 'Meta engineering, 2024' }
    ]
  },
  {
    company: 'Klarna',
    quote: 'Our AI assistant does the work of 700 full-time agents. We\'ve stopped backfilling.',
    attribution: 'Klarna\'s AI handles 2/3 of all customer service chats — in the first month.',
    context: 'Engineering headcount dropped from 5,000 to 3,800 in 12 months.',
    bullets: [
      'Remaining engineers must own AI-integrated systems.'
    ],
    stats: [
      { value: '700', label: 'jobs replaced by AI in year one', source: 'Klarna press release, 2024' },
      { value: '$40M', label: 'saved annually', source: 'Financial Times, 2024' }
    ]
  }
];

export default AI_SHIFT_COMPANIES;
