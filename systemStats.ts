import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface SystemStats {
  diskUsage: string;
  cpuUsage: number;
  memoryUsage: string;
  uptime: string;
  loadAverage: string;
}

async function getSystemStats(): Promise<SystemStats> {
  const diskUsageCommand = 'df -h --total | grep total | awk \'{print $3"/"$2}\'';
  const cpuUsageCommand = 'top -bn1 | grep "Cpu(s)" | sed "s/.*, *\\([0-9.]*\\)%* id.*/\\1/" | awk \'{print 100 - $1}\'';
  const memoryUsageCommand = 'free -m | grep Mem | awk \'{print $3"/"$2"MB"}\'';
  const uptimeCommand = 'uptime -p';
  const loadAverageCommand = 'cat /proc/loadavg | awk \'{print $1" "$2" "$3}\'';

  const [diskUsage, cpuUsage, memoryUsage, uptime, loadAverage] = await Promise.all([
    execAsync(diskUsageCommand),
    execAsync(cpuUsageCommand),
    execAsync(memoryUsageCommand),
    execAsync(uptimeCommand),
    execAsync(loadAverageCommand),
  ]);

  return {
    diskUsage: diskUsage.stdout.trim(),
    cpuUsage: parseFloat(cpuUsage.stdout.trim()),
    memoryUsage: memoryUsage.stdout.trim(),
    uptime: uptime.stdout.trim(),
    loadAverage: loadAverage.stdout.trim(),
  };
}

async function getWindowsSystemStats(): Promise<SystemStats> {
  const diskUsageCommand = 'powershell -command "Get-PSDrive C | Select-Object Used,Free,UsedPercent"';
  const cpuUsageCommand = 'powershell -command "Get-WmiObject win32_processor | Measure-Object -property LoadPercentage -Average | Select-Object Average"';
  const memoryUsageCommand = 'powershell -command "Get-WmiObject win32_operatingsystem | Select-Object TotalVisibleMemorySize,FreePhysicalMemory"';
  const uptimeCommand = 'powershell -command "(get-date) - (gcim Win32_OperatingSystem).LastBootUpTime"';
  const loadAverageCommand = 'powershell -command "Get-WmiObject win32_processor | Select-Object LoadPercentage"'; // Windows doesn't have load average; using CPU load.

  const [diskUsage, cpuUsage, memoryUsage, uptime, loadAverage] = await Promise.all([
    execAsync(diskUsageCommand),
    execAsync(cpuUsageCommand),
    execAsync(memoryUsageCommand),
    execAsync(uptimeCommand),
    execAsync(loadAverageCommand),
  ]);

  const diskUsageOutput = diskUsage.stdout.split('\n')[3].trim().split(/\s+/);
  const usedDisk = diskUsageOutput[0];
  const freeDisk = diskUsageOutput[1];

  const memoryUsageOutput = memoryUsage.stdout.trim().split(/\s+/);
  const totalMemory = parseInt(memoryUsageOutput[1], 10) / 1024;
  const freeMemory = parseInt(memoryUsageOutput[2], 10) / 1024;
  const usedMemory = totalMemory - freeMemory;

  const uptimeOutput = uptime.stdout.trim();

  return {
    diskUsage: `${usedDisk} used, ${freeDisk} free`,
    cpuUsage: parseFloat(cpuUsage.stdout.split(':')[1].trim()),
    memoryUsage: `${usedMemory.toFixed(2)}/${totalMemory.toFixed(2)} MB`,
    uptime: uptimeOutput,
    loadAverage: `Load: ${parseFloat(loadAverage.stdout.split(':')[1].trim())}%`,
  };
}

getSystemStats().then(stats => console.log(stats)).catch(err => console.error(err));
