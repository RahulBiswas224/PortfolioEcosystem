// prisma/seed.js
'use strict'

require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const { PrismaNeon }   = require('@prisma/adapter-neon')
const bcrypt           = require('bcryptjs')

const adapter = new PrismaNeon({ connectionString: process.env.DIRECT_URL })
const db      = new PrismaClient({ adapter })

async function main() {
  console.log('🌱  Seeding database …')

  const hashedPassword = await bcrypt.hash('password123', 10)

  const alice = await db.author.upsert({
    where:  { email: 'alice@example.com' },
    update: {},
    create: {
      name:        'Alice Nguyen',
      email:       'alice@example.com',
      password:    hashedPassword,
      bio:         'Full-stack engineer and technical writer.',
      githubUrl:   'https://github.com',
      linkedinUrl: 'https://linkedin.com',
    },
  })

  const bob = await db.author.upsert({
    where:  { email: 'bob@example.com' },
    update: {},
    create: {
      name:      'Bob Okafor',
      email:     'bob@example.com',
      password:  hashedPassword,
      bio:       'Open-source contributor and DevOps enthusiast.',
      githubUrl: 'https://github.com',
    },
  })

  const tagData = [
    { name: 'JavaScript', slug: 'javascript' },
    { name: 'PostgreSQL', slug: 'postgresql' },
    { name: 'Prisma',     slug: 'prisma' },
    { name: 'DevOps',     slug: 'devops' },
  ]

  const tags = await Promise.all(
    tagData.map(t => db.tag.upsert({ where: { slug: t.slug }, update: {}, create: t }))
  )

  const [, tagPG, tagPrisma, tagDevOps] = tags

  await db.post.upsert({
    where:  { slug: 'getting-started-with-prisma-7' },
    update: {},
    create: {
      title:       'Getting Started with Prisma 7',
      slug:        'getting-started-with-prisma-7',
      excerpt:     'A practical guide to setting up Prisma 7 with Neon PostgreSQL.',
      content:     '## Introduction\n\nPrisma 7 ships with a revamped query engine …',
      published:   true,
      publishedAt: new Date(),
      authorId:    alice.id,
      tags: {
        create: [
          { tag: { connect: { id: tagPrisma.id } } },
          { tag: { connect: { id: tagPG.id } } },
        ],
      },
    },
  })

  await db.post.upsert({
    where:  { slug: 'zero-downtime-deployments-with-neon' },
    update: {},
    create: {
      title:       'Zero-Downtime Deployments with Neon',
      slug:        'zero-downtime-deployments-with-neon',
      excerpt:     'Branch your database the same way you branch your code.',
      content:     '## Why Neon Branches Matter\n\nNeon branching model …',
      published:   true,
      publishedAt: new Date(),
      authorId:    bob.id,
      tags: {
        create: [
          { tag: { connect: { id: tagDevOps.id } } },
          { tag: { connect: { id: tagPG.id } } },
        ],
      },
    },
  })

  console.log('✅  Seed complete.')
  console.log('   Login: alice@example.com / password123')
  console.log('   Login: bob@example.com   / password123')
}

main()
  .catch(e => { console.error('❌  Seed failed:', e); process.exit(1) })
  .finally(() => db.$disconnect())