import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: 'https://stable-porpoise-5763.upstash.io',
  token: 'ARaDAAImcDIxOTIxNDdkZDBjZDY0NTJiYjQyMTk3MzI4M2I1NTg4Y3AyNTc2Mw',
})

export default redis;