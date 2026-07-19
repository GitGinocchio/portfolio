export const useBootLogger = () => {
  const bootLogs = ref<string[]>([]);

  const bootLogsPool = [
    // Hardware Probing
    "Detecting hardware... CPU: AMD Ryzen 9 7950X",
    "Checking NMI watchdog...",
    "ACPI: Core revision 20260325",
    "PCI: Probing PCI hardware (bus 00)",
    "PCI: Bus 00:01.0 [1002:164e] card detected",
    "pci 0000:00:01.0: BAR 0: assigned [mem 0xf0000000-0xf00fffff]",
    "pnp 00:0a: plug and play device 00:0a is active",
    "vgaarb: device changed decodes: PCI:0000:00:01.0",
    "usb 1-1: new high-speed USB device number 2 using xhci_hcd",
    "usb 1-1: New USB device found, idVendor=046d, idProduct=c52b",
    
    // Filesystem
    "EXT4-fs (sda1): mounted filesystem with ordered data mode",
    "EXT4-fs (sda2): recovery complete",
    "EXT4-fs (sda2): mounted filesystem with writeback data mode",
    "systemd[1]: Inserted module 'autofs4'",
    "systemd[1]: Mounted Configuration File System",
    "systemd[1]: Mounted RPC Pipe File System",
    
    // Network & Security
    "net-tools: Configuring loopback interface...",
    "IPv6: ADDRCONF(NETDEV_UP): lo: link is not ready",
    "IPv6: ADDRCONF(NETDEV_UP): eth0: link becomes ready",
    "firewalld: Entering running state",
    "iptables: Loading shared libraries...",
    "apparmor: AppArmor initialized",
    
    // Services
    "systemd[1]: Starting Dispatcher daemon for systemd-networkd...",
    "systemd[1]: Started Network Time Synchronization",
    "systemd[1]: Starting Permit User Sessions...",
    "systemd[1]: Starting Login Service...",
    "systemd[1]: Starting OpenBSD Secure Shell server...",
    "systemd[1]: Started Getty on tty1",
    "systemd[1]: Started User Manager for UID 1000",
    
    // Godot / Web environment specific
    "GDExtension: Loading GodotPhysics3D...",
    "GDExtension: Loading NavigationServer3D...",
    "RenderingDevice: Initializing Vulkan API...",
    "Vulkan: Driver version 23.1.4 detected",
    "ShaderCache: Compiling main_env_material.gdshader...",
    "ShaderCache: Compiling character_controller.gdshader...",
    "AssetLoader: Fetching 'room_mesh.glb' [450kb]...",
    "AssetLoader: Fetching 'lego_bricks.glb' [120kb]...",
    "WebAssembly: Memory allocated [128MB]...",
    "WebAssembly: Instantiating Godot Engine module...",
    
    // ... (Puoi espandere fino a 100+ riga per riga)
    "Kernel: Booting complete in 1.45s",
    "systemd[1]: Reached target Graphical Interface",
    "systemd[1]: Starting User Session [GiulioTognetto]",
    "Portfolio-System: Ready."
  ];

  let lastThresholdIndex = -1;

  const updateProgress = (percent: number) => {
    const targetIndex = Math.floor((percent / 100) * bootLogsPool.length);
    
    if (targetIndex > lastThresholdIndex) {
      for (let i = lastThresholdIndex + 1; i <= targetIndex; i++) {
        if (bootLogsPool[i]) {
          const timestamp = new Date().toLocaleTimeString('it-IT', { hour12: false });
          bootLogs.value.push(`[${timestamp}] ${bootLogsPool[i]}`);
        }
      }
      lastThresholdIndex = targetIndex;
    }
  };

  return { bootLogs, updateProgress };
};