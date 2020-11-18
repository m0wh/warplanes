import { init } from './utils/three-helpers'
import raf from './utils/raf'
import Plane from './plane/Plane'
import fx from './effects'
import spitfireModel from './assets/spitfire-mesh.glb'
import createParticles from './particles'
import { Color } from 'three'

const { camera, renderer, scene } = init()
renderer.pixelRatio = 2
scene.background = new Color(0x020808)

const { composer } = fx({ renderer, scene, camera })

camera.position.z = 3
camera.position.x = -4
camera.position.y = 3

const spitfire = new Plane({
  model: spitfireModel,
  propeller: ['Cube006', 'Cube007', 'Cube008', 'BOUT'],
  color: 0xFF9900
})

const particles = createParticles(0xFF9900)
scene.add(particles)

spitfire.onReady(() => {
  scene.add(spitfire.object)
  spitfire.object.children.forEach(part => { part.children.forEach(part => { part.position.set(0, 2.9, -0.1) }) })

  raf.subscribe((time) => {
    camera.lookAt(0, 0, 0)

    // helice
    const rpm = 200
    spitfire.object.getObjectByName('propeller').rotation.z = time * rpm * Math.PI / 30000

    const perturbations = {
      rotation: {
        x: ((Math.cos(time / 1724) / 10) +
            (Math.cos(time / 674) / 50) +
            (Math.cos(time / -220) / 100)) * -0.8,
        y: 0,
        z: (Math.sin(time / -2030) / 6) +
           (Math.sin(time / 930) / 12) +
           (Math.sin(time / -574) / 25) +
           (Math.sin(time / 210) / 50) +
           (Math.sin(time / 70) / 300)
      },
      position: {
        x: 0,
        y: (Math.sin(time / 1724) / 10) +
           (Math.sin(time / 674) / 50) +
           (Math.sin(time / -220) / 100) +
           (Math.sin(time / 40) / 600),
        z: 0
      }
    }

    spitfire.object.rotation.x = perturbations.rotation.x
    spitfire.object.rotation.y = perturbations.rotation.y
    spitfire.object.rotation.z = perturbations.rotation.z

    spitfire.object.position.x = perturbations.position.x
    spitfire.object.position.y = perturbations.position.y
    spitfire.object.position.z = perturbations.position.z

    composer.render()
  })
})
