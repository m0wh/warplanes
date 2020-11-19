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
camera.position.y = -3

const planes = [
  new Plane({
    model: spitfireModel,
    propeller: ['Cube006', 'Cube007', 'Cube008', 'BOUT'],
    color: 0xFF9900
  }),
  new Plane({
    model: spitfireModel,
    propeller: ['Cube006', 'Cube007', 'Cube008', 'BOUT'],
    color: 0xFF9900
  }),
  new Plane({
    model: spitfireModel,
    propeller: ['Cube006', 'Cube007', 'Cube008', 'BOUT'],
    color: 0xFF9900
  })
]

const particles = createParticles(0xFF9900)
scene.add(particles)

planes.forEach(plane => {
  plane.onReady(() => {
    if (planes.every(p => p.ready)) start()
  })
})

function start () {
  planes.forEach(plane => {
    scene.add(plane.object)
    plane.object.children.forEach(part => { part.children.forEach(part => { part.position.set(0, 2.9, -0.1) }) })
  })

  raf.subscribe((time) => {
    camera.lookAt(0, 0, 0)

    const rpm = 200

    planes.forEach((plane, i) => {
      plane.object.getObjectByName('propeller').rotation.z = time * rpm * Math.PI / 30000

      const val = ((i * Math.PI * 2) / planes.length - 1) + time / 500

      const global = {
        rotation: {
          x: 0,
          y: 0,
          z: -val - Math.PI / 3
        },
        position: {
          x: Math.sin(val) * 2,
          y: Math.cos(val) * 1,
          z: Math.cos(val) * -2
        }
      }

      const perturbations = {
        rotation: {
          x: ((Math.cos(time / 1724) / 10) +
              (Math.cos(time / (674 + i * 4)) / 50) +
              (Math.cos(time / (-220 - i * 10)) / 100)) * -0.8,
          y: 0,
          z: (Math.sin((time - (i * 137)) / -2030) / 6) +
             (Math.sin((time - (i * 337)) / 930) / 12) +
             (Math.sin((time - (i * 783)) / (-574 + i * 9)) / 25) +
             (Math.sin((time - (i * 824)) / (210 + i * 15)) / 50) +
             (Math.sin(time / (70 + i * 30)) / 300)
        },
        position: {
          x: 0,
          y: (Math.sin((time + (i * 856)) / (1724 - i)) / 10) +
             (Math.sin(time / (674 + i)) / 50) +
             (Math.sin((time - (i * 736)) / (-220)) / 100) +
             (Math.sin(time / (40 + i)) / 600),
          z: (Math.cos((time + (i * 276)) / (2947 + i * 10)) / 5) +
             (Math.sin((time - (i * 1022)) / (638 + i)) / 20)
        }
      }

      plane.object.rotation.x = (perturbations.rotation.x + global.rotation.x) % Math.PI * 2
      plane.object.rotation.y = (perturbations.rotation.y + global.rotation.y) % Math.PI * 2
      plane.object.rotation.z = (perturbations.rotation.z + global.rotation.z) % Math.PI * 2

      plane.object.position.x = perturbations.position.x + global.position.x
      plane.object.position.y = perturbations.position.y + global.position.y
      plane.object.position.z = perturbations.position.z + global.position.z
    })

    composer.render()
  })
}
