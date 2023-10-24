import { auth } from '@clerk/nextjs'
import prismaDB from './prisma-db'
import { NextResponse } from 'next/server'

export const increaseApiLimit = async () => {
  const { userId } = auth()
  if (!userId) return new NextResponse("userId not valid", { status: 401 });

  const userApiLimit = await prismaDB.userApiLimit.findUnique({
    where: {
      userId
    }
  })

  if (userApiLimit) {
    await prismaDB.userApiLimit.update({
      where: {
        userId
      },
      data: {
        count: userApiLimit.count + 1
      }
    })
  } else {
    await prismaDB.userApiLimit.create({
      data: {
        userId,
        count: 1
      }
    })
  }
}


export const checkApiLimit = async () => {
  const { userId } = auth()
  if (!userId) return new NextResponse("userId not valid", { status: 401 });

  const max_counts = 5
  const userApiLimit = await prismaDB.userApiLimit.findUnique({
    where: {
      userId
    }
  })

  if (!userApiLimit || userApiLimit.count < max_counts) {
    return true
  } else {
    return false
  }
}


export const getApiLimitCount = async () => {
  const { userId } = auth()
  if (!userId) return 0

  const userApiLimit = await prismaDB.userApiLimit.findUnique({
    where: {
      userId
    }
  })

  if (!userApiLimit) {
    return 0
  } else {
    return userApiLimit.count
  }
}