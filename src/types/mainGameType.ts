import type { teamType } from '@/types/teamType.ts'

class mainGameType {
  hostTeam: teamType = {
    name: "",
    players: [],
    trainers: []
  }
  guestTeam: teamType = {
    name: "",
    players: [],
    trainers: []
  }

  constructor() {
    return this
  }
}

export {mainGameType}
