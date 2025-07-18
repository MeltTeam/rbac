import { Bootstrap } from './Bootstrap/Bootstrap'
import { RootModule } from './root.module'
/** 热重载指令 */
declare const module: any
Bootstrap.create(RootModule)
  .then(async (bootstrap) => {
    await bootstrap.init()
    await bootstrap.listen()
    if (module.hot) {
      module.hot.accept()
      module.hot.dispose(() => Bootstrap.app.close())
    }
  })
  .catch((e) => {
    console.log(e)
  })
