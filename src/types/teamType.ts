import type { playerType } from '@/types/playerType.ts'
import type { goalType } from '@/types/goalType.ts'

type teamType = {
  name: string,
  players: playerType[],
  trainers: string[],
  goals: goalType[]
}

export type {teamType}
