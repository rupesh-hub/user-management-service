import {Component, OnInit} from '@angular/core';


interface ServerStatus {
  id: string;
  name: string;
  status: 'operational' | 'degraded' | 'outage';
  uptime: number; // in seconds
  responseTime: number; // in milliseconds
  cpuUsage: number; // percentage
  memoryUsage: number; // percentage
  diskUsage: number; // percentage
  lastChecked: Date;
}

interface SecurityAlert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  affectedSystem: string;
  timestamp: Date;
  status: 'new' | 'investigating' | 'mitigated' | 'resolved';
  ipAddress?: string;
  userId?: string;
  userName?: string;
}

interface Vulnerability {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  affectedComponent: string;
  discoveredAt: Date;
  status: 'open' | 'in-progress' | 'resolved';
  cveId?: string;
  remediation: string;
}

interface BackupInfo {
  id: string;
  name: string;
  type: 'full' | 'incremental' | 'differential';
  status: 'completed' | 'in-progress' | 'failed';
  size: number; // in MB
  createdAt: Date;
  duration: number; // in seconds
  location: string;
}

interface ComplianceStatus {
  id: string;
  standard: string;
  status: 'compliant' | 'non-compliant' | 'partially-compliant';
  lastAssessment: Date;
  nextAssessment: Date;
  passedControls: number;
  totalControls: number;
  criticalFindings: number;
}

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  history: { timestamp: Date; value: number }[];
}

interface AuditLog {
  id: string;
  action: string;
  category: string;
  userId: string;
  userName: string;
  ipAddress: string;
  timestamp: Date;
  details: string;
  status: 'success' | 'failure';
}

@Component({
  selector: 'ums-system-healths',
  standalone: false,
  templateUrl: './system-healths.component.html',
  styleUrl: './system-healths.component.scss'
})
export class SystemHealthsComponent implements OnInit {
  // Active tab
  activeTab = 'dashboard';

  // Dashboard data
  systemMetrics: SystemMetric[] = [];
  securityScore = 0;
  systemHealthScore = 0;
  complianceScore = 0;
  recentAlerts: SecurityAlert[] = [];

  // Server status
  servers: ServerStatus[] = [];
  selectedServer: ServerStatus | null = null;

  // Security alerts
  securityAlerts: SecurityAlert[] = [];
  filteredAlerts: SecurityAlert[] = [];
  alertSearchTerm = '';
  alertSeverityFilter: 'all' | 'critical' | 'high' | 'medium' | 'low' | 'info' = 'all';
  alertStatusFilter: 'all' | 'new' | 'investigating' | 'mitigated' | 'resolved' = 'all';

  // Vulnerabilities
  vulnerabilities: Vulnerability[] = [];
  filteredVulnerabilities: Vulnerability[] = [];
  vulnerabilitySearchTerm = '';
  vulnerabilitySeverityFilter: 'all' | 'critical' | 'high' | 'medium' | 'low' = 'all';
  vulnerabilityStatusFilter: 'all' | 'open' | 'in-progress' | 'resolved' = 'all';

  // Backups
  backups: BackupInfo[] = [];
  filteredBackups: BackupInfo[] = [];
  backupSearchTerm = '';
  backupStatusFilter: 'all' | 'completed' | 'in-progress' | 'failed' = 'all';
  backupScheduleEnabled = true;
  backupFrequency = 'daily';
  backupRetention = 30; // days
  backupEncryptionEnabled = true;

  // Compliance
  complianceStatuses: ComplianceStatus[] = [];

  // Audit logs
  auditLogs: AuditLog[] = [];
  filteredAuditLogs: AuditLog[] = [];
  auditLogSearchTerm = '';
  auditLogCategoryFilter = 'all';
  auditLogStatusFilter: 'all' | 'success' | 'failure' = 'all';
  auditLogCategories: string[] = [];

  constructor() { }

