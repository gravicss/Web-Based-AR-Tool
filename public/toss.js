AFRAME.registerComponent('shoot-tomato', {
  init() {
    const camera = document.getElementById('camera')
    const splatSnd = document.querySelector('#splat').components.sound

    this.el.sceneEl.addEventListener('touchstart', (event) => {
      const tomato = document.createElement('a-entity')
      tomato.setAttribute('position', camera.object3D.position)
      tomato.setAttribute('scale', '1 1 1')
      tomato.setAttribute('gltf-model', '#dynamicModel')

      const randomRotation = {x: -90 + Math.random() * 30, y: Math.random() * 360, z: 0}
      tomato.setAttribute('rotation', randomRotation)

      const velocity = new THREE.Vector3(0, 0, -10)
      velocity.applyQuaternion(camera.object3D.quaternion)
      tomato.setAttribute('velocity', velocity)

      tomato.setAttribute('body', {
        type: 'dynamic',
        sphereRadius: 0.35,
        shape: 'sphere',
      })

      tomato.setAttribute('shadow', {
        receive: false,
      })

      this.el.sceneEl.appendChild(tomato)

      const splatBase = document.createElement('a-entity')
      splatBase.setAttribute('visible', 'false')

      const splat = document.createElement('a-entity')
      splat.setAttribute('gltf-model', '#dynamicModel')
      splat.setAttribute('scale', '1 1 1')
      splatBase.appendChild(splat)

      this.el.sceneEl.appendChild(splatBase)

      let didCollide = false
      tomato.addEventListener('collide', (e) => {
        if (didCollide || e.detail.body.el.id !== 'ground') {
          return
        }
        didCollide = true
        splatSnd.stopSound()
        splatSnd.playSound()
        splatBase.object3D.position.copy(tomato.object3D.position)
        splat.object3D.rotation.copy(tomato.object3D.rotation)

        splatBase.object3D.visible = true
        tomato.setAttribute('visible', 'false')

        setTimeout(() => {
          tomato.parentNode.removeChild(tomato)
        }, 0)

        splatBase.setAttribute('animation__scale', {
          property: 'scale',
          from: '1 1 1',
          to: '3 0.1 3',
          dur: 500,
          easing: 'easeOutQuad',
        })

        setTimeout(() => {
          splatBase.setAttribute('animation__scale', {
            property: 'scale',
            from: '3 0.1 3',
            to: '0.001 0.001 0.001',
            dur: 1500,
            easing: 'easeInQuad',
          })
          setTimeout(() => splatBase.parentNode.removeChild(splatBase), 1500)
        }, 2500)
      })
    })
  },
})
