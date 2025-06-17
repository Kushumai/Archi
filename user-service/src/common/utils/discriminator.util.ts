import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

export function generateDiscriminator(): string {
  const random = Math.floor(Math.random() * 0xfffff)
  return random.toString(36).padStart(4, '0')
}

export async function generateUniqueDiscriminator(
  prismaCreateFn: (discriminator: string) => Promise<any>,
  maxAttempts = 5,
) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const discriminator = generateDiscriminator()

    try {
      return await prismaCreateFn(discriminator)
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2002' &&
        Array.isArray((err.meta as any)?.target) &&
        (err.meta as any).target.includes('firstName_lastName_discriminator')
      ) {
        continue
      }
      throw err
    }
  }

  throw new Error('Échec : impossible de générer un discriminator unique')
}
