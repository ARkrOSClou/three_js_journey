import './style.scss'
import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const init = (canvas) => {
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  const material = new THREE.MeshStandardMaterial({
    color: '#ccc',
    // flatShading: true,
    // roughness: 0,
    // metalness: 0.2,
  })

  // Base
  const base = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    new THREE.MeshStandardMaterial({ color: '#777' })
  )
  base.rotation.x = -Math.PI * 0.5
  base.receiveShadow = true

  // Objects
  const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1.6, 1), material)
  box.position.set(1.6, 0.8, 0)
  box.rotation.y = 0.6
  box.receiveShadow = true
  box.castShadow = true

  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.8, 2, 50), material)
  cone.position.set(-1, 1, 0.6)
  cone.receiveShadow = true
  cone.castShadow = true

  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.7, 40, 26), material)
  ball.position.set(-0.2, 0.7, -0.8)
  ball.receiveShadow = true
  ball.castShadow = true

  const objects = new THREE.Group()
  objects.position.set(0, 0, 0)
  objects.add(box, cone, ball)

  // Camera
  const aspectRatio = sizes.width / sizes.height
  const camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 50)
  camera.position.set(0, 5, 6)

  // Light
  const ambientLight = new THREE.AmbientLight('#fff', 0.1)

  const directionalLight = new THREE.DirectionalLight('#fff', 0.1)
  directionalLight.position.set(1, 8, 4)
  directionalLight.castShadow = true

  directionalLight.shadow.mapSize.width = sizes.width
  directionalLight.shadow.mapSize.height = sizes.height
  directionalLight.shadow.camera.far = 15

  const pointLight = new THREE.PointLight('#fff', 0.5, 15)
  pointLight.position.y = 3
  pointLight.castShadow = true

  pointLight.shadow.mapSize.width = sizes.width
  pointLight.shadow.mapSize.height = sizes.height

  // Scene
  const scene = new THREE.Scene()
  scene.add(
    base,
    objects,
    camera,
    ambientLight,
    directionalLight,
    pointLight
    //
  )

  // Helpers
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
  scene.add(pointLightHelper)

  const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
  // scene.add(directionalLightHelper)

  const directionalLightCamera = new THREE.CameraHelper(directionalLight.shadow.camera)
  // scene.add(directionalLightCamera)

  // Controls
  const orbitCamera = new OrbitControls(camera, canvas)
  // orbitCamera.autoRotate = true
  orbitCamera.enableDamping = true
  orbitCamera.minDistance = 4
  orbitCamera.maxDistance = 10
  orbitCamera.maxPolarAngle = Math.PI / 2 - 0.1
  orbitCamera.enablePan = false

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  renderer.shadowMap.enabled = true

  window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })

  const clock = new THREE.Clock()

  const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    pointLight.position.x = Math.sin(elapsedTime * Math.PI * 0.2) * 5
    pointLight.position.z = Math.cos(elapsedTime * Math.PI * 0.2) * 5

    orbitCamera.update()

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
