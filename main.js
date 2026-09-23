const canvas = document.getElementById("three-canvas");
const visual = document.querySelector(".hero-visual");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true,
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);

const geometry = new THREE.TorusGeometry(1.18, 0.38, 48, 140);
const material = new THREE.MeshStandardMaterial({
  color: 0xb56b73,
  metalness: 0.36,
  roughness: 0.24,
});

const torus = new THREE.Mesh(geometry, material);
torus.rotation.x = 0.45;
torus.rotation.y = -0.25;
scene.add(torus);

const innerGeometry = new THREE.TorusGeometry(1.55, 0.015, 12, 160);
const innerMaterial = new THREE.MeshBasicMaterial({
  color: 0xe19aa3,
  transparent: true,
  opacity: 0.24,
});
const orbit = new THREE.Mesh(innerGeometry, innerMaterial);
orbit.rotation.x = 1.18;
orbit.rotation.z = 0.55;
scene.add(orbit);

const keyLight = new THREE.DirectionalLight(0xffffff, 2.7);
keyLight.position.set(4, 4, 6);
scene.add(keyLight);

const rimLight = new THREE.PointLight(0xe19aa3, 9, 8);
rimLight.position.set(-2.5, -0.6, 3.2);
scene.add(rimLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

camera.position.z = 4.6;

let pointerX = 0;
let pointerY = 0;
let targetX = 0;
let targetY = 0;

function resizeRenderer() {
  const width = visual.clientWidth;
  const height = visual.clientHeight;

  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

visual.addEventListener("pointermove", (event) => {
  const bounds = visual.getBoundingClientRect();
  pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
  pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
});

visual.addEventListener("pointerleave", () => {
  pointerX = 0;
  pointerY = 0;
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function animate() {
  requestAnimationFrame(animate);

  if (!prefersReducedMotion) {
    targetX += (pointerX - targetX) * 0.035;
    targetY += (pointerY - targetY) * 0.035;

    torus.rotation.x += 0.0024;
    torus.rotation.y += 0.004;
    torus.rotation.z = targetX * 0.16;
    torus.position.y = targetY * -0.09;

    orbit.rotation.z -= 0.0018;
    orbit.rotation.y = targetX * 0.08;
  }

  renderer.render(scene, camera);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

document.getElementById("year").textContent = new Date().getFullYear();

resizeRenderer();
window.addEventListener("resize", resizeRenderer);
animate();