  ngOnInit(): void {
    this.generateMockData();
    this.calculateScores();
    this.applyAlertFilters();
    this.applyVulnerabilityFilters();
    this.applyBackupFilters();
    this.applyAuditLogFilters();
  }

  generateMockData(): void {
    // Generate system metrics
    this.systemMetrics = [
      {
        name: 'CPU Usage',
        value: 42,
        unit: '%',
        status: 'good',
        trend: 'stable',
        history: this.generateMetricHistory(20, 80)
      },
      {
        name: 'Memory Usage',
        value: 68,
        unit: '%',
        status: 'warning',
        trend: 'up',
        history: this.generateMetricHistory(40, 90)
      },
      {
        name: 'Disk Space',
        value: 76,
        unit: '%',
        status: 'warning',
        trend: 'up',
        history: this.generateMetricHistory(50, 95)
      },
      {
        name: 'Network Traffic',
        value: 3.8,
        unit: 'MB/s',
        status: 'good',
        trend: 'down',
        history: this.generateMetricHistory(1, 10, true)
      },
      {
        name: 'Response Time',
        value: 187,
        unit: 'ms',
        status: 'good',
        trend: 'stable',
        history: this.generateMetricHistory(100, 500, true)
      },
      {
        name: 'Active Users',
        value: 1243,
        unit: 'users',
        status: 'good',
        trend: 'up',
        history: this.generateMetricHistory(800, 2000, true)
      }
    ];

    // Generate server statuses
    const serverNames = ['API Server', 'Web Server', 'Database Server', 'Authentication Server', 'Storage Server', 'Cache Server'];
    this.servers = [];

    for (let i = 0; i < serverNames.length; i++) {
      const status: ('operational' | 'degraded' | 'outage')[] = ['operational', 'operational', 'operational', 'degraded', 'operational', 'outage'];
      const uptime = Math.floor(Math.random() * 30 * 24 * 60 * 60) + 24 * 60 * 60; // 1-30 days in seconds
      const responseTime = Math.floor(Math.random() * 200) + 50; // 50-250ms
      const cpuUsage = Math.floor(Math.random() * 80) + 10; // 10-90%
      const memoryUsage = Math.floor(Math.random() * 80) + 10; // 10-90%
      const diskUsage = Math.floor(Math.random() * 80) + 10; // 10-90%

      this.servers.push({
        id: `server-${i + 1}`,
        name: serverNames[i],
        status: status[i],
        uptime: uptime,
        responseTime: responseTime,
        cpuUsage: cpuUsage,
        memoryUsage: memoryUsage,
        diskUsage: diskUsage,
        lastChecked: new Date(Date.now() - Math.floor(Math.random() * 3600000)) // Within the last hour
      });
    }

    // Generate security alerts
    const alertTitles = [
      'Suspicious login attempt detected',
      'Brute force attack detected',
      'Unusual file access pattern',
      'Potential data exfiltration',
      'Malware detected',
      'Unauthorized admin access attempt',
      'API rate limit exceeded',
      'SSL certificate expiring soon',
      'Firewall rule violation',
      'Database connection spike'
    ];

    const alertDescriptions = [
      'Multiple failed login attempts from unusual location',
      'Repeated login attempts with different credentials',
      'User accessing sensitive files outside normal pattern',
      'Large data transfer to external IP address',
      'Antivirus detected potential malware in uploaded file',
      'Attempt to access admin panel without proper credentials',
      'API endpoints being called at unusually high frequency',
      'SSL certificate will expire in 7 days',
      'Traffic detected that violates firewall security rules',
      'Unusual spike in database connections from single source'
    ];

    const affectedSystems = ['Authentication System', 'User Portal', 'File Storage', 'API Gateway', 'Upload Service', 'Admin Panel', 'API Service', 'Web Server', 'Network', 'Database'];
    const severities: ('critical' | 'high' | 'medium' | 'low' | 'info')[] = ['critical', 'high', 'high', 'medium', 'high', 'critical', 'medium', 'low', 'medium', 'low'];
    const statuses: ('new' | 'investigating' | 'mitigated' | 'resolved')[] = ['new', 'new', 'investigating', 'investigating', 'mitigated', 'new', 'resolved', 'resolved', 'investigating', 'mitigated'];

    this.securityAlerts = [];

    for (let i = 0; i < 20; i++) {
      const alertIndex = i % 10;
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 30)); // Within the last 30 days

