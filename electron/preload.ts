import { clipboard } from 'electron'

// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector: string, text: string) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const type of ['chrome', 'node', 'electron']) {
      replaceText(`${type}-version`, process.versions[type as keyof NodeJS.ProcessVersions] as string)
    }
})

// Polyfill navigator.clipboard for Monaco Editor to bypass browser permission checks
// This is required because Monaco uses the Clipboard API which is restricted in Electron
Object.defineProperty(navigator, 'clipboard', {
  value: {
    readText: async () => clipboard.readText(),
    writeText: async (text: string) => clipboard.writeText(text),
  },
  configurable: true,
  writable: true
});
