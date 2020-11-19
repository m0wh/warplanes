import { BufferGeometry, PointsMaterial, Points, Float32BufferAttribute } from 'three'
import raf from './utils/raf'

export default function createParticles (color: number) {
  const geometry = new BufferGeometry()
  const material = new PointsMaterial({
    color,
    opacity: 0.6,
    transparent: true,
    size: 0.05
  })

  const data = []
  let vertices = []
  for (let i = 0; i < 2000; i++) {
    const pos = Math.random() * Math.PI * 2
    const dist = Math.random() / Math.random() * 3
    data.push({
      x: Math.sin(pos) * dist,
      y: Math.cos(pos) * dist,
      z: Math.random() * 6 - 3
    })
  }

  data.forEach(p => {
    vertices.push(p.x, p.y, p.z + 3)
  })

  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))
  const particles = new Points(geometry, material)

  raf.subscribe((time) => {
    vertices = []
    data.forEach(p => {
      const deltaZ = time / 200
      const newPos = (p.z - deltaZ) % 4
      vertices.push(p.x, p.y, newPos + 3)
    })

    geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))
  })

  return particles
}
