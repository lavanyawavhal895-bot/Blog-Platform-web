"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export function WebGLShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current

    const scene = new THREE.Scene()

    const camera = new THREE.OrthographicCamera(
      -1,
      1,
      1,
      -1,
      0,
      1
    )

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
    })

    renderer.setPixelRatio(window.devicePixelRatio)

    const uniforms = {
      resolution: {
        value: new THREE.Vector2(
          window.innerWidth,
          window.innerHeight
        ),
      },
      time: { value: 0 },
      xScale: { value: 1.0 },
      yScale: { value: 0.5 },
      distortion: { value: 0.05 },
    }

    const geometry = new THREE.PlaneGeometry(2, 2)

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        void main() {
          gl_Position = vec4(position,1.0);
        }
      `,
      fragmentShader: `
        precision highp float;

        uniform vec2 resolution;
        uniform float time;
        uniform float xScale;
        uniform float yScale;
        uniform float distortion;

        void main() {
          vec2 p =
            (gl_FragCoord.xy * 2.0 - resolution) /
            min(resolution.x, resolution.y);

          float d = length(p) * distortion;

          float rx = p.x * (1.0 + d);
          float gx = p.x;
          float bx = p.x * (1.0 - d);

          float r =
            0.05 /
            abs(
              p.y +
              sin((rx + time) * xScale) *
              yScale
            );

          float g =
            0.05 /
            abs(
              p.y +
              sin((gx + time) * xScale) *
              yScale
            );

          float b =
            0.05 /
            abs(
              p.y +
              sin((bx + time) * xScale) *
              yScale
            );

          gl_FragColor = vec4(r,g,b,1.0);
        }
      `,
    })

    const mesh = new THREE.Mesh(
      geometry,
      material
    )

    scene.add(mesh)

    const resize = () => {
      renderer.setSize(
        window.innerWidth,
        window.innerHeight
      )

      uniforms.resolution.value.set(
        window.innerWidth,
        window.innerHeight
      )
    }

    resize()

    let frameId: number

    const animate = () => {
      uniforms.time.value += 0.01

      renderer.render(scene, camera)

      frameId =
        requestAnimationFrame(animate)
    }

    animate()

    window.addEventListener(
      "resize",
      resize
    )

    return () => {
      cancelAnimationFrame(frameId)

      window.removeEventListener(
        "resize",
        resize
      )

      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 w-full h-full"
    />
  )
}