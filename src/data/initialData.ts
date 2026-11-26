import { User, ProblemRecord, KnowledgeArticle, SimilarIssue, AnalyticsMetrics } from '../types';

export const DEMO_USERS: User[] = [
  {
    id: 'usr_001',
    name: 'Alex Rivera',
    email: 'alex@fixtrail.io',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering (Frontend)',
    resolvedIssuesCount: 14,
  },
  {
    id: 'adm_001',
    name: 'Sarah Chen',
    email: 'admin@fixtrail.io',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    department: 'IT Operations & Infrastructure',
    resolvedIssuesCount: 42,
  },
];

export interface SampleErrorCase {
  id: string;
  name: string;
  errorCode: string;
  category: string;
  system: string;
  logText: string;
  description: string;
  imageThumbnail: string;
}

export const SAMPLE_ERROR_CASES: SampleErrorCase[] = [
  {
    id: 'sample-docker-perm',
    name: 'Docker Daemon Permission Denied',
    errorCode: 'EACCES /var/run/docker.sock',
    category: 'DevOps & Containers',
    system: 'Linux / Ubuntu 22.04',
    logText: 'Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Get "http://%2Fvar%2Frun%2Fdocker.sock/v1.24/containers/json": dial unix /var/run/docker.sock: connect: permission denied',
    description: 'Running `docker ps` returns permission denied without sudo.',
    imageThumbnail: 'docker'
  },
  {
    id: 'sample-react-hydration',
    name: 'React 18 Hydration Error',
    errorCode: 'Minified React error #418 / #423',
    category: 'Frontend & Web',
    system: 'Next.js 14 / React 18',
    logText: 'Error: Hydration failed because the initial UI does not match what was rendered on the server. Warning: Expected server HTML to contain a matching <div> in <body>. See https://reactjs.org/link/hydration-error',
    description: 'Mismatch between SSR render and client hydration caused by browser-only Date/localStorage call.',
    imageThumbnail: 'react'
  },
  {
    id: 'sample-cuda-oom',
    name: 'PyTorch CUDA Out of Memory',
    errorCode: 'CUDA_OUT_OF_MEMORY (Allocated 14.8GB)',
    category: 'Backend & APIs',
    system: 'Python 3.10 / PyTorch / NVIDIA RTX 4090',
    logText: 'torch.cuda.OutOfMemoryError: CUDA out of memory. Tried to allocate 2.40 GiB (GPU 0; 15.77 GiB total capacity; 14.82 GiB already allocated; 128.00 MiB free; 14.90 GiB reserved in total by PyTorch)',
    description: 'Deep learning training loop crashed at batch 124 when processing large context window tensors.',
    imageThumbnail: 'python'
  },
  {
    id: 'sample-k8s-crashloop',
    name: 'Kubernetes Pod CrashLoopBackOff',
    errorCode: 'OOMKilled / ExitCode:137',
    category: 'DevOps & Containers',
    system: 'Kubernetes v1.28 / EKS',
    logText: 'Warning  BackOff   2m (x14 over 8m)   kubelet  Back-off restarting failed container web-service in pod web-service-789cf94-xk29j. Last State: Terminated (Reason: OOMKilled, Exit Code: 137)',
    description: 'Production service restarts repeatedly every 45 seconds after hitting cgroup memory threshold.',
    imageThumbnail: 'k8s'
  },
  {
    id: 'sample-win-bsod',
    name: 'Windows BSOD Kernel Security Failure',
    errorCode: '0x00000139 (KERNEL_SECURITY_CHECK_FAILURE)',
    category: 'Operating Systems',
    system: 'Windows 11 Pro 23H2',
    logText: 'Your PC ran into a problem and needs to restart. Stop code: KERNEL_SECURITY_CHECK_FAILURE. What failed: nvlddmkm.sys. Minidump saved to C:\\Windows\\Minidump\\092424-8140-01.dmp',
    description: 'System crashes with blue screen during graphics switching and docking station sleep wakeup.',
    imageThumbnail: 'windows'
  },
  {
    id: 'sample-pg-pool',
    name: 'PostgreSQL Too Many Clients',
    errorCode: 'PG::ConnectionBad (53300)',
    category: 'Databases',
    system: 'PostgreSQL 15 / Supabase',
    logText: 'FATAL: remaining connection slots are reserved for non-replication superuser connections (SQLSTATE 53300). Could not acquire connection from pool: max_connections limit 100 reached.',
    description: 'Database rejected traffic during morning traffic surge due to unreleased pooled serverless connections.',
    imageThumbnail: 'database'
  }
];