      this.securityAlerts.push({
        id: `alert-${i + 1}`,
        severity: severities[alertIndex],
        title: alertTitles[alertIndex],
        description: alertDescriptions[alertIndex],
        affectedSystem: affectedSystems[alertIndex],
        timestamp: timestamp,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        userId: `user-${Math.floor(Math.random() * 1000) + 1}`,
        userName: `user${Math.floor(Math.random() * 1000) + 1}@example.com`
      });
    }

    // Sort alerts by timestamp (newest first)
    this.securityAlerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Get recent alerts for dashboard
    this.recentAlerts = this.securityAlerts.slice(0, 5);

    // Generate vulnerabilities
    const vulnerabilityTitles = [
      'Cross-Site Scripting (XSS) Vulnerability',
      'SQL Injection Vulnerability',
      'Outdated Library with Known Vulnerabilities',
      'Insecure Direct Object References',
      'Cross-Site Request Forgery (CSRF)',
      'Insecure Deserialization',
      'Broken Authentication',
      'Security Misconfiguration',
      'Insufficient Logging & Monitoring',
      'Using Components with Known Vulnerabilities'
    ];

    const vulnerabilityDescriptions = [
      'Application does not properly sanitize user input, allowing script injection',
      'API endpoint is vulnerable to SQL injection attacks',
      'Using an outdated version of a library with known security issues',
      'Application exposes references to internal objects, allowing unauthorized access',
      'Application is vulnerable to CSRF attacks due to lack of anti-forgery tokens',
      'Application deserializes untrusted data without proper validation',
      'Authentication mechanism has weaknesses that could be exploited',
      'Server is misconfigured, exposing sensitive information or functionality',
      'System does not have adequate logging to detect and respond to security incidents',
      'Using third-party components with known vulnerabilities'
    ];

    const affectedComponents = ['User Input Forms', 'API Endpoints', 'Frontend Libraries', 'User Profile System', 'Form Submission', 'Data Processing', 'Login System', 'Server Configuration', 'Monitoring System', 'Third-party Components'];
    const remediations = [
      'Implement proper input validation and output encoding',
      'Use parameterized queries and input validation',
      'Update to the latest version of the library',
      'Implement proper access controls and indirect reference maps',
      'Implement anti-CSRF tokens for all state-changing operations',
      'Implement integrity checks and do not deserialize from untrusted sources',
      'Review and strengthen authentication mechanisms',
      'Review and update server configurations according to security best practices',
      'Implement comprehensive logging and monitoring',
      'Update or replace components with known vulnerabilities'
    ];
    const vulnerabilitySeverities: ('critical' | 'high' | 'medium' | 'low')[] = ['critical', 'critical', 'high', 'medium', 'high', 'high', 'critical', 'medium', 'medium', 'high'];
    const vulnerabilityStatuses: ('open' | 'in-progress' | 'resolved')[] = ['open', 'in-progress', 'in-progress', 'open', 'resolved', 'open', 'in-progress', 'resolved', 'open', 'resolved'];

    this.vulnerabilities = [];

    for (let i = 0; i < 15; i++) {
      const vulnIndex = i % 10;
      const discoveredAt = new Date();
      discoveredAt.setDate(discoveredAt.getDate() - Math.floor(Math.random() * 90)); // Within the last 90 days

      this.vulnerabilities.push({
        id: `vuln-${i + 1}`,
        title: vulnerabilityTitles[vulnIndex],
        description: vulnerabilityDescriptions[vulnIndex],
        severity: vulnerabilitySeverities[vulnIndex],
        affectedComponent: affectedComponents[vulnIndex],
        discoveredAt: discoveredAt,
        status: vulnerabilityStatuses[Math.floor(Math.random() * vulnerabilityStatuses.length)],
        cveId: Math.random() > 0.5 ? `CVE-${2022 - Math.floor(Math.random() * 3)}-${1000 + Math.floor(Math.random() * 9000)}` : undefined,
        remediation: remediations[vulnIndex]
      });
    }

    // Sort vulnerabilities by severity and discovery date
    this.vulnerabilities.sort((a, b) => {
      const severityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[a.severity] - severityOrder[b.severity];
      }
      return b.discoveredAt.getTime() - a.discoveredAt.getTime();
    });

    // Generate backups
    const backupTypes: ('full' | 'incremental' | 'differential')[] = ['full', 'incremental', 'differential'];
    const backupStatuses: ('completed' | 'in-progress' | 'failed')[] = ['completed', 'completed', 'completed', 'completed', 'in-progress', 'failed'];
    const backupLocations = ['AWS S3', 'Google Cloud Storage', 'Azure Blob Storage', 'Local Storage'];

    this.backups = [];

    for (let i = 0; i < 20; i++) {
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - Math.floor(i / 2)); // Every half day for the last 10 days
      createdAt.setHours(i % 2 === 0 ? 1 : 13, 0, 0, 0); // 1 AM or 1 PM

      const type = backupTypes[i % 3];
      const status = backupStatuses[Math.floor(Math.random() * backupStatuses.length)];
      const size = type === 'full' ?
        Math.floor(Math.random() * 5000) + 5000 : // 5-10 GB
        Math.floor(Math.random() * 1000) + 500; // 500 MB - 1.5 GB

      this.backups.push({
        id: `backup-${i + 1}`,
        name: `${type}-backup-${createdAt.toISOString().split('T')[0]}`,
        type: type,
        status: status,
        size: size,
        createdAt: createdAt,
        duration: Math.floor(Math.random() * 3600) + 600, // 10-70 minutes
        location: backupLocations[Math.floor(Math.random() * backupLocations.length)]
      });
    }

    // Sort backups by creation date (newest first)
    this.backups.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Generate compliance statuses
    const complianceStandards = ['GDPR', 'HIPAA', 'PCI DSS', 'SOC 2', 'ISO 27001', 'NIST 800-53'];
    const complianceStatuses: ('compliant' | 'non-compliant' | 'partially-compliant')[] = ['compliant', 'partially-compliant', 'compliant', 'compliant', 'partially-compliant', 'non-compliant'];

    this.complianceStatuses = [];

    for (let i = 0; i < complianceStandards.length; i++) {
      const lastAssessment = new Date();
      lastAssessment.setDate(lastAssessment.getDate() - Math.floor(Math.random() * 90)); // Within the last 90 days

      const nextAssessment = new Date(lastAssessment);
      nextAssessment.setDate(nextAssessment.getDate() + 90 + Math.floor(Math.random() * 90)); // 3-6 months after last assessment

      const totalControls = Math.floor(Math.random() * 100) + 50; // 50-150 controls
      const passedControls = complianceStatuses[i] === 'compliant' ?
        totalControls :
        (complianceStatuses[i] === 'partially-compliant' ?
          Math.floor(totalControls * 0.7) + Math.floor(Math.random() * (totalControls * 0.2)) : // 70-90% for partially compliant
          Math.floor(totalControls * 0.5) + Math.floor(Math.random() * (totalControls * 0.2))); // 50-70% for non-compliant

      const criticalFindings = complianceStatuses[i] === 'compliant' ?
        0 :
        (complianceStatuses[i] === 'partially-compliant' ?
          Math.floor(Math.random() * 3) + 1 : // 1-3 for partially compliant
          Math.floor(Math.random() * 5) + 3); // 3-7 for non-compliant

      this.complianceStatuses.push({
        id: `compliance-${i + 1}`,
        standard: complianceStandards[i],
        status: complianceStatuses[i],
        lastAssessment: lastAssessment,
        nextAssessment: nextAssessment,
        passedControls: passedControls,
        totalControls: totalControls,
        criticalFindings: criticalFindings
      });
    }

    // Generate audit logs
    const auditActions = [
      'User login',
      'User logout',
      'User created',
      'User updated',
      'User deleted',
      'Role created',
      'Role updated',
      'Role deleted',
      'Permission granted',
      'Permission revoked',
      'File uploaded',
      'File downloaded',
      'File deleted',
      'System setting changed',
      'Password changed',
      'API key generated',
      'API key revoked',
      'Backup initiated',
      'Backup completed',
      'System update installed'
    ];

    const auditCategories = [
      'Authentication',
      'Authentication',
      'User Management',
      'User Management',
      'User Management',
      'Role Management',
      'Role Management',
      'Role Management',
      'Permission Management',
      'Permission Management',
      'File Management',
      'File Management',
      'File Management',
      'System Configuration',
      'Security',
      'API Management',
      'API Management',
      'Backup',
      'Backup',
      'System Maintenance'
    ];

    this.auditLogs = [];
    this.auditLogCategories = [...new Set(auditCategories)];

    for (let i = 0; i < 100; i++) {
      const actionIndex = Math.floor(Math.random() * auditActions.length);
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 30)); // Within the last 30 days
      timestamp.setHours(
        Math.floor(Math.random() * 24),
        Math.floor(Math.random() * 60),
        Math.floor(Math.random() * 60)
      );

      const status: ('success' | 'failure') = Math.random() > 0.1 ? 'success' : 'failure';

      this.auditLogs.push({
        id: `log-${i + 1}`,
        action: auditActions[actionIndex],
        category: auditCategories[actionIndex],
        userId: `user-${Math.floor(Math.random() * 1000) + 1}`,
        userName: `user${Math.floor(Math.random() * 1000) + 1}@example.com`,
        ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        timestamp: timestamp,
        details: `${status === 'success' ? 'Successfully' : 'Failed to'} ${auditActions[actionIndex].toLowerCase()}`,
        status: status
      });
    }

    // Sort audit logs by timestamp (newest first)
    this.auditLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  generateMetricHistory(min: number, max: number, isDecimal: boolean = false): { timestamp: Date; value: number }[] {
    const history: { timestamp: Date; value: number }[] = [];
    const now = new Date();

    for (let i = 0; i < 24; i++) {
      const timestamp = new Date(now);
      timestamp.setHours(now.getHours() - i);

      let value = Math.random() * (max - min) + min;
      if (!isDecimal) {
        value = Math.floor(value);
      } else {
        value = parseFloat(value.toFixed(1));
      }

      history.push({ timestamp, value });
    }

    return history.reverse(); // Oldest to newest
  }

  calculateScores(): void {
    // Calculate security score
    const totalVulnerabilities = this.vulnerabilities.length;
    const resolvedVulnerabilities = this.vulnerabilities.filter(v => v.status === 'resolved').length;
    const criticalVulnerabilities = this.vulnerabilities.filter(v => v.severity === 'critical' && v.status !== 'resolved').length;
    const highVulnerabilities = this.vulnerabilities.filter(v => v.severity === 'high' && v.status !== 'resolved').length;

    // Penalize more for critical and high vulnerabilities
    this.securityScore = Math.max(0, Math.min(100, Math.round(
      (resolvedVulnerabilities / totalVulnerabilities) * 100 -
      (criticalVulnerabilities * 15) -
      (highVulnerabilities * 5)
    )));

    // Calculate system health score
    const operationalServers = this.servers.filter(s => s.status === 'operational').length;
    const totalServers = this.servers.length;
    const avgCpuUsage = this.servers.reduce((sum, server) => sum + server.cpuUsage, 0) / totalServers;
    const avgMemoryUsage = this.servers.reduce((sum, server) => sum + server.memoryUsage, 0) / totalServers;
    const avgDiskUsage = this.servers.reduce((sum, server) => sum + server.diskUsage, 0) / totalServers;

    // Penalize for high resource usage and non-operational servers
    this.systemHealthScore = Math.max(0, Math.min(100, Math.round(
      (operationalServers / totalServers) * 50 +
      (100 - avgCpuUsage) * 0.2 +
      (100 - avgMemoryUsage) * 0.15 +
      (100 - avgDiskUsage) * 0.15
    )));

    // Calculate compliance score
    const totalControls = this.complianceStatuses.reduce((sum, compliance) => sum + compliance.totalControls, 0);
    const passedControls = this.complianceStatuses.reduce((sum, compliance) => sum + compliance.passedControls, 0);
    const criticalFindings = this.complianceStatuses.reduce((sum, compliance) => sum + compliance.criticalFindings, 0);

    this.complianceScore = Math.max(0, Math.min(100, Math.round(
      (passedControls / totalControls) * 100 -
      (criticalFindings * 5)
    )));
  }

  // Tab Navigation
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  // Server Status
  selectServer(server: ServerStatus): void {
    this.selectedServer = server;
  }

  getServerStatusClass(status: string): string {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-800';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800';
      case 'outage':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatUptime(seconds: number): string {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);

    return `${days}d ${hours}h ${minutes}m`;
  }

  // Security Alerts
  applyAlertFilters(): void {
    let filtered = [...this.securityAlerts];

    // Apply search term
    if (this.alertSearchTerm) {
      const term = this.alertSearchTerm.toLowerCase();
      filtered = filtered.filter(alert =>
        alert.title.toLowerCase().includes(term) ||
        alert.description.toLowerCase().includes(term) ||
        alert.affectedSystem.toLowerCase().includes(term) ||
        (alert.userName && alert.userName.toLowerCase().includes(term)) ||
        (alert.ipAddress && alert.ipAddress.includes(term))
      );
    }

    // Apply severity filter
    if (this.alertSeverityFilter !== 'all') {
      filtered = filtered.filter(alert => alert.severity === this.alertSeverityFilter);
    }

    // Apply status filter
    if (this.alertStatusFilter !== 'all') {
      filtered = filtered.filter(alert => alert.status === this.alertStatusFilter);
    }

    this.filteredAlerts = filtered;
  }

  getAlertSeverityClass(severity: string): string {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'info':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getAlertStatusClass(status: string): string {
    switch (status) {
      case 'new':
        return 'bg-red-100 text-red-800';
      case 'investigating':
        return 'bg-yellow-100 text-yellow-800';
      case 'mitigated':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Vulnerabilities
  applyVulnerabilityFilters(): void {
    let filtered = [...this.vulnerabilities];

    // Apply search term
    if (this.vulnerabilitySearchTerm) {
      const term = this.vulnerabilitySearchTerm.toLowerCase();
      filtered = filtered.filter(vuln =>
        vuln.title.toLowerCase().includes(term) ||
        vuln.description.toLowerCase().includes(term) ||
        vuln.affectedComponent.toLowerCase().includes(term) ||
        (vuln.cveId && vuln.cveId.toLowerCase().includes(term))
      );
    }

    // Apply severity filter
    if (this.vulnerabilitySeverityFilter !== 'all') {
      filtered = filtered.filter(vuln => vuln.severity === this.vulnerabilitySeverityFilter);
    }

    // Apply status filter
    if (this.vulnerabilityStatusFilter !== 'all') {
      filtered = filtered.filter(vuln => vuln.status === this.vulnerabilityStatusFilter);
    }

    this.filteredVulnerabilities = filtered;
  }

  getVulnerabilitySeverityClass(severity: string): string {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getVulnerabilityStatusClass(status: string): string {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Backups
  applyBackupFilters(): void {
    let filtered = [...this.backups];

    // Apply search term
    if (this.backupSearchTerm) {
      const term = this.backupSearchTerm.toLowerCase();
      filtered = filtered.filter(backup =>
        backup.name.toLowerCase().includes(term) ||
        backup.type.toLowerCase().includes(term) ||
        backup.location.toLowerCase().includes(term)
      );
    }

    // Apply status filter
    if (this.backupStatusFilter !== 'all') {
      filtered = filtered.filter(backup => backup.status === this.backupStatusFilter);
    }

    this.filteredBackups = filtered;
  }

  getBackupStatusClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  formatFileSize(sizeInMB: number): string {
    if (sizeInMB >= 1000) {
      return `${(sizeInMB / 1000).toFixed(2)} GB`;
    }
    return `${sizeInMB} MB`;
  }

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  }

  saveBackupSettings(): void {
    console.log('Saving backup settings:', {
      backupScheduleEnabled: this.backupScheduleEnabled,
      backupFrequency: this.backupFrequency,
      backupRetention: this.backupRetention,
      backupEncryptionEnabled: this.backupEncryptionEnabled
    });
    alert('Backup settings saved successfully');
    // In a real application, you would send this to your backend
  }

  initiateBackup(): void {
    if (confirm('Are you sure you want to initiate a manual backup?')) {
      // In a real application, you would call your backend API
      alert('Backup initiated successfully');

      // Add a mock backup to the list
      const newBackup: BackupInfo = {
        id: `backup-${this.backups.length + 1}`,
        name: `manual-backup-${new Date().toISOString().split('T')[0]}`,
        type: 'full',
        status: 'in-progress',
        size: 0, // Size not known yet
        createdAt: new Date(),
        duration: 0, // Duration not known yet
        location: 'AWS S3' // Example location
      };

      this.backups.unshift(newBackup);
      this.applyBackupFilters();
    }
  }

  restoreBackup(backup: BackupInfo): void {
    if (confirm(`Are you sure you want to restore from backup "${backup.name}"? This will overwrite current data.`)) {
      // In a real application, you would call your backend API
      alert('Backup restoration initiated');
    }
  }

  // Compliance
  getComplianceStatusClass(status: string): string {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800';
      case 'partially-compliant':
        return 'bg-yellow-100 text-yellow-800';
      case 'non-compliant':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Audit Logs
  applyAuditLogFilters(): void {
    let filtered = [...this.auditLogs];

    // Apply search term
    if (this.auditLogSearchTerm) {
      const term = this.auditLogSearchTerm.toLowerCase();
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(term) ||
        log.userName.toLowerCase().includes(term) ||
        log.ipAddress.includes(term) ||
        log.details.toLowerCase().includes(term)
      );
    }

    // Apply category filter
    if (this.auditLogCategoryFilter !== 'all') {
      filtered = filtered.filter(log => log.category === this.auditLogCategoryFilter);
    }

    // Apply status filter
    if (this.auditLogStatusFilter !== 'all') {
      filtered = filtered.filter(log => log.status === this.auditLogStatusFilter);
    }

    this.filteredAuditLogs = filtered;
  }

  getAuditLogStatusClass(status: string): string {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'failure':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  // Helper methods
  getMetricStatusClass(status: string): string {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  }

  getMetricTrendIcon(trend: string): string {
    switch (trend) {
      case 'up':
        return 'trending-up';
      case 'down':
        return 'trending-down';
      case 'stable':
        return 'minus';
      default:
        return 'minus';
    }
  }

  getScoreClass(score: number): string {
    if (score >= 80) {
      return 'text-green-600';
    } else if (score >= 60) {
      return 'text-yellow-600';
    } else {
      return 'text-red-600';
    }
  }

  formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);

    if (diffSec < 60) {
      return `${diffSec} seconds ago`;
    } else if (diffMin < 60) {
      return `${diffMin} minutes ago`;
    } else if (diffHour < 24) {
      return `${diffHour} hours ago`;
    } else if (diffDay < 30) {
      return `${diffDay} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  getMaxValue(history: { value: number }[]): number {
    return history.length ? Math.max(...history.map(point => point.value)) : 1;
  }

}

