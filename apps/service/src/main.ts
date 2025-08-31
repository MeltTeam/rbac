import { Bootstrap } from '@/bootstrap/bootstrap'
import { RootModule } from '@/root.module'

Bootstrap.create(RootModule)
  .then(async (bootstrap) => {
    await bootstrap.initConfig()
    await bootstrap.initGlobalSettings()
    await bootstrap.initMiddlewares()
    await bootstrap.initPipes()
    bootstrap.enableHotReload()
    await bootstrap.listen()
  })
  .catch((e) => console.error(e))
