'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface GolfBallSceneProps {
  variant?: 'dark' | 'light'
  className?: string
}

export default function GolfBallScene({ variant = 'dark', className = '' }: GolfBallSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Colors based on variant
    const isDark = variant === 'dark'
    const fogColor = isDark ? 0x0a0a0a : 0xf8f8f8
    scene.fog = new THREE.FogExp2(fogColor, 0.15)

    // Lighting
    const ambientLight = new THREE.AmbientLight(isDark ? 0x404060 : 0x808090, 0.8)
    scene.add(ambientLight)
    const dirLight = new THREE.DirectionalLight(isDark ? 0x8888ff : 0xffffff, 1.2)
    dirLight.position.set(5, 5, 5)
    scene.add(dirLight)
    const pointLight = new THREE.PointLight(isDark ? 0x22cc66 : 0x00aa44, 0.6, 20)
    pointLight.position.set(-3, 2, 3)
    scene.add(pointLight)

    // Golf balls
    const ballGeometry = new THREE.IcosahedronGeometry(0.3, 3)
    const ballMaterial = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0xffffff : 0xf0f0f0,
      roughness: 0.3,
      metalness: 0.05,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
    })

    const balls: { mesh: THREE.Mesh; speed: THREE.Vector3; rotationSpeed: THREE.Vector3; baseY: number }[] = []
    const ballCount = 8

    for (let i = 0; i < ballCount; i++) {
      const mesh = new THREE.Mesh(ballGeometry, ballMaterial)
      mesh.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6 - 2
      )
      mesh.scale.setScalar(0.5 + Math.random() * 0.8)
      scene.add(mesh)
      balls.push({
        mesh,
        speed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.003,
          (Math.random() - 0.5) * 0.003,
          (Math.random() - 0.5) * 0.002
        ),
        rotationSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.005
        ),
        baseY: mesh.position.y,
      })
    }

    // Particle field (grass/dots)
    const particleCount = 500
    const particleGeometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 3

      // Mix of green and white particles
      if (Math.random() > 0.5) {
        colors[i * 3] = 0.1 + Math.random() * 0.2
        colors[i * 3 + 1] = 0.5 + Math.random() * 0.4
        colors[i * 3 + 2] = 0.1 + Math.random() * 0.2
      } else {
        const brightness = isDark ? 0.4 + Math.random() * 0.4 : 0.7 + Math.random() * 0.3
        colors[i * 3] = brightness
        colors[i * 3 + 1] = brightness
        colors[i * 3 + 2] = brightness
      }
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.6 : 0.4,
      sizeAttenuation: true,
    })

    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

    // Tee/flag accent geometry
    const torusGeometry = new THREE.TorusGeometry(0.8, 0.02, 16, 100)
    const torusMaterial = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0x22cc66 : 0x00aa44,
      roughness: 0.2,
      metalness: 0.3,
      transparent: true,
      opacity: 0.3,
    })
    const rings: THREE.Mesh[] = []
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(torusGeometry, torusMaterial)
      ring.position.set(
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4,
        -2 - Math.random() * 3
      )
      ring.rotation.x = Math.random() * Math.PI
      ring.rotation.y = Math.random() * Math.PI
      ring.scale.setScalar(0.8 + Math.random() * 1.5)
      scene.add(ring)
      rings.push(ring)
    }

    // Mouse interaction
    const mouse = { x: 0, y: 0 }
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Animation loop
    let animationId: number
    const startTime = performance.now()

    const animate = () => {
      animationId = requestAnimationFrame(animate)
      const elapsed = (performance.now() - startTime) * 0.001

      // Animate balls
      balls.forEach((ball, i) => {
        ball.mesh.position.x += ball.speed.x
        ball.mesh.position.y = ball.baseY + Math.sin(elapsed * 0.5 + i * 1.2) * 0.3
        ball.mesh.position.z += ball.speed.z
        ball.mesh.rotation.x += ball.rotationSpeed.x
        ball.mesh.rotation.y += ball.rotationSpeed.y

        // Wrap around
        if (ball.mesh.position.x > 6) ball.mesh.position.x = -6
        if (ball.mesh.position.x < -6) ball.mesh.position.x = 6
        if (ball.mesh.position.z > 3) ball.mesh.position.z = -5
        if (ball.mesh.position.z < -5) ball.mesh.position.z = 3
      })

      // Rotate particles slowly
      particles.rotation.y = elapsed * 0.02
      particles.rotation.x = elapsed * 0.01

      // Animate rings
      rings.forEach((ring, i) => {
        ring.rotation.x += 0.002 + i * 0.001
        ring.rotation.z += 0.001
      })

      // Subtle camera movement following mouse
      camera.position.x += (mouse.x * 0.3 - camera.position.x) * 0.02
      camera.position.y += (mouse.y * 0.3 - camera.position.y) * 0.02
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }
    animate()

    // Resize handler
    const handleResize = () => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      ballGeometry.dispose()
      ballMaterial.dispose()
      particleGeometry.dispose()
      particleMaterial.dispose()
      torusGeometry.dispose()
      torusMaterial.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [variant])

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
    />
  )
}
 