export const INITIAL_KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
  {
    id: 'kb-001',
    title: 'Fixing Docker Daemon Socket Permission Denied (Linux)',
    errorCode: 'EACCES /var/run/docker.sock',
    category: 'DevOps & Containers',
    os: 'Linux',
    difficulty: 'Beginner',
    views: 4890,
    upvotes: 342,
    author: 'Sarah Chen (Lead DevOps)',
    verified: true,
    summary: 'Occurs when non-root users attempt to interact with the Docker daemon without membership in the `docker` group.',
    rootCause: 'The UNIX socket /var/run/docker.sock is owned by root:docker with 660 permissions. Non-root users not in the docker group are denied socket access.',
    steps: [
      {
        stepNumber: 1,
        title: 'Create the docker group (if not present)',
        detail: 'Ensure the system docker group exists.',
        command: 'sudo groupadd docker'
      },
      {
        stepNumber: 2,
        title: 'Add current user to docker group',
        detail: 'Append your current active username to the docker security group.',
        command: 'sudo usermod -aG docker $USER'
      },
      {
        stepNumber: 3,
        title: 'Apply group membership change without logging out',
        detail: 'Activate the new group attributes in the current shell session.',
        command: 'newgrp docker'
      },
      {
        stepNumber: 4,
        title: 'Verify socket connectivity',
        detail: 'Run standard hello-world container to test unprivileged access.',
        command: 'docker run hello-world'
      }
    ],
    tags: ['docker', 'linux', 'permissions', 'devops', 'socket'],
    lastUpdated: '2026-11-20'
  },
  {
    id: 'kb-002',
    title: 'Resolving React 18 SSR Hydration Mismatch in Next.js',
    errorCode: 'React Error #418 / #423',
    category: 'Frontend & Web',
    os: 'Cross-Platform',
    difficulty: 'Intermediate',
    views: 6120,
    upvotes: 495,
    author: 'Alex Rivera (Frontend)',
    verified: true,
    summary: 'Triggered when the server-rendered HTML AST diverges from the client initial mount tree.',
    rootCause: 'Rendering dynamic values (such as new Date(), Math.random(), window.innerWidth, or localStorage) during the initial component render cycle before useEffect runs.',
    steps: [
      {
        stepNumber: 1,
        title: 'Identify the mismatched element',
        detail: 'Inspect the browser console tree diff to see which text node or attribute differs between SSR and CSR.'
      },
      {
        stepNumber: 2,
        title: 'Defer client-only state initialization to useEffect',
        detail: 'Initialize state with a neutral fallback and update inside an effect hook once mounted on the client.',
        command: 'const [mounted, setMounted] = useState(false);\nuseEffect(() => setMounted(true), []);'
      },
      {
        stepNumber: 3,
        title: 'Optional: Use suppressHydrationWarning for uncritical dynamic text',
        detail: 'For timestamps where small shifts are acceptable, attach suppressHydrationWarning to the enclosing tag.',
        command: '<time dateTime={date} suppressHydrationWarning>{formattedDate}</time>'
      }
    ],
    tags: ['react', 'nextjs', 'ssr', 'hydration', 'javascript'],
    lastUpdated: '2026-11-18'
  },
  {
    id: 'kb-003',
    title: 'Fixing CUDA Out of Memory (OOM) in PyTorch / Transformers',
    errorCode: 'torch.cuda.OutOfMemoryError',
    category: 'Backend & APIs',
    os: 'Cross-Platform',
    difficulty: 'Advanced',
    views: 3200,
    upvotes: 288,
    author: 'AI Research Team',
    verified: true,
    summary: 'Occurs when tensor memory allocation exceeds GPU VRAM capacity or fragmentation accumulates.',
    rootCause: 'Accumulation of computation graph tensors in Python loop variables, excessively large batch sizes, or failure to clear cached allocations.',
    steps: [
      {
        stepNumber: 1,
        title: 'Clear PyTorch CUDA cache & run garbage collection',
        detail: 'Release unreferenced cached VRAM back to the NVIDIA driver.',
        command: 'import torch, gc\ngc.collect()\ntorch.cuda.empty_cache()'
      },
      {
        stepNumber: 2,
        title: 'Enable Automatic Mixed Precision (AMP / FP16/BF16)',
        detail: 'Reduce tensor memory footprint by half without significant precision loss.',
        command: 'with torch.autocast(device_type="cuda", dtype=torch.bfloat16):\n    outputs = model(inputs)'
      },
      {
        stepNumber: 3,
        title: 'Implement Gradient Accumulation',
        detail: 'Cut batch_size by half or a quarter, and accumulate gradients across multiple forward passes before calling optimizer.step().'
      }
    ],
    tags: ['pytorch', 'cuda', 'gpu', 'python', 'vram', 'ai'],
    lastUpdated: '2026-11-22'
  },
  {
    id: 'kb-004',
    title: 'Kubernetes Pod CrashLoopBackOff: Diagnosing Exit Code 137 (OOMKilled)',
    errorCode: 'ExitCode 137 / OOMKilled',
    category: 'DevOps & Containers',
    os: 'Linux',
    difficulty: 'Intermediate',
    views: 5410,
    upvotes: 390,
    author: 'Sarah Chen (Lead DevOps)',
    verified: true,
    summary: 'The Linux kernel OOM killer sent SIGKILL (128 + 9 = 137) to the container process for exceeding memory limits.',
    rootCause: 'The memory.limit_in_bytes defined in the pod resources.limits.memory was hit by memory leaks or sudden burst loads.',
    steps: [
      {
        stepNumber: 1,
        title: 'Inspect previous container termination reason',
        detail: 'Check why the container died using kubectl describe.',
        command: 'kubectl describe pod <pod-name> -n <namespace>'
      },
      {
        stepNumber: 2,
        title: 'Read the previous container crash logs',
        detail: 'Retrieve logs from the crashed instance before it was restarted.',
        command: 'kubectl logs <pod-name> --previous -n <namespace>'
      },
      {
        stepNumber: 3,
        title: 'Adjust pod memory limits in deployment spec',
        detail: 'Increase resources.limits.memory and resources.requests.memory appropriately.',
        command: 'resources:\n  requests:\n    memory: "512Mi"\n  limits:\n    memory: "1Gi"'
      }
    ],
    tags: ['kubernetes', 'k8s', 'docker', 'devops', 'oom', 'crashloop'],
    lastUpdated: '2026-11-21'
  },
  {
    id: 'kb-005',
    title: 'Resolving CORS Error: "No Access-Control-Allow-Origin Header"',
    errorCode: 'CORS_BLOCKED_REQUEST',
    category: 'Security & Auth',
    os: 'Cross-Platform',
    difficulty: 'Beginner',
    views: 7800,
    upvotes: 610,
    author: 'Alex Rivera (Frontend)',
    verified: true,
    summary: 'Web browser security policy blocks cross-origin requests when the backend fails to send proper CORS response headers.',
    rootCause: 'The API server did not acknowledge the Preflight OPTIONS request or missing Access-Control-Allow-Origin response header.',
    steps: [
      {
        stepNumber: 1,
        title: 'Configure CORS middleware on backend server',
        detail: 'Enable CORS for your frontend client origin in Express / FastAPI / Django.',
        command: 'import cors from "cors";\napp.use(cors({ origin: "http://localhost:5173", credentials: true }));'
      },
      {
        stepNumber: 2,
        title: 'Allow preflight OPTIONS HTTP methods',
        detail: 'Ensure server responds with 200/204 to OPTIONS requests with allowed methods (GET, POST, PUT, DELETE, OPTIONS).'
      },
      {
        stepNumber: 3,
        title: 'Avoid configuring wildcard origin with credentials',
        detail: 'Never pair Access-Control-Allow-Origin: * with Access-Control-Allow-Credentials: true.'
      }
    ],
    tags: ['cors', 'security', 'api', 'express', 'http', 'frontend'],
    lastUpdated: '2026-11-15'
  },
  {
    id: 'kb-006',
    title: 'Windows BSOD: KERNEL_SECURITY_CHECK_FAILURE (0x00000139)',
    errorCode: '0x00000139 KERNEL_SECURITY_CHECK',
    category: 'Operating Systems',
    os: 'Windows',
    difficulty: 'Intermediate',
    views: 2950,
    upvotes: 215,
    author: 'IT Helpdesk Team',
    verified: true,
    summary: 'The Windows kernel detected corruption in a critical data structure, frequently caused by outdated display or chip driver files.',
    rootCause: 'Driver buffer overruns, corrupted memory pages, or outdated GPU/chipset drivers (often nvlddmkm.sys or amdkmdag.sys).',
    steps: [
      {
        stepNumber: 1,
        title: 'Run System File Checker (SFC) scan',
        detail: 'Scan and repair corrupted Windows system protected files in elevated PowerShell.',
        command: 'sfc /scannow'
      },
      {
        stepNumber: 2,
        title: 'Execute DISM deployment image repair',
        detail: 'Repair the local Windows Component Store against online image.',
        command: 'DISM /Online /Cleanup-Image /RestoreHealth'
      },
      {
        stepNumber: 3,
        title: 'Clean reinstall graphics drivers using DDU (Display Driver Uninstaller)',
        detail: 'Boot into Safe Mode, run DDU to wipe residual driver registers, and install latest WHQL driver.'
      }
    ],
    tags: ['windows', 'bsod', 'kernel', 'drivers', 'hardware'],
    lastUpdated: '2026-11-19'
  }
];

