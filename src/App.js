import './style.scss'
import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const init = (canvas) => {
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })

  // scene
  const scene = new THREE.Scene()

  // Camera
  const aspectRatio = sizes.width / sizes.height
  // const cameraOffset = 4
  // const camera = new THREE.OrthographicCamera(
  //   -cameraOffset * aspectRatio,
  //   cameraOffset * aspectRatio,
  //   cameraOffset,
  //   -cameraOffset,
  //   0.1,
  //   100
  // )
  const camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 100)
  scene.add(camera)
  camera.position.set(0, 5, 10)

  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true

  // Objects
  const group = new THREE.Group()
  group.position.set(0, 0, 0)
  scene.add(group)

  const material = new THREE.MeshNormalMaterial({ flatShading: true })

  const base = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    new THREE.MeshBasicMaterial({ color: '#444' })
  )
  base.rotation.x = -Math.PI * 0.5
  scene.add(base)

  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.8, 2, 40), material)
  cone.position.set(-1, 1, 0.6)
  group.add(cone)

  const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1.6, 1), material)
  box.position.set(1.6, 0.8, 0)
  box.rotation.y = 0.6
  group.add(box)

  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 16), material)
  ball.position.set(-0.2, 0.7, -0.8)
  group.add(ball)

  // Axes helper
  const axesHelper = new THREE.AxesHelper(2)
  scene.add(axesHelper)

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const clock = new THREE.Clock()

  const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // camera.position.y = Math.cos(elapsedTime * Math.PI * 0.4) + 5
    // camera.position.x = Math.sin(elapsedTime * Math.PI * 0.1) * 10
    // camera.position.z = Math.cos(elapsedTime * Math.PI * 0.1) * 10

    camera.lookAt(cone.position)

    controls.update()

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
