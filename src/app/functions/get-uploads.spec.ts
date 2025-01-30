import { randomUUID } from 'node:crypto'
import { isRight, unwrapEither } from '@/shared/either'
import { makeUpload } from '@/test/factories/make-upload'
import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { getUploads } from './get-uploads'

describe('get uploads', () => {
  it('should be able to get the uploads', async () => {
    const namePattern = randomUUID()

    const upload1 = await makeUpload({
      name: `${namePattern}-1.jpg`,
    })
    const upload2 = await makeUpload({
      name: `${namePattern}-2.jpg`,
    })
    const upload3 = await makeUpload({
      name: `${namePattern}-3.jpg`,
    })
    const upload4 = await makeUpload({
      name: `${namePattern}-4.jpg`,
    })
    const upload5 = await makeUpload({
      name: `${namePattern}-5.jpg`,
    })

    const sut = await getUploads({
      searchQuery: namePattern,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toBe(5)
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload5.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload3.id }),
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload1.id }),
    ])
  })

  it('should be able to get paginated uploads', async () => {
    const namePattern = randomUUID()

    const upload1 = await makeUpload({
      name: `${namePattern}-1.jpg`,
    })
    const upload2 = await makeUpload({
      name: `${namePattern}-2.jpg`,
    })
    const upload3 = await makeUpload({
      name: `${namePattern}-3.jpg`,
    })
    const upload4 = await makeUpload({
      name: `${namePattern}-4.jpg`,
    })
    const upload5 = await makeUpload({
      name: `${namePattern}-5.jpg`,
    })

    let sut = await getUploads({
      searchQuery: namePattern,
      page: 1,
      pageSize: 3,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toBe(5)
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload5.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload3.id }),
    ])

    sut = await getUploads({
      searchQuery: namePattern,
      page: 2,
      pageSize: 3,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toBe(5)
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload1.id }),
    ])
  })

  it('should be able to get the uploads sorted created at', async () => {
    const namePattern = randomUUID()

    const upload1 = await makeUpload({
      name: `${namePattern}-1.jpg`,
      createdAt: new Date(),
    })
    const upload2 = await makeUpload({
      name: `${namePattern}-2.jpg`,
      createdAt: dayjs().subtract(1, 'days').toDate(),
    })
    const upload3 = await makeUpload({
      name: `${namePattern}-3.jpg`,
      createdAt: dayjs().subtract(2, 'days').toDate(),
    })
    const upload4 = await makeUpload({
      name: `${namePattern}-4.jpg`,
      createdAt: dayjs().subtract(3, 'days').toDate(),
    })
    const upload5 = await makeUpload({
      name: `${namePattern}-5.jpg`,
      createdAt: dayjs().subtract(4, 'days').toDate(),
    })

    let sut = await getUploads({
      searchQuery: namePattern,
      sortBy: 'createdAt',
      sortDirection: 'desc',
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toBe(5)
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload1.id }),
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload3.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload5.id }),
    ])

    sut = await getUploads({
      searchQuery: namePattern,
      sortBy: 'createdAt',
      sortDirection: 'asc',
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toBe(5)
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload5.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload3.id }),
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload1.id }),
    ])
  })
})
