import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: 'https://fun-koi-17228.upstash.io',
  token: 'AUNMAAIncDI0N2Q5ZTQ1ZWJkMDQ0N2IwODYwMWZlYjdkMmUyYzQyNnAyMTcyMjg',
})

export default redis;