export const INITIAL_SIMILAR_ISSUES: SimilarIssue[] = [
  {
    id: 'sim-01',
    title: 'Docker command fails without root privileges on Ubuntu',
    errorCode: 'EACCES /var/run/docker.sock',
    category: 'DevOps & Containers',
    similarityScore: 98,
    solutionSummary: 'Add current user to docker group via `sudo usermod -aG docker $USER` and refresh sessions.',
    verified: true,
    os: 'Linux',
    upvotes: 342,
  },
  {
    id: 'sim-02',
    title: 'docker.sock permission denied in Jenkins CI agent container',
    errorCode: 'EACCES /var/run/docker.sock',
    category: 'DevOps & Containers',
    similarityScore: 89,
    solutionSummary: 'Mount docker socket with matching GID or configure docker-in-docker daemon privileges.',
    verified: true,
    os: 'Linux / Docker',
    upvotes: 128,
  },
  {
    id: 'sim-03',
    title: 'Docker desktop WSL2 socket access error on Windows',
    errorCode: 'dial unix /var/run/docker.sock: connect: no such file or directory',
    category: 'DevOps & Containers',
    similarityScore: 76,
    solutionSummary: 'Enable WSL2 integration in Docker Desktop settings under Resources > WSL Integration.',
    verified: true,
    os: 'Windows / WSL2',
    upvotes: 210,
  }
];

