import { Environment } from 'vitest';

export default <Environment>{
  // eslint-disable-next-line prettier/prettier
  name: 'prisma',
  async setup() {
    console.log('setup')

    return {
      async teardown() {
        console.log('Teardown')
      }
    }
  }
}