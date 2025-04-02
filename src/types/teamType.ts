import type { playerType } from '@/types/playerType.ts'

type teamType = {
  name: string,
  players: playerType[],
  trainers: string[]
}

export type {teamType}