export const INITIAL_PROBLEM_RECORDS: ProblemRecord[] = [
  {
    id: 'rec_101',
    userId: 'usr_001',
    userName: 'Alex Rivera',
    title: 'Docker daemon socket permission denied',
    description: 'Cannot run docker ps in terminal after fresh Ubuntu setup.',
    extractedText: 'Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock',
    status: 'resolved',
    createdAt: '2026-11-23T14:22:00Z',
    resolvedAt: '2026-11-23T14:28:30Z',
    timeSpentMinutes: 6,
    userNotes: 'Added user to docker group and executed newgrp docker. Verified with docker run hello-world.',
    diagnosticResult: {
      id: 'diag_101',
      title: 'Docker Socket Permission Denied',
      errorCode: 'EACCES /var/run/docker.sock',
      category: 'DevOps & Containers',
      severity: 'medium',
      confidence: 99.2,
      detectedEnvironment: 'Linux (Ubuntu 22.04 LTS) / Docker Engine 24.0',
      summary: 'Standard user account lacks permissions to read/write to the Docker daemon UNIX socket.',
      quickFix: 'Run `sudo usermod -aG docker $USER && newgrp docker` to grant socket access.',
      rootCause: 'The /var/run/docker.sock file is owned by root and group docker with 660 permission mode.',
      steps: [
        {
          id: 'step-1',
          order: 1,
          title: 'Add current user to docker group',
          instruction: 'Run usermod with append and group flags in your bash terminal.',
          command: 'sudo usermod -aG docker $USER',
          completed: true
        },
        {
          id: 'step-2',
          order: 2,
          title: 'Refresh shell session group permissions',
          instruction: 'Execute newgrp to reload permissions in current terminal window.',
          command: 'newgrp docker',
          completed: true
        },
        {
          id: 'step-3',
          order: 3,
          title: 'Verify docker engine status',
          instruction: 'Test without sudo to confirm container lists successfully.',
          command: 'docker ps',
          completed: true
        }
      ],
      preventionTips: [
        'Include docker group creation in your server setup Ansible/Terraform scripts.',
        'Never set chmod 777 on /var/run/docker.sock as it creates a critical privilege escalation vector.'
      ],
      timestamp: '2026-11-23T14:22:00Z'
    }
  },
  {
    id: 'rec_102',
    userId: 'usr_001',
    userName: 'Alex Rivera',
    title: 'Next.js 14 SSR Hydration Mismatch on Dashboard',
    description: 'Header clock component triggers hydration warning on initial page load in Chrome.',
    extractedText: 'Warning: Text content did not match. Server: "10:30:00" Client: "10:30:02" in <time>',
    status: 'resolved',
    createdAt: '2026-11-24T09:15:00Z',
    resolvedAt: '2026-11-24T09:25:00Z',
    timeSpentMinutes: 10,
    userNotes: 'Used mounted state pattern to only display client time after initial mount.',
    diagnosticResult: {
      id: 'diag_102',
      title: 'React Hydration Text Mismatch',
      errorCode: 'REACT_HYDRATION_ERROR_418',
      category: 'Frontend & Web',
      severity: 'low',
      confidence: 96.5,
      detectedEnvironment: 'Next.js 14.1 / React 18.2 / Chrome 124',
      summary: 'Dynamic clock generated on server rendered 2 seconds earlier than client render timestamp.',
      quickFix: 'Defer rendering the formatted time until component mounts via useEffect.',
      rootCause: 'Server rendered timestamp at request time differs from client mount time.',
      steps: [
        {
          id: 'step-1',
          order: 1,
          title: 'Add isMounted state flag',
          instruction: 'Track client mount lifecycle in component state.',
          codeSnippet: 'const [isMounted, setIsMounted] = useState(false);\nuseEffect(() => setIsMounted(true), []);',
          completed: true
        },
        {
          id: 'step-2',
          order: 2,
          title: 'Conditional render or suppress warning',
          instruction: 'Render null or static placeholder until mounted, or use suppressHydrationWarning.',
          codeSnippet: 'if (!isMounted) return <time>--:--:--</time>;',
          completed: true
        }
      ],
      preventionTips: [
        'Avoid accessing window, localStorage, or new Date() directly inside component body before mount.'
      ],
      timestamp: '2026-11-24T09:15:00Z'
    }
  },
  {
    id: 'rec_103',
    userId: 'usr_001',
    userName: 'Alex Rivera',
    title: 'PostgreSQL connection timeout in production serverless lambda',
    description: 'High concurrency spikes cause connection saturation on RDS Postgres.',
    extractedText: 'FATAL: remaining connection slots are reserved for non-replication superuser connections',
    status: 'in_progress',
    createdAt: '2026-11-25T11:40:00Z',
    timeSpentMinutes: 25,
    userNotes: 'Working on adding PgBouncer or AWS RDS Proxy to manage connection pooling.',
    diagnosticResult: {
      id: 'diag_103',
      title: 'PostgreSQL Max Connections Exhaustion',
      errorCode: 'SQLSTATE 53300',
      category: 'Databases',
      severity: 'critical',
      confidence: 97.8,
      detectedEnvironment: 'AWS Lambda / Node.js / PostgreSQL 15 on RDS',
      summary: 'Serverless functions opening individual persistent DB connections without connection pooling.',
      quickFix: 'Deploy PgBouncer or enable AWS RDS Proxy to queue and multiplex connections.',
      rootCause: 'PostgreSQL max_connections was set to 100, but Lambda scaled to 250 concurrent invocations.',
      steps: [
        {
          id: 'step-1',
          order: 1,
          title: 'Verify active connection counts',
          instruction: 'Check open connections grouped by application and client IP.',
          command: 'SELECT count(*), state, client_addr FROM pg_stat_activity GROUP BY state, client_addr;',
          completed: true
        },
        {
          id: 'step-2',
          order: 2,
          title: 'Terminate idle hanging connections',
          instruction: 'Kill connections that have been idle in transaction for more than 5 minutes.',
          command: 'SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = "idle in transaction" AND state_change < current_timestamp - INTERVAL "5 minutes";',
          completed: true
        },
        {
          id: 'step-3',
          order: 3,
          title: 'Enable connection pooler',
          instruction: 'Point application database connection string to RDS Proxy or PgBouncer instance.',
          command: 'DATABASE_URL="postgres://user:pass@rds-proxy.internal.aws:5432/production?pgbouncer=true"',
          completed: false
        }
      ],
      preventionTips: [
        'Always use serverless connection pooling (PgBouncer, Prisma Accelerate, or RDS Proxy) with Lambda/Cloud Functions.',
        'Set idle_in_transaction_session_timeout = 60000 (1 minute) in postgresql.conf.'
      ],
      timestamp: '2026-11-25T11:40:00Z'
    }
  }
];

