import './style.scss'
import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'

const init = (canvas) => {
  const sizes = { width: window.innerWidth, height: window.innerHeight }

  // scene
  const scene = new THREE.Scene()

  // Camera
  const aspectRatio = sizes.width / sizes.height
  // const camera = new THREE.PerspectiveCamera(45, aspectRatio)
  const camera = new THREE.OrthographicCamera(-3 * aspectRatio, 3 * aspectRatio, 3, -3, 0.1, 300)
  scene.add(camera)
  camera.position.set(0, 5, 15)

  // Objects

  const group = new THREE.Group()
  group.position.set(0, 0, 0)
  scene.add(group)

  const base = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    new THREE.MeshBasicMaterial({ color: '#444' })
  )
  base.rotation.x = -Math.PI * 0.5
  scene.add(base)

  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(0.8, 2, 40),
    new THREE.MeshBasicMaterial({ color: 'orange' })
  )
  cone.position.set(-1, 1, 0.6)
  group.add(cone)

  const box = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1.6, 1),
    new THREE.MeshBasicMaterial({ color: 'tomato' })
  )
  box.position.set(1.6, 0.8, 0)
  box.rotation.y = 0.6
  group.add(box)

  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(0.7, 32, 16),
    new THREE.MeshBasicMaterial({ color: 'teal' })
  )
  ball.position.set(-0.2, 0.7, -0.8)
  group.add(ball)

  const clock = new THREE.Clock()

  // Axes helper
  const axesHelper = new THREE.AxesHelper(2)
  scene.add(axesHelper)

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
  })
  renderer.setSize(sizes.width, sizes.height)

  const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    camera.position.y = Math.cos(elapsedTime * Math.PI * 0.4) + 5
    camera.position.x = Math.sin(elapsedTime * Math.PI * 0.1) * 10
    camera.position.z = Math.cos(elapsedTime * Math.PI * 0.1) * 10

    camera.lookAt(cone.position)

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
  }
  tick()
}

function App() {
  const ref = useRef()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    if (!mounted) {
      setMounted(true)
    }
    if (mounted) {
      init(ref.current)
    }
  }, [mounted])

  return <canvas id="scene" ref={ref} />
}

export default App
