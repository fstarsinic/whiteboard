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

getSystemStats().then(stats => console.log(stats)).catch(err => console.error(err));
