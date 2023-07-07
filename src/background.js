// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


async function code(ptz, multiplier) {
  // Prompt user to allow website to control camera PTZ if needed.
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { pan: true, tilt: true, zoom: true },
  });
  const [videoTrack] = stream.getVideoTracks();
  if (ptz in videoTrack.getSettings()) {
    const range = videoTrack.getCapabilities()[ptz];
    const granularity = 6;
    const step = Math.max(range.step, (range.max - range.min) / granularity);
    const value = Math.max(range.min, Math.min(range.max,
      videoTrack.getSettings()[ptz] + step * multiplier));
    await videoTrack.applyConstraints({ advanced: [{ [ptz] : value }] });
  } else {
    alert(`Your camera doesn't support ${ptz}. Sorry!`);
  }
  // Stop tracks.
  stream.getTracks().forEach(track => track.stop());
}

const commands = {
  zoomIn: ["zoom", 1],
  zoomOut: ["zoom", -1],
  panRight: ["pan", 1],
  panLeft: ["pan", -1],
  tiltUp: ["tilt", 1],
  tiltDown: ["tilt", -1],
};

async function executeScript(command) {
  if (!(command in commands)) return;
  const [tab] = await chrome.tabs.query({ active: true });
  const scriptInjection = {
    target: { tabId: tab.id },
    func: code,
    args: commands[command],
  }
  chrome.scripting.executeScript(scriptInjection);
}

chrome.runtime.onMessage.addListener(({command}) => {
  executeScript(command);
});

chrome.commands.onCommand.addListener((command) => {
  executeScript(command);
});
