import { DiagnosticResultData, SimilarIssue, IssueCategory, IssueSeverity, TroubleshootingStep } from '../types';
import { INITIAL_KNOWLEDGE_ARTICLES } from '../data/initialData';

export interface DiagnoseRequest {
  description: string;
  extractedText?: string;
  categoryHint?: string;
  osHint?: string;
  apiKey?: string;
}

export interface DiagnoseResponse {
  result: DiagnosticResultData;
  similarIssues: SimilarIssue[];
}

export function diagnoseProblem(req: DiagnoseRequest): DiagnoseResponse {
  const combined = `${req.description} ${req.extractedText || ''}`.toLowerCase();
  
  // Rule & heuristic matching engine for IT issues
  let errorCode = 'UNKNOWN_ERR_01';
  let title = 'General IT Execution Error';
  let category: IssueCategory = 'Backend & APIs';
  let severity: IssueSeverity = 'medium';
  let confidence = 89.5;
  let detectedEnv = 'Cross-Platform Runtime / Node / Cloud';
  let summary = 'A runtime exception was encountered during operation execution.';
  let rootCause = 'The process encountered an unexpected state, invalid permission, or unhandled dependency failure.';
  let quickFix = 'Check application logs, verify permissions, and restart the related service process.';
  let steps: TroubleshootingStep[] = [];
  let preventionTips: string[] = [
    'Enable structured JSON logging with error stack traces.',
    'Implement health-check endpoints and automated circuit breakers.'
  ];

  if (combined.includes('docker') || combined.includes('docker.sock') || combined.includes('permission denied') && combined.includes('socket')) {
    title = 'Docker Daemon Socket Permission Denied';
    errorCode = 'EACCES /var/run/docker.sock';
    category = 'DevOps & Containers';
    severity = 'medium';
    confidence = 99.1;
    detectedEnv = 'Linux (Ubuntu/Debian) / Docker CE Engine';
    summary = 'The current user account does not have read/write privileges on the Docker daemon UNIX control socket.';
    quickFix = 'Add your user to the docker group via `sudo usermod -aG docker $USER && newgrp docker`.';
    rootCause = '/var/run/docker.sock is restricted to the root user and members of the docker group (mode 660).';
    steps = [
      {
        id: 'step-1',
        order: 1,
        title: 'Create the docker security group',
        instruction: 'Confirm the docker group exists in system group database.',
        command: 'sudo groupadd docker',
        completed: false
      },
      {
        id: 'step-2',
        order: 2,
        title: 'Add current user to docker group',
        instruction: 'Add the current logged-in user to the docker group without removing other memberships.',
        command: 'sudo usermod -aG docker $USER',
        completed: false
      },
      {
        id: 'step-3',
        order: 3,
        title: 'Activate group membership immediately',
        instruction: 'Reload group privileges in the current shell session without a full system reboot.',
        command: 'newgrp docker',
        completed: false
      },
      {
        id: 'step-4',
        order: 4,
        title: 'Validate unprivileged daemon access',
        instruction: 'Run test container without sudo to confirm operational clearance.',
        command: 'docker run --rm hello-world',
        completed: false
      }
    ];
    preventionTips = [
      'In CI/CD environments, avoid chmod 777 on docker.sock as it grants root-equivalent container escape.',
      'Automate user group assignment in your cloud-init or Ansible server provisioning templates.'
    ];
  } else if (combined.includes('hydration') || combined.includes('react') || combined.includes('#418') || combined.includes('#423') || combined.includes('did not match')) {
    title = 'React 18 SSR Hydration Content Mismatch';
    errorCode = 'REACT_HYDRATION_ERR_#418';
    category = 'Frontend & Web';
    severity = 'low';
    confidence = 98.4;
    detectedEnv = 'Next.js 14 / React 18 / Browser DOM';
    summary = 'Client-rendered DOM structure differs from the server-generated pre-rendered HTML snapshot.';
    quickFix = 'Defer accessing client-only variables (Date.now(), window, localStorage) until after component mount.';
    rootCause = 'A component rendered browser-dependent state during the initial render pass before useEffect had executed.';
    steps = [
      {
        id: 'step-1',
        order: 1,
        title: 'Isolate dynamic timestamp or browser APIs',
        instruction: 'Search for references to window, localStorage, or new Date() evaluated in top-level render scope.',
        codeSnippet: '// Bad:\nconst now = new Date().toLocaleTimeString();\n// Good:\nconst [mounted, setMounted] = useState(false);\nuseEffect(() => setMounted(true), []);',
        completed: false
      },
      {
        id: 'step-2',
        order: 2,
        title: 'Use suppressHydrationWarning for acceptable timestamp shifts',
        instruction: 'If displaying localized human timestamps where small drifts occur, mark the leaf element.',
        codeSnippet: '<span suppressHydrationWarning>{timeString}</span>',
        completed: false
      },
      {
        id: 'step-3',
        order: 3,
        title: 'Verify valid HTML nesting',
        instruction: 'Ensure no invalid tag hierarchies exist (e.g. <p> enclosing <div> or <div> inside <p>).',
        completed: false
      }
    ];
    preventionTips = [
      'Use modern CSS for theme switching rather than rendering different HTML server vs client.',
      'Wrap browser-only interactive widgets in dynamic import with { ssr: false } in Next.js.'
    ];
  } else if (combined.includes('cuda') || combined.includes('out of memory') || combined.includes('vram') || combined.includes('pytorch') || combined.includes('gpu')) {
    title = 'PyTorch CUDA Out of Memory (OOM)';
    errorCode = 'torch.cuda.OutOfMemoryError';
    category = 'Backend & APIs';
    severity = 'high';
    confidence = 97.9;
    detectedEnv = 'Python 3.10+ / PyTorch 2.x / NVIDIA CUDA Driver';
    summary = 'GPU VRAM has been exhausted while attempting to allocate tensors for batch operations.',
    quickFix = 'Reduce batch size by 50% and execute `torch.cuda.empty_cache()` with gradient accumulation.',
    rootCause = 'Peak memory during forward/backward pass exceeded dedicated VRAM, or unreleased tensor graph history accumulated.',
    steps = [
      {
        id: 'step-1',
        order: 1,
        title: 'Release cached memory & invoke garbage collector',
        instruction: 'Free any unreferenced PyTorch cached blocks before starting iteration.',
        codeSnippet: 'import torch, gc\ngc.collect()\ntorch.cuda.empty_cache()',
        completed: false
      },
      {
        id: 'step-2',
        order: 2,
        title: 'Enable Automatic Mixed Precision (AMP)',
        instruction: 'Use FP16 or BF16 precision to cut tensor memory requirements in half.',
        codeSnippet: 'with torch.autocast(device_type="cuda", dtype=torch.bfloat16):\n    output = model(inputs)',
        completed: false
      },
      {
        id: 'step-3',
        order: 3,
        title: 'Implement gradient accumulation',
        instruction: 'Halve batch_size and accumulate loss.backward() over 2 or 4 micro-steps before optimizer.step().',
        codeSnippet: 'loss = loss / accum_steps\nloss.backward()\nif (step + 1) % accum_steps == 0:\n    optimizer.step()\n    optimizer.zero_grad()',
        completed: false
      }
    ];
    preventionTips = [
      'Detach loss values from graph when recording metrics: use loss.item() instead of loss.',
      'Profile memory using torch.cuda.memory_summary() to identify leak points.'
    ];
  } else if (combined.includes('crashloop') || combined.includes('oomkilled') || combined.includes('exit code: 137') || combined.includes('k8s') || combined.includes('kubernetes')) {
    title = 'Kubernetes Pod CrashLoopBackOff (OOMKilled Exit 137)';
    errorCode = 'OOMKilled_EXIT_137';
    category = 'DevOps & Containers';
    severity = 'critical';
    confidence = 98.7;
    detectedEnv = 'Kubernetes v1.26+ / Containerd / Linux Kernel Cgroup';
    summary = 'Container was forcefully terminated by the Linux OOM killer for exceeding its configured memory limit.',
    quickFix = 'Inspect previous termination logs via `kubectl logs <pod> --previous` and bump memory limit in deployment spec.',
    rootCause = 'Process resident set size (RSS) breached memory.limit_in_bytes defined in pod spec resources.limits.',
    steps = [
      {
        id: 'step-1',
        order: 1,
        title: 'Check pod termination events & reason',
        instruction: 'Inspect Last State and Reason flags in pod description.',
        command: 'kubectl describe pod <pod-name> -n <namespace>',
        completed: false
      },
      {
        id: 'step-2',
        order: 2,
        title: 'Extract crash stack trace before container reset',
        instruction: 'Retrieve standard output of terminated container instance.',
        command: 'kubectl logs <pod-name> --previous -n <namespace>',
        completed: false
      },
      {
        id: 'step-3',
        order: 3,
        title: 'Update resource limits in deployment manifest',
        instruction: 'Increase memory limits and configure Node.js/JVM heap flags to remain within cgroup boundary.',
        codeSnippet: 'resources:\n  requests:\n    memory: "512Mi"\n    cpu: "250m"\n  limits:\n    memory: "1536Mi"\n    cpu: "1000m"',
        completed: false
      }
    ];
    preventionTips = [
      'Ensure language runtimes are cgroup-aware (e.g. NODE_OPTIONS="--max-old-space-size=1024").',
      'Deploy Horizontal Pod Autoscaler (HPA) or Vertical Pod Autoscaler (VPA) for traffic spikes.'
    ];
  } else if (combined.includes('bsod') || combined.includes('blue screen') || combined.includes('kernel_security') || combined.includes('0x00000139') || combined.includes('nvlddmkm.sys')) {
    title = 'Windows BSOD: KERNEL_SECURITY_CHECK_FAILURE';
    errorCode = '0x00000139 (KERNEL_SECURITY_CHECK)';
    category = 'Operating Systems';
    severity = 'high';
    confidence = 96.2;
    detectedEnv = 'Microsoft Windows 11 / Windows 10 (Kernel 10.0)';
    summary = 'Windows kernel detected integrity failure or corrupted list pointers, frequently triggered by GPU or storage drivers.',
    quickFix = 'Run `sfc /scannow` in administrative PowerShell and perform a clean driver reinstallation.',
    rootCause = 'Outdated or corrupted display driver (nvlddmkm.sys/amdkmdag.sys) writing to protected kernel memory pages.',
    steps = [
      {
        id: 'step-1',
        order: 1,
        title: 'Run System File Checker (SFC)',
        instruction: 'Repair system protected binaries and hashes in elevated PowerShell.',
        command: 'sfc /scannow',
        completed: false
      },
      {
        id: 'step-2',
        order: 2,
        title: 'Execute DISM component cleanup and health restore',
        instruction: 'Query Windows Update component store to fix missing payload files.',
        command: 'DISM.exe /Online /Cleanup-image /Restorehealth',
        completed: false
      },
      {
        id: 'step-3',
        order: 3,
        title: 'Clean reinstall graphics and chipset drivers',
        instruction: 'Download official manufacturer WHQL drivers and select "Perform Clean Installation".',
        completed: false
      }
    ];
    preventionTips = [
      'Avoid beta or non-WHQL certified GPU drivers on production workstations.',
      'Check system RAM integrity with Windows Memory Diagnostic (mdsched.exe).'
    ];
  } else if (combined.includes('cors') || combined.includes('access-control-allow-origin') || combined.includes('preflight')) {
    title = 'CORS Policy: Access-Control-Allow-Origin Missing';
    errorCode = 'CORS_PREFLIGHT_FAIL';
    category = 'Security & Auth';
    severity = 'medium';
    confidence = 99.0;
    detectedEnv = 'Web Browser (Fetch/XHR) / RESTful Backend API';
    summary = 'Browser blocked frontend HTTP request because the target backend did not return matching CORS headers.',
    quickFix = 'Enable CORS middleware on backend server and whitelist your frontend origin (e.g. http://localhost:5173).',
    rootCause = 'Cross-Origin Resource Sharing security enforcement prevents cross-origin data exposure unless explicitly authorized.',
    steps = [
      {
        id: 'step-1',
        order: 1,
        title: 'Install and enable CORS middleware in backend',
        instruction: 'Add cors package in your Node.js Express server.',
        codeSnippet: 'import cors from "cors";\napp.use(cors({\n  origin: ["http://localhost:5173", "https://yourdomain.com"],\n  credentials: true,\n  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]\n}));',
        completed: false
      },
      {
        id: 'step-2',
        order: 2,
        title: 'Ensure preflight OPTIONS requests return 200/204',
        instruction: 'Verify your API route handler handles HTTP OPTIONS preflight without throwing 401/403.',
        completed: false
      }
    ];
    preventionTips = [
      'In development, configure a Vite or Next.js proxy rewrite to avoid cross-origin domain calls altogether.',
      'Never use origin: "*" together with credentials: true as browsers will actively reject the response.'
    ];
  } else if (combined.includes('postgres') || combined.includes('connection') || combined.includes('53300') || combined.includes('slots')) {
    title = 'PostgreSQL Connection Limit Exceeded';
    errorCode = 'SQLSTATE 53300 (too_many_connections)';
    category = 'Databases';
    severity = 'critical';
    confidence = 97.4;
    detectedEnv = 'PostgreSQL 14/15/16 / Cloud Hosted Database';
    summary = 'All available database connection slots have been exhausted by open, idle, or leaked client connections.',
    quickFix = 'Terminate idle connections and configure a connection pooler like PgBouncer or Supabase/AWS RDS Proxy.',
    rootCause = 'Number of concurrent application instances exceeded max_connections configured in postgresql.conf.',
    steps = [
      {
        id: 'step-1',
        order: 1,
        title: 'Inspect active connections per application',
        instruction: 'Query active backend sessions and their current status.',
        command: 'SELECT count(*), state, client_addr FROM pg_stat_activity GROUP BY state, client_addr;',
        completed: false
      },
      {
        id: 'step-2',
        order: 2,
        title: 'Terminate orphaned idle connections',
        instruction: 'Clean out sessions idle for longer than 10 minutes.',
        command: 'SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = "idle in transaction" AND state_change < current_timestamp - INTERVAL "10 minutes";',
        completed: false
      },
      {
        id: 'step-3',
        order: 3,
        title: 'Implement connection pooling',
        instruction: 'Route traffic through transaction-level pooler (PgBouncer) on port 6543.',
        completed: false
      }
    ];
    preventionTips = [
      'Set idle_in_transaction_session_timeout = 60000 in database parameters.',
      'Always release database clients inside try/finally or using connection pool managers.'
    ];
  } else {
    // Dynamic intelligent synthesizer based on keywords
    errorCode = req.categoryHint ? `ERR_${req.categoryHint.toUpperCase().replace(/\s+/g, '_')}` : 'SYS_RUNTIME_FAULT';
    title = `Diagnosed Incident: ${req.description.slice(0, 48) || 'System Error'}`;
    summary = 'The system analyzed the error trace and identified an unexpected operational abort.';
    rootCause = 'Execution halted due to resource constraint, missing dependency, or unhandled exception.';
    quickFix = 'Inspect process logs, verify network/dependency health, and validate configuration values.';
    steps = [
      {
        id: 'step-1',
        order: 1,
        title: 'Check operational logs for root stack trace',
        instruction: 'Review the latest 100 lines of standard output and system error logs.',
        command: 'tail -n 100 /var/log/syslog || journalctl -xe',
        completed: false
      },
      {
        id: 'step-2',
        order: 2,
        title: 'Verify environment variables & permissions',
        instruction: 'Confirm file read/write permissions and required environment variables exist.',
        completed: false
      },
      {
        id: 'step-3',
        order: 3,
        title: 'Restart application daemon in debug mode',
        instruction: 'Run with verbose logging flag enabled to capture full fault state.',
        completed: false
      }
    ];
  }

  const result: DiagnosticResultData = {
    id: `diag_${Date.now()}`,
    title,
    errorCode,
    category,
    severity,
    confidence,
    detectedEnvironment: detectedEnv,
    summary,
    quickFix,
    rootCause,
    steps,
    preventionTips,
    timestamp: new Date().toISOString()
  };

  // Find matching similar issues from Knowledge base
  const similarIssues: SimilarIssue[] = INITIAL_KNOWLEDGE_ARTICLES.map((art) => {
    let matchScore = 40;
    if (art.category === category) matchScore += 30;
    if (art.errorCode.toLowerCase().includes(errorCode.toLowerCase()) || errorCode.toLowerCase().includes(art.errorCode.toLowerCase())) matchScore += 25;
    if (art.title.toLowerCase().includes(title.toLowerCase())) matchScore += 15;
    matchScore = Math.min(matchScore, 98);

    return {
      id: `sim_${art.id}`,
      title: art.title,
      errorCode: art.errorCode,
      category: art.category,
      similarityScore: matchScore,
      solutionSummary: art.summary,
      verified: art.verified,
      os: art.os,
      upvotes: art.upvotes
    };
  })
  .filter(item => item.similarityScore >= 60)
  .sort((a, b) => b.similarityScore - a.similarityScore)
  .slice(0, 3);

  return { result, similarIssues };
}
