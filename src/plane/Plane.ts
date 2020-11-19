// eslint-disable-next-line no-unused-vars
import { Group, MeshBasicMaterial } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

const draco = new DRACOLoader()
draco.setDecoderConfig({ type: 'js' })
draco.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')

const loader = new GLTFLoader()
loader.setDRACOLoader(draco)

export default class Plane {
  public ready: boolean = false
  private callbacks: Function[] = []
  private propellerParts: string[]
  public object: Group = new Group()

  constructor (params: { model: string, propeller: string[], color: number }) {
    this.propellerParts = params.propeller
    loader.load(params.model, gltf => {
      this.object.add(this.createMesh(gltf, params.propeller, true, params.color))
      this.object.add(this.createMesh(gltf, params.propeller, false, params.color))
      this.ready = true
      this.callbacks.forEach(c => c())
    })
  }

  createMesh (gltf: any, propellerParts: string[], isPropeller: boolean, color: number): Group {
    const object = new Group()
    object.name = isPropeller ? 'propeller' : 'plane'
    const material = new MeshBasicMaterial({ wireframe: true, color })

    gltf.scene.traverse((node) => {
      if (!node.isMesh) return

      node.visible = isPropeller ? propellerParts.includes(node.name) : !propellerParts.includes(node.name)
      node.material = material
      node.material.wireframe = true
    })

    object.add(gltf.scene.clone())
    return object
  }

  onReady (callback: Function): void {
    if (this.ready) callback()
    else this.callbacks.push(callback)
  }
}
