import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState('TP1');

  // The configurations extracted from the provided sources
  const files = {
    exam: `S1 (2960-24TT) — Switch central
	enable
	conf t

	vlan 10
	 name VLAN10
	vlan 20
	 name VLAN20

	! EtherChannel vers S2 — LACP (Po2)
	interface range fa0/1 - 2
	 channel-group 2 mode active
	interface port-channel 2
	 switchport mode trunk

	! EtherChannel vers S3 — PAgP (Po1)
	interface range fa0/3 - 4
	 channel-group 1 mode desirable
	interface port-channel 1
	 switchport mode trunk

	! Trunk vers Router0
	interface fa0/24
	 switchport mode trunk

	end

S2 (2960-24TT) — Switch VLAN10
	enable
	conf t

	vlan 10
	 name VLAN10
	vlan 20
	 name VLAN20

	! EtherChannel vers S1 — LACP (Po2)
	interface range fa0/1 - 2
	 channel-group 2 mode active
	interface port-channel 2
	 switchport mode trunk

	! EtherChannel vers S3 — LACP (Po3)
	interface range fa0/3 - 4
	 channel-group 3 mode active
	interface port-channel 3
	 switchport mode trunk

	! Ports access VLAN 10 (PC-B, AP1, Smartphone0)
	interface range fa0/5 - 7
	 switchport mode access
	 switchport access vlan 10

	end

S3 (2960-24TT) — Switch VLAN20
	enable
	conf t

	vlan 10
	 name VLAN10
	vlan 20
	 name VLAN20

	! EtherChannel vers S1 — PAgP (Po1)
	interface range fa0/1 - 2
	 channel-group 1 mode desirable
	interface port-channel 1
	 switchport mode trunk

	! EtherChannel vers S2 — LACP (Po3)
	interface range fa0/3 - 4
	 channel-group 3 mode passive
	interface port-channel 3
	 switchport mode trunk

	! Ports access VLAN 20 (PC0, AP2, Smartphone1)
	interface range fa0/5 - 7
	 switchport mode access
	 switchport access vlan 20

	end

Router0 (2911) — Router-on-a-Stick
	enable
	conf t

	interface g0/0
	 no shutdown

	interface g0/0.10
	 encapsulation dot1Q 10
	 ip address 192.168.10.1 255.255.255.0

	interface g0/0.20
	 encapsulation dot1Q 20
	 ip address 192.168.20.1 255.255.255.0

	end`,

    TP7: `Configuration ROUTEUR R1
	conf t

	! Activer routage IPv6
	ipv6 unicast-routing

	! Interface vers Switch1 (LAN1)
	interface g0/0
	 ipv6 address 2001:DB8:ACAD:1::1/64
	 ipv6 enable
	 no shutdown

	! Interface vers Switch2 (LAN2)
	interface g0/1
	 ipv6 address 2001:DB8:ACAD:2::1/64
	 ipv6 enable
	 no shutdown

	! Interface vers Internet (WAN)
	interface s0/0/0
	 ipv6 address 2001:DB8:ACAD:3::2/64
	 ipv6 enable
	 no shutdown

	end
	write memory

Configuration PC1 (LAN1 - .10)
	Desktop → IP Configuration :
	  IPv6 Address : 2001:DB8:ACAD:1::10
	  Prefix       : 64
	  Gateway      : 2001:DB8:ACAD:1::1

Configuration PC2 (LAN1 - .11)
	Desktop → IP Configuration :
	  IPv6 Address : 2001:DB8:ACAD:1::11
	  Prefix       : 64
	  Gateway      : 2001:DB8:ACAD:1::1

Configuration PC3 (LAN2 - Auto)
	Desktop → IP Configuration :
	  Sélectionne : Auto Config ✅
	  Gateway     : 2001:DB8:ACAD:2::1

Configuration PC4 (LAN2 - Auto)
	Desktop → IP Configuration :
	  Sélectionne : Auto Config ✅
	  Gateway     : 2001:DB8:ACAD:2::1

Configuration Switch1 (2960-24TT)
	conf t

	! Pas de VLANs nécessaires (réseau simple)
	! Juste vérifier les ports

	interface Gig0/1
	 no shutdown

	interface fa0/1
	 no shutdown

	interface fa0/20
	 no shutdown

	end
	write memory

Configuration Switch2 (2960-24TT)
	conf t

	interface Gig0/1
	 no shutdown

	interface fa0/1
	 no shutdown

	interface fa0/4
	 no shutdown

	end
	write memory

Vérification
	Sur R1 :
	show ipv6 interface brief
	show ipv6 route
	Sur PC1 :
	ipconfig
	ping 2001:DB8:ACAD:1::11
	ping 2001:DB8:ACAD:2::1
	Sur PC3 (SLAAC) :
	ipconfig
	ping 2001:DB8:ACAD:1::1`,

    TP5: `Étape 1 — Switch d'accès S1
	ciscoenable
	configure terminal
	hostname S1

	! Création des VLANs
	vlan 10
	 name VLAN10
	vlan 20
	 name VLAN20
	exit

	! Port PC0 → VLAN 10 (access)
	interface fa0/1
	 switchport mode access
	 switchport access vlan 10
	 no shutdown
	exit

	! Port PC1 → VLAN 20 (access)
	interface fa0/24
	 switchport mode access
	 switchport access vlan 20
	 no shutdown
	exit

	! Ports uplink vers D1 et D2 en trunk
	interface range gig0/1 - 2
	 switchport mode trunk
	 switchport trunk native vlan 99
	 no shutdown
	exit

Étape 2 — Switch d'accès S2
	ciscoenable
	configure terminal
	hostname S2

	! Création des VLANs
	vlan 10
	 name VLAN10
	vlan 20
	 name VLAN20
	exit

	! Port PC2 → VLAN 10 (access)
	interface fa0/1
	 switchport mode access
	 switchport access vlan 10
	 no shutdown
	exit

	! Port PC3 → VLAN 20 (access)
	interface fa0/24
	 switchport mode access
	 switchport access vlan 20
	 no shutdown
	exit

	! Ports uplink vers D1 et D2 en trunk
	interface range gig0/1 - 2
	 switchport mode trunk
	 switchport trunk native vlan 99
	 no shutdown
	exit
	
Étape 3 — EtherChannel entre D1 et D2 (Fa0/22, Fa0/23, Fa0/24)
	Sur D1 :
		ciscoenable
		configure terminal
		hostname D1

		! VLANs
		vlan 10
		 name VLAN10
		vlan 20
		 name VLAN20
		exit

		! EtherChannel Po1 vers D2 — LACP
		interface range fa0/22 - 24
		 shutdown
		 switchport mode trunk
		 switchport trunk native vlan 99
		 channel-group 1 mode active
		 no shutdown
		exit
		
	Sur D2 :
		ciscoenable
		configure terminal
		hostname D2

		! VLANs
		vlan 10
		 name VLAN10
		vlan 20
		 name VLAN20
		exit

		! EtherChannel Po1 vers D1 — LACP
		interface range fa0/22 - 24
		 shutdown
		 switchport mode trunk
		 switchport trunk native vlan 99
		 channel-group 1 mode active
		 no shutdown
		exit
		
Étape 4 — Interfaces SVI (adresses IP des VLANs) sur D1 et D2
	Sur D1 :
		cisco! Activer le routage inter-VLAN
		ip routing

		! SVI VLAN 10
		interface vlan 10
		 ip address 192.168.10.2 255.255.255.0
		 no shutdown
		exit

		! SVI VLAN 20
		interface vlan 20
		 ip address 192.168.20.2 255.255.255.0
		 no shutdown
		exit
		
	Sur D2 :
		cisco! Activer le routage inter-VLAN
		ip routing

		! SVI VLAN 10
		interface vlan 10
		 ip address 192.168.10.3 255.255.255.0
		 no shutdown
		exit

		! SVI VLAN 20
		interface vlan 20
		 ip address 192.168.20.3 255.255.255.0
		 no shutdown
		exit
		
Étape 5 — Configuration HSRP sur D1 et D2
	Sur D1 (Active VLAN 10 / Standby VLAN 20) :
		cisco! HSRP pour VLAN 10 — D1 est ACTIF (priorité haute)
		interface vlan 10
		 standby 10 ip 192.168.10.1
		 standby 10 priority 110
		 standby 10 preempt
		exit

		! HSRP pour VLAN 20 — D1 est STANDBY (priorité basse)
		interface vlan 20
		 standby 20 ip 192.168.20.1
		 standby 20 priority 90
		 standby 20 preempt
		exit
		
	Sur D2 (Active VLAN 20 / Standby VLAN 10) :
		cisco! HSRP pour VLAN 10 — D2 est STANDBY (priorité basse)
		interface vlan 10
		 standby 10 ip 192.168.10.1
		 standby 10 priority 90
		 standby 10 preempt
		exit

		! HSRP pour VLAN 20 — D2 est ACTIF (priorité haute)
		interface vlan 20
		 standby 20 ip 192.168.20.1
		 standby 20 priority 110
		 standby 20 preempt
		exit`,

    TP6: `Configuration SWITCH ✅
conf t

! Création des VLANs
vlan 10
 name VLAN10
vlan 20
 name VLAN20
vlan 99
 name MANAGEMENT
exit

! Port vers AP1 (access vlan 10)
interface fa0/1
 switchport mode access
 switchport access vlan 10
 no shutdown

! Port vers WLC1 (access vlan 99)
interface fa0/2
 switchport mode access
 switchport access vlan 99
 no shutdown

! Port vers PC_Admin (access vlan 99)
interface fa0/3
 switchport mode access
 switchport access vlan 99
 no shutdown

! Port vers PC2 (access vlan 20)
interface fa0/4
 switchport mode access
 switchport access vlan 20
 no shutdown

! Port vers Server0 DHCP_VLAN20 (access vlan 20)
interface fa0/5
 switchport mode access
 switchport access vlan 20
 no shutdown

! Port vers Server1 DHCP_VLAN10 (access vlan 10)
interface fa0/6
 switchport mode access
 switchport access vlan 10
 no shutdown

! Port vers PC1 (access vlan 10)
interface fa0/7
 switchport mode access
 switchport access vlan 10
 no shutdown

! Port vers Routeur R1 (trunk)
interface fa0/8
 switchport mode trunk
 switchport trunk allowed vlan 10,20,99
 no shutdown

! Port vers AP2 (access vlan 20)
interface fa0/9
 switchport mode access
 switchport access vlan 20
 no shutdown

end
write memory

Configuration ROUTEUR ✅
conf t

interface g0/0
 no shutdown

interface g0/0.10
 encapsulation dot1Q 10
 ip address 192.168.10.1 255.255.255.0
 ip helper-address 192.168.10.250
 no shutdown

interface g0/0.20
 encapsulation dot1Q 20
 ip address 192.168.20.1 255.255.255.0
 ip helper-address 192.168.20.250
 no shutdown

interface g0/0.99
 encapsulation dot1Q 99
 ip address 192.168.99.1 255.255.255.0
 no shutdown

end
write memory

Configuration Serveur DHCP_VLAN10 (Server1) ✅
IP statique : 192.168.10.250
Mask        : 255.255.255.0
Gateway     : 192.168.10.1
DNS         : 8.8.8.8

Pool DHCP :
  Pool Name : VLAN10
  Start IP  : 192.168.10.2
  Mask      : 255.255.255.0
  Gateway   : 192.168.10.1
  DNS       : 8.8.8.8
  Max Users : 248

Configuration Serveur DHCP_VLAN20 (Server0) ✅
IP statique : 192.168.20.250
Mask        : 255.255.255.0
Gateway     : 192.168.20.1
DNS         : 8.8.8.8

Pool DHCP :
  Pool Name : VLAN20
  Start IP  : 192.168.20.2
  Mask      : 255.255.255.0
  Gateway   : 192.168.20.1
  DNS       : 8.8.8.8
  Max Users : 248

Configuration PC_Admin ✅
IP      : 192.168.99.10
Mask    : 255.255.255.0
Gateway : 192.168.99.1

Configuration WLC1 ✅
Management Interface :
  IP      : 192.168.99.254
  Mask    : 255.255.255.0
  Gateway : 192.168.99.1

Configuration AP1 (Access Point3) ✅
Port 0 : filaire vers Switch Fa0/1 (VLAN 10)
Port 1 :
  SSID       : VLAN10_WIFI
  Auth       : WPA2-PSK
  Password   : cisco123
  Encryption : AES
  Channel    : 6

Configuration AP2 (Access Point4) ✅
Port 0 : filaire vers Switch Fa0/9 (VLAN 20)
Port 1 :
  SSID       : VLAN20_WIFI
  Auth       : WPA2-PSK
  Password   : cisco123
  Encryption : AES
  Channel    : 6

Configuration Clients ✅
Laptop1, Smartphone0 :
  SSID : VLAN10_WIFI
  Auth : WPA2-PSK
  PSK  : cisco123
  IP   : DHCP → 192.168.10.x

Laptop0, Smartphone1 :
  SSID : VLAN20_WIFI
  Auth : WPA2-PSK
  PSK  : cisco123
  IP   : DHCP → 192.168.20.x

PC1  : DHCP → 192.168.10.x
PC2  : DHCP → 192.168.20.x




-------------------------------------------T2
Modifications à faire :
1. Supprimer Server0 et Server1
2. Configurer DHCP sur le Routeur R1 :
	conf t

	ip dhcp pool VLAN10
	 network 192.168.10.0 255.255.255.0
	 default-router 192.168.10.1
	 dns-server 8.8.8.8
	exit
	
	ip dhcp pool VLAN20
	 network 192.168.20.0 255.255.255.0
	 default-router 192.168.20.1
	 dns-server 8.8.8.8
	exit

	ip dhcp pool VLAN99
	 network 192.168.99.0 255.255.255.0
	 default-router 192.168.99.1
	 dns-server 8.8.8.8
	exit
	
	! Exclure les IPs statiques
	ip dhcp excluded-address 192.168.10.1
	ip dhcp excluded-address 192.168.20.1
	ip dhcp excluded-address 192.168.99.1
	ip dhcp excluded-address 192.168.99.10
	ip dhcp excluded-address 192.168.99.254

	end
	write memory`,
    
  };

  // Inline styling
  const styles = {
    appContainer: {
      fontFamily: 'system-ui, -apple-system, sans-serif',
      minHeight: '100vh',
      backgroundColor: '#1e1e1e',
      color: '#d4d4d4',
      display: 'flex',
      flexDirection: 'column'
    },
    navBar: {
      display: 'flex',
      backgroundColor: '#252526',
      borderBottom: '1px solid #333',
      padding: '0 10px',
    },
    button: {
      padding: '12px 20px',
      backgroundColor: 'transparent',
      color: '#969696',
      border: 'none',
      borderTop: '2px solid transparent',
      cursor: 'pointer',
      fontSize: '14px',
      outline: 'none',
      transition: 'all 0.2s ease',
    },
    activeButton: {
      color: '#ffffff',
      backgroundColor: '#1e1e1e',
      borderTop: '2px solid #007acc',
    },
    codeContainer: {
      padding: '20px',
      flex: 1,
      overflowY: 'auto'
    },
    pre: {
      backgroundColor: '#1e1e1e',
      padding: '15px',
      borderRadius: '5px',
      fontFamily: '"Fira Code", monospace',
      fontSize: '14px',
      whiteSpace: 'pre-wrap',
      margin: 0
    }
  };

  return (
    <div style={styles.appContainer}>
      {/* Top Menu Bar */}
      <div style={styles.navBar}>
        {Object.keys(files).map((tabName) => (
          <button
            key={tabName}
            onClick={() => setActiveTab(tabName)}
            style={{
              ...styles.button,
              ...(activeTab === tabName ? styles.activeButton : {})
            }}
          >
            {tabName}.txt
          </button>
        ))}
      </div>

      {/* Code Display Area */}
      <div style={styles.codeContainer}>
        <pre style={styles.pre}>
          <code>{files[activeTab]}</code>
        </pre>
      </div>
    </div>
  );
}