import * as THREE from "three";

const ROUTE_LABEL = "50 / SODERINI - NERI";

export function makeTextTexture({
  title,
  subtitle = "",
  width = 1024,
  height = 256,
  bg = "#f3ecd9",
  color = "#25282a",
  titleSize = 96,
  subtitleSize = 34,
  align = "center"
}) {
  const canvasText = document.createElement("canvas");
  canvasText.width = width;
  canvasText.height = height;
  const ctx = canvasText.getContext("2d");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);
  ctx.globalAlpha = 0.11;
  for (let i = 0; i < 70; i += 1) {
    ctx.fillStyle = i % 2 ? "#99a8ad" : "#ffffff";
    ctx.fillRect(Math.random() * width, Math.random() * height, Math.random() * 4 + 1, 1);
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.font = `900 ${titleSize}px "Hiragino Sans", "Yu Gothic", sans-serif`;
  ctx.fillText(title, align === "center" ? width / 2 : 36, height * 0.46);
  if (subtitle) {
    ctx.font = `700 ${subtitleSize}px Inter, sans-serif`;
    ctx.textAlign = "right";
    ctx.fillText(subtitle, width - 38, height * 0.78);
  }
  return makeCanvasTexture(canvasText);
}

export function makeStopSignTexture() {
  return makeTextTexture({
    title: "BUS STOP",
    subtitle: ROUTE_LABEL,
    width: 900,
    height: 220,
    bg: "#2c92b8",
    color: "#f7fbf6",
    titleSize: 96,
    subtitleSize: 32
  });
}

export function makeAdTexture() {
  const canvasAd = document.createElement("canvas");
  canvasAd.width = 512;
  canvasAd.height = 900;
  const ctx = canvasAd.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, 0, canvasAd.height);
  gradient.addColorStop(0, "#153044");
  gradient.addColorStop(0.52, "#256b86");
  gradient.addColorStop(1, "#f0c64f");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvasAd.width, canvasAd.height);
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "900 68px Inter, sans-serif";
  ctx.fillText("PROJECTS", 52, 120, canvasAd.width - 104);
  ctx.fillStyle = "#ff7d75";
  ctx.fillRect(52, 250, 240, 26);
  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 6; i += 1) {
    ctx.globalAlpha = 0.92 - i * 0.08;
    ctx.fillRect(52, 340 + i * 52, 350 - i * 22, 16);
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#ff7d75";
  ctx.beginPath();
  ctx.arc(350, 610, 78, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f7f0d8";
  ctx.font = "900 54px Inter, sans-serif";
  ctx.fillText("18:40", 58, 790);
  ctx.font = "700 28px Inter, sans-serif";
  ctx.fillText("platform 02", 62, 835);
  return makeCanvasTexture(canvasAd);
}

export function makeTimetableTexture() {
  const canvasTable = document.createElement("canvas");
  canvasTable.width = 480;
  canvasTable.height = 760;
  const ctx = canvasTable.getContext("2d");
  ctx.fillStyle = "#f8f5e9";
  ctx.fillRect(0, 0, canvasTable.width, canvasTable.height);
  ctx.fillStyle = "#2c92b8";
  ctx.fillRect(0, 0, canvasTable.width, 104);
  ctx.fillStyle = "#fffdf2";
  ctx.font = "900 48px Inter, sans-serif";
  ctx.fillText("CONTACT", 34, 68);

  const rows = ["07:12", "08:04", "09:40", "11:18", "13:05", "15:32", "17:46", "19:20"];
  ctx.fillStyle = "#27313a";
  ctx.font = "900 46px Inter, sans-serif";
  rows.forEach((time, index) => {
    const y = 164 + index * 66;
    ctx.fillText(time, 44, y);
    ctx.fillStyle = index % 2 === 0 ? "#e95f62" : "#45bed8";
    ctx.fillRect(204, y - 30, 190 - index * 7, 14);
    ctx.fillStyle = "#27313a";
  });

  ctx.fillStyle = "#f2bf25";
  ctx.fillRect(34, 686, 170, 28);
  ctx.fillStyle = "#27313a";
  ctx.font = "700 22px Inter, sans-serif";
  ctx.fillText(ROUTE_LABEL, 224, 710, canvasTable.width - 224 - 34);
  return makeCanvasTexture(canvasTable);
}

function makeCanvasTexture(canvasSource) {
  const texture = new THREE.CanvasTexture(canvasSource);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}