export const INITIAL_ANALYTICS: AnalyticsMetrics = {
  totalIssuesDiagnosed: 1842,
  resolvedCount: 1685,
  inProgressCount: 94,
  unresolvedCount: 63,
  resolutionRate: 91.5,
  avgResolutionTimeMinutes: 14.2,
  activeUsersCount: 428,
  categoryDistribution: [
    { category: 'DevOps & Containers', count: 580, percentage: 31.5, color: '#38bdf8' },
    { category: 'Frontend & Web', count: 420, percentage: 22.8, color: '#818cf8' },
    { category: 'Backend & APIs', count: 340, percentage: 18.5, color: '#a855f7' },
    { category: 'Databases', count: 215, percentage: 11.7, color: '#10b981' },
    { category: 'Operating Systems', count: 165, percentage: 8.9, color: '#f59e0b' },
    { category: 'Security & Auth', count: 122, percentage: 6.6, color: '#ef4444' }
  ],
  severityDistribution: [
    { severity: 'critical', count: 284, color: '#ef4444' },
    { severity: 'high', count: 612, color: '#f97316' },
    { severity: 'medium', count: 710, color: '#eab308' },
    { severity: 'low', count: 236, color: '#10b981' }
  ],
  weeklyTrends: [
    { day: 'Mon', reported: 68, resolved: 62 },
    { day: 'Tue', reported: 84, resolved: 78 },
    { day: 'Wed', reported: 96, resolved: 90 },
    { day: 'Thu', reported: 110, resolved: 104 },
    { day: 'Fri', reported: 75, resolved: 71 },
    { day: 'Sat', reported: 32, resolved: 30 },
    { day: 'Sun', reported: 24, resolved: 22 }
  ],
  topErrorCodes: [
    { code: 'EACCES /var/run/docker.sock', count: 245, category: 'DevOps & Containers', avgTime: '6m', severity: 'medium' },
    { code: 'CORS_BLOCKED_REQUEST', count: 218, category: 'Security & Auth', avgTime: '9m', severity: 'medium' },
    { code: 'REACT_HYDRATION_ERROR_418', count: 194, category: 'Frontend & Web', avgTime: '11m', severity: 'low' },
    { code: 'ExitCode 137 / OOMKilled', count: 162, category: 'DevOps & Containers', avgTime: '22m', severity: 'critical' },
    { code: 'PG::ConnectionBad (53300)', count: 138, category: 'Databases', avgTime: '18m', severity: 'critical' },
    { code: 'torch.cuda.OutOfMemoryError', count: 115, category: 'Backend & APIs', avgTime: '25m', severity: 'high' },
    { code: '0x00000139 KERNEL_CHECK', count: 87, category: 'Operating Systems', avgTime: '35m', severity: 'high' }
  ],
  recentIncidents: INITIAL_PROBLEM_RECORDS
};
