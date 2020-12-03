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

const buttons = Array.from(document.querySelectorAll("button"));

buttons.forEach(button => button.onclick = () => {
  const command = button.dataset.command;
  chrome.runtime.sendMessage({ command });
});

document.addEventListener("keydown", ({ key }) => {
  if (!["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(key)) {
    return;
  }

  const direction = ["ArrowRight", "ArrowDown"].includes(key) ? 1 : -1;
  let index = buttons.indexOf(document.activeElement) + direction;
  if (index >= buttons.length) {
    index = 0;
  } else if (index < 0) {
    index = buttons.length - 1;
  }

  // Focus next or previous button.
  buttons[index].focus();
});
