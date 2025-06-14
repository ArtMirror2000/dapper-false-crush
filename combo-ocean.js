/* global AFRAME */

// Combo of Ada's ocean plane and Don's a-ocean component
// Original source ada: https://samsunginter.net/a-frame-components/dist/ocean-plane.js
// Original source don: https://github.com/c-frame/aframe-extras/blob/master/src/primitives/a-ocean.js

AFRAME.registerComponent('wobble-normal', {
  schema: {},
  tick: function (t) {
    if (!this.el.components.material.material.normalMap) return;
    this.el.components.material.material.normalMap.offset.x += 0.0001 * Math.sin(t / 10000);
    this.el.components.material.material.normalMap.offset.y += 0.0001 * Math.cos(t / 8000);
    this.el.components.material.material.normalScale.x = 0.5 + 0.5 * Math.cos(t / 1000);
    this.el.components.material.material.normalScale.x = 0.5 + 0.5 * Math.sin(t / 1200);
  }
});

AFRAME.registerComponent('wobble-geometry', {
  schema: {
    // Wave amplitude and variance.
    amplitude: {default: 0.1},
    amplitudeVariance: {default: 0.3},

    // Wave speed and variance.
    speed: {default: 0.25},
    speedVariance: {default: 2},
  },
  play: function () {
    let data = this.data;
    let geometry = this.geometry = this.el.object3D.children[0].geometry;

    console.log(this.el.object3D.children[0].geometry)
    this.waves = [];
    const posAttribute = geometry.getAttribute('position');
    console.log(posAttribute)
    for (let i = 0; i < posAttribute.count; i++) {
      this.waves.push({
        z: posAttribute.getZ(i),
        ang: Math.random() * Math.PI * 2,
        amp: data.amplitude + Math.random() * data.amplitudeVariance,
        speed: (data.speed + Math.random() * data.speedVariance) / 1000 // radians / frame
      });
    }
  },
  tick: function (t, dt) {
    if (!dt) return;

    const posAttribute = this.geometry.getAttribute('position');
    for (let i = 0; i < posAttribute.count; i++){
      const vprops = this.waves[i];
      const value = vprops.z + Math.sin(vprops.ang) * vprops.amp;
      posAttribute.setZ(i, value);
      vprops.ang += vprops.speed * dt;
    }
    posAttribute.needsUpdate = true;
  }
});

AFRAME.registerPrimitive('a-ocean-plane', {
  defaultComponents: {
    geometry: {
      primitive: 'plane',
      height: 1000,
      width: 1000,
      segmentsHeight: 100,
      segmentsWidth: 100
    },
    rotation: '-90 0 0',
    material: {
      shader: 'standard',
      color: '#8ab39f',
      metalness: 1,
      roughness: 0.2,
      normalMap: 'url(https://assets.3dstreet.app/materials/waternormals.jpg)',
      normalTextureRepeat: '50 50',
      normalTextureOffset: '0 0',
      normalScale: '0.5 0.5',
      opacity: 0.8
    },
    'wobble-normal': {},
    'wobble-geometry': {},
  }
});