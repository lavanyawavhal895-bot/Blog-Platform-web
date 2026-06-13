"use client"

import { useEffect, useRef, } from "react"
import * as THREE from "three"

interface Uniforms {
  time: { value: number }
  resolution: { value: number[] }
  mousePos: { value: number[] }
  scrollY: { value: number }
  clickIntensity: { value: number }
}

export function MilkyWayBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene | null
    camera: THREE.OrthographicCamera | null
    renderer: THREE.WebGLRenderer | null
    mesh: THREE.Mesh | null
    uniforms: Uniforms | null
    animationId: number | null
  }>({
    scene: null,
    camera: null,
    renderer: null,
    mesh: null,
    uniforms: null,
    animationId: null,
  })

  const mouseRef = useRef({ x: 0, y: 0 })
  const scrollRef = useRef({ y: 0 })
  const clickRef = useRef({ val: 0, time: 0 })

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const { current: refs } = sceneRef

    const vertexShader = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform vec2 mousePos;
      uniform float scrollY;
      uniform float clickIntensity;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      float smoothNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        float freq = 1.0;
        for (int i = 0; i < 5; i++) {
          v += a * smoothNoise(p * freq);
          a *= 0.5;
          freq *= 2.1;
        }
        return v;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        vec2 p = uv * 2.0 - 1.0;
        p.x *= resolution.x / resolution.y;

        // Normalize mouse position to [-1, 1]
        vec2 mp = mousePos / resolution * 2.0 - 1.0;
        mp.x *= resolution.x / resolution.y;

        // Distance from cursor
        float dist = length(p - mp);

        // Click ripple effect
        float ripple = clickIntensity * exp(-dist * 3.0) * sin(dist * 18.0 - time * 8.0) * 0.12;

        // Scroll parallax
        float tm = time * 0.15;
        vec2 q = vec2(
          fbm(p + tm),
          fbm(p + vec2(1.0, 1.0) + tm * 0.8)
        );

        vec2 r = vec2(
          fbm(p + 4.0 * q + vec2(1.7, 9.2) + tm * 0.5),
          fbm(p + 4.0 * q + vec2(8.3, 2.8) + tm * 0.35)
        );

        float f = fbm(p + 4.0 * r) + ripple;

        // Vignette
        float vig = 1.0 - smoothstep(0.3, 1.4, length(p));

        // Color gradient
        vec3 c0 = vec3(0.04, 0.02, 0.10);   // deep purple
        vec3 c1 = vec3(0.20, 0.06, 0.48);   // purple
        vec3 c2 = vec3(0.52, 0.12, 0.58);   // magenta
        vec3 c3 = vec3(0.85, 0.38, 0.25);   // coral

        vec3 col = c0;
        col = mix(col, c1, smoothstep(0.0, 0.35, f));
        col = mix(col, c2, smoothstep(0.3, 0.7, f));
        col = mix(col, c3, smoothstep(0.65, 1.0, f));
        col *= vig;

        // Glow toward cursor
        col += exp(-dist * dist * 8.0) * 0.15 * vec3(0.6, 0.3, 1.0);

        gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
      }
    `

    const initScene = () => {
      refs.scene = new THREE.Scene()
      refs.renderer = new THREE.WebGLRenderer({ 
        canvas,
        antialias: true,
        alpha: true,
      })
      refs.renderer.setPixelRatio(window.devicePixelRatio)
      refs.renderer.setClearColor(new THREE.Color(0x050215), 1)
      refs.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1)

      refs.uniforms = {
        time: { value: 0.0 },
        resolution: { value: [window.innerWidth, window.innerHeight] },
        mousePos: { value: [0, 0] },
        scrollY: { value: 0 },
        clickIntensity: { value: 0 },
      }

      const position = [
        -1.0, -1.0, 0.0,
        1.0, -1.0, 0.0,
        -1.0, 1.0, 0.0,
        1.0, -1.0, 0.0,
        -1.0, 1.0, 0.0,
        1.0, 1.0, 0.0,
      ]

      const positions = new THREE.BufferAttribute(new Float32Array(position), 3)
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute("position", positions)

      const material = new THREE.RawShaderMaterial({
        vertexShader,
        fragmentShader,
        side: THREE.DoubleSide,
      })

      refs.mesh = new THREE.Mesh(geometry, material)
      refs.scene.add(refs.mesh)

      handleResize()
    }

    const animate = () => {
      if (refs.uniforms) {
        refs.uniforms.time.value += 0.016
        refs.uniforms.mousePos.value = [mouseRef.current.x, window.innerHeight - mouseRef.current.y]
        refs.uniforms.scrollY.value = scrollRef.current.y

        // Decay click intensity
        const elapsed = (Date.now() - clickRef.current.time) / 1000
        clickRef.current.val = Math.max(0, 1.0 - elapsed * 1.5)
        refs.uniforms.clickIntensity.value = clickRef.current.val
      }

      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera)
      }

      refs.animationId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      if (!refs.renderer || !refs.uniforms) return
      const width = window.innerWidth
      const height = window.innerHeight
      refs.renderer.setSize(width, height, false)
      refs.uniforms.resolution.value = [width, height]
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const onScroll = () => {
      scrollRef.current.y = window.scrollY
    }

    const onClick = () => {
      clickRef.current = { val: 1.0, time: Date.now() }
    }

    initScene()
    animate()

    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("scroll", onScroll)
    window.addEventListener("click", onClick)

    return () => {
      if (refs.animationId) cancelAnimationFrame(refs.animationId)
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("click", onClick)

      if (refs.mesh) {
        refs.scene?.remove(refs.mesh)
        refs.mesh.geometry.dispose()
        if (refs.mesh.material instanceof THREE.Material) {
          refs.mesh.material.dispose()
        }
      }
      refs.renderer?.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full block -z-10"
      style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(51, 14, 76, 0.3) 0%, rgba(10, 5, 20, 0.8) 100%)" }}
    />
  )
}

export default MilkyWayBackground