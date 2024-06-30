// Component that places models where the ground is clicked
AFRAME.registerComponent('tap-place', {
    schema: {
      modelUrl: {type: 'string'}
    },
  
    init() {
      const ground = document.getElementById('ground');
      ground.addEventListener('click', (event) => {
        const newElement = document.createElement('a-entity');
        const touchPoint = event.detail.intersection.point;
        const randomYRotation = Math.random() * 360;
        
        newElement.setAttribute('position', touchPoint);
        newElement.setAttribute('rotation', `0 ${randomYRotation} 0`);
        newElement.setAttribute('visible', 'false');
        newElement.setAttribute('scale', '0.0001 0.0001 0.0001');
        newElement.setAttribute('gltf-model', this.data.modelUrl); // Use the passed model URL
        newElement.setAttribute('shadow', { receive: false });
  
        this.el.sceneEl.appendChild(newElement);
  
        newElement.addEventListener('model-loaded', () => {
          newElement.setAttribute('visible', 'true');
          newElement.setAttribute('animation', {
            property: 'scale',
            to: '7 7 7',
            easing: 'easeOutElastic',
            dur: 800,
          });
        });
      });
    },
  });
  