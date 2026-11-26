export interface OcrResult {
  text: string;
  detectedErrorCode?: string;
  detectedSystem?: string;
  confidence: number;
  highlightBoxes: { x: number; y: number; width: number; height: number; label: string }[];
}

export function simulateOcrFromImage(fileOrUrl: string | File): Promise<OcrResult> {
  return new Promise((resolve) => {
    // Simulated realistic OCR visual scanner with bounding box recognition
    setTimeout(() => {
      const fileName = typeof fileOrUrl === 'string' ? fileOrUrl : fileOrUrl.name;
      const lower = fileName.toLowerCase();

      if (lower.includes('docker')) {
        resolve({
          text: 'Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Get "http://%2Fvar%2Frun%2Fdocker.sock/v1.24/containers/json": dial unix /var/run/docker.sock: connect: permission denied',
          detectedErrorCode: 'EACCES /var/run/docker.sock',
          detectedSystem: 'Linux (Ubuntu 22.04 LTS)',
          confidence: 98.7,
          highlightBoxes: [
            { x: 12, y: 35, width: 75, height: 18, label: 'Permission Denied Error' },
            { x: 12, y: 60, width: 45, height: 14, label: 'Docker Socket Path' }
          ]
        });
      } else if (lower.includes('react') || lower.includes('hydration')) {
        resolve({
          text: 'Error: Hydration failed because the initial UI does not match what was rendered on the server. Warning: Expected server HTML to contain a matching <div> in <body>.',
          detectedErrorCode: 'React Error #418 / #423',
          detectedSystem: 'Next.js 14 / React 18',
          confidence: 97.2,
          highlightBoxes: [
            { x: 10, y: 20, width: 80, height: 25, label: 'Hydration Mismatch Alert' }
          ]
        });
      } else if (lower.includes('cuda') || lower.includes('memory') || lower.includes('python')) {
        resolve({
          text: 'torch.cuda.OutOfMemoryError: CUDA out of memory. Tried to allocate 2.40 GiB (GPU 0; 15.77 GiB total capacity; 14.82 GiB already allocated; 128.00 MiB free)',
          detectedErrorCode: 'torch.cuda.OutOfMemoryError',
          detectedSystem: 'Python 3.10 / PyTorch / NVIDIA CUDA',
          confidence: 99.1,
          highlightBoxes: [
            { x: 15, y: 28, width: 70, height: 20, label: 'CUDA VRAM OOM' }
          ]
        });
      } else if (lower.includes('k8s') || lower.includes('crashloop') || lower.includes('oomkilled')) {
        resolve({
          text: 'Warning BackOff 2m kubelet Back-off restarting failed container web-service. Last State: Terminated (Reason: OOMKilled, Exit Code: 137)',
          detectedErrorCode: 'ExitCode: 137 (OOMKilled)',
          detectedSystem: 'Kubernetes v1.28 / Containerd',
          confidence: 98.4,
          highlightBoxes: [
            { x: 8, y: 30, width: 84, height: 22, label: 'OOMKilled Exit 137' }
          ]
        });
      } else if (lower.includes('bsod') || lower.includes('windows')) {
        resolve({
          text: 'Your PC ran into a problem and needs to restart. Stop code: KERNEL_SECURITY_CHECK_FAILURE. What failed: nvlddmkm.sys',
          detectedErrorCode: '0x00000139 (KERNEL_SECURITY_CHECK_FAILURE)',
          detectedSystem: 'Microsoft Windows 11',
          confidence: 96.8,
          highlightBoxes: [
            { x: 20, y: 40, width: 60, height: 20, label: 'Windows BSOD BugCheck' },
            { x: 20, y: 65, width: 40, height: 15, label: 'Offending Driver: nvlddmkm.sys' }
          ]
        });
      } else {
        // Generic fallback scanner
        resolve({
          text: 'FATAL EXCEPTION: System process terminated with unhandled signal error. Traceback recorded at line 42.',
          detectedErrorCode: 'FATAL_SIGNAL_SIGSEGV',
          detectedSystem: 'System Application Process',
          confidence: 91.5,
          highlightBoxes: [
            { x: 10, y: 25, width: 80, height: 30, label: 'Detected Error Block' }
          ]
        });
      }
    }, 700);
  });
}
