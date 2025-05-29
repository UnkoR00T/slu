import {type App, inject} from 'vue'
import Plausible from 'plausible-tracker'

let plausible: any = null

function setupPlausible(app: App<Element>) {
  if (import.meta.env.PROD) {
    plausible = Plausible({
      domain: 'slu.joltamp.pl',
    })
    plausible.enableAutoPageviews()
    plausible.enableAutoOutboundTracking()
  }

  app.config.globalProperties.$plausible = plausible
}

function usePlausible() {
  return plausible
}

export {setupPlausible, usePlausible}
