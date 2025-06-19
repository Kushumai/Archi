import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

export function generateDiscriminator(length = 4): string {
  const base = 36
  const max = Math.pow(base, length)
  const num = Math.floor(Math.random() * max)
  return num.toString(base).padStart(length, '0')
}

export async function generateUniqueDiscriminator(
  prismaCreateFn: (discriminator: string) => Promise<any>,
  maxAttempts = 10,
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